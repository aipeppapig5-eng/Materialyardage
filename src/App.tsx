import React, { useState, useEffect } from 'react';
import { MeasurementSystem, CategoryMode, BOMItem } from './types';
import { Header } from './components/Header';
import { FabricYardageCalc } from './components/calculators/FabricYardageCalc';
import { CurtainDraperyCalc } from './components/calculators/CurtainDraperyCalc';
import { QuiltBackingCalc } from './components/calculators/QuiltBackingCalc';
import { UpholsteryCalc } from './components/calculators/UpholsteryCalc';
import { MulchSoilCalc } from './components/calculators/MulchSoilCalc';
import { GravelAggregateCalc } from './components/calculators/GravelAggregateCalc';
import { ConcreteCalc } from './components/calculators/ConcreteCalc';
import { PaverMasonryCalc } from './components/calculators/PaverMasonryCalc';
import { SodTurfCalc } from './components/calculators/SodTurfCalc';
import { RetainingWallCalc } from './components/calculators/RetainingWallCalc';
import { WallpaperCalc } from './components/calculators/WallpaperCalc';
import { ProjectBOMModal } from './components/ProjectBOMModal';
import { ProjectManagerModal, SavedProject } from './components/ProjectManagerModal';
import { UnitConverterModal } from './components/UnitConverterModal';
import { ReferenceGuidesModal } from './components/ReferenceGuidesModal';
import { Project3DPreviewModal } from './components/Project3DPreviewModal';
import { PrintJobSheetModal } from './components/PrintJobSheetModal';
import { MaterialComparisonModal } from './components/MaterialComparisonModal';
import { CalculatorSkeleton } from './components/CalculatorSkeleton';
import { SEOGuideSection } from './components/SEOGuideSection';
import { RelatedCalculators } from './components/RelatedCalculators';
import { AdSlot } from './components/AdSlot';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { GuidesHubPage } from './components/pages/GuidesHubPage';
import { GuideDetailPage } from './components/pages/GuideDetailPage';
import { GUIDES_DATA } from './data/guidesData';
import { SEO_PAGES } from './data/seoData';
import { CALCULATOR_IMAGES } from './data/uiImages';
import { GSC_INDEXED_ROUTES, resolveGSCPath, GSCIndexedRoute } from './data/gscIndexedRoutes';
import { updateDocumentSEO } from './utils/useSEO';
import {
  Scissors,
  TreePine,
  Search,
  ArrowRightLeft,
  BookOpen,
  FileSpreadsheet,
  ShieldCheck,
  Compass,
  MessageSquare,
  Box,
  Printer,
  Scale,
  FolderKanban,
} from 'lucide-react';

export default function App() {
  const [categoryMode, setCategoryMode] = useState<CategoryMode>('fabric');
  const [activeCalculator, setActiveCalculator] = useState<string>('fabric_cut');
  const [system, setSystem] = useState<MeasurementSystem>('imperial');

  // Modals
  const [isBOMOpen, setIsBOMOpen] = useState<boolean>(false);
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState<boolean>(false);
  const [is3DPreviewOpen, setIs3DPreviewOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [comparisonTargetItem, setComparisonTargetItem] = useState<BOMItem | null>(null);
  const [activeGuideSlug, setActiveGuideSlug] = useState<string | null>(null);
  const [isCalculatorLoading, setIsCalculatorLoading] = useState<boolean>(false);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState<boolean>(false);
  const [activeGSCRoute, setActiveGSCRoute] = useState<GSCIndexedRoute | null>(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Multi-project state with LocalStorage
  const [projects, setProjects] = useState<SavedProject[]>(() => {
    try {
      const savedProjects = localStorage.getItem('materialyardage_projects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Migrate legacy single project if exists
      const legacyBOM = localStorage.getItem('materialyardage_bom');
      const legacyItems: BOMItem[] = legacyBOM ? JSON.parse(legacyBOM) : [];
      return [
        {
          id: 'proj_default',
          name: 'My Material Estimate',
          items: legacyItems,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
    } catch {
      return [
        {
          id: 'proj_default',
          name: 'My Material Estimate',
          items: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
    }
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('materialyardage_active_project_id');
      return savedId || 'proj_default';
    } catch {
      return 'proj_default';
    }
  });

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || {
    id: 'proj_default',
    name: 'My Material Estimate',
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const bomItems = activeProject.items;

  const setBomItems = (newItemsOrUpdater: BOMItem[] | ((prev: BOMItem[]) => BOMItem[])) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === activeProject.id) {
          const updatedItems =
            typeof newItemsOrUpdater === 'function'
              ? newItemsOrUpdater(p.items)
              : newItemsOrUpdater;
          return {
            ...p,
            items: updatedItems,
            updatedAt: Date.now(),
          };
        }
        return p;
      });
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('materialyardage_projects', JSON.stringify(projects));
      localStorage.setItem('materialyardage_active_project_id', activeProjectId);
      localStorage.setItem('materialyardage_bom', JSON.stringify(activeProject.items));
    } catch (e) {
      console.error(e);
    }
  }, [projects, activeProjectId, activeProject]);

  const handleCreateProject = (name: string, templateItems?: Omit<BOMItem, 'id' | 'timestamp'>[]) => {
    const newId = `proj_${Date.now()}`;
    const items: BOMItem[] = templateItems
      ? templateItems.map((it, idx) => ({
          ...it,
          id: `item_${Date.now()}_${idx}`,
          timestamp: Date.now() + idx,
        }))
      : [];
    const newProject: SavedProject = {
      id: newId,
      name,
      items,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newId);
  };

  const handleDuplicateProject = (id: string) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;
    const dupId = `proj_${Date.now()}`;
    const dup: SavedProject = {
      ...target,
      id: dupId,
      name: `${target.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects(prev => [dup, ...prev]);
    setActiveProjectId(dupId);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].id);
    }
  };

  const handleRenameProject = (id: string, newName: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, name: newName, updatedAt: Date.now() } : p))
    );
  };

  const handleImportProjects = (imported: SavedProject[]) => {
    setProjects(imported);
    if (imported.length > 0) {
      setActiveProjectId(imported[0].id);
    }
  };

  // Quick tools list for tabs & search
  const tools = [
    // Fabric
    { id: 'fabric_cut', label: '2D Fabric Cut Planner', category: 'fabric', desc: 'Interactive roll bin-packing with offcut waste diagrams & pattern repeats' },
    { id: 'curtains_drapery', label: 'Curtains & Drapery', category: 'fabric', desc: 'Window drop, fullness 1.5x–2.5x, double hems, headings & pattern matches' },
    { id: 'quilt_backing', label: 'Quilt Backing & Binding', category: 'fabric', desc: 'Backing seam layouts (horizontal vs vertical vs 108" wide) and binding strips' },
    { id: 'upholstery_cushions', label: 'Upholstery & Cushions', category: 'fabric', desc: 'Box cushions, foam thickness, boxing strips & welting/piping cord yards' },
    { id: 'wallpaper_calc', label: 'Wallpaper & Decor', category: 'fabric', desc: 'Single accent wall or 4-room walls, pattern repeat drops, window deductions, and paste' },
    // Construction
    { id: 'mulch_soil', label: 'Mulch & Soil Mix', category: 'construction', desc: 'Cubic yards, retail bags (2/3 cu ft), bed shapes, and depth coverage matrix' },
    { id: 'gravel_aggregate', label: 'Gravel & Aggregates', category: 'construction', desc: 'Crushed stone, pea gravel, road base, US tons, metric tonnes, and truckloads' },
    { id: 'concrete_calc', label: 'Concrete Slabs & Footings', category: 'construction', desc: 'Slabs, Sonotube columns, stairs, 40/60/80lb ready-mix bags, and 1:2:4 mix' },
    { id: 'paver_masonry', label: 'Paver Patios & CMU Walls', category: 'construction', desc: 'Paver counts, bedding sand, polymeric joint sand, and modular brick walls' },
    { id: 'retaining_wall', label: 'Retaining Wall & Drainage', category: 'construction', desc: 'Blocks, buried base courses, capstones, 6" leveling gravel, and 12" drainage rock chimney' },
    { id: 'sod_turf', label: 'Sod & Turf Grass', category: 'construction', desc: 'Lawn square footage, 2\'×5\' sod rolls, whole pallets, and edge cutting waste' },
  ];

  // Clean URL Router sync for direct URL navigation, back/forward buttons, and SEO
  useEffect(() => {
    const handleRouteChange = () => {
      // 1. Check pathname (e.g. /concrete-calculator or /guides/how-to-calculate-cubic-yards)
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
      // 2. Check hash as fallback for legacy links
      const hash = window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');

      const currentRoute = pathname || hash;
      if (!currentRoute || currentRoute === 'index.html') {
        setActiveCalculator('fabric_cut');
        setActiveGuideSlug(null);
        setCategoryMode('fabric');
        setActiveGSCRoute(null);
        return;
      }

      // 1. Check Google Search Console Indexed Pages Registry First
      const gscMatch = resolveGSCPath(currentRoute);
      if (gscMatch) {
        setActiveGSCRoute(gscMatch);
        if (gscMatch.guideSlug) {
          setActiveCalculator('guide_detail');
          setActiveGuideSlug(gscMatch.guideSlug);
        } else {
          setActiveCalculator(gscMatch.targetCalculator);
          setActiveGuideSlug(null);
        }
        if (gscMatch.category === 'fabric' || gscMatch.category === 'construction') {
          setCategoryMode(gscMatch.category);
        }
        if (gscMatch.isModalTrigger === 'converter') {
          setIsConverterOpen(true);
        } else if (gscMatch.isModalTrigger === 'reference') {
          setIsGuidesOpen(true);
        } else if (gscMatch.isModalTrigger === 'comparison') {
          setIsComparisonModalOpen(true);
        }
        return;
      }

      setActiveGSCRoute(null);

      if (currentRoute === 'privacy-policy' || currentRoute === 'privacy') {
        setActiveCalculator('privacy');
        setActiveGuideSlug(null);
      } else if (currentRoute === 'about' || currentRoute === 'about-us') {
        setActiveCalculator('about');
        setActiveGuideSlug(null);
      } else if (currentRoute === 'contact') {
        setActiveCalculator('contact');
        setActiveGuideSlug(null);
      } else if (currentRoute === 'guides' || currentRoute === 'guides-library' || currentRoute === 'reference') {
        setActiveCalculator('guides');
        setActiveGuideSlug(null);
      } else if (currentRoute.startsWith('guides/')) {
        const slug = currentRoute.replace(/^guides\//, '');
        if (GUIDES_DATA[slug]) {
          setActiveCalculator('guide_detail');
          setActiveGuideSlug(slug);
        } else {
          setActiveCalculator('guides');
          setActiveGuideSlug(null);
        }
      } else {
        setActiveGuideSlug(null);
        // Find calculator by slug or id
        const matched = Object.entries(SEO_PAGES).find(
          ([id, seo]) => seo.slug === currentRoute || id === currentRoute
        );
        if (matched) {
          setActiveCalculator(matched[0]);
          const tool = tools.find(t => t.id === matched[0]);
          if (tool) setCategoryMode(tool.category as CategoryMode);
        }
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    const handleOpenPrintModal = () => setIsPrintModalOpen(true);
    const handleOpenCompareModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ item?: BOMItem }>;
      setComparisonTargetItem(customEvent.detail?.item || null);
      setIsComparisonModalOpen(true);
    };
    window.addEventListener('open-job-sheet-modal', handleOpenPrintModal);
    window.addEventListener('open-material-comparison', handleOpenCompareModal);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('open-job-sheet-modal', handleOpenPrintModal);
      window.removeEventListener('open-material-comparison', handleOpenCompareModal);
    };
  }, []);

  // Update document title, meta tags, OpenGraph, and Schema JSON-LD with clean URL
  useEffect(() => {
    let targetPath = '/';
    if (activeGSCRoute) {
      updateDocumentSEO(activeGSCRoute, activeGSCRoute.fullUrl);
      targetPath = activeGSCRoute.path ? `/${activeGSCRoute.path}` : '/';
    } else if (activeCalculator === 'privacy') {
      document.title = 'Privacy Policy — Material Yardage';
      targetPath = '/privacy-policy';
    } else if (activeCalculator === 'about') {
      document.title = 'About Us & Calculation Methodology — Material Yardage';
      targetPath = '/about';
    } else if (activeCalculator === 'contact') {
      document.title = 'Contact Support & Editors — Material Yardage';
      targetPath = '/contact';
    } else if (activeCalculator === 'guides') {
      document.title = 'Material Calculation Guides & Engineering Reference — Material Yardage';
      targetPath = '/guides';
    } else if (activeCalculator === 'guide_detail' && activeGuideSlug && GUIDES_DATA[activeGuideSlug]) {
      const guide = GUIDES_DATA[activeGuideSlug];
      document.title = `${guide.metaTitle} — Material Yardage`;
      targetPath = `/guides/${guide.slug}`;
    } else {
      const currentSeo = SEO_PAGES[activeCalculator];
      if (currentSeo) {
        updateDocumentSEO(currentSeo);
        targetPath = `/${currentSeo.slug}`;
      }
    }

    // Upgrade URL to clean path without '#'
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.replaceState(null, '', targetPath);
    }

    // Background Google Analytics page view tracking (strictly non-visual)
    try {
      const win = window as unknown as { gtag?: (...args: unknown[]) => void };
      if (typeof win.gtag === 'function') {
        win.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: targetPath,
        });
      }
    } catch {
      // Ignore background analytics errors
    }
  }, [activeCalculator, activeGuideSlug]);

  const handleAddToBOM = (item: Omit<BOMItem, 'id' | 'timestamp'>) => {
    const newItem: BOMItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setBomItems(prev => [newItem, ...prev]);
    setIsBOMOpen(true);
  };

  const handleRemoveBOMItem = (id: string) => {
    setBomItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearBOM = () => {
    setBomItems([]);
  };

  const handleUpdateItemPrice = (id: string, price: number) => {
    setBomItems(prev => prev.map(i => i.id === id ? { ...i, unitPrice: price } : i));
  };

  const handleReplaceBOMItem = (id: string, updated: Omit<BOMItem, 'id' | 'timestamp'>) => {
    setBomItems(prev =>
      prev.map(i => (i.id === id ? { ...updated, id, timestamp: i.timestamp } : i))
    );
  };

  const handleOpenComparison = (item?: BOMItem) => {
    setComparisonTargetItem(item || null);
    setIsComparisonModalOpen(true);
  };

  const handleSelectGuide = (slug: string) => {
    setActiveGuideSlug(slug);
    setActiveCalculator('guide_detail');
    const targetPath = `/guides/${slug}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tabId: string) => {
    setActiveGuideSlug(null);
    setIsCalculatorLoading(true);
    setActiveCalculator(tabId);
    let targetPath = '/';
    if (tabId === 'privacy') {
      targetPath = '/privacy-policy';
    } else if (tabId === 'about') {
      targetPath = '/about';
    } else if (tabId === 'contact') {
      targetPath = '/contact';
    } else if (tabId === 'guides') {
      targetPath = '/guides';
    } else {
      const tool = tools.find(t => t.id === tabId);
      if (tool) {
        setCategoryMode(tool.category as CategoryMode);
      }
      const seo = SEO_PAGES[tabId];
      if (seo) {
        targetPath = `/${seo.slug}`;
      }
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Smooth transition timeout to allow clean skeleton rendering
    setTimeout(() => {
      setIsCalculatorLoading(false);
    }, 160);
  };

  const filteredTools = searchQuery.trim()
    ? tools.filter(t =>
        t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tools.filter(t => t.category === categoryMode);

  const activeSeo = SEO_PAGES[activeCalculator];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeCalculator}
        onSelectTab={handleSelectTab}
        bomCount={bomItems.length}
        onOpenBOM={() => setIsBOMOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onOpen3DPreview={() => setIs3DPreviewOpen(true)}
        onOpenPrintSheet={() => setIsPrintModalOpen(true)}
        onOpenComparison={() => handleOpenComparison()}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
        activeProjectName={activeProject.name}
      />

      {/* Render Dedicated Legal / Company Pages */}
      {activeCalculator === 'privacy' && <PrivacyPolicyPage />}
      {activeCalculator === 'about' && <AboutPage />}
      {activeCalculator === 'contact' && <ContactPage />}

      {/* Render Guides Hub & Individual Guide Pages */}
      {activeCalculator === 'guides' && (
        <GuidesHubPage
          onSelectGuide={handleSelectGuide}
          onSelectCalculator={handleSelectTab}
        />
      )}
      {activeCalculator === 'guide_detail' && activeGuideSlug && GUIDES_DATA[activeGuideSlug] && (
        <GuideDetailPage
          guide={GUIDES_DATA[activeGuideSlug]}
          onBackToGuides={() => handleSelectTab('guides')}
          onOpenCalculator={handleSelectTab}
        />
      )}

      {/* Main Calculator Workspace */}
      {activeCalculator !== 'privacy' && activeCalculator !== 'about' && activeCalculator !== 'contact' && activeCalculator !== 'guides' && activeCalculator !== 'guide_detail' && (
        <>
          {/* Hero Section */}
          <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  {CALCULATOR_IMAGES[activeCalculator] && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-semibold">
                        <img
                          src={CALCULATOR_IMAGES[activeCalculator].src}
                          alt=""
                          className="w-4 h-4 rounded-xs object-cover"
                        />
                        <span>{CALCULATOR_IMAGES[activeCalculator].badge}</span>
                      </span>
                    </div>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeSeo?.h1 || 'Material & Fabric Yardage Calculator'}
                  </h1>
                  <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                    {activeSeo?.lead || 'Real-time quantity estimation with interactive 2D cutting diagrams, exact material bulk densities, and integrated multi-zone project billing.'}
                  </p>
                </div>

                {/* Quick Controls: Imperial/Metric & Quick Utility buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Unit Toggle */}
                  <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSystem('imperial')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        system === 'imperial'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Imperial (ft, in, yd)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSystem('metric')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        system === 'metric'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Metric (m, cm)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsConverterOpen(true)}
                    className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Unit Converter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGuidesOpen(true)}
                    className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Reference</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIs3DPreviewOpen(true)}
                    className="px-3 py-2 text-xs font-semibold bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                    title="Interactive 3D project model with layer explosion"
                  >
                    <Box className="w-3.5 h-3.5 text-emerald-700" />
                    <span>3D Schematic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenComparison()}
                    className="px-3 py-2 text-xs font-semibold bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Compare materials: Pine Bark vs. Cedar vs. Topsoil"
                  >
                    <Scale className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Compare Materials</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPrintModalOpen(true)}
                    className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Open print-friendly job-site specification sheet"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Spec Sheet</span>
                  </button>
                </div>
              </div>

              {/* Primary Domain Switcher & Search Bar */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                {/* Domain Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryMode('fabric');
                      handleSelectTab('fabric_cut');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      categoryMode === 'fabric'
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Sewing & Fabric Calculators</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategoryMode('construction');
                      handleSelectTab('mulch_soil');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      categoryMode === 'construction'
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    <TreePine className="w-4 h-4" />
                    <span>Landscaping & Construction</span>
                  </button>
                </div>

                {/* Instant Filter Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search calculators (mulch, slab, curtains...)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Sub-tool Selector Ribbon */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 no-scrollbar">
                {filteredTools.map(tool => {
                  const img = CALCULATOR_IMAGES[tool.id];
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleSelectTab(tool.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                        activeCalculator === tool.id
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {img && (
                        <img
                          src={img.src}
                          alt=""
                          className="w-4 h-4 rounded object-cover border border-slate-300/80 shrink-0"
                          loading="lazy"
                        />
                      )}
                      <span>{tool.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Main Workspace Viewport */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Top Responsive Leaderboard Ad Slot (Google AdSense) */}
            <AdSlot slotId="5928371920" format="auto" label="Sponsored Suppliers & Equipment" />

            {/* Active Calculator Component with Smooth Loading Skeleton */}
            {isCalculatorLoading ? (
              <CalculatorSkeleton />
            ) : (
              <>
                {activeCalculator === 'fabric_cut' && (
                  <FabricYardageCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'curtains_drapery' && (
                  <CurtainDraperyCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'quilt_backing' && (
                  <QuiltBackingCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'upholstery_cushions' && (
                  <UpholsteryCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'wallpaper_calc' && (
                  <WallpaperCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'mulch_soil' && (
                  <MulchSoilCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'gravel_aggregate' && (
                  <GravelAggregateCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'concrete_calc' && (
                  <ConcreteCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'paver_masonry' && (
                  <PaverMasonryCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'retaining_wall' && (
                  <RetainingWallCalc system={system} onAddToBOM={handleAddToBOM} />
                )}

                {activeCalculator === 'sod_turf' && (
                  <SodTurfCalc system={system} onAddToBOM={handleAddToBOM} />
                )}
              </>
            )}

            {/* On-Page SEO Guide, Formulas, Worked Example, and Rich FAQ Accordion */}
            {activeSeo && <SEOGuideSection seo={activeSeo} />}

            {/* Up Next & Related Calculators for Internal Link Equity & SEO Authority */}
            <RelatedCalculators
              currentId={activeCalculator}
              onSelectCalculator={handleSelectTab}
            />
          </main>

          {/* Feature Highlights */}
          <section className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-8 space-y-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Engineered Precision for Homeowners, Crafters & Contractors
                </h2>
                <p className="text-xs text-slate-500">
                  Standard online calculators give flat estimations. Material Yardage accounts for real geometric packing, density variances, and job-site losses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">2D Bolt Cut Optimization</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Rather than basic division, our 2D bin-packing algorithm tests piece rotations, fabric width margins, and vertical repeat alignment to reduce yardage waste and save fabric budget.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <TreePine className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Verified Bulk Densities</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Aggregates and mulches have vast weight disparities. From light pine bark (~0.28 tons/yd³) to dense road base (~1.60 tons/yd³), our calculator prevents delivery truck overloads and supplier shortfalls.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Multi-Zone Project BOM</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Combine flowerbed mulch, patio gravel, sod, and chair cushions into a single unified Bill of Materials. Calculate delivery charges, tax rates, and export clean CSV spreadsheets or printable order lists.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">Material Yardage</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-xs">Professional estimation & cutting layout tools</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <button onClick={() => handleSelectTab('about')} className="hover:text-white transition-colors flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                <span>About Us</span>
              </button>
              <button onClick={() => handleSelectTab('contact')} className="hover:text-white transition-colors flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact</span>
              </button>
              <button onClick={() => handleSelectTab('privacy')} className="hover:text-white transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </button>
              <button onClick={() => handleSelectTab('guides')} className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-emerald-300">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guides Library</span>
              </button>
              <button onClick={() => setIsGuidesOpen(true)} className="hover:text-white transition-colors">
                Density Guide
              </button>
              <button onClick={() => setIsConverterOpen(true)} className="hover:text-white transition-colors">
                Unit Converter
              </button>
              <button onClick={() => setIs3DPreviewOpen(true)} className="hover:text-white transition-colors flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-emerald-400" />
                <span>3D Preview</span>
              </button>
              <button onClick={() => setIsPrintModalOpen(true)} className="hover:text-white transition-colors flex items-center gap-1 text-emerald-400 font-semibold cursor-pointer">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Spec Sheet</span>
              </button>
              <button
                type="button"
                onClick={() => setIsProjectManagerOpen(true)}
                className="hover:text-white transition-colors flex items-center gap-1 text-slate-300"
              >
                <FolderKanban className="w-3.5 h-3.5 text-emerald-400" />
                <span>Projects ({projects.length})</span>
              </button>
              <button onClick={() => setIsBOMOpen(true)} className="hover:text-white transition-colors">
                Project BOM ({bomItems.length})
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <p>
              © 2026 Material Yardage. All rights reserved. Calculations are provided for planning and estimation purposes.
            </p>
            <p className="flex items-center gap-3">
              <span>Google AdSense Compliant</span>
              <span>·</span>
              <span>GDPR / CCPA Protected</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProjectBOMModal
        isOpen={isBOMOpen}
        onClose={() => setIsBOMOpen(false)}
        items={bomItems}
        onRemoveItem={handleRemoveBOMItem}
        onClearAll={handleClearBOM}
        onUpdateItemPrice={handleUpdateItemPrice}
        onReplaceItem={handleReplaceBOMItem}
        onOpen3DPreview={() => setIs3DPreviewOpen(true)}
        onOpenComparisonModal={handleOpenComparison}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
      />

      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={id => setActiveProjectId(id)}
        onCreateProject={handleCreateProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onRenameProject={handleRenameProject}
        onImportProjects={handleImportProjects}
      />

      <MaterialComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        onAddToBOM={handleAddToBOM}
        targetBOMItem={comparisonTargetItem}
        onReplaceBOMItem={handleReplaceBOMItem}
      />

      <UnitConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />

      <ReferenceGuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
      />

      <Project3DPreviewModal
        isOpen={is3DPreviewOpen}
        onClose={() => setIs3DPreviewOpen(false)}
        items={bomItems}
        projectName="Project 3D Material Schematic"
      />

      <PrintJobSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        system={system}
      />
    </div>
  );
}
