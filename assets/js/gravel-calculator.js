/* MaterialYardage — gravel calculator (v1.7) */
(function () {
  "use strict";

  var MY = window.MY;

  /* Typical bulk densities in US tons per cubic yard for common aggregates. */
  var DENSITY = {
    pea: 1.35,
    crushed: 1.4,
    river: 1.35,
    base: 1.5,
    decomposed: 1.3
  };

  var el = {
    length: document.getElementById("input-length"),
    width: document.getElementById("input-width"),
    depth: document.getElementById("input-depth"),
    material: document.getElementById("select-material"),
    allowance: document.getElementById("select-allowance"),
    labelLength: document.getElementById("lbl-length"),
    labelWidth: document.getElementById("lbl-width"),
    labelDepth: document.getElementById("lbl-depth"),
    primary: document.getElementById("out-volume-primary"),
    secondary: document.getElementById("out-volume-secondary"),
    weight: document.getElementById("out-weight"),
    order: document.getElementById("out-order"),
    alert: document.getElementById("validation"),
    reset: document.getElementById("reset")
  };

  if (!el.length) { return; }

  var toggle = MY.unitToggle(function (system) { applyDefaults(system); calculate(); });

  function applyDefaults(system) {
    if (system === "metric") {
      el.labelLength.textContent = "Length (meters)";
      el.labelWidth.textContent = "Width (meters)";
      el.labelDepth.textContent = "Depth (centimeters)";
      el.length.value = "12";
      el.width.value = "3";
      el.depth.value = "10";
    } else {
      el.labelLength.textContent = "Length (feet)";
      el.labelWidth.textContent = "Width (feet)";
      el.labelDepth.textContent = "Depth (inches)";
      el.length.value = "40";
      el.width.value = "10";
      el.depth.value = "4";
    }
  }

  function calculate() {
    var l = MY.num(el.length);
    var w = MY.num(el.width);
    var d = MY.num(el.depth);

    if (![l, w, d].every(isFinite) || l < 0 || w < 0 || d < 0) {
      el.alert.textContent = "Please enter length, width and depth as non-negative numbers.";
      el.alert.classList.remove("hidden");
      return;
    }
    el.alert.classList.add("hidden");

    var v = MY.volume(toggle.get(), l, w, d);
    var tons = v.cubicYards * (DENSITY[el.material.value] || DENSITY.crushed);
    var allowance = Number(el.allowance.value) || 0;
    var ordered = v.cubicYards * (1 + allowance / 100);

    if (toggle.get() === "metric") {
      el.primary.textContent = MY.fmt(v.cubicMeters) + " m³";
      el.secondary.textContent = MY.fmt(v.cubicYards) + " yd³ · " + MY.fmt(v.cubicFeet, 1) + " ft³";
    } else {
      el.primary.textContent = MY.fmt(v.cubicYards) + " yd³";
      el.secondary.textContent = MY.fmt(v.cubicMeters) + " m³ · " + MY.fmt(v.cubicFeet, 1) + " ft³";
    }

    el.weight.textContent = MY.fmt(tons) + " tons";
    el.order.textContent = MY.fmt(ordered) + " yd³ (" + MY.fmt(tons * (1 + allowance / 100)) + " tons)";
  }

  [el.length, el.width, el.depth].forEach(function (input) {
    input.addEventListener("input", calculate);
  });
  el.material.addEventListener("change", calculate);
  el.allowance.addEventListener("change", calculate);
  el.reset.addEventListener("click", function () {
    applyDefaults(toggle.get());
    calculate();
  });

  applyDefaults("imperial");
  calculate();
})();