/* MaterialYardage — mulch calculator (v1.7) */
(function () {
  "use strict";

  var MY = window.MY;

  /* Typical bulk densities in US tons per cubic yard for mulch products. */
  var DENSITY = {
    bark: 0.4,
    wood: 0.45,
    pine: 0.3,
    rubber: 0.6
  };

  var el = {
    length: document.getElementById("input-length"),
    width: document.getElementById("input-width"),
    depth: document.getElementById("input-depth"),
    material: document.getElementById("select-material"),
    bagSize: document.getElementById("select-bag"),
    labelLength: document.getElementById("lbl-length"),
    labelWidth: document.getElementById("lbl-width"),
    labelDepth: document.getElementById("lbl-depth"),
    primary: document.getElementById("out-volume-primary"),
    secondary: document.getElementById("out-volume-secondary"),
    bags: document.getElementById("out-bags"),
    weight: document.getElementById("out-weight"),
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
      el.length.value = "6";
      el.width.value = "4.5";
      el.depth.value = "7.5";
    } else {
      el.labelLength.textContent = "Length (feet)";
      el.labelWidth.textContent = "Width (feet)";
      el.labelDepth.textContent = "Depth (inches)";
      el.length.value = "20";
      el.width.value = "15";
      el.depth.value = "3";
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
    var bagCuFt = Number(el.bagSize.value) || 2;
    var tons = v.cubicYards * (DENSITY[el.material.value] || DENSITY.bark);

    if (toggle.get() === "metric") {
      el.primary.textContent = MY.fmt(v.cubicMeters) + " m³";
      el.secondary.textContent = MY.fmt(v.cubicYards) + " yd³ · " + MY.fmt(v.cubicFeet, 1) + " ft³";
    } else {
      el.primary.textContent = MY.fmt(v.cubicYards) + " yd³";
      el.secondary.textContent = MY.fmt(v.cubicMeters) + " m³ · " + MY.fmt(v.cubicFeet, 1) + " ft³";
    }

    el.bags.textContent = Math.ceil(v.cubicFeet / bagCuFt) + " bags";
    el.weight.textContent = MY.fmt(tons) + " tons";
  }

  [el.length, el.width, el.depth].forEach(function (input) {
    input.addEventListener("input", calculate);
  });
  el.material.addEventListener("change", calculate);
  el.bagSize.addEventListener("change", calculate);
  el.reset.addEventListener("click", function () {
    applyDefaults(toggle.get());
    calculate();
  });

  applyDefaults("imperial");
  calculate();
})();