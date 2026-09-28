function calcCompostMix() {
    // These IDs must match your HTML input fields exactly!
    const length = parseFloat(document.getElementById('cmx-len').value) || 0;
    const width = parseFloat(document.getElementById('cmx-wid').value) || 0;
    const depthInches = parseFloat(document.getElementById('cmx-dep').value) || 0;
    const wastePercent = parseFloat(document.getElementById('cmx-waste').value) || 0;

    // Calculations
    const netCubicFeet = length * width * (depthInches / 12);
    const grossCubicFeet = netCubicFeet * (1 + (wastePercent / 100));
    const grossCubicYards = grossCubicFeet / 27;

    const topsoilVolumeYards = grossCubicYards * 0.70;
    const topsoilVolumeFeet = grossCubicFeet * 0.70;
    const compostVolumeYards = grossCubicYards * 0.30;
    const compostVolumeFeet = grossCubicFeet * 0.30;

    // Update the UI Elements
    document.getElementById('cmx-out-total-yd').innerText = grossCubicYards.toFixed(2) + " Cubic Yards";
    document.getElementById('cmx-out-total-ft').innerText = grossCubicFeet.toFixed(2) + " Total Cubic Feet (Inc. Waste)";
    
    document.getElementById('cmx-out-soil-yd').innerText = topsoilVolumeYards.toFixed(2) + " yd³";
    document.getElementById('cmx-out-soil-tons').innerText = (topsoilVolumeYards * 1.00).toFixed(2);
    document.getElementById('cmx-out-soil-bags').innerText = Math.ceil(topsoilVolumeFeet / 0.75).toLocaleString();

    document.getElementById('cmx-out-comp-yd').innerText = compostVolumeYards.toFixed(2) + " yd³";
    document.getElementById('cmx-out-comp-tons').innerText = (compostVolumeYards * 0.60).toFixed(2);
    document.getElementById('cmx-out-comp-bags').innerText = Math.ceil(compostVolumeFeet / 1.00).toLocaleString();
}
