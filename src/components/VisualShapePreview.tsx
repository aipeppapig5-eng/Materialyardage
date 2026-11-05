import React from 'react';
import { BedShape } from '../types';

interface VisualShapePreviewProps {
  shape: BedShape;
  dim1: number; // length / diameter / base
  dim2?: number; // width / inner diameter / height
  depthInches: number;
  materialName?: string;
  units?: 'imperial' | 'metric';
}

export const VisualShapePreview: React.FC<VisualShapePreviewProps> = ({
  shape,
  dim1,
  dim2 = 0,
  depthInches,
  materialName = 'Material',
  units = 'imperial',
}) => {
  const lengthUnit = units === 'imperial' ? 'ft' : 'm';
  const depthUnit = units === 'imperial' ? 'in' : 'cm';

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2">
        <span className="font-semibold text-slate-700">Bed Geometry & Depth Preview</span>
        <span className="font-mono tabular-nums bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
          Target Depth: {depthInches} {depthUnit}
        </span>
      </div>

      <div className="w-full h-44 flex items-center justify-center relative bg-white border border-slate-200/80 rounded-lg p-2 overflow-hidden shadow-2xs">
        {shape === 'rectangle' && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="relative border-2 border-emerald-600 bg-emerald-50/70 rounded-md flex flex-col items-center justify-center shadow-xs transition-all w-3/4 h-24">
              <span className="text-xs font-semibold text-emerald-900">{materialName}</span>
              <span className="text-[11px] font-mono text-emerald-700">
                {dim1} {lengthUnit} × {dim2} {lengthUnit}
              </span>
              {/* Length indicator */}
              <div className="absolute -top-5 w-full flex items-center justify-center text-[10px] font-mono text-slate-600 font-medium">
                ← {dim1} {lengthUnit} →
              </div>
              {/* Width indicator */}
              <div className="absolute -right-12 h-full flex items-center justify-center text-[10px] font-mono text-slate-600 font-medium rotate-90">
                ← {dim2} {lengthUnit} →
              </div>
            </div>
          </div>
        )}

        {shape === 'circle' && (
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-emerald-600 bg-emerald-50/70 flex flex-col items-center justify-center shadow-xs">
              <span className="text-xs font-semibold text-emerald-900">{materialName}</span>
              <span className="text-[11px] font-mono text-emerald-700">Ø {dim1} {lengthUnit}</span>
            </div>
            <div className="absolute -bottom-5 text-[10px] font-mono text-slate-600 font-medium">
              Diameter: {dim1} {lengthUnit}
            </div>
          </div>
        )}

        {shape === 'ring' && (
          <div className="relative flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-2 border-emerald-600 bg-emerald-50/70 flex items-center justify-center shadow-xs">
              <div className="w-16 h-16 rounded-full border border-slate-300 bg-white flex flex-col items-center justify-center text-center p-1">
                <span className="text-[9px] text-slate-500 font-semibold leading-tight">Inner Circle</span>
                <span className="text-[9px] font-mono text-slate-600">{dim2} {lengthUnit}</span>
              </div>
            </div>
            <div className="absolute -bottom-5 text-[10px] font-mono text-slate-600 font-medium">
              Outer Ø: {dim1} {lengthUnit} · Inner Ø: {dim2} {lengthUnit}
            </div>
          </div>
        )}

        {shape === 'triangle' && (
          <div className="relative flex flex-col items-center justify-center">
            <svg width="150" height="110" viewBox="0 0 150 110" className="overflow-visible">
              <polygon
                points="75,10 140,95 10,95"
                fill="#ecfdf5"
                stroke="#059669"
                strokeWidth="2"
              />
              <text x="75" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill="#065f46">
                {materialName}
              </text>
              <text x="75" y="75" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#047857">
                {dim1} {lengthUnit} base
              </text>
            </svg>
            <div className="text-[10px] font-mono text-slate-600 font-medium mt-1">
              Base: {dim1} {lengthUnit} · Height: {dim2} {lengthUnit}
            </div>
          </div>
        )}

        {shape === 'direct_area' && (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="w-36 h-24 border-2 border-dashed border-emerald-500 bg-emerald-50/50 rounded-lg flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-emerald-900">Custom Measured Area</span>
              <span className="text-sm font-mono font-bold text-emerald-700 mt-1">
                {dim1} {units === 'imperial' ? 'sq ft' : 'm²'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between text-[11px] text-slate-500 mt-2">
        <span>Cross-section: <strong className="text-slate-700">{depthInches} {depthUnit}</strong> compacted layer</span>
        <span className="text-emerald-700 font-medium">Top-down perspective</span>
      </div>
    </div>
  );
};
