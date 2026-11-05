import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { LANDSCAPE_MATERIALS, FABRIC_WIDTH_PRESETS } from '../data/materialsData';

interface ReferenceGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideSection = 'density' | 'fabrics' | 'curtains' | 'concrete';

export const ReferenceGuidesModal: React.FC<ReferenceGuidesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [section, setSection] = useState<GuideSection>('density');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Engineering Reference & Density Tables</h3>
              <p className="text-xs text-slate-500">Official standard weights, bulk densities, bolt widths, and yield factors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/40 text-xs font-semibold">
          {[
            { id: 'density', label: 'Material Density & Bulk Weight' },
            { id: 'fabrics', label: 'Fabric Bolt Standards & Uses' },
            { id: 'curtains', label: 'Curtain Fullness & Hem Rules' },
            { id: 'concrete', label: 'Concrete Mix & Bag Yields' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id as GuideSection)}
              className={`py-3 px-4 border-b-2 transition-colors ${
                section === tab.id
                  ? 'border-emerald-600 text-emerald-900 font-bold bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content View */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {section === 'density' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">Standard Bulk Material Densities</h4>
                <p className="text-slate-500 mb-3">
                  Bulk density varies based on moisture content and compaction. Values below represent standard dry-to-damp delivered conditions used by commercial quarries and soil yards:
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Material Type</th>
                      <th className="py-2.5 px-3">US Short Tons / yd³</th>
                      <th className="py-2.5 px-3">Tonnes / m³</th>
                      <th className="py-2.5 px-3">Rec. Depth</th>
                      <th className="py-2.5 px-3">Characteristics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {LANDSCAPE_MATERIALS.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{m.name}</td>
                        <td className="py-2.5 px-3 font-mono font-medium text-emerald-800">{m.tonsPerCuYd.toFixed(2)} tons</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{m.tonnesPerCuM.toFixed(2)} t</td>
                        <td className="py-2.5 px-3 font-mono">{m.recommendedDepthInches ? `${m.recommendedDepthInches}"` : '—'}</td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-xs">{m.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'fabrics' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">Standard Fabric Bolt Widths</h4>
                <p className="text-slate-500 mb-3">
                  Fabrics come wound on standard bolts or rolls. Note that outer 0.5" to 1" edges are woven selvedges (selvage) and must be trimmed:
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Standard Classification</th>
                      <th className="py-2.5 px-3">Nominal Width</th>
                      <th className="py-2.5 px-3">Usable Width</th>
                      <th className="py-2.5 px-3">Typical Applications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {FABRIC_WIDTH_PRESETS.map(f => (
                      <tr key={f.name} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-semibold text-slate-900">{f.name}</td>
                        <td className="py-3 px-3 font-mono font-medium text-emerald-800">{f.widthInches}" ({f.widthCm} cm)</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{f.widthInches - 1}" to {f.widthInches - 1.5}"</td>
                        <td className="py-3 px-3 text-slate-500">{f.typicalUses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'curtains' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Curtain Fullness & Hem Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-semibold text-slate-800">Fullness Factors Explained</h5>
                  <p className="text-slate-600">
                    Fullness is the ratio of fabric width before gathering to the finished track or rod width.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li><strong>1.5x Fullness:</strong> Minimal gatherings, casual rod pocket, lightweight cottage panels.</li>
                    <li><strong>2.0x Fullness:</strong> Standard tailored look, eyelet/grommet drapery, neat pencil pleats.</li>
                    <li><strong>2.5x Fullness:</strong> Traditional custom decorator standard, pinch pleats, Euro double/triple pleats.</li>
                    <li><strong>3.0x Fullness:</strong> Ultra-sheer voiles and organzas that need heavy rippling to provide privacy.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-semibold text-slate-800">Heading & Hem Standard Allowances</h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li><strong>Header (Heading):</strong> 4" for simple tape or rod pockets; 6" for double-fold pinch pleat headers.</li>
                    <li><strong>Bottom Double Hem:</strong> 8" (folds 4" then 4") provides essential drapery weight and clean fall.</li>
                    <li><strong>Puddling:</strong> Add 2" for a soft brush, 4"–6" for a dramatic puddle on hardwood or stone floors.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {section === 'concrete' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Concrete Ready-Mix Bags vs Volumetric Ratios</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-semibold text-slate-800">80 lb Pre-Mix Bags</h5>
                  <p className="text-slate-600">Yield: ~0.60 cu ft per bag.</p>
                  <p className="text-emerald-800 font-bold font-mono">45 bags = 1 cubic yard (27 ft³)</p>
                  <p className="text-[11px] text-slate-500">Most economical bag size for small slabs and footings.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-semibold text-slate-800">60 lb Pre-Mix Bags</h5>
                  <p className="text-slate-600">Yield: ~0.45 cu ft per bag.</p>
                  <p className="text-emerald-800 font-bold font-mono">60 bags = 1 cubic yard (27 ft³)</p>
                  <p className="text-[11px] text-slate-500">Easier to carry and handle for single DIYers.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h5 className="font-semibold text-slate-800">1:2:4 Volumetric On-Site Mix</h5>
                  <p className="text-slate-600">For 1 cubic yard of 3,000–3,500 PSI concrete:</p>
                  <p className="font-mono text-emerald-800">
                    • 5.5 bags (94 lb) Portland cement<br />
                    • 14 cu ft masonry sand<br />
                    • 21 cu ft #57 gravel stone<br />
                    • ~30 gallons water
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
