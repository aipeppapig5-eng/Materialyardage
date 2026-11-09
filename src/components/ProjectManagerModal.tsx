import React, { useState } from 'react';
import { BOMItem } from '../types';
import {
  FolderKanban,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Check,
  X,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Calendar,
  Layers,
} from 'lucide-react';

export interface SavedProject {
  id: string;
  name: string;
  items: BOMItem[];
  createdAt: number;
  updatedAt: number;
  description?: string;
}

export const STARTER_TEMPLATES: {
  title: string;
  desc: string;
  badge: string;
  items: Omit<BOMItem, 'id' | 'timestamp'>[];
}[] = [
  {
    title: 'Backyard Outdoor Oasis & Patio',
    desc: '300 sq ft interlocking paver patio, 3 cu yds shredded hardwood bark mulch, and 25 ft segmental retaining wall with drainage stone.',
    badge: 'Hardscape & Landscape',
    items: [
      {
        name: 'Holland Stone 4"×8" Architectural Pavers',
        category: 'construction',
        calculatorType: 'Paver & Masonry Calculator',
        primaryQuantity: 1485,
        primaryUnit: 'pavers',
        secondarySummary: '300 sq ft patio with 10% cutting waste & 1" screeded sand',
        unitPrice: 0.85,
      },
      {
        name: 'Triple-Shredded Hardwood Bark Mulch',
        category: 'construction',
        calculatorType: 'Mulch & Soil Calculator',
        primaryQuantity: 3.0,
        primaryUnit: 'cu yards',
        secondarySummary: 'covers 324 sq ft @ 3" depth (approx 40 bags)',
        unitPrice: 38.0,
      },
      {
        name: '12"×4"×8" Retaining Wall Blocks',
        category: 'construction',
        calculatorType: 'Retaining Wall Calculator',
        primaryQuantity: 275,
        primaryUnit: 'blocks',
        secondarySummary: '25 ft linear wall @ 3.0 ft exposed height + 1 buried base course',
        unitPrice: 2.85,
      },
      {
        name: 'Clean Drainage Stone (#57 Washed Rock)',
        category: 'construction',
        calculatorType: 'Retaining Wall Calculator',
        primaryQuantity: 4.2,
        primaryUnit: 'tons',
        secondarySummary: '12" chimney drainage backfill behind wall face',
        unitPrice: 46.0,
      },
    ],
  },
  {
    title: 'Designer Living Room Makeover',
    desc: '4 floor-to-ceiling tailored pinch-pleat linen curtain widths, 6 custom box cushions with welted piping, and 4 rolls of botanical wallpaper.',
    badge: 'Interior Textiles & Decor',
    items: [
      {
        name: 'Tailored Linen Drapery Panels (Pair of 84" Drop)',
        category: 'fabric',
        calculatorType: 'Curtain & Drapery Calculator',
        primaryQuantity: 11.0,
        primaryUnit: 'yards',
        secondarySummary: '54" wide decorator linen with 2.0x fullness, 4" double hem',
        unitPrice: 34.0,
      },
      {
        name: 'Custom Box Cushions with Welted Piping Cord',
        category: 'fabric',
        calculatorType: 'Upholstery & Cushions Calculator',
        primaryQuantity: 8.5,
        primaryUnit: 'yards',
        secondarySummary: '6 dining seat cushions (22"×20"×3") with matching boxing and welt',
        unitPrice: 42.0,
      },
      {
        name: 'Designer Botanical Wallpaper (US Double Roll)',
        category: 'fabric',
        calculatorType: 'Wallpaper Calculator',
        primaryQuantity: 4,
        primaryUnit: 'rolls',
        secondarySummary: '14ft × 9ft accent wall (straight match @ 21" repeat) + 1 safety roll',
        unitPrice: 48.0,
      },
    ],
  },
  {
    title: 'Garage Slab & Foundation Base',
    desc: '450 sq ft 5" concrete slab pour, 6.5 tons #57 crushed stone road base, and #4 rebar elevation grid.',
    badge: 'Heavy Construction',
    items: [
      {
        name: 'Ready-Mix 4,000 PSI Air-Entrained Concrete',
        category: 'construction',
        calculatorType: 'Concrete Calculator',
        primaryQuantity: 7.2,
        primaryUnit: 'cu yards',
        secondarySummary: '450 sq ft slab @ 5" depth with 10% subgrade buffer',
        unitPrice: 155.0,
      },
      {
        name: '#57 Crushed Stone Road Base Course',
        category: 'construction',
        calculatorType: 'Gravel & Aggregates Calculator',
        primaryQuantity: 6.8,
        primaryUnit: 'tons',
        secondarySummary: '4" compacted stone leveling base beneath slab',
        unitPrice: 38.0,
      },
      {
        name: 'Grade 60 #4 Steel Rebar (1/2" × 20ft)',
        category: 'construction',
        calculatorType: 'Concrete Calculator',
        primaryQuantity: 28,
        primaryUnit: 'bars',
        secondarySummary: '18" on-center grid elevated on 2" chairs',
        unitPrice: 11.5,
      },
    ],
  },
];

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SavedProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, templateItems?: Omit<BOMItem, 'id' | 'timestamp'>[]) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onImportProjects: (imported: SavedProject[]) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
  onImportProjects,
}) => {
  const [activeTab, setActiveTab] = useState<'my_projects' | 'templates'>('my_projects');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateProject(newProjectName.trim());
    setNewProjectName('');
    setFeedbackMsg('New project created!');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleLoadTemplate = (t: (typeof STARTER_TEMPLATES)[0]) => {
    onCreateProject(t.title, t.items);
    setActiveTab('my_projects');
    setFeedbackMsg(`Loaded "${t.title}" template with ${t.items.length} items!`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `materialyardage_projects_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportProjects(parsed);
          setFeedbackMsg(`Successfully imported ${parsed.length} projects!`);
          setTimeout(() => setFeedbackMsg(null), 3000);
        }
      } catch (err) {
        alert('Invalid JSON project backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Project Manager & Multi-Estimate Workspaces
              </h3>
              <p className="text-xs text-slate-500">
                Switch active projects, load pre-configured starter kits, or backup your estimates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center justify-between bg-white text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('my_projects')}
              className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'my_projects'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>My Saved Projects ({projects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Starter Templates (3 Kits)</span>
            </button>
          </div>

          {/* Export / Import Controls */}
          <div className="flex items-center gap-2 py-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              title="Download JSON backup"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Backup</span>
            </button>
            <label className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3 h-3" />
              <span className="hidden sm:inline">Restore</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'my_projects' ? (
            <div className="space-y-6">
              {/* Create New Project Inline Form */}
              <form onSubmit={handleCreate} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter new project name (e.g. Backyard Renovation, Living Room Drapes)..."
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </button>
              </form>

              {/* Projects List */}
              <div className="space-y-3">
                {projects.map(p => {
                  const isActive = p.id === activeProjectId;
                  const totalEst = p.items.reduce(
                    (sum, it) => sum + it.primaryQuantity * it.unitPrice,
                    0
                  );

                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {editingProjectId === p.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="px-2 py-0.5 border border-slate-300 rounded text-xs font-bold text-slate-900"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (editName.trim()) {
                                    onRenameProject(p.id, editName.trim());
                                  }
                                  setEditingProjectId(null);
                                }}
                                className="p-1 bg-emerald-600 text-white rounded text-xs"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => {
                                setEditingProjectId(p.id);
                                setEditName(p.name);
                              }}
                              className="font-bold text-slate-900 text-sm hover:underline cursor-pointer"
                              title="Click to rename"
                            >
                              {p.name}
                            </span>
                          )}

                          {isActive && (
                            <span className="text-[10px] font-mono font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                              Active Workspace
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span>{p.items.length} BOM Items</span>
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-slate-700">
                            Est: ${totalEst.toFixed(2)}
                          </span>
                          <span>·</span>
                          <span className="text-slate-400">
                            {new Date(p.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {!isActive ? (
                          <button
                            type="button"
                            onClick={() => onSelectProject(p.id)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-bold px-2 py-1 bg-emerald-100 rounded-lg">
                            Currently Open
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => onDuplicateProject(p.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Duplicate Project"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete project "${p.name}"?`)) {
                                onDeleteProject(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Starter Templates */
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Instantly launch an estimate workspace pre-filled with industry standard materials, real quantities, and professional installation specs:
              </p>

              <div className="grid grid-cols-1 gap-4">
                {STARTER_TEMPLATES.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 transition-all flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {t.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{t.desc}</p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {t.items.map((it, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700"
                          >
                            {it.name.slice(0, 32)}...
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleLoadTemplate(t)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Load This Template</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>All project data auto-saved in your local browser storage</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
