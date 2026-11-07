import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  X,
  FileText,
  Calendar,
  MapPin,
  User,
  HardHat,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { MeasurementSystem } from '../types';
import {
  CalculatorSEOInput,
  getActiveCalculation,
  subscribeToActiveCalculation,
} from '../utils/dynamicSEO';
import { generateJobSheetPDF, JobSheetPDFData } from '../utils/pdfGenerator';

interface PrintJobSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  system: MeasurementSystem;
  activeCalcInput?: CalculatorSEOInput | null;
}

export const PrintJobSheetModal: React.FC<PrintJobSheetModalProps> = ({
  isOpen,
  onClose,
  system,
  activeCalcInput,
}) => {
  const [calcData, setCalcData] = useState<CalculatorSEOInput | null>(
    activeCalcInput || getActiveCalculation()
  );

  // Subscribe to live calculation updates
  useEffect(() => {
    if (activeCalcInput) {
      setCalcData(activeCalcInput);
      return;
    }
    const unsub = subscribeToActiveCalculation((data) => {
      if (data) setCalcData(data);
    });
    return unsub;
  }, [activeCalcInput, isOpen]);

  // Project and job-site metadata
  const [clientName, setClientName] = useState('Smith Residence Project');
  const [siteAddress, setSiteAddress] = useState('1428 Elm Creek Road');
  const [contractorName, setContractorName] = useState('Apex Hardscaping & Construction');
  const [referenceNo, setReferenceNo] = useState(`MY-${Math.floor(100000 + Math.random() * 900000)}`);
  const [workDate, setWorkDate] = useState(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  );
  const [jobSiteNotes, setJobSiteNotes] = useState(
    'Verify formwork & subgrade compaction prior to concrete/materials delivery. Staging on gravel pad.'
  );

  // Sheet configuration toggles
  const [includeCost, setIncludeCost] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [showMetadataEditor, setShowMetadataEditor] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Format calculation specifications based on active calculator type
  const formatSpecSheetData = (calc: CalculatorSEOInput | null): JobSheetPDFData => {
    const defaultData: JobSheetPDFData = {
      jobTitle: 'Material Quantity & Job-Site Spec Sheet',
      category: 'General Materials',
      clientName,
      siteAddress,
      contractorName,
      referenceNo,
      workDate,
      dimensions: [
        { label: 'Calculated Area / Volume', value: 'Standard specification' },
        { label: 'Measurement System', value: system === 'imperial' ? 'Imperial (US Customary)' : 'Metric (SI)' },
      ],
      primaryQuantity: { label: 'Total Material Required', value: '1.00', unit: 'Units' },
      secondaryBreakdown: [{ label: 'Packaging', value: 'Standard Bulk / Retail' }],
      allowanceNote: 'Calculated using Material Yardage engineering equations',
      jobSiteNotes,
    };

    if (!calc) return defaultData;

    switch (calc.calculatorId) {
      case 'concrete_calc': {
        const isSlab = calc.concreteType === 'slab';
        const isCol = calc.concreteType === 'column';
        const vol = calc.volumeCuYd.toFixed(2);
        const unitPrice = calc.unitPrice || 145;
        const subtotal = calc.volumeCuYd * unitPrice;

        const dimensions = isSlab
          ? [
              { label: 'Structure Type', value: 'Flat Concrete Slab / Patio' },
              { label: 'Length', value: `${calc.slabLength || 20} feet` },
              { label: 'Width', value: `${calc.slabWidth || 10} feet` },
              { label: 'Thickness', value: `${calc.slabThickness || 4} inches` },
              { label: 'Spillage & Form Loss Allowance', value: `${calc.spillageWaste || 10}% extra` },
            ]
          : isCol
          ? [
              { label: 'Structure Type', value: 'Round Column / Sonotube Pier' },
              { label: 'Column Diameter', value: `${calc.colDiameter || 12} inches` },
              { label: 'Hole Depth', value: `${calc.colDepth || 48} inches` },
              { label: 'Number of Columns', value: `${calc.colCount || 6} piers` },
              { label: 'Spillage Allowance', value: `${calc.spillageWaste || 10}% extra` },
            ]
          : [
              { label: 'Structure Type', value: 'Cast Concrete Steps' },
              { label: 'Step Count', value: `${calc.stepCount || 3} risers` },
              { label: 'Width', value: `${calc.stepWidth || 4} feet` },
              { label: 'Spillage Allowance', value: `${calc.spillageWaste || 10}% extra` },
            ];

        return {
          jobTitle: isSlab
            ? `Concrete Slab Pour (${calc.slabLength}' × ${calc.slabWidth}' × ${calc.slabThickness}")`
            : isCol
            ? `Sonotube Pier Footings (${calc.colCount}x ${calc.colDiameter}" Ø)`
            : 'Concrete Steps & Stairs Takeoff',
          category: 'Concrete & Masonry',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions,
          primaryQuantity: { label: 'Ready-Mix Ready Pour Volume', value: vol, unit: 'Cubic Yards' },
          secondaryBreakdown: [
            { label: '80-lb Ready-Mix Concrete Bags', value: `${calc.bags80lb} bags (60 lb: ${calc.bags60lb} bags)` },
            { label: 'Estimated Wet Mass', value: `${(calc.volumeCuYd * 2.025).toFixed(2)} US Tons (~${((calc.volumeCuYd * 2.025) * 2000).toLocaleString()} lbs)` },
            { label: 'Metric Volume Equivalent', value: `${(calc.volumeCuYd * 0.7645).toFixed(2)} Cubic Meters (m³)` },
            { label: '1:2:4 On-Site Mix Ingredients', value: `${Math.ceil(calc.volumeCuYd * 6)} bags Portland + ${Math.ceil(calc.volumeCuYd * 12)} cu ft Sand + ${Math.ceil(calc.volumeCuYd * 18)} cu ft Stone` },
          ],
          allowanceNote: `Includes ${calc.spillageWaste || 10}% volumetric spillage & formwork margin`,
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }

      case 'mulch_soil': {
        const vol = calc.volumeCuYd.toFixed(2);
        const unitPrice = calc.unitPrice || 38;
        const subtotal = calc.volumeCuYd * unitPrice;

        return {
          jobTitle: `${calc.materialName} Bedding Takeoff`,
          category: 'Landscaping & Soil',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions: [
            { label: 'Bed Geometry Shape', value: calc.shape.toUpperCase() },
            { label: 'Bed Dimensions', value: `${calc.dim1}' × ${calc.dim2 || 0}'` },
            { label: 'Total Surface Area', value: `${Math.round(calc.areaSqFt).toLocaleString()} Square Feet` },
            { label: 'Application Depth', value: `${calc.depthInches} inches` },
            { label: 'Material Density', value: `${calc.materialName} (settling buffer included)` },
          ],
          primaryQuantity: { label: 'Bulk Delivered Volume', value: vol, unit: 'Cubic Yards' },
          secondaryBreakdown: [
            { label: 'Standard Retail Bags (2.0 cu ft)', value: `${calc.bags2CuFt} bags` },
            { label: 'Large Retail Bags (3.0 cu ft)', value: `${Math.ceil(calc.volumeCuYd * 9)} bags` },
            { label: 'Delivered Weight (Tonnage)', value: `${calc.weightTons.toFixed(2)} US Tons (~${Math.round(calc.weightTons * 2000).toLocaleString()} lbs)` },
            { label: 'Metric Volume Equivalent', value: `${(calc.volumeCuYd * 0.7645).toFixed(2)} Cubic Meters (m³)` },
          ],
          allowanceNote: 'Calculated with compaction factor for even garden bed coverage',
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }

      case 'gravel_aggregate': {
        const tons = calc.weightTons.toFixed(2);
        const unitPrice = calc.unitPrice || 45;
        const subtotal = calc.weightTons * unitPrice;

        return {
          jobTitle: `${calc.materialName} Driveway / Sub-Base Specification`,
          category: 'Aggregates & Grading',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions: [
            { label: 'Area Shape', value: calc.shape.toUpperCase() },
            { label: 'Dimensions', value: `${calc.dim1}' × ${calc.dim2 || 0}'` },
            { label: 'Surface Area', value: `${Math.round(calc.areaSqFt).toLocaleString()} Square Feet` },
            { label: 'Compacted Depth', value: `${calc.depthInches} inches` },
            { label: 'Material Specified', value: calc.materialName },
          ],
          primaryQuantity: { label: 'Total Scaled Weight Requirement', value: tons, unit: 'US Tons' },
          secondaryBreakdown: [
            { label: 'Bulk Volume Equivalent', value: `${calc.volumeCuYd.toFixed(2)} Cubic Yards` },
            { label: '50-lb Bag Equivalent', value: `${calc.bags50lb.toLocaleString()} bags` },
            { label: 'Tri-Axle Dump Truck Loads (10 yd)', value: `${calc.truckloads || 1} truckload(s)` },
            { label: 'Metric Tonnes Equivalent', value: `${(calc.weightTons * 0.907).toFixed(2)} Tonnes` },
          ],
          allowanceNote: 'Includes ~12% mechanical compaction factor for road base/driveway grading',
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }

      case 'paver_masonry': {
        const isPaver = calc.subType === 'pavers';
        const unitPrice = calc.unitPrice || (isPaver ? 0.85 : 2.50);
        const count = isPaver ? (calc.totalPavers || 0) : (calc.totalUnits || 0);
        const subtotal = count * unitPrice;

        const dimensions = isPaver
          ? [
              { label: 'Patio Length', value: `${calc.patioLength || 20} feet` },
              { label: 'Patio Width', value: `${calc.patioWidth || 15} feet` },
              { label: 'Surface Area', value: `${(calc.patioAreaSqFt || 300).toLocaleString()} Sq Ft` },
              { label: 'Selected Paver Unit', value: calc.paverName || 'Holland Paver (4"×8")' },
              { label: 'Cutting & Perimeter Waste', value: '10% factored' },
            ]
          : [
              { label: 'Wall Length', value: `${calc.wallLength || 30} feet` },
              { label: 'Wall Height', value: `${calc.wallHeight || 4} feet` },
              { label: 'Wall Face Area', value: `${(calc.wallLength || 30) * (calc.wallHeight || 4)} Sq Ft` },
              { label: 'Block Unit Type', value: calc.masonryType === 'brick' ? 'Modular Brick' : 'CMU Block (8×8×16)' },
            ];

        return {
          jobTitle: isPaver ? 'Paver Patio & Walkway Specification Sheet' : 'Masonry Block Wall Takeoff',
          category: 'Hardscaping & Masonry',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions,
          primaryQuantity: {
            label: isPaver ? 'Total Pavers Required (Incl. Cut Waste)' : 'Total Masonry Units',
            value: count.toLocaleString(),
            unit: isPaver ? 'Pavers' : 'Blocks',
          },
          secondaryBreakdown: isPaver
            ? [
                { label: 'Bedding Sand Layer (1" Screeded)', value: `${(calc.beddingSandTons || 1.2).toFixed(2)} US Tons` },
                { label: 'Polymeric Joint Sand (50-lb bags)', value: `${calc.polymericSandBags || 5} bags` },
                { label: 'Compacted Base Rock (4" depth)', value: `${((calc.patioAreaSqFt || 300) * (4 / 12) / 27 * 1.5).toFixed(2)} US Tons` },
              ]
            : [
                { label: 'Mortar Mix (80-lb bags)', value: `${calc.mortarBags || 15} bags` },
                { label: 'Rebar / Grout (if required)', value: 'As per structural code' },
              ],
          allowanceNote: 'Includes cutting waste for bond joints & perimeter borders',
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }

      case 'sod_turf': {
        const unitPrice = calc.unitPrice || 250;
        const subtotal = calc.wholePallets * unitPrice;

        return {
          jobTitle: 'Sod & Turf Grass Lawn Takeoff Sheet',
          category: 'Turf & Sod',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions: [
            { label: 'Lawn Length', value: `${calc.lawnLength} feet` },
            { label: 'Lawn Width', value: `${calc.lawnWidth} feet` },
            { label: 'Net Lawn Area', value: `${Math.round(calc.areaSqFt).toLocaleString()} Sq Ft` },
            { label: 'Perimeter Cutting Waste', value: '8% factored' },
            { label: 'Gross Area with Waste', value: `${Math.round(calc.totalAreaWithWaste).toLocaleString()} Sq Ft` },
          ],
          primaryQuantity: { label: 'Whole Pallets to Order', value: `${calc.wholePallets}`, unit: 'Pallets' },
          secondaryBreakdown: [
            { label: 'Individual Rolls Needed (2\' × 5\')', value: `${calc.rollsNeeded} rolls` },
            { label: 'Pallet Coverage Standard', value: `${calc.palletSizeSqFt} sq ft per pallet` },
            { label: 'Total Sod Delivered', value: `${calc.wholePallets * calc.palletSizeSqFt} sq ft total` },
          ],
          allowanceNote: 'Order must be laid within 24-48 hours of farm delivery',
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }

      case 'curtains_drapery': {
        const unitPrice = calc.unitPrice || 28;
        const subtotal = calc.totalYards * unitPrice;

        return {
          jobTitle: 'Curtains & Drapery Workroom Cut Sheet',
          category: 'Fabric & Window Treatments',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions: [
            { label: 'Track / Rod Width', value: `${calc.trackWidthInches} inches` },
            { label: 'Finished Drop Length', value: `${calc.finishedDropInches} inches` },
            { label: 'Gathered Fullness Multiplier', value: `${calc.fullness}x fullness` },
            { label: 'Panel Configuration', value: calc.pairOfCurtains ? 'Pair (2 Panels)' : 'Single Panel' },
            { label: 'Fabric Bolt Usable Width', value: `${calc.fabricWidthInches} inches` },
          ],
          primaryQuantity: { label: 'Total Linear Fabric Requirement', value: calc.totalYards.toFixed(2), unit: 'Yards' },
          secondaryBreakdown: [
            { label: 'Fabric Widths Needed', value: `${calc.totalWidthsNeeded} widths` },
            { label: 'Lining Fabric (if required)', value: `${calc.totalYards.toFixed(2)} yards` },
            { label: 'Metric Length Equivalent', value: `${(calc.totalYards * 0.9144).toFixed(2)} Meters` },
          ],
          allowanceNote: 'Includes double bottom hems (8") and heading allowances (6")',
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }

      case 'quilt_backing': {
        const unitPrice = calc.unitPrice || 14;
        const subtotal = calc.totalYards * unitPrice;

        return {
          jobTitle: 'Quilt Backing & Binding Workroom Sheet',
          category: 'Quilting & Craft',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions: [
            { label: 'Quilt Top Width', value: `${calc.topWidthInches} inches` },
            { label: 'Quilt Top Length', value: `${calc.topLengthInches} inches` },
            { label: 'Fabric Bolt Width', value: `${calc.fabricWidthInches} inches` },
            { label: 'Longarm Overhang Buffer', value: '4" on all 4 sides' },
            { label: 'Seam Orientation', value: (calc.seamOrientation || 'Horizontal').toUpperCase() },
          ],
          primaryQuantity: { label: 'Total Project Yardage', value: calc.totalYards.toFixed(2), unit: 'Yards' },
          secondaryBreakdown: [
            { label: 'Backing Fabric Requirement', value: `${calc.backingYards.toFixed(2)} yards` },
            { label: 'Binding Strips Fabric (2.5" wide)', value: `${calc.bindingYards.toFixed(2)} yards` },
            { label: 'Metric Length', value: `${(calc.totalYards * 0.9144).toFixed(2)} meters` },
          ],
          allowanceNote: 'Includes miter seam join margin for continuous binding',
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }

      case 'upholstery_cushions': {
        const unitPrice = calc.unitPrice || 36;
        const subtotal = calc.totalFabricYards * unitPrice;

        return {
          jobTitle: 'Upholstery & Box Cushion Workroom Sheet',
          category: 'Upholstery & Foam',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions: [
            { label: 'Cushion Count', value: `${calc.cushionCount} cushions` },
            { label: 'Cushion Width', value: `${calc.cushionWidth} inches` },
            { label: 'Cushion Depth', value: `${calc.cushionDepth} inches` },
            { label: 'Foam Core Thickness', value: `${calc.foamThickness} inches` },
            { label: 'Fabric Bolt Width', value: `${calc.fabricWidth}" Decorator Fabric` },
          ],
          primaryQuantity: { label: 'Total Upholstery Fabric', value: calc.totalFabricYards.toFixed(2), unit: 'Yards' },
          secondaryBreakdown: [
            { label: 'Top & Bottom Plates Cut', value: `${calc.cushionCount * 2} plates` },
            { label: 'Continuous Welting / Piping Cord', value: `${(calc.pipingCordYards || 0).toFixed(1)} yards` },
            { label: 'High-Density Foam Volume', value: `${((calc.cushionWidth * calc.cushionDepth * calc.foamThickness * calc.cushionCount) / 144).toFixed(1)} Board Feet` },
          ],
          allowanceNote: 'Includes 0.5" seam allowances on all perimeter joins',
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }

      case 'fabric_cut': {
        const unitPrice = calc.unitPrice || 24;
        const subtotal = calc.totalYards * unitPrice;

        return {
          jobTitle: '2D Fabric Cut Layout Specification',
          category: 'Sewing & Apparel',
          clientName,
          siteAddress,
          contractorName,
          referenceNo,
          workDate,
          dimensions: [
            { label: 'Usable Bolt Width', value: `${calc.usableWidth} inches` },
            { label: 'Total Pattern Pieces', value: `${calc.totalPieces} pieces` },
            { label: 'Purchase Scrap Margin', value: `${calc.wastePercent || 8}% buffer` },
            { label: 'Cutting Strategy', value: '2D Guillotine Bin-Packing' },
          ],
          primaryQuantity: { label: 'Linear Fabric Purchase Yardage', value: calc.totalYards.toFixed(2), unit: 'Yards' },
          secondaryBreakdown: [
            { label: 'Total Pieces Placed', value: `${calc.totalPieces} pattern cuts` },
            { label: 'Metric Equivalent', value: `${(calc.totalYards * 0.9144).toFixed(2)} meters` },
          ],
          allowanceNote: 'Pieces aligned to grainline with squaring & seam buffer',
          costEstimate: includeCost
            ? {
                unitPrice,
                subtotal,
                tax: subtotal * 0.08,
                total: subtotal * 1.08,
              }
            : undefined,
          jobSiteNotes,
        };
      }
    }
  };

  const sheetData = formatSpecSheetData(calcData);

  // Trigger browser print dialog (targeting print stylesheet)
  const handlePrint = () => {
    window.print();
  };

  // Trigger high-res jsPDF generation and download
  const handleDownloadPDF = () => {
    generateJobSheetPDF(sheetData);
  };

  // Copy plain text summary for quick messaging
  const handleCopySummary = async () => {
    const textSummary = `
========================================
MATERIAL YARDAGE — JOB-SITE SPEC SHEET
Reference: #${sheetData.referenceNo}
Date: ${sheetData.workDate}
========================================
Project: ${sheetData.clientName}
Location: ${sheetData.siteAddress}
Contractor: ${sheetData.contractorName}
Specification: ${sheetData.jobTitle}

PRIMARY REQUIREMENT:
${sheetData.primaryQuantity.value} ${sheetData.primaryQuantity.unit} (${sheetData.primaryQuantity.label})

DIMENSIONS & PARAMETERS:
${sheetData.dimensions.map(d => `• ${d.label}: ${d.value}`).join('\n')}

PACKAGING BREAKDOWN:
${sheetData.secondaryBreakdown.map(s => `• ${s.label}: ${s.value}`).join('\n')}

${sheetData.costEstimate ? `ESTIMATED BUDGET: $${sheetData.costEstimate.total.toFixed(2)} (Unit: $${sheetData.costEstimate.unitPrice.toFixed(2)})` : ''}

JOB-SITE NOTES:
${sheetData.jobSiteNotes || 'None specified'}
========================================
Generated via https://www.materialyardage.com
`.trim();

    try {
      await navigator.clipboard.writeText(textSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div
      id="print-job-sheet-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print-modal-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden print-modal-dialog">
        {/* Top Control Header Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 print-controls-bar no-print shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 text-emerald-100 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Print-Friendly Job-Site Spec Sheet</span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60 font-mono uppercase">
                  PDF Ready
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Strips all ads, navigation & footer for clean physical printouts or PDF contracts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              title="Print document or save as PDF via system dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Download direct high-resolution PDF document"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Copy plain-text summary for message or email"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1 cursor-pointer"
              aria-label="Close print modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Settings & Custom Metadata Accordion (Hidden during print) */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 text-xs print-controls-bar no-print shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeCost}
                  onChange={e => setIncludeCost(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium">Include Budget Pricing</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSignatures}
                  onChange={e => setIncludeSignatures(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium">Signature Sign-off Block</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setShowMetadataEditor(!showMetadataEditor)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              <span>{showMetadataEditor ? 'Hide' : 'Customize'} Client & Job Info</span>
              {showMetadataEditor ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible Metadata Editor Form */}
          {showMetadataEditor && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-200">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Client / Project</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Job Site Address</label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={e => setSiteAddress(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Contractor / Prepared By</label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={e => setContractorName(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">PO / Ref Number</label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={e => setReferenceNo(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800 font-mono"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4">
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Job-Site Delivery & Access Notes</label>
                <input
                  type="text"
                  value={jobSiteNotes}
                  onChange={e => setJobSiteNotes(e.target.value)}
                  placeholder="e.g., Gate access code, 10-wheel truck parking clearance..."
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* The Printable Spec Sheet Document Body */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            id="print-job-sheet-card"
            className="bg-white border border-slate-300 shadow-lg rounded-xl w-full max-w-3xl p-6 sm:p-8 space-y-6 print-sheet-paper"
          >
            {/* Sheet Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    Material<span className="text-emerald-800">Yardage</span>
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-mono uppercase font-bold">
                    Job-Site Spec Sheet
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Engineering Material Takeoff & Procurement Order
                </p>
                <p className="text-[11px] text-slate-400 font-mono">www.materialyardage.com</p>
              </div>

              <div className="text-right text-xs space-y-1">
                <div className="font-mono font-bold text-slate-900 text-sm">
                  PO / REF: #{sheetData.referenceNo}
                </div>
                <div className="text-slate-500 flex items-center justify-end gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sheetData.workDate}</span>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">
                  Verified Engineering Calculation
                </div>
              </div>
            </div>

            {/* Client & Site Details Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Project / Client</div>
                <div className="font-semibold text-slate-900 mt-0.5">{sheetData.clientName}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Job Site Address</div>
                <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{sheetData.siteAddress}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prepared By</div>
                <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1">
                  <HardHat className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{sheetData.contractorName}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Category</div>
                <div className="font-semibold text-emerald-900 mt-0.5">{sheetData.category}</div>
              </div>
            </div>

            {/* Headline Specification Title & Primary Quantity Callout */}
            <div className="border border-emerald-600 bg-emerald-50/70 rounded-xl p-5 print-avoid-break">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                Specified Structure: {sheetData.jobTitle}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <div className="text-xs text-slate-600">Headline Net Requirement:</div>
                  <div className="text-3xl font-black text-emerald-950 font-mono tracking-tight">
                    {sheetData.primaryQuantity.value}{' '}
                    <span className="text-lg font-bold text-emerald-800 uppercase">
                      {sheetData.primaryQuantity.unit}
                    </span>
                  </div>
                </div>

                {sheetData.allowanceNote && (
                  <div className="text-xs text-slate-600 bg-white/90 border border-emerald-200 px-3 py-2 rounded-lg max-w-xs">
                    <span className="font-semibold text-emerald-900">Allowance Factored:</span>{' '}
                    {sheetData.allowanceNote}
                  </div>
                )}
              </div>
            </div>

            {/* Dimensional Specifications Table */}
            <div className="space-y-2 print-avoid-break">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Dimensional Specifications & Geometric Inputs</span>
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Parameter / Dimensional Variable</th>
                      <th className="py-2 px-3 font-semibold text-right">Specified Input Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sheetData.dimensions.map((dim, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="py-2 px-3 text-slate-700 font-medium">{dim.label}</td>
                        <td className="py-2 px-3 text-slate-900 font-mono font-bold text-right">{dim.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Packaging, Unit Breakdown & Logistics */}
            {sheetData.secondaryBreakdown.length > 0 && (
              <div className="space-y-2 print-avoid-break">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>2. Packaging, Logistics & Delivery Breakdown</span>
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Packaging Unit / Material Format</th>
                        <th className="py-2 px-3 font-semibold text-right">Estimated Units Required</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {sheetData.secondaryBreakdown.map((sec, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                          <td className="py-2 px-3 text-slate-700 font-medium">{sec.label}</td>
                          <td className="py-2 px-3 text-slate-900 font-mono font-bold text-right">{sec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Budget & Procurement Estimate (If toggled) */}
            {includeCost && sheetData.costEstimate && sheetData.costEstimate.total > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 print-avoid-break">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  3. Procurement Budget & Material Quote
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-slate-600">
                      Estimated Unit Rate:{' '}
                      <span className="font-mono font-semibold text-slate-900">
                        ${sheetData.costEstimate.unitPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Material Subtotal: ${sheetData.costEstimate.subtotal.toFixed(2)} · Estimated 8% Tax: $
                      {sheetData.costEstimate.tax.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">Total Estimated Material Cost</div>
                    <div className="text-xl font-black text-emerald-900 font-mono">
                      ${sheetData.costEstimate.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job-Site Verification Checklist */}
            <div className="border border-slate-200 rounded-lg p-4 text-xs space-y-2 print-avoid-break bg-white">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Job-Site Field Verification Checklist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs shrink-0" />
                  <span>Verify subgrade leveling & mechanical compaction prior to pour/fill</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs shrink-0" />
                  <span>Confirm minimum 10-ft clearance for tandem/tri-axle delivery truck</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs shrink-0" />
                  <span>Double check physical formwork diagonals & stringline elevation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs shrink-0" />
                  <span>Inspect fabric bolt usable width & pattern grain before cutting</span>
                </div>
              </div>

              {sheetData.jobSiteNotes && (
                <div className="pt-2 border-t border-slate-100 text-[11px]">
                  <span className="font-semibold text-slate-800">Job-Site Access Notes:</span>{' '}
                  <span className="text-slate-600">{sheetData.jobSiteNotes}</span>
                </div>
              )}
            </div>

            {/* Signatures Authorization Block */}
            {includeSignatures && (
              <div className="pt-4 border-t border-slate-300 print-avoid-break">
                <div className="grid grid-cols-2 gap-8 text-xs">
                  <div>
                    <div className="border-b border-slate-400 pb-8 text-slate-400 italic text-[11px]">
                      Authorized Signature
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                      <span>Contractor / Foreman</span>
                      <span>Date</span>
                    </div>
                  </div>

                  <div>
                    <div className="border-b border-slate-400 pb-8 text-slate-400 italic text-[11px]">
                      Accepted Signature
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                      <span>Owner / Client</span>
                      <span>Date</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sheet Footer */}
            <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400">
              <div>Material Yardage Specification Sheet · Printed from www.materialyardage.com</div>
              <div>PO #{sheetData.referenceNo} · Professional Estimating & Cut Layouts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
