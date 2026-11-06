import React, { useState } from 'react';
import { ShoppingBag, ArrowRightLeft, BookOpen, Menu, X, Box } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  bomCount: number;
  onOpenBOM: () => void;
  onOpenConverter: () => void;
  onOpenGuides: () => void;
  onOpen3DPreview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  bomCount,
  onOpenBOM,
  onOpenConverter,
  onOpenGuides,
  onOpen3DPreview,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'fabric_cut', label: 'Fabric Cut Planner' },
    { id: 'curtains_drapery', label: 'Curtains & Quilts' },
    { id: 'mulch_soil', label: 'Mulch & Soil' },
    { id: 'gravel_aggregate', label: 'Gravel & Stone' },
    { id: 'concrete_calc', label: 'Concrete & Slabs' },
    { id: 'paver_masonry', label: 'Pavers & Walls' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleNavClick('fabric_cut'); }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-emerald-700 transition-colors"
          >
            Material<span className="text-emerald-700 font-extrabold">Yardage</span>
          </a>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 ${
                activeTab === link.id
                  ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                  : 'text-slate-600'
              }`}
            >
              {link.label}
            </button>
          ))}
          <span className="text-slate-300">|</span>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 ${
              activeTab === 'about' ? 'text-emerald-800 font-bold' : 'text-slate-600'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-slate-900 ${
              activeTab === 'contact' ? 'text-emerald-800 font-bold' : 'text-slate-600'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => handleNavClick('guides')}
            className={`flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'guides' || activeTab === 'guide_detail'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Guides Library</span>
          </button>
          <button
            onClick={onOpenConverter}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Converter</span>
          </button>
          <button
            onClick={onOpenGuides}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reference</span>
          </button>
          {onOpen3DPreview && (
            <button
              onClick={onOpen3DPreview}
              className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold whitespace-nowrap shrink-0"
              title="Open 3D Schematic & Exploded Layer View"
            >
              <Box className="w-3.5 h-3.5 text-emerald-700" />
              <span>3D Preview</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpen3DPreview && (
            <button
              onClick={onOpen3DPreview}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shadow-2xs"
              title="View 3D project schematic model"
            >
              <Box className="w-3.5 h-3.5 text-emerald-700" />
              <span>3D Model</span>
            </button>
          )}
          <button
            onClick={onOpenBOM}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Project BOM</span>
            {bomCount > 0 && (
              <span className="bg-emerald-600 text-white font-mono text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {bomCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 text-xs">
          <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Calculators</div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left p-2 rounded-lg font-medium ${
                  activeTab === link.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] pt-2 border-t border-slate-100">
            Company & Resources
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => handleNavClick('about')} className="text-slate-700 font-medium py-1">
              About Us
            </button>
            <button onClick={() => handleNavClick('contact')} className="text-slate-700 font-medium py-1">
              Contact
            </button>
            <button onClick={() => handleNavClick('privacy')} className="text-slate-700 font-medium py-1">
              Privacy Policy
            </button>
            <button onClick={() => handleNavClick('guides')} className="text-emerald-800 font-bold py-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guides Library</span>
            </button>
            <button onClick={() => { onOpenConverter(); setMobileMenuOpen(false); }} className="text-slate-700 font-medium py-1">
              Unit Converter
            </button>
            <button onClick={() => { onOpenGuides(); setMobileMenuOpen(false); }} className="text-slate-700 font-medium py-1">
              Reference
            </button>
            {onOpen3DPreview && (
              <button
                onClick={() => { onOpen3DPreview(); setMobileMenuOpen(false); }}
                className="text-emerald-800 font-bold py-1 flex items-center gap-1.5"
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Preview</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
