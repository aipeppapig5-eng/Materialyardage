import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateFenceProject } from '../../utils/constructionMath';
import { ShoppingCart } from 'lucide-react';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface FencePostCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const FencePostCalc: React.FC<FencePostCalcProps> = ({
  onAddToBOM,
}) => {
  const [linearFeet, setLinearFeet] = useState<number>(120);
  const [postSpacingFt, setPostSpacingFt] = useState<number>(8);
  const [fenceHeightFt, setFenceHeightFt] = useState<number>(6);
  const [railsPerSection, setRailsPerSection] = useState<number>(3);
  const [picketWidthIn, setPicketWidthIn] = useState<number>(5.5);
  const [picketGapIn, setPicketGapIn] = useState<number>(0.125);
  const [holeDiameterIn, setHoleDiameterIn] = useState<number>(10);
  const [holeDepthIn, setHoleDepthIn] = useState<number>(30);
  const [extraPosts, setExtraPosts] = useState<number>(2);
  const [costPer50lbBag, setCostPer50lbBag] = useState<number>(5.75);

  const res = useMemo(() => {
    return calculateFenceProject(
      linearFeet,
      postSpacingFt,
      fenceHeightFt,
      railsPerSection,
      picketWidthIn,
      picketGapIn,
      holeDiameterIn,
      holeDepthIn,
      extraPosts
    );
  }, [
    linearFeet,
    postSpacingFt,
    fenceHeightFt,
    railsPerSection,
    picketWidthIn,
    picketGapIn,
    holeDiameterIn,
    holeDepthIn,
    extraPosts,
  ]);

  const presets = [
    {
      label: '100 ft Backyard Run (8\' Spacing)',
      sublabel: '16 posts · ~39 concrete bags',
      active: linearFeet === 100 && postSpacingFt === 8,
      onClick: () => {
        setLinearFeet(100);
        setPostSpacingFt(8);
        setFenceHeightFt(6);
      },
    },
    {
      label: '160 ft Full Yard Perimeter',
      sublabel: '23 posts · 349 pickets',
      active: linearFeet === 160 && postSpacingFt === 8,
      onClick: () => {
        setLinearFeet(160);
        setPostSpacingFt(8);
        setFenceHeightFt(6);
      },
    },
    {
      label: '80 ft Heavy Duty (6\' Spacing)',
      sublabel: '17 posts · High-wind rating',
      active: linearFeet === 80 && postSpacingFt === 6,
      onClick: () => {
        setLinearFeet(80);
        setPostSpacingFt(6);
        setFenceHeightFt(6);
      },
    },
  ];

  const handleAddToBOM = () => {
    onAddToBOM({
      name: `${fenceHeightFt}' Wood Fence (${linearFeet} lin ft) — Posts & Concrete`,
      category: 'construction',
      calculatorType: 'Fence Post & Concrete Calculator',
      primaryQuantity: res.bags50lbTotal,
      primaryUnit: '50-lb concrete bags',
      secondarySummary: `${res.totalPosts} posts · ${res.totalRails} rails · ${res.totalPickets} pickets`,
      unitPrice: costPer50lbBag,
      notes: `${postSpacingFt}' spacing, ${holeDiameterIn}" Ø × ${holeDepthIn}" post holes.`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Residential Fence Runs"
        presets={presets}
        canonicalPath="/fence-post-calculator"
        currentSummary={`${linearFeet} lin ft = ${res.totalPosts} Posts & ${res.bags50lbTotal} Concrete Bags`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-semibold text-slate-900">
              Fence Run, Framing &amp; Post Hole Footings
            </h2>
            <span className="text-xs text-slate-500">
              Total Bays: <strong className="font-mono text-slate-800">{res.sectionsCount} sections</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Linear Feet</label>
              <input
                type="number"
                min="8"
                step="2"
                value={linearFeet}
                onChange={e => setLinearFeet(Math.max(4, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Post Spacing</label>
              <select
                value={postSpacingFt}
                onChange={e => setPostSpacingFt(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={6}>6 ft Centers</option>
                <option value={8}>8 ft Centers (Std)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Fence Height</label>
              <select
                value={fenceHeightFt}
                onChange={e => setFenceHeightFt(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={4}>4 ft Picket</option>
                <option value={6}>6 ft Privacy (Std)</option>
                <option value={8}>8 ft Tall Privacy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Extra Gate/Corner Posts</label>
              <input
                type="number"
                min="0"
                max="20"
                step="1"
                value={extraPosts}
                onChange={e => setExtraPosts(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Hole Diameter</label>
              <select
                value={holeDiameterIn}
                onChange={e => setHoleDiameterIn(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={8}>8" Hole (Light)</option>
                <option value={10}>10" Hole (Standard)</option>
                <option value={12}>12" Hole (Gate/Heavy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Hole Depth (in)</label>
              <select
                value={holeDepthIn}
                onChange={e => setHoleDepthIn(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={24}>24" (Mild Frost)</option>
                <option value={30}>30" (Standard 6' Fence)</option>
                <option value={36}>36" (Deep Frost Line)</option>
                <option value={42}>42" (Northern Frost)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Rails per Bay</label>
              <select
                value={railsPerSection}
                onChange={e => setRailsPerSection(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={2}>2 Rails (4' Fence)</option>
                <option value={3}>3 Rails (6' Fence)</option>
                <option value={4}>4 Rails (8' Fence)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Picket Width (in)</label>
              <select
                value={picketWidthIn}
                onChange={e => setPicketWidthIn(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={3.5}>3.5" Narrow Dog-Ear</option>
                <option value={5.5}>5.5" Standard 1×6</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Picket Gap (inches)</label>
              <select
                value={picketGapIn}
                onChange={e => setPicketGapIn(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={0}>0" Tight Butted Privacy</option>
                <option value={0.125}>1/8" Standard Shrinkage Gap</option>
                <option value={1}>1" Spaced Picket</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Price / 50-lb Concrete Bag ($)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={costPer50lbBag}
                  onChange={e => setCostPer50lbBag(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ProjectPhotoPreview
            calculatorId="concrete_calc"
            title="Post Hole & Hardware Summary"
            metricsOverlay={{
              primaryValue: `${res.totalPosts} Posts`,
              primaryLabel: `${res.bags50lbTotal} × 50lb Bags`,
              secondaryValue: `${res.totalPickets} Pickets`,
              secondaryLabel: `${res.totalRails} Rails`,
            }}
          >
            <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">50-lb Fast-Set Bags / Post:</span>
                <strong className="font-mono text-slate-900">~{res.bags50lbPerPost} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total 50-lb Bags (incl. 8%):</span>
                <strong className="font-mono text-emerald-800">{res.bags50lbTotal} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Or Total 80-lb Mix Bags:</span>
                <strong className="font-mono text-slate-900">{res.bags80lbTotal} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">4" Hole Drainage Gravel:</span>
                <strong className="font-mono text-slate-900">{res.totalGravelCuFt.toFixed(1)} cu ft</strong>
              </div>
            </div>
          </ProjectPhotoPreview>

          <button
            type="button"
            onClick={handleAddToBOM}
            className="w-full py-2.5 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add Fence Posts &amp; Concrete to BOM</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Total Fence Posts</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1 tabular-nums">
            {res.totalPosts} posts
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5">
            {res.sectionsCount} bays @ {postSpacingFt}' + {extraPosts} extra
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">50-lb Concrete Bags</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.bags50lbTotal} bags
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Or {res.bags80lbTotal} × 80-lb bags</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Framing Rails &amp; Pickets</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.totalPickets} pickets
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{res.totalRails} horizontal 2×4 rails</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Post Concrete Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            ${(res.bags50lbTotal * costPer50lbBag).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">@ ${costPer50lbBag}/50-lb bag</p>
        </div>
      </div>
    </div>
  );
};
