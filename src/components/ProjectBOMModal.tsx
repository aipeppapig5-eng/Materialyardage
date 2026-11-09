import React, { useState } from 'react';
import { BOMItem } from '../types';
import { X, Trash2, Printer, Download, Copy, Check, ShoppingBag, FileDown, Box, Scale, TrendingUp, TrendingDown, Layers, Weight, Sparkles, ArrowRight, FolderKanban } from 'lucide-react';
import { generateBOMPDF } from '../utils/pdfGenerator';
import { MATERIAL_COMPARISONS, MaterialComparisonOption, calculateMaterialComparisonMetrics } from '../data/materialComparisonData';

interface ProjectBOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BOMItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onUpdateItemPrice: (id: string, price: number) => void;
  onReplaceItem?: (id: string, updated: Omit<BOMItem, 'id' | 'timestamp'>) => void;
  onOpen3DPreview?: () => void;
  onOpenComparisonModal?: (item?: BOMItem) => void;
  onOpenProjectManager?: () => void;
}

export const ProjectBOMModal: React.FC<ProjectBOMModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  onUpdateItemPrice,
  onReplaceItem,
  onOpen3DPreview,
  onOpenComparisonModal,
  onOpenProjectManager,
}) => {
  const [comparingItemId, setComparingItemId] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(65);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(7.5);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('My Project Material Estimate');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.primaryQuantity * item.unitPrice, 0);
  const taxAmount = (subtotal + deliveryFee) * (taxRatePercent / 100);
  const totalBudget = subtotal + deliveryFee + taxAmount;

  const handleCopySummary = () => {
    let summary = `MATERIAL ESTIMATE: ${projectName}\n`;
    summary += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    items.forEach((item, i) => {
      summary += `${i + 1}. ${item.name}\n`;
      summary += `   Quantity: ${item.primaryQuantity} ${item.primaryUnit} @ $${item.unitPrice.toFixed(2)} = $${(item.primaryQuantity * item.unitPrice).toFixed(2)}\n`;
      summary += `   Details: ${item.secondarySummary}\n`;
      if (item.notes) summary += `   Notes: ${item.notes}\n`;
      summary += `\n`;
    });
    summary += `----------------------------------------\n`;
    summary += `Material Subtotal: $${subtotal.toFixed(2)}\n`;
    summary += `Delivery Fee: $${deliveryFee.toFixed(2)}\n`;
    summary += `Estimated Tax (${taxRatePercent}%): $${taxAmount.toFixed(2)}\n`;
    summary += `TOTAL ESTIMATED BUDGET: $${totalBudget.toFixed(2)}\n`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    let csv = 'Item,Category,Calculator,Quantity,Unit,Unit Price ($),Subtotal ($),Details,Notes\n';
    items.forEach(item => {
      const line = [
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        `"${item.calculatorType}"`,
        item.primaryQuantity,
        `"${item.primaryUnit}"`,
        item.unitPrice.toFixed(2),
        (item.primaryQuantity * item.unitPrice).toFixed(2),
        `"${(item.secondarySummary || '').replace(/"/g, '""')}"`,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
      csv += line + '\n';
    });
    csv += `\n"Material Subtotal",,,,,,"${subtotal.toFixed(2)}",,\n`;
    csv += `"Delivery Fee",,,,,,"${deliveryFee.toFixed(2)}",,\n`;
    csv += `"Estimated Tax (${taxRatePercent}%)",,,,,,"${taxAmount.toFixed(2)}",,\n`;
    csv += `"Total Budget",,,,,,"${totalBudget.toFixed(2)}",,\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `material_estimate_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (items.length === 0) return;
    setIsGeneratingPDF(true);
    try {
      generateBOMPDF({
        projectName,
        items,
        deliveryFee,
        taxRatePercent,
      });
    } catch (err) {
      console.error('Failed to generate PDF estimate:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="text-base font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-500 focus:border-emerald-600 focus:outline-hidden pb-0.5"
              />
              <p className="text-xs text-slate-500">
                Consolidated Bill of Materials, supplier order quantities & cost breakdown
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenProjectManager && (
              <button
                onClick={onOpenProjectManager}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                title="Manage projects, templates, and backups"
              >
                <FolderKanban className="w-3.5 h-3.5 text-emerald-700" />
                <span>Projects</span>
              </button>
            )}
            {onOpenComparisonModal && (
              <button
                onClick={() => onOpenComparisonModal()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Open side-by-side Material Comparison tool"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                <span>Compare Materials</span>
              </button>
            )}
            {onOpen3DPreview && (
              <button
                onClick={onOpen3DPreview}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Open interactive 3D cross-section and schematic model"
              >
                <Box className="w-3.5 h-3.5 text-emerald-700" />
                <span>3D Schematic</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {items.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Your Project Estimate is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use any of our fabric, mulch, concrete, or aggregate calculators and click "Add to Project BOM" to build your complete supply list.
              </p>
            </div>
          ) : (
            <>
              {/* Item List Table with Inline Material Comparison */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Item & Category</th>
                      <th className="py-2.5 px-3">Quantity</th>
                      <th className="py-2.5 px-3">Unit Price ($)</th>
                      <th className="py-2.5 px-3">Subtotal</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map(item => {
                      const isComparing = comparingItemId === item.id;
                      const alternatives = (() => {
                        const name = item.name.toLowerCase();
                        const type = item.calculatorType.toLowerCase();
                        if (name.includes('mulch') || name.includes('bark') || name.includes('soil') || name.includes('compost') || type.includes('mulch')) {
                          return MATERIAL_COMPARISONS['mulch_soil'] || [];
                        }
                        if (name.includes('gravel') || name.includes('aggregate') || name.includes('stone') || name.includes('crush') || name.includes('sand') || type.includes('gravel')) {
                          return MATERIAL_COMPARISONS['aggregates'] || [];
                        }
                        if (item.category === 'fabric' || name.includes('cotton') || name.includes('linen') || name.includes('curtain') || name.includes('quilt')) {
                          return MATERIAL_COMPARISONS['fabric'] || [];
                        }
                        return MATERIAL_COMPARISONS['mulch_soil'] || [];
                      })();

                      return (
                        <React.Fragment key={item.id}>
                          <tr className={`transition-colors ${isComparing ? 'bg-emerald-50/60' : 'hover:bg-slate-50/50'}`}>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900">{item.name}</div>
                              <div className="text-[11px] text-slate-500">{item.secondarySummary}</div>
                              {item.notes && (
                                <div className="text-[10px] text-slate-400 italic mt-0.5">{item.notes}</div>
                              )}
                              {/* Quick Material Comparison Trigger */}
                              <div className="flex items-center gap-2 mt-1.5">
                                <button
                                  type="button"
                                  onClick={() => setComparingItemId(isComparing ? null : item.id)}
                                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                                    isComparing
                                      ? 'bg-emerald-900 text-white font-bold'
                                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                                  }`}
                                  title="Compare alternative materials (Pine Bark, Cedar, Topsoil) and adjust costs"
                                >
                                  <Scale className="w-3 h-3 text-emerald-700" />
                                  <span>{isComparing ? 'Hide Comparison' : 'Compare Material Types'}</span>
                                </button>
                                {onOpenComparisonModal && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenComparisonModal(item)}
                                    className="text-[10px] text-slate-500 hover:text-emerald-700 underline"
                                  >
                                    Side-by-side modal &rarr;
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-800 tabular-nums">
                              {item.primaryQuantity} {item.primaryUnit}
                            </td>
                            <td className="py-3 px-3">
                              <div className="relative w-24">
                                <span className="absolute left-2 top-1.5 text-slate-400 text-xs">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={item.unitPrice}
                                  onChange={e => onUpdateItemPrice(item.id, Number(e.target.value))}
                                  className="w-full pl-5 pr-2 py-1 text-xs border border-slate-300 rounded font-mono tabular-nums"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-emerald-800 tabular-nums">
                              ${(item.primaryQuantity * item.unitPrice).toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                title="Remove line item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>

                          {/* Expandable Material Comparison Drawer Row */}
                          {isComparing && (
                            <tr className="bg-emerald-50/40 border-y border-emerald-200 animate-fadeIn">
                              <td colSpan={5} className="p-4">
                                <div className="space-y-3">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1 bg-emerald-700 text-white rounded">
                                        <Scale className="w-3.5 h-3.5" />
                                      </div>
                                      <div>
                                        <span className="text-xs font-bold text-slate-900 block">
                                          Compare Material Types & Cost/Volume Differences
                                        </span>
                                        <span className="text-[11px] text-slate-600">
                                          Toggle materials to see instant cost delta and weight/volume adjustments based on bulk density.
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setComparingItemId(null)}
                                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                                    >
                                      Done Comparing ✕
                                    </button>
                                  </div>

                                  {/* Candidate Material Cards Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {alternatives.map(alt => {
                                      // Volume adjustment based on depth ratio (standard baseline = 3")
                                      const depthRatio = alt.recommendedDepthInches > 0 ? (alt.recommendedDepthInches / 3.0) : 1;
                                      const adjustedVol = Number((item.primaryQuantity * depthRatio).toFixed(2));
                                      const currentItemTotal = item.primaryQuantity * item.unitPrice;
                                      const candidateTotal = adjustedVol * alt.defaultPricePerUnit;
                                      const costDiff = candidateTotal - currentItemTotal;
                                      const costPercentDiff = currentItemTotal > 0 ? (costDiff / currentItemTotal) * 100 : 0;
                                      const totalWeightTons = Number((adjustedVol * alt.tonsPerCuYd).toFixed(2));
                                      const estimatedBags = Math.ceil(adjustedVol * alt.bagsPerCuYd);
                                      const isCurrent = item.name.toLowerCase().includes(alt.shortName.toLowerCase());

                                      return (
                                        <div
                                          key={alt.id}
                                          className={`bg-white rounded-xl p-3 border transition-all flex flex-col justify-between shadow-2xs ${
                                            isCurrent
                                              ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                                              : 'border-slate-200 hover:border-emerald-400'
                                          }`}
                                        >
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-bold text-slate-900">
                                                {alt.shortName}
                                              </span>
                                              {isCurrent ? (
                                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                                  Current
                                                </span>
                                              ) : (
                                                <span
                                                  className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                                    costDiff > 0
                                                      ? 'bg-rose-100 text-rose-800'
                                                      : costDiff < 0
                                                      ? 'bg-emerald-100 text-emerald-800'
                                                      : 'bg-slate-100 text-slate-700'
                                                  }`}
                                                >
                                                  {costDiff > 0 ? '+' : ''}${costDiff.toFixed(2)} ({costPercentDiff > 0 ? '+' : ''}{costPercentDiff.toFixed(0)}%)
                                                </span>
                                              )}
                                            </div>

                                            <div className="flex items-baseline justify-between text-xs">
                                              <span className="text-sm font-mono font-extrabold text-slate-900">
                                                ${candidateTotal.toFixed(2)}
                                              </span>
                                              <span className="text-[11px] text-slate-500 font-mono">
                                                ${alt.defaultPricePerUnit}/{alt.unitLabel}
                                              </span>
                                            </div>

                                            {/* Volume & Weight Adjustment Details */}
                                            <div className="bg-slate-50 p-2 rounded-lg text-[10px] space-y-1 text-slate-600 border border-slate-100">
                                              <div className="flex justify-between">
                                                <span>Volume:</span>
                                                <strong className="font-mono text-slate-800">{adjustedVol} yd³ ({alt.recommendedDepthInches}" depth)</strong>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>Hauling Weight:</span>
                                                <strong className="font-mono text-slate-800">{totalWeightTons} tons ({alt.tonsPerCuYd} t/yd³)</strong>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>Packaged Yield:</span>
                                                <span className="font-mono text-slate-700">{estimatedBags} {alt.bagSizeLabel}</span>
                                              </div>
                                            </div>

                                            <p className="text-[10px] text-slate-500 line-clamp-1 italic">
                                              Best for: {alt.bestFor}
                                            </p>
                                          </div>

                                          <div className="pt-2 mt-2 border-t border-slate-100">
                                            {isCurrent ? (
                                              <span className="block text-center text-[11px] font-bold text-emerald-800 py-1 bg-emerald-50 rounded-lg">
                                                ✓ Selected in BOM
                                              </span>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  if (onReplaceItem) {
                                                    onReplaceItem(item.id, {
                                                      name: `${alt.name} (${adjustedVol} yd³ @ ${alt.recommendedDepthInches}" depth)`,
                                                      category: item.category,
                                                      calculatorType: item.calculatorType,
                                                      primaryQuantity: adjustedVol,
                                                      primaryUnit: item.primaryUnit,
                                                      secondarySummary: `${estimatedBags} ${alt.bagSizeLabel} · ${totalWeightTons} tons · ${alt.durabilityYears}`,
                                                      unitPrice: alt.defaultPricePerUnit,
                                                      notes: `Swapped via Material Comparison. Rec. depth: ${alt.recommendedDepthInches}". Best for: ${alt.bestFor}.`,
                                                    });
                                                    setComparingItemId(null);
                                                  }
                                                }}
                                                className="w-full py-1.5 px-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                                              >
                                                <span>Swap to {alt.shortName}</span>
                                                <ArrowRight className="w-3 h-3" />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Delivery, Tax, and Budget Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-800">Additional Charges</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Supplier Delivery Fee ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={deliveryFee}
                        onChange={e => setDeliveryFee(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Sales Tax Rate (%)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        value={taxRatePercent}
                        onChange={e => setTaxRatePercent(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950 text-white rounded-xl p-5 space-y-2">
                  <div className="flex justify-between text-xs text-emerald-200">
                    <span>Materials Subtotal:</span>
                    <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-200">
                    <span>Delivery Fee:</span>
                    <span className="font-mono tabular-nums">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-200 border-b border-emerald-800 pb-2">
                    <span>Estimated Tax ({taxRatePercent}%):</span>
                    <span className="font-mono tabular-nums">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-1">
                    <span>Total Estimated Budget:</span>
                    <span className="font-mono tabular-nums">${totalBudget.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1"
              >
                Clear All Items
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpen3DPreview && (
              <button
                onClick={onOpen3DPreview}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg hover:bg-emerald-100 flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Open 3D schematic & exploded layer view"
              >
                <Box className="w-3.5 h-3.5 text-emerald-700" />
                <span>3D Schematic</span>
              </button>
            )}
            <button
              onClick={handleCopySummary}
              disabled={items.length === 0}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={items.length === 0}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={items.length === 0}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={items.length === 0 || isGeneratingPDF}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
