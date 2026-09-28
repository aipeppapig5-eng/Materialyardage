/* MaterialYardage — shared site script (v1.7) */
(function () {
  "use strict";

  // Footer year
  var y = document.getElementById("year");
  if (y) { y.textContent = new Date().getFullYear(); }

  // Mark the current page in the main navigation
  var path = window.location.pathname.replace(/index\.html$/, "");
  var links = document.querySelectorAll(".nav a");
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (href === path || (href === "/" && path === "/")) {
      links[i].setAttribute("aria-current", "page");
    }
  }
})();

/* Shared helpers used by the individual calculator scripts. */
window.MY = {
  YD3_PER_M3: 1.30795062,

  /* Read a numeric input; returns NaN when blank or invalid. */
  num: function (el) {
    if (!el || el.value === "") { return NaN; }
    return Number(el.value);
  },

  /* Round to a fixed number of decimals and trim trailing zeros. */
  fmt: function (value, decimals) {
    if (!isFinite(value)) { return "—"; }
    var d = typeof decimals === "number" ? decimals : 2;
    return Number(value.toFixed(d)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: d
    });
  },

  /*
   * Convert user dimensions to cubic feet / cubic yards / cubic meters.
   * Imperial: length + width in feet, depth in inches.
   * Metric:   length + width in meters, depth in centimeters.
   */
  volume: function (system, length, width, depth) {
    var cubicFeet, cubicYards, cubicMeters;
    if (system === "metric") {
      cubicMeters = length * width * (depth / 100);
      cubicYards = cubicMeters * window.MY.YD3_PER_M3;
      cubicFeet = cubicYards * 27;
    } else {
      cubicFeet = length * width * (depth / 12);
      cubicYards = cubicFeet / 27;
      cubicMeters = cubicYards / window.MY.YD3_PER_M3;
    }
    return { cubicFeet: cubicFeet, cubicYards: cubicYards, cubicMeters: cubicMeters };
  },

  /* Wire the imperial/metric toggle and return a small controller. */
  unitToggle: function (onChange) {
    var imperial = document.getElementById("btn-imperial");
    var metric = document.getElementById("btn-metric");
    var system = "imperial";

    function set(next) {
      system = next;
      imperial.setAttribute("aria-pressed", String(system === "imperial"));
      metric.setAttribute("aria-pressed", String(system === "metric"));
      onChange(system);
    }

    imperial.addEventListener("click", function () { set("imperial"); });
    metric.addEventListener("click", function () { set("metric"); });

    return { get: function () { return system; }, set: set };
  }
};