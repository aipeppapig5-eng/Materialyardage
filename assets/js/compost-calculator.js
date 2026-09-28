(function () {
    "use strict";

    function value(id) {
        const el = document.getElementById(id);
        return el ? (parseFloat(el.value) || 0) : 0;
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function calcCompostMix() {
        const length = Math.max(0, value("cmx-len"));
        const width = Math.max(0, value("cmx-wid"));
        const depthInches = Math.max(0, value("cmx-dep"));
        const wastePercent = Math.max(0, value("cmx-waste"));

        const netCubicFeet = length * width * (depthInches / 12);
        const grossCubicFeet = netCubicFeet * (1 + wastePercent / 100);
        const grossCubicYards = grossCubicFeet / 27;

        // Default recipe: 70% screened topsoil / 30% compost by volume.
        const topsoilVolumeYards = grossCubicYards * 0.70;
        const topsoilVolumeFeet = grossCubicFeet * 0.70;
        const compostVolumeYards = grossCubicYards * 0.30;
        const compostVolumeFeet = grossCubicFeet * 0.30;

        // Approximate bulk densities used by MaterialYardage. Supplier data takes precedence.
        const topsoilTons = topsoilVolumeYards * 1.00;
        const compostTons = compostVolumeYards * 0.60;

        const topsoilBags = Math.ceil(topsoilVolumeFeet / 0.75);
        const compostBags = Math.ceil(compostVolumeFeet / 1.00);

        setText("cmx-out-total-yd", grossCubicYards.toFixed(2) + " Cubic Yards");
        setText("cmx-out-total-ft", grossCubicFeet.toFixed(2) + " Total Cubic Feet (Inc. Waste Allowance)");
        setText("cmx-out-soil-yd", topsoilVolumeYards.toFixed(2) + " yd³");
        setText("cmx-out-soil-tons", topsoilTons.toFixed(2));
        setText("cmx-out-soil-bags", topsoilBags.toLocaleString());
        setText("cmx-out-comp-yd", compostVolumeYards.toFixed(2) + " yd³");
        setText("cmx-out-comp-tons", compostTons.toFixed(2));
        setText("cmx-out-comp-bags", compostBags.toLocaleString());
    }

    window.calcCompostMix = calcCompostMix;

    document.addEventListener("DOMContentLoaded", function () {
        ["cmx-len", "cmx-wid", "cmx-dep", "cmx-waste"].forEach(function (id) {
            const input = document.getElementById(id);
            if (input) input.addEventListener("input", calcCompostMix);
        });
        calcCompostMix();
    });
})();
