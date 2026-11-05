import React, { useState } from 'react';
import { PlacedPiece } from '../types';
import { ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';

interface FabricCutVisualizerProps {
  usableWidth: number;
  totalLength: number;
  placedPieces: PlacedPiece[];
  wastePercentage: number;
  verticalRepeat?: number;
  units: 'in' | 'cm';
}

export const FabricCutVisualizer: React.FC<FabricCutVisualizerProps> = ({
  usableWidth,
  totalLength,
  placedPieces,
  wastePercentage,
  verticalRepeat = 0,
  units,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showRepeatGrid, setShowRepeatGrid] = useState<boolean>(true);
  const [hoveredPiece, setHoveredPiece] = useState<PlacedPiece | null>(null);

  // Scaled dimensions for SVG viewbox
  const paddingX = 40;
  const paddingY = 40;
  const boltWidth = Math.max(30, usableWidth);
  const boltLength = Math.max(36, totalLength);

  // Width in SVG units (e.g. 1 unit = 1 inch or 1 cm)
  const svgWidth = boltWidth + paddingX * 2;
  const svgHeight = boltLength + paddingY * 2;

  // Yard / Meter tick marks
  const unitFactor = units === 'in' ? 36 : 100; // 36 inches per yard, 100 cm per meter
  const unitLabel = units === 'in' ? 'yd' : 'm';
  const majorTickCount = Math.floor(boltLength / unitFactor) + 1;
  const ticks = Array.from({ length: majorTickCount }, (_, i) => i * unitFactor);

  // Repeat lines
  const repeats: number[] = [];
  if (verticalRepeat > 0 && showRepeatGrid) {
    const count = Math.floor(boltLength / verticalRepeat) + 1;
    for (let i = 1; i <= count; i++) {
      repeats.push(i * verticalRepeat);
    }
  }

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(2.5, Math.max(0.6, prev + delta)));
  };

  const resetZoom = () => setZoom(1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Canvas Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 bg-slate-50/70 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 text-sm">2D Fabric Bolt Layout</span>
          <span className="text-slate-400">|</span>
          <span className="font-mono tabular-nums text-slate-700">
            {usableWidth}{units} width × {totalLength.toFixed(1)}{units} length
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600">
            Efficiency: <span className="font-semibold text-emerald-700 font-mono tabular-nums">{(100 - wastePercentage).toFixed(1)}%</span> (Waste: <span className="font-mono tabular-nums">{wastePercentage.toFixed(1)}%</span>)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {verticalRepeat > 0 && (
            <button
              onClick={() => setShowRepeatGrid(!showRepeatGrid)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                showRepeatGrid
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-medium'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle pattern repeat grid"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Repeat Grid ({verticalRepeat}{units})</span>
            </button>
          )}

          <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5 shadow-2xs">
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-600 select-none">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => handleZoom(0.2)}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border-l border-slate-200 ml-0.5"
              title="Fit View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Viewport */}
      <div className="relative overflow-auto max-h-[520px] bg-slate-900/5 p-4 flex justify-center">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
          <svg
            width={svgWidth * 3.8}
            height={svgHeight * 3.8}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="drop-shadow-sm select-none"
          >
            <defs>
              {/* Pattern for offcut waste material */}
              <pattern id="wastePattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="2" />
              </pattern>
              {/* Pattern for selvedge edge */}
              <pattern id="selvedgePattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#94a3b8" />
              </pattern>
            </defs>

            {/* Left & Right Selvedge margins */}
            <rect
              x={paddingX - 6}
              y={paddingY}
              width={6}
              height={boltLength}
              fill="url(#selvedgePattern)"
              stroke="#cbd5e1"
              strokeWidth="0.5"
            />
            <rect
              x={paddingX + boltWidth}
              y={paddingY}
              width={6}
              height={boltLength}
              fill="url(#selvedgePattern)"
              stroke="#cbd5e1"
              strokeWidth="0.5"
            />

            {/* Fabric Roll Background (Uncut fabric area) */}
            <rect
              x={paddingX}
              y={paddingY}
              width={boltWidth}
              height={boltLength}
              fill="url(#wastePattern)"
              stroke="#94a3b8"
              strokeWidth="1.2"
              rx="2"
            />

            {/* Length Ruler on Left */}
            <g className="text-[7px] font-mono fill-slate-500 select-none">
              <line
                x1={paddingX - 12}
                y1={paddingY}
                x2={paddingX - 12}
                y2={paddingY + boltLength}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              {ticks.map((tickVal, idx) => (
                <g key={`tick-${idx}`}>
                  <line
                    x1={paddingX - 18}
                    y1={paddingY + tickVal}
                    x2={paddingX - 6}
                    y2={paddingY + tickVal}
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 22}
                    y={paddingY + tickVal + 2.5}
                    textAnchor="end"
                    fontWeight="600"
                    fill="#475569"
                  >
                    {idx} {unitLabel}
                  </text>
                </g>
              ))}
            </g>

            {/* Width Ruler on Top */}
            <g className="text-[7px] font-mono fill-slate-500 select-none">
              <line
                x1={paddingX}
                y1={paddingY - 10}
                x2={paddingX + boltWidth}
                y2={paddingY - 10}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              <line x1={paddingX} y1={paddingY - 14} x2={paddingX} y2={paddingY - 6} stroke="#64748b" strokeWidth="1" />
              <line x1={paddingX + boltWidth} y1={paddingY - 14} x2={paddingX + boltWidth} y2={paddingY - 6} stroke="#64748b" strokeWidth="1" />
              <text x={paddingX + boltWidth / 2} y={paddingY - 14} textAnchor="middle" fontWeight="600" fill="#475569">
                {usableWidth} {units} Usable Width
              </text>
            </g>

            {/* Vertical Pattern Repeat lines */}
            {repeats.map((repeatY, rIdx) => (
              <g key={`rep-${rIdx}`}>
                <line
                  x1={paddingX}
                  y1={paddingY + repeatY}
                  x2={paddingX + boltWidth}
                  y2={paddingY + repeatY}
                  stroke="#f59e0b"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                />
                <text
                  x={paddingX + boltWidth + 8}
                  y={paddingY + repeatY + 2.5}
                  fontSize="6"
                  fontFamily="monospace"
                  fill="#d97706"
                >
                  Repeat {rIdx + 1}
                </text>
              </g>
            ))}

            {/* Placed Pieces */}
            {placedPieces.map((piece) => {
              const isHovered = hoveredPiece?.pieceId === piece.pieceId;
              const px = paddingX + piece.x;
              const py = paddingY + piece.y;

              return (
                <g
                  key={piece.pieceId}
                  onMouseEnter={() => setHoveredPiece(piece)}
                  onMouseLeave={() => setHoveredPiece(null)}
                  className="cursor-pointer transition-all duration-100"
                >
                  <rect
                    x={px}
                    y={py}
                    width={piece.width}
                    height={piece.height}
                    fill={piece.color}
                    fillOpacity={isHovered ? 0.95 : 0.85}
                    stroke={isHovered ? '#0f172a' : '#1e293b'}
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    rx="1"
                  />
                  {/* Internal text info inside piece */}
                  {piece.width >= 10 && piece.height >= 8 && (
                    <g className="select-none pointer-events-none">
                      <text
                        x={px + piece.width / 2}
                        y={py + piece.height / 2 - (piece.height > 14 ? 3 : 0)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.max(4.5, Math.min(8, piece.width / 6))}
                        fontWeight="700"
                        fill="#ffffff"
                      >
                        {piece.label}
                      </text>
                      {piece.height > 14 && (
                        <text
                          x={px + piece.width / 2}
                          y={py + piece.height / 2 + 5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="5.5"
                          fontFamily="monospace"
                          fontWeight="500"
                          fill="rgba(255,255,255,0.9)"
                        >
                          {piece.width}{units} × {piece.height}{units}
                          {piece.rotated ? ' ↻' : ''}
                        </text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Piece Tooltip / Info Bar */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 min-h-[36px]">
        {hoveredPiece ? (
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-xs" style={{ backgroundColor: hoveredPiece.color }} />
            <span className="font-semibold text-slate-900">{hoveredPiece.label}</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono tabular-nums">
              Width: {hoveredPiece.width}{units} | Length: {hoveredPiece.height}{units}
            </span>
            {hoveredPiece.rotated && (
              <span className="text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded text-[10px] font-medium">
                Rotated 90°
              </span>
            )}
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono">
              Position: ({hoveredPiece.x.toFixed(1)}, {hoveredPiece.y.toFixed(1)})
            </span>
          </div>
        ) : (
          <span className="text-slate-500">
            Hover over any cut piece in the diagram to inspect its exact cut dimensions and orientation.
          </span>
        )}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-slate-300 inline-block bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:3px_3px]" />
            <span className="text-slate-500">Offcut Waste</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-3 bg-slate-300 inline-block rounded-xs" />
            <span className="text-slate-500">Selvedge edge</span>
          </span>
        </div>
      </div>
    </div>
  );
};
