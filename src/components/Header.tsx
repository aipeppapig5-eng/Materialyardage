import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRightLeft,
  BookOpen,
  Menu,
  X,
  Box,
  Printer,
  Scale,
  FolderKanban,
  Code2,
} from 'lucide-react';
import { MeasurementSystem } from '../types';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tabId: string, customRoutePath?: string, subType?: string) => void;
  onNavigateHomeSection?: (sectionId: string) => void;
  bomCount: number;
  onOpenBOM: () => void;
  onOpenConverter: () => void;
  onOpenGuides: () => void;
  onOpen3DPreview?: () => void;
  onOpenPrintSheet?: () => void;
  onOpenComparison?: () => void;
  onOpenProjectManager?: () => void;
  onOpenEmbed?: () => void;
  activeProjectName?: string;
  system?: MeasurementSystem;
  onToggleSystem?: (system: MeasurementSystem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onNavigateHomeSection,
  bomCount,
  onOpenBOM,
  onOpenConverter,
  onOpenGuides,
  onOpen3DPreview,
  onOpenPrintSheet,
  onOpenComparison,
  onOpenProjectManager,
  onOpenEmbed,
  activeProjectName = 'My Estimate',
  system,
  onToggleSystem,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const quickCalcs: { id: string; label: string; path: string; subType?: string }[] = [
    { id: 'mulch_soil', label: 'Topsoil', path: 'topsoil-calculator', subType: 'topsoil' },
    { id: 'raised_bed_soil', label: 'Raised Bed Soil', path: 'raised-bed-soil-calculator' },
    { id: 'potting_soil', label: 'Potting Soil', path: 'potting-soil-calculator' },
    { id: 'mulch_soil', label: 'Compost', path: 'compost-calculator', subType: 'compost' },
    { id: 'mulch_soil', label: 'Fill Dirt', path: 'fill-dirt-calculator', subType: 'fill_dirt' },
    { id: 'gravel_aggregate', label: 'Lawn Leveling Sand', path: 'lawn-leveling-sand-calculator', subType: 'lawn_sand' },
    { id: 'gravel_aggregate', label: 'Pea Gravel', path: 'pea-gravel-calculator', subType: 'pea_gravel' },
    { id: 'gravel_aggregate', label: 'Crushed Stone #57', path: 'crushed-stone-calculator', subType: 'crushed_stone' },
    { id: 'gravel_aggregate', label: 'Decomposed Granite', path: 'decomposed-granite-calculator', subType: 'decomposed_granite' },
    { id: 'gravel_aggregate', label: 'River Rock', path: 'river-rock-calculator', subType: 'river_rock' },
    { id: 'paver_masonry', label: 'Paver Base & Sand', path: 'paver-base-calculator', subType: 'paver_base' },
    { id: 'retaining_wall', label: 'Retaining Wall', path: 'retaining-wall-calculator' },
    { id: 'mulch_soil', label: 'Mulch', path: 'mulch-calculator', subType: 'mulch' },
    { id: 'mulch_soil', label: 'Playground Mulch', path: 'playground-mulch-calculator', subType: 'playground' },
    { id: 'pine_straw', label: 'Pine Straw Bales', path: 'pine-straw-calculator' },
    { id: 'sod_turf', label: 'Sod & Turf', path: 'sod-calculator' },
    { id: 'grass_seed', label: 'Grass Seed', path: 'grass-seed-calculator' },
    { id: 'fence_post', label: 'Fence Post & Bags', path: 'fence-post-calculator' },
    { id: 'concrete_calc', label: 'Concrete & Slabs', path: 'concrete-calculator' },
    { id: 'fabric_cut', label: 'Fabric Yardage', path: 'fabric-yardage-calculator' },
    { id: 'curtains_drapery', label: 'Curtains & Drapery', path: 'curtain-fabric-calculator' },
    { id: 'upholstery_cushions', label: 'Upholstery', path: 'upholstery-cushion-calculator' },
    { id: 'quilt_backing', label: 'Quilt Backing', path: 'quilt-backing-binding-calculator' },
    { id: 'wallpaper_calc', label: 'Wallpaper', path: 'wallpaper-calculator' },
  ];

  const handleNavClick = (id: string, path?: string, subType?: string) => {
    onSelectTab(id, path, subType);
    setMobileMenuOpen(false);
  };

  const handleSectionClick = (sectionId: string, fallbackCalc: string) => {
    setMobileMenuOpen(false);
    if (onNavigateHomeSection) {
      onNavigateHomeSection(sectionId);
    } else {
      onSelectTab(fallbackCalc);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home', '');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-emerald-800 transition-colors"
          >
            Material<span className="text-emerald-700 font-extrabold">Yardage</span>
          </a>
        </div>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home', '');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 ${
              activeTab === 'home' ? 'text-emerald-800 font-bold' : 'text-slate-600'
            }`}
          >
            Calculators
          </a>
          <button
            type="button"
            onClick={() => handleSectionClick('landscaping-materials', 'mulch_soil')}
            className="whitespace-nowrap shrink-0 py-1 transition-colors text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Landscaping
          </button>
          <button
            type="button"
            onClick={() => handleSectionClick('construction-materials', 'concrete_calc')}
            className="whitespace-nowrap shrink-0 py-1 transition-colors text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Construction
          </button>
          <button
            type="button"
            onClick={() => handleSectionClick('fabric-sewing', 'fabric_cut')}
            className="whitespace-nowrap shrink-0 py-1 transition-colors text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Fabric &amp; Sewing
          </button>
          <a
            href="/guides"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('guides', 'guides');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 ${
              activeTab === 'guides' || activeTab === 'guide_detail'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-600'
            }`}
          >
            Guides
          </a>
        </nav>

        {/* Zone 3: Unit Preference & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {system && onToggleSystem && (
            <div
              className="hidden sm:flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs shrink-0"
              title="Unit preference saved to browser"
            >
              <button
                type="button"
                onClick={() => onToggleSystem('imperial')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  system === 'imperial'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Imperial Units (ft, in, yd) — Saved to browser"
              >
                US
              </button>
              <button
                type="button"
                onClick={() => onToggleSystem('metric')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  system === 'metric'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Metric Units (m, cm, tonnes) — Saved to browser"
              >
                Metric
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onOpenBOM}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Project BOM</span>
            {bomCount > 0 && (
              <span className="font-mono text-[11px] text-emerald-200 tabular-nums">
                ({bomCount})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-500 text-[11px]">All Calculators</span>
            <button
              type="button"
              onClick={() => handleNavClick('home', '')}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              View Home Directory
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {quickCalcs.map((calc) => (
              <button
                key={`${calc.id}-${calc.path}`}
                type="button"
                onClick={() => handleNavClick(calc.id, calc.path, calc.subType)}
                className={`text-left px-2.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === calc.id
                    ? 'bg-emerald-50 text-emerald-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {calc.label}
              </button>
            ))}
          </div>

          <div className="font-bold text-slate-500 text-[11px] pt-3 border-t border-slate-100">
            Tools &amp; Reference
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('guides', 'guides')}
              className="text-emerald-800 font-bold py-1 flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guides Library</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenConverter();
                setMobileMenuOpen(false);
              }}
              className="text-slate-700 font-medium py-1 flex items-center gap-1 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Unit Converter</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenGuides();
                setMobileMenuOpen(false);
              }}
              className="text-slate-700 font-medium py-1 cursor-pointer"
            >
              Density Chart
            </button>
            {onOpenComparison && (
              <button
                type="button"
                onClick={() => {
                  onOpenComparison();
                  setMobileMenuOpen(false);
                }}
                className="text-slate-700 font-medium py-1 flex items-center gap-1 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            )}
            {onOpen3DPreview && (
              <button
                type="button"
                onClick={() => {
                  onOpen3DPreview();
                  setMobileMenuOpen(false);
                }}
                className="text-slate-700 font-medium py-1 flex items-center gap-1 cursor-pointer"
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Schematic</span>
              </button>
            )}
            {onOpenPrintSheet && (
              <button
                type="button"
                onClick={() => {
                  onOpenPrintSheet();
                  setMobileMenuOpen(false);
                }}
                className="text-slate-700 font-medium py-1 flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sheet</span>
              </button>
            )}
            {onOpenProjectManager && (
              <button
                type="button"
                onClick={() => {
                  onOpenProjectManager();
                  setMobileMenuOpen(false);
                }}
                className="text-slate-700 font-medium py-1 flex items-center gap-1 cursor-pointer"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Projects ({activeProjectName})</span>
              </button>
            )}
            {onOpenEmbed && (
              <button
                type="button"
                onClick={() => {
                  onOpenEmbed();
                  setMobileMenuOpen(false);
                }}
                className="text-slate-700 font-medium py-1 flex items-center gap-1 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Embed Widget</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleNavClick('about', 'about')}
              className="text-slate-700 font-medium py-1 cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('contact', 'contact')}
              className="text-slate-700 font-medium py-1 cursor-pointer"
            >
              Contact
            </button>
          </div>

          {system && onToggleSystem && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Unit Preference:</span>
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => onToggleSystem('imperial')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    system === 'imperial' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  US Imperial
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSystem('metric')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    system === 'metric' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Metric
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
