import React, { useState } from 'react';
import { GUIDES_DATA, GuideArticle } from '../../data/guidesData';
import {
  BookOpen,
  ArrowRight,
  Calculator,
  Search,
  TreePine,
  Scissors,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

interface GuidesHubPageProps {
  onSelectGuide: (slug: string) => void;
  onSelectCalculator: (calculatorId: string) => void;
}

export const GuidesHubPage: React.FC<GuidesHubPageProps> = ({
  onSelectGuide,
  onSelectCalculator,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'construction' | 'fabric'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const guidesList = Object.values(GUIDES_DATA);

  const filteredGuides = guidesList.filter(guide => {
    const matchesCategory = filterCategory === 'all' || guide.category === filterCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Engineering Guides & Educational Library</span>
        </div>
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Material Yardage Guides & Calculation Reference
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            In-depth engineering reference formulas, bulk material density charts, fabric bolt specifications, and step-by-step contractor measuring walkthroughs.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Guides ({guidesList.length})
            </button>
            <button
              onClick={() => setFilterCategory('construction')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterCategory === 'construction'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>Construction & Landscaping</span>
            </button>
            <button
              onClick={() => setFilterCategory('fabric')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterCategory === 'fabric'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Sewing & Decor</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search guides (cubic yards, bags, curtains...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map(guide => (
          <article
            key={guide.id}
            className="group bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800">
                  {guide.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{guide.readTime}</span>
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  <a
                    href={`/guides/${guide.slug}`}
                    onClick={e => {
                      e.preventDefault();
                      onSelectGuide(guide.slug);
                    }}
                  >
                    {guide.title}
                  </a>
                </h2>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              {/* Key Bullet Highlights */}
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 space-y-1 border border-slate-100">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Key Formula:</span>
                </div>
                <p className="truncate text-slate-500 font-mono text-[10px]">
                  {guide.keyTakeaways[0]}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onSelectCalculator(guide.calculatorId)}
                className="text-[11px] font-semibold text-slate-500 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <Calculator className="w-3 h-3 text-emerald-600" />
                <span>Open Tool</span>
              </button>

              <a
                href={`/guides/${guide.slug}`}
                onClick={e => {
                  e.preventDefault();
                  onSelectGuide(guide.slug);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-1 transition-all"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
