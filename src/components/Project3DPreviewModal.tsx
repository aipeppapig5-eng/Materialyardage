import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BOMItem } from '../types';
import {
  createProceduralConcreteTexture,
  createProceduralMulchTexture,
  createProceduralGravelTexture,
  createProceduralPaverTexture,
  createProceduralCuttingMatTexture,
  createProceduralWoodFormTexture,
} from '../utils/threeTextures';
import {
  X,
  Box,
  Layers,
  RotateCw,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info,
  Ruler,
  Crosshair,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface Project3DPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BOMItem[];
  projectName?: string;
}

export interface LayerInspectionData {
  name: string;
  category: string;
  thickness: string;
  spec: string;
  volumeOrArea: string;
  notes: string;
  colorBadge: string;
}

export const Project3DPreviewModal: React.FC<Project3DPreviewModalProps> = ({
  isOpen,
  onClose,
  items,
  projectName = 'Project 3D Schematic Preview',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [explodedPercent, setExplodedPercent] = useState<number>(0);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'front' | 'cross'>('iso');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1); // -1 = all items
  const [showControls, setShowControls] = useState<boolean>(true);
  const [hoveredLayer, setHoveredLayer] = useState<LayerInspectionData | null>(null);

  // References to keep animation loop & Three.js state stable
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const dimensionsGroupRef = useRef<THREE.Group | null>(null);
  const inspectableMeshesRef = useRef<THREE.Mesh[]>([]);
  const currentlyHighlightedMeshRef = useRef<{ mesh: THREE.Mesh; origEmissive: THREE.Color } | null>(null);
  const animFrameRef = useRef<number>(0);

  // Layer objects that respond to exploded view slider
  const explodableLayersRef = useRef<{ obj: THREE.Object3D; baseY: number; explodeFactor: number }[]>([]);

  // Raycaster & Mouse tracking
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseCoordsRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));

  // Initialize Three.js scene
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // slate-900 architectural darkroom
    scene.fog = new THREE.FogExp2(0x0f172a, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(16, 13, 20);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Directional Studio Rig (Key, Fill, Rim)
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    keyLight.position.set(18, 28, 16);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 80;
      keyLight.shadow.camera.left = -22;
      keyLight.shadow.camera.right = 22;
      keyLight.shadow.camera.top = 22;
      keyLight.shadow.camera.bottom = -22;
      keyLight.shadow.bias = -0.0004;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1e293b, 1.0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-18, 16, -18);
    scene.add(rimLight);

    // 6. Ground Shadow Receiver & Grid
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(60, 60, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // 7. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.01; // keep above ground
    controls.minDistance = 4;
    controls.maxDistance = 75;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // 8. Model Assembly & Dimensions
    const rootGroup = new THREE.Group();
    const dimensionsGroup = new THREE.Group();
    scene.add(rootGroup);
    scene.add(dimensionsGroup);
    objectsGroupRef.current = rootGroup;
    dimensionsGroupRef.current = dimensionsGroup;

    explodableLayersRef.current = [];
    inspectableMeshesRef.current = [];

    buildEnhancedSchematics(
      rootGroup,
      dimensionsGroup,
      items,
      selectedItemIndex,
      explodableLayersRef.current,
      inspectableMeshesRef.current
    );

    // 9. Pointer Move Handler for Raycasting Inspection
    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseCoordsRef.current.set(x, y);
    };

    const handlePointerLeave = () => {
      mouseCoordsRef.current.set(-999, -999);
      if (currentlyHighlightedMeshRef.current) {
        const { mesh, origEmissive } = currentlyHighlightedMeshRef.current;
        if (mesh.material && 'emissive' in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).emissive.copy(origEmissive);
        }
        currentlyHighlightedMeshRef.current = null;
      }
      setHoveredLayer(null);
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);

    // 10. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 1.0;
        controlsRef.current.update();
      }

      // Smooth exploded layer interpolation
      const targetSep = (explodedPercent / 100) * 8.5;
      explodableLayersRef.current.forEach(layer => {
        const targetY = layer.baseY + targetSep * layer.explodeFactor;
        layer.obj.position.y = THREE.MathUtils.damp(layer.obj.position.y, targetY, 8.0, delta);
      });

      // Raycasting check for inspectable layers
      if (cameraRef.current && inspectableMeshesRef.current.length > 0) {
        raycasterRef.current.setFromCamera(mouseCoordsRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(inspectableMeshesRef.current, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          const meta = hit.userData?.metadata as LayerInspectionData | undefined;

          if (meta) {
            if (currentlyHighlightedMeshRef.current?.mesh !== hit) {
              // Revert previous mesh
              if (currentlyHighlightedMeshRef.current) {
                const { mesh, origEmissive } = currentlyHighlightedMeshRef.current;
                if (mesh.material && 'emissive' in mesh.material) {
                  (mesh.material as THREE.MeshStandardMaterial).emissive.copy(origEmissive);
                }
              }
              // Highlight new hit
              if (hit.material && 'emissive' in hit.material) {
                const standardMat = hit.material as THREE.MeshStandardMaterial;
                currentlyHighlightedMeshRef.current = {
                  mesh: hit,
                  origEmissive: standardMat.emissive.clone(),
                };
                standardMat.emissive.set(0x0284c7); // neon sky highlight
              }
              setHoveredLayer(meta);
            }
          }
        } else {
          if (currentlyHighlightedMeshRef.current) {
            const { mesh, origEmissive } = currentlyHighlightedMeshRef.current;
            if (mesh.material && 'emissive' in mesh.material) {
              (mesh.material as THREE.MeshStandardMaterial).emissive.copy(origEmissive);
            }
            currentlyHighlightedMeshRef.current = null;
            setHoveredLayer(null);
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();

      // Traverse and dispose all scene geometries and materials
      scene.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [isOpen, selectedItemIndex, autoRotate]);

  // Handle Dimensions visibility toggle
  useEffect(() => {
    if (dimensionsGroupRef.current) {
      dimensionsGroupRef.current.visible = showDimensions;
    }
  }, [showDimensions]);

  // Handle Wireframe mode toggle
  useEffect(() => {
    if (!objectsGroupRef.current) return;
    objectsGroupRef.current.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const setMatWireframe = (mat: THREE.Material) => {
          if ('wireframe' in mat) {
            (mat as THREE.MeshStandardMaterial).wireframe = wireframeMode;
          }
        };
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(setMatWireframe);
        } else if (mesh.material) {
          setMatWireframe(mesh.material);
        }
      }
    });
  }, [wireframeMode]);

  // Handle X-Ray Cross-Section mode toggle
  useEffect(() => {
    if (!objectsGroupRef.current) return;
    objectsGroupRef.current.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const applyXray = (mat: THREE.Material) => {
          if ('transparent' in mat && 'opacity' in mat) {
            const std = mat as THREE.MeshStandardMaterial;
            if (xrayMode) {
              std.transparent = true;
              std.opacity = 0.38;
              std.depthWrite = false;
            } else {
              // Restore solid state
              std.transparent = false;
              std.opacity = 1.0;
              std.depthWrite = true;
            }
          }
        };
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(applyXray);
        } else if (mesh.material) {
          applyXray(mesh.material);
        }
      }
    });
  }, [xrayMode]);

  // Camera presets
  const setCameraPreset = useCallback((view: 'iso' | 'top' | 'front' | 'cross') => {
    setCameraView(view);
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (view === 'iso') {
      cam.position.set(16, 13, 20);
      ctrl.target.set(0, 1.2, 0);
    } else if (view === 'top') {
      cam.position.set(0.01, 32, 0);
      ctrl.target.set(0, 0, 0);
    } else if (view === 'front') {
      cam.position.set(0, 3.5, 26);
      ctrl.target.set(0, 1.2, 0);
    } else if (view === 'cross') {
      cam.position.set(24, 2.5, 0.01);
      ctrl.target.set(0, 1.2, 0);
    }
    ctrl.update();
  }, []);

  const resetCamera = () => {
    setExplodedPercent(0);
    setWireframeMode(false);
    setXrayMode(false);
    setCameraPreset('iso');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-2 sm:p-5 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden text-white relative">
        {/* Top Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 rounded-lg shadow-inner">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{projectName}</h3>
                <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Procedural PBR Schematic
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Architectural layer inspection · Exploded disassembly · 3D measurement callouts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetCamera}
              className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
              title="Reset View & Explode"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset View</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Close 3D Viewport"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D WebGL Canvas Viewport */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950 select-none">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top-Left Item Filter Selector & Raycasting Inspector HUD */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-xs sm:max-w-sm pointer-events-none">
            {/* Model Focus Selector */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl text-xs shadow-xl pointer-events-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Focus Model
              </span>
              <select
                value={selectedItemIndex}
                onChange={e => setSelectedItemIndex(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-medium"
              >
                <option value={-1}>All BOM Items (Combined Site Scene)</option>
                {items.map((it, i) => (
                  <option key={it.id} value={i}>
                    {i + 1}. {it.name.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Layer Inspection Card (Appears dynamically when hovering any layer) */}
            {hoveredLayer && (
              <div className="bg-slate-900/95 backdrop-blur-md border border-sky-500/60 p-3.5 rounded-xl shadow-2xl transition-all duration-200 pointer-events-auto">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20"
                      style={{ backgroundColor: hoveredLayer.colorBadge }}
                    />
                    <span className="text-xs font-bold text-white tracking-wide">
                      {hoveredLayer.name}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60">
                    {hoveredLayer.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-2 font-mono">
                  <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/50">
                    <span className="text-slate-400 block text-[9px] uppercase">Thickness/Depth</span>
                    <span className="font-semibold text-emerald-400">{hoveredLayer.thickness}</span>
                  </div>
                  <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/50">
                    <span className="text-slate-400 block text-[9px] uppercase">Layer Spec</span>
                    <span className="font-semibold text-sky-300">{hoveredLayer.spec}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800/80 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coverage:</span>
                    <span className="font-semibold text-amber-300">{hoveredLayer.volumeOrArea}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-800/70 pt-1 mt-1">
                    {hoveredLayer.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Viewport Floating Info Hint (Top Right) */}
          <div className="absolute top-4 right-4 z-20 hidden md:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 px-3 py-1.5 rounded-lg text-xs text-slate-300 pointer-events-none shadow-lg">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Hover layers to inspect details · Drag to orbit · Scroll to zoom</span>
          </div>

          {/* Collapsible Bottom Control Dock */}
          <div
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-3xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-300 ${
              showControls ? 'translate-y-0 opacity-100' : 'translate-y-[calc(100%-38px)] opacity-90'
            }`}
          >
            {/* Dock Collapse Toggle Tab */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/90">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Schematic Controls & Exploded Disassembly</span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  (PBR Textures + 3D Dimensioning)
                </span>
              </span>
              <button
                type="button"
                onClick={() => setShowControls(!showControls)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
              >
                <span>{showControls ? 'Minimize' : 'Expand Controls'}</span>
                {showControls ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Controls Content */}
            <div className="p-3.5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              {/* 1. Exploded View Slider */}
              <div className="space-y-1.5 md:col-span-1">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Explode View:</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{explodedPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explodedPercent}
                  onChange={e => setExplodedPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Assembled</span>
                  <span>Disassembled</span>
                </div>
              </div>

              {/* 2. Camera Presets */}
              <div className="space-y-1.5 md:col-span-1">
                <span className="font-semibold text-slate-300 block">Camera View:</span>
                <div className="grid grid-cols-2 gap-1 font-medium">
                  <button
                    type="button"
                    onClick={() => setCameraPreset('iso')}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-colors text-[11px] ${
                      cameraView === 'iso'
                        ? 'bg-emerald-800 border-emerald-500 text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Isometric
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraPreset('top')}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-colors text-[11px] ${
                      cameraView === 'top'
                        ? 'bg-emerald-800 border-emerald-500 text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Plan (Top)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraPreset('front')}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-colors text-[11px] ${
                      cameraView === 'front'
                        ? 'bg-emerald-800 border-emerald-500 text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Front Elev.
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraPreset('cross')}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-colors text-[11px] ${
                      cameraView === 'cross'
                        ? 'bg-emerald-800 border-emerald-500 text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Cross-Section
                  </button>
                </div>
              </div>

              {/* 3. Visual Modes: Dimensions & X-Ray */}
              <div className="space-y-1.5 md:col-span-1">
                <span className="font-semibold text-slate-300 block">Inspection Modes:</span>
                <div className="grid grid-cols-2 gap-1 font-medium">
                  <button
                    type="button"
                    onClick={() => setShowDimensions(!showDimensions)}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-colors flex items-center justify-center gap-1 text-[11px] ${
                      showDimensions
                        ? 'bg-sky-900/80 border-sky-500 text-sky-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Dimensions</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setXrayMode(!xrayMode)}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-colors flex items-center justify-center gap-1 text-[11px] ${
                      xrayMode
                        ? 'bg-purple-900/80 border-purple-500 text-purple-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>X-Ray Cut</span>
                  </button>
                </div>
              </div>

              {/* 4. Render Options & Turntable */}
              <div className="space-y-1.5 md:col-span-1">
                <span className="font-semibold text-slate-300 block">Display Rig:</span>
                <div className="grid grid-cols-2 gap-1 font-medium">
                  <button
                    type="button"
                    onClick={() => setWireframeMode(!wireframeMode)}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-colors flex items-center justify-center gap-1 text-[11px] ${
                      wireframeMode
                        ? 'bg-amber-900/80 border-amber-500 text-amber-200'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{wireframeMode ? 'Wire' : 'Solid'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-colors flex items-center justify-center gap-1 text-[11px] ${
                      autoRotate
                        ? 'bg-emerald-800 border-emerald-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>{autoRotate ? 'Spin On' : 'Paused'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Creates an architectural Canvas 2D Text Sprite for floating dimension callouts
 */
function createDimensionBadge(
  title: string,
  value: string,
  accentColor: string = '#38bdf8'
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Background pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.roundRect(4, 4, 312, 88, 14);
    ctx.fill();

    // Border stroke
    ctx.lineWidth = 3;
    ctx.strokeStyle = accentColor;
    ctx.stroke();

    // Title label
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(title.toUpperCase(), 160, 34);

    // Value label
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value, 160, 72);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    depthTest: false,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3.4, 1.02, 1);
  return sprite;
}

/**
 * Adds an architectural dimension line with end ticks
 */
function addDimensionLine(
  group: THREE.Group,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  label: string,
  value: string,
  offset: THREE.Vector3,
  color: number = 0x38bdf8
) {
  const a = p1.clone().add(offset);
  const b = p2.clone().add(offset);

  const points = [a, b];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, linewidth: 2, transparent: true, opacity: 0.85 });
  const line = new THREE.Line(geometry, material);
  group.add(line);

  // End tick 1
  const tickGeo1 = new THREE.BufferGeometry().setFromPoints([
    a.clone().add(new THREE.Vector3(0, -0.25, 0)),
    a.clone().add(new THREE.Vector3(0, 0.25, 0)),
  ]);
  group.add(new THREE.Line(tickGeo1, material));

  // End tick 2
  const tickGeo2 = new THREE.BufferGeometry().setFromPoints([
    b.clone().add(new THREE.Vector3(0, -0.25, 0)),
    b.clone().add(new THREE.Vector3(0, 0.25, 0)),
  ]);
  group.add(new THREE.Line(tickGeo2, material));

  // Centered dimension badge sprite
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y += 0.8;
  const badge = createDimensionBadge(label, value, `#${color.toString(16).padStart(6, '0')}`);
  badge.position.copy(mid);
  group.add(badge);
}

/**
 * Builds the enhanced composite 3D schematic models for BOM items
 */
function buildEnhancedSchematics(
  parent: THREE.Group,
  dimensionsGroup: THREE.Group,
  items: BOMItem[],
  focusIndex: number,
  explodables: { obj: THREE.Object3D; baseY: number; explodeFactor: number }[],
  inspectables: THREE.Mesh[]
) {
  // If BOM is empty, provide a default multi-craft showcase
  const activeItems =
    items.length > 0
      ? focusIndex === -1
        ? items
        : [items[focusIndex]]
      : [
          {
            id: 'demo_concrete',
            name: 'Concrete Patio Slab (12ft × 10ft × 4in)',
            category: 'construction' as const,
            calculatorType: 'Concrete Calculator',
            primaryQuantity: 1.48,
            primaryUnit: 'cu yards',
            secondarySummary: '67 bags (80 lb) on 4" compacted road base with #4 rebar',
            unitPrice: 145,
            timestamp: Date.now(),
          },
          {
            id: 'demo_mulch',
            name: 'Shredded Hardwood Bark Mulch (300 sq ft @ 3" depth)',
            category: 'construction' as const,
            calculatorType: 'Mulch & Soil Calculator',
            primaryQuantity: 2.78,
            primaryUnit: 'cu yards',
            secondarySummary: '38 bags (2 cu ft) · 0.95 tons with cedar edge timbers',
            unitPrice: 38,
            timestamp: Date.now(),
          },
          {
            id: 'demo_paver',
            name: 'Interlocking Brick Paver Patio (10ft × 8ft)',
            category: 'construction' as const,
            calculatorType: 'Paver & Walkway Calculator',
            primaryQuantity: 360,
            primaryUnit: 'paver units',
            secondarySummary: '4" gravel sub-base, 1" setting sand & edge restraint',
            unitPrice: 2.25,
            timestamp: Date.now(),
          },
        ];

  let currentXOffset = 0;
  const spacing = 16;

  activeItems.forEach(item => {
    const itemGroup = new THREE.Group();
    itemGroup.position.x = currentXOffset;

    const lowerName = item.name.toLowerCase();
    const lowerType = item.calculatorType.toLowerCase();

    // ----------------------------------------------------
    // 1. Concrete Slab Construction Assembly
    // ----------------------------------------------------
    if (lowerType.includes('concrete') || lowerName.includes('slab')) {
      const slabL = 12;
      const slabW = 10;
      const slabH = 0.55; // 4" - 6" scaled
      const baseH = 0.45; // 4" sub-base

      // A. Compacted Gravel Sub-Base
      const gravelMat = new THREE.MeshStandardMaterial({
        map: createProceduralGravelTexture(),
        roughness: 0.9,
        metalness: 0.05,
      });
      const gravelMesh = new THREE.Mesh(new THREE.BoxGeometry(slabL + 0.8, baseH, slabW + 0.8), gravelMat);
      gravelMesh.position.y = baseH / 2;
      gravelMesh.receiveShadow = true;
      gravelMesh.userData = {
        metadata: {
          name: 'Compacted Gravel Sub-Base',
          category: 'Civil / Structural',
          thickness: '4.0 in (100 mm)',
          spec: 'Crushed #57 Stone / Road Base',
          volumeOrArea: `${((slabL * slabW * 4) / (12 * 27)).toFixed(2)} cu yd`,
          notes: 'Vibratory plate compacted to 95% Standard Proctor density to prevent slab settlement cracking.',
          colorBadge: '#64748b',
        },
      };
      itemGroup.add(gravelMesh);
      inspectables.push(gravelMesh);

      // B. Wood Formwork Perimeter (2x6 Timber Forms with 45 deg kickers)
      const woodMat = new THREE.MeshStandardMaterial({
        map: createProceduralWoodFormTexture(),
        roughness: 0.75,
      });
      const formT = 0.2;
      const formH = slabH + 0.1;

      // North & South Form Boards
      const formNSGeo = new THREE.BoxGeometry(slabL + 0.4, formH, formT);
      const formNorth = new THREE.Mesh(formNSGeo, woodMat);
      formNorth.position.set(0, baseH + formH / 2 - 0.05, slabW / 2 + formT / 2);
      itemGroup.add(formNorth);

      const formSouth = new THREE.Mesh(formNSGeo, woodMat);
      formSouth.position.set(0, baseH + formH / 2 - 0.05, -slabW / 2 - formT / 2);
      itemGroup.add(formSouth);

      // East & West Form Boards
      const formEWGeo = new THREE.BoxGeometry(formT, formH, slabW);
      const formEast = new THREE.Mesh(formEWGeo, woodMat);
      formEast.position.set(slabL / 2 + formT / 2, baseH + formH / 2 - 0.05, 0);
      itemGroup.add(formEast);

      const formWest = new THREE.Mesh(formEWGeo, woodMat);
      formWest.position.set(-slabL / 2 - formT / 2, baseH + formH / 2 - 0.05, 0);
      itemGroup.add(formWest);

      // Exterior 2x4 Wooden Support Stakes driven into ground
      for (let sx = -slabL / 2 + 1; sx <= slabL / 2 - 1; sx += 3) {
        const stakeGeo = new THREE.BoxGeometry(0.18, 1.2, 0.18);
        const stakeN = new THREE.Mesh(stakeGeo, woodMat);
        stakeN.position.set(sx, 0.5, slabW / 2 + 0.25);
        itemGroup.add(stakeN);

        const stakeS = new THREE.Mesh(stakeGeo, woodMat);
        stakeS.position.set(sx, 0.5, -slabW / 2 - 0.25);
        itemGroup.add(stakeS);
      }

      // C. Poured Concrete Slab (Explodable)
      const concreteMat = new THREE.MeshStandardMaterial({
        map: createProceduralConcreteTexture(),
        roughness: 0.6,
        metalness: 0.05,
      });
      const concreteMesh = new THREE.Mesh(new THREE.BoxGeometry(slabL, slabH, slabW), concreteMat);
      concreteMesh.position.y = baseH + slabH / 2;
      concreteMesh.castShadow = true;
      concreteMesh.receiveShadow = true;
      concreteMesh.userData = {
        metadata: {
          name: 'Poured Concrete Patio Slab',
          category: 'Structural Slab',
          thickness: '4.0 in (Continuous Pour)',
          spec: '4,000 PSI Air-Entrained Mix',
          volumeOrArea: `${item.primaryQuantity || 1.48} cu yd`,
          notes: 'Finished with broom slip-resistant texture and tooled expansion joint at center span.',
          colorBadge: '#cbd5e1',
        },
      };
      itemGroup.add(concreteMesh);
      inspectables.push(concreteMesh);
      explodables.push({ obj: concreteMesh, baseY: concreteMesh.position.y, explodeFactor: 1.0 });

      // D. Steel #4 Rebar Grid on 2" Elevation Chairs
      const rebarMat = new THREE.MeshStandardMaterial({
        color: 0xd97706, // oxidized steel rebar
        roughness: 0.4,
        metalness: 0.85,
      });

      const rebarGroup = new THREE.Group();
      // Longitudinal Bars
      for (let rx = -slabL / 2 + 0.8; rx <= slabL / 2 - 0.8; rx += 2.0) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, slabW - 0.8, 8), rebarMat);
        bar.rotation.x = Math.PI / 2;
        bar.position.set(rx, 0, 0);
        rebarGroup.add(bar);
      }
      // Transverse Bars
      for (let rz = -slabW / 2 + 0.8; rz <= slabW / 2 - 0.8; rz += 2.0) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, slabL - 0.8, 8), rebarMat);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(0, 0.04, rz);
        rebarGroup.add(bar);
      }
      concreteMesh.add(rebarGroup);

      // Dimension Callouts
      addDimensionLine(
        dimensionsGroup,
        new THREE.Vector3(-slabL / 2 + currentXOffset, baseH + slabH, slabW / 2 + 0.8),
        new THREE.Vector3(slabL / 2 + currentXOffset, baseH + slabH, slabW / 2 + 0.8),
        'Length Span',
        '12 ft - 0 in',
        new THREE.Vector3(0, 0, 0),
        0x38bdf8
      );
      addDimensionLine(
        dimensionsGroup,
        new THREE.Vector3(slabL / 2 + 0.8 + currentXOffset, baseH + slabH, -slabW / 2),
        new THREE.Vector3(slabL / 2 + 0.8 + currentXOffset, baseH + slabH, slabW / 2),
        'Width Span',
        '10 ft - 0 in',
        new THREE.Vector3(0, 0, 0),
        0x38bdf8
      );
    }
    // ----------------------------------------------------
    // 2. Mulch & Topsoil Garden Bed Assembly
    // ----------------------------------------------------
    else if (lowerType.includes('mulch') || lowerName.includes('mulch') || lowerName.includes('soil')) {
      const bedL = 11;
      const bedW = 8.5;
      const soilDepth = 0.55;
      const mulchDepth = 0.45;

      // A. Compacted Loam Sub-Soil Layer
      const soilMat = new THREE.MeshStandardMaterial({
        color: 0x271911,
        roughness: 0.95,
      });
      const soilMesh = new THREE.Mesh(new THREE.BoxGeometry(bedL, soilDepth, bedW), soilMat);
      soilMesh.position.y = soilDepth / 2;
      soilMesh.receiveShadow = true;
      soilMesh.userData = {
        metadata: {
          name: 'Screened Loam Planting Bed Soil',
          category: 'Agronomic Grade',
          thickness: '6.0 in Base Depth',
          spec: '60/40 Loam & Organic Compost',
          volumeOrArea: `${((bedL * bedW * 6) / (12 * 27)).toFixed(2)} cu yd`,
          notes: 'Rich organic rooting medium prepared with high moisture retention and aeration capacity.',
          colorBadge: '#3f2e21',
        },
      };
      itemGroup.add(soilMesh);
      inspectables.push(soilMesh);

      // B. Landscape Filter Fabric Mesh Barrier
      const fabricMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8,
      });
      const fabricMesh = new THREE.Mesh(new THREE.BoxGeometry(bedL - 0.1, 0.03, bedW - 0.1), fabricMat);
      fabricMesh.position.y = soilDepth + 0.02;
      itemGroup.add(fabricMesh);

      // C. Shredded Hardwood Bark Mulch Layer (Explodable)
      const mulchMat = new THREE.MeshStandardMaterial({
        map: createProceduralMulchTexture(),
        roughness: 0.92,
      });
      const mulchMesh = new THREE.Mesh(new THREE.BoxGeometry(bedL - 0.25, mulchDepth, bedW - 0.25), mulchMat);
      mulchMesh.position.y = soilDepth + mulchDepth / 2;
      mulchMesh.castShadow = true;
      mulchMesh.receiveShadow = true;
      mulchMesh.userData = {
        metadata: {
          name: 'Double-Shredded Hardwood Bark Mulch',
          category: 'Landscape Surface',
          thickness: '3.0 in Top Dressing',
          spec: 'Dark Organic Forest Bark',
          volumeOrArea: `${item.primaryQuantity || 2.78} cu yd`,
          notes: 'Thermal insulation barrier for root zones, moisture preservation, and natural weed suppression.',
          colorBadge: '#78350f',
        },
      };
      itemGroup.add(mulchMesh);
      inspectables.push(mulchMesh);
      explodables.push({ obj: mulchMesh, baseY: mulchMesh.position.y, explodeFactor: 1.15 });

      // D. Heavy Timber Retaining Edging with Ground Spikes
      const timberMat = new THREE.MeshStandardMaterial({
        map: createProceduralWoodFormTexture(),
        roughness: 0.8,
      });
      const totalH = soilDepth + mulchDepth;

      // Timber Edging around borders
      const tL1 = new THREE.Mesh(new THREE.BoxGeometry(bedL + 0.7, totalH, 0.4), timberMat);
      tL1.position.set(0, totalH / 2, bedW / 2 + 0.2);
      itemGroup.add(tL1);

      const tL2 = new THREE.Mesh(new THREE.BoxGeometry(bedL + 0.7, totalH, 0.4), timberMat);
      tL2.position.set(0, totalH / 2, -bedW / 2 - 0.2);
      itemGroup.add(tL2);

      const tW1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, totalH, bedW), timberMat);
      tW1.position.set(bedL / 2 + 0.2, totalH / 2, 0);
      itemGroup.add(tW1);

      const tW2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, totalH, bedW), timberMat);
      tW2.position.set(-bedL / 2 - 0.2, totalH / 2, 0);
      itemGroup.add(tW2);

      // Low-poly Decorative Landscaping Shrubs
      const bushMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      [[-3, -2], [2.5, 1.8], [0, 0]].forEach(([bx, bz]) => {
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65), bushMat);
        bush.position.set(bx, 0.4, bz);
        mulchMesh.add(bush);
      });

      // Dimension Callouts
      addDimensionLine(
        dimensionsGroup,
        new THREE.Vector3(-bedL / 2 + currentXOffset, totalH, bedW / 2 + 0.8),
        new THREE.Vector3(bedL / 2 + currentXOffset, totalH, bedW / 2 + 0.8),
        'Bed Length',
        '11 ft - 0 in',
        new THREE.Vector3(0, 0, 0),
        0x10b981
      );
    }
    // ----------------------------------------------------
    // 3. Interlocking Pavers & Walkway Patio Assembly
    // ----------------------------------------------------
    else if (lowerType.includes('paver') || lowerName.includes('paver')) {
      const pL = 11;
      const pW = 8.5;
      const baseH = 0.45; // 4" gravel
      const sandH = 0.18; // 1" screeded sand
      const paverH = 0.32; // 2-3/8" pavers

      // A. Compacted Gravel Base
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(pL + 0.6, baseH, pW + 0.6),
        new THREE.MeshStandardMaterial({
          map: createProceduralGravelTexture(),
          roughness: 0.92,
        })
      );
      baseMesh.position.y = baseH / 2;
      baseMesh.receiveShadow = true;
      baseMesh.userData = {
        metadata: {
          name: 'Crushed Rock Base Course',
          category: 'Interlocking Sub-Base',
          thickness: '4.0 in Dense Graded Base',
          spec: 'ASTM D2940 Crushed Aggregate',
          volumeOrArea: `${((pL * pW * 4) / (12 * 27)).toFixed(2)} cu yd`,
          notes: 'Compacted with mechanical tamper in 2-inch lifts to establish load-bearing rigidity.',
          colorBadge: '#64748b',
        },
      };
      itemGroup.add(baseMesh);
      inspectables.push(baseMesh);

      // B. Screeded Bedding Sand Layer (Explodable)
      const sandMesh = new THREE.Mesh(
        new THREE.BoxGeometry(pL + 0.3, sandH, pW + 0.3),
        new THREE.MeshStandardMaterial({
          color: 0xd97706,
          roughness: 0.95,
        })
      );
      sandMesh.position.y = baseH + sandH / 2;
      sandMesh.userData = {
        metadata: {
          name: 'Screeded Setting Bed Sand',
          category: 'Levelling Bed',
          thickness: '1.0 in (Screeded Uncompacted)',
          spec: 'ASTM C33 Washed Concrete Sand',
          volumeOrArea: `${((pL * pW * 1) / (12 * 27)).toFixed(2)} cu yd`,
          notes: 'Uncompacted sharp coarse sand screeded across pipes to receive paver layout before compaction.',
          colorBadge: '#d97706',
        },
      };
      itemGroup.add(sandMesh);
      inspectables.push(sandMesh);
      explodables.push({ obj: sandMesh, baseY: sandMesh.position.y, explodeFactor: 0.5 });

      // C. Interlocking Paver Brick Field (Explodable)
      const paverMat = new THREE.MeshStandardMaterial({
        map: createProceduralPaverTexture(),
        roughness: 0.68,
      });
      const paverField = new THREE.Mesh(new THREE.BoxGeometry(pL, paverH, pW), paverMat);
      paverField.position.y = baseH + sandH + paverH / 2;
      paverField.castShadow = true;
      paverField.receiveShadow = true;
      paverField.userData = {
        metadata: {
          name: 'Architectural Brick Paver Field',
          category: 'Hardscape Surface',
          thickness: '2-3/8 in (60 mm)',
          spec: '8,500 PSI High-Density Concrete Pavers',
          volumeOrArea: `${(pL * pW).toFixed(0)} sq ft (${item.primaryQuantity || 360} units)`,
          notes: 'Interlocking running-bond layout with polymeric jointing sand vibrated into bevel grooves.',
          colorBadge: '#ea580c',
        },
      };
      itemGroup.add(paverField);
      inspectables.push(paverField);
      explodables.push({ obj: paverField, baseY: paverField.position.y, explodeFactor: 1.25 });

      // D. Heavy PVC Edge Restraint along boundary with spikes
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      const edgeN = new THREE.Mesh(new THREE.BoxGeometry(pL + 0.4, paverH, 0.2), edgeMat);
      edgeN.position.set(0, baseH + sandH + paverH / 2, pW / 2 + 0.1);
      itemGroup.add(edgeN);

      const edgeS = new THREE.Mesh(new THREE.BoxGeometry(pL + 0.4, paverH, 0.2), edgeMat);
      edgeS.position.set(0, baseH + sandH + paverH / 2, -pW / 2 - 0.1);
      itemGroup.add(edgeS);

      // Dimension Callouts
      addDimensionLine(
        dimensionsGroup,
        new THREE.Vector3(-pL / 2 + currentXOffset, baseH + sandH + paverH, pW / 2 + 0.8),
        new THREE.Vector3(pL / 2 + currentXOffset, baseH + sandH + paverH, pW / 2 + 0.8),
        'Paver Length',
        '11 ft - 0 in',
        new THREE.Vector3(0, 0, 0),
        0xf97316
      );
    }
    // ----------------------------------------------------
    // 4. Fabric Cutting Studio & Textile Bolt Assembly
    // ----------------------------------------------------
    else if (lowerType.includes('fabric') || lowerType.includes('quilt') || lowerName.includes('fabric')) {
      const tableW = 7.5;
      const tableL = 11;
      const tableH = 2.4;

      // A. Studio Work Table Frame & Birch Top
      const tableTopMat = new THREE.MeshStandardMaterial({
        map: createProceduralWoodFormTexture(),
        roughness: 0.6,
      });
      const tableTop = new THREE.Mesh(new THREE.BoxGeometry(tableL, 0.25, tableW), tableTopMat);
      tableTop.position.y = tableH;
      itemGroup.add(tableTop);

      // Heavy Powder-Coated Steel Frame Legs
      const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });
      [
        [-tableL / 2 + 0.5, -tableW / 2 + 0.5],
        [tableL / 2 - 0.5, -tableW / 2 + 0.5],
        [-tableL / 2 + 0.5, tableW / 2 - 0.5],
        [tableL / 2 - 0.5, tableW / 2 - 0.5],
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, tableH, 12), steelMat);
        leg.position.set(lx, tableH / 2, lz);
        itemGroup.add(leg);
      });

      // B. Professional Green Self-Healing Cutting Mat
      const matMat = new THREE.MeshStandardMaterial({
        map: createProceduralCuttingMatTexture(),
        roughness: 0.5,
      });
      const cuttingMat = new THREE.Mesh(new THREE.BoxGeometry(tableL - 1.2, 0.04, tableW - 1.2), matMat);
      cuttingMat.position.set(0.4, tableH + 0.14, 0);
      cuttingMat.userData = {
        metadata: {
          name: 'Self-Healing Studio Cutting Mat',
          category: 'Textile Workstation',
          thickness: '3 mm Double-Sided Mat',
          spec: '1" Imperial Grid with 45° Angle Bias',
          volumeOrArea: `${((tableL - 1.2) * (tableW - 1.2)).toFixed(0)} sq ft workspace`,
          notes: 'Precision non-slip surface calibrated for rotary blade cutting and pattern layout.',
          colorBadge: '#059669',
        },
      };
      itemGroup.add(cuttingMat);
      inspectables.push(cuttingMat);

      // C. Heavy Textile Roll Bolt on Side Rack
      const boltMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.75 });
      const boltCoreMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });

      const boltRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 5.8, 24), boltMat);
      boltRoll.rotation.x = Math.PI / 2;
      boltRoll.position.set(-tableL / 2 + 1.2, tableH + 0.75, 0);
      boltRoll.userData = {
        metadata: {
          name: 'Bolt Roll of Fabric Yardage',
          category: 'Textile Material',
          thickness: '54 in Bolt Width',
          spec: 'Heavyweight Canvas / Upholstery Weave',
          volumeOrArea: `${item.primaryQuantity || 3.5} linear yards`,
          notes: 'Continuous textile roll staged for precision yardage measurement and pattern bias cuts.',
          colorBadge: '#0284c7',
        },
      };
      itemGroup.add(boltRoll);
      inspectables.push(boltRoll);

      const boltCore = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6.2, 16), boltCoreMat);
      boltCore.rotation.x = Math.PI / 2;
      boltCore.position.set(-tableL / 2 + 1.2, tableH + 0.75, 0);
      itemGroup.add(boltCore);

      // D. Unrolled Fabric Sheet (Explodable)
      const fabricSheetMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.8,
        metalness: 0.05,
      });
      const fabricSheet = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.03, 5.2), fabricSheetMat);
      fabricSheet.position.set(0.6, tableH + 0.2, 0);
      fabricSheet.castShadow = true;
      fabricSheet.userData = {
        metadata: {
          name: 'Cut Pattern Yardage Panel',
          category: 'Pattern Piece',
          thickness: 'Standard 12 oz Duck Cloth',
          spec: 'Pre-Washed & Steamed Fabric',
          volumeOrArea: `${item.primaryQuantity || 3.5} Linear Yards`,
          notes: 'Grainline aligned with cutting mat grid to prevent diagonal bias stretching.',
          colorBadge: '#38bdf8',
        },
      };
      itemGroup.add(fabricSheet);
      inspectables.push(fabricSheet);
      explodables.push({ obj: fabricSheet, baseY: fabricSheet.position.y, explodeFactor: 0.9 });

      // E. Clear Acrylic Ruler & Rotary Cutter
      const acrylicMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.85,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.49,
      });
      const ruler = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.02, 0.8), acrylicMat);
      ruler.position.set(1.5, tableH + 0.24, 0.8);
      itemGroup.add(ruler);

      // Dimension Callouts
      addDimensionLine(
        dimensionsGroup,
        new THREE.Vector3(-2.8 + currentXOffset, tableH + 0.6, 2.8),
        new THREE.Vector3(4.0 + currentXOffset, tableH + 0.6, 2.8),
        'Cutting Length',
        '6.8 ft (~2.3 yds)',
        new THREE.Vector3(0, 0, 0),
        0x38bdf8
      );
    }
    // ----------------------------------------------------
    // 5. Upholstery Cushion & Foam Core Assembly
    // ----------------------------------------------------
    else if (lowerType.includes('upholstery') || lowerName.includes('cushion')) {
      const cL = 6.5;
      const cW = 6.5;
      const foamH = 1.4;

      const cushionGroup = new THREE.Group();
      cushionGroup.position.y = 1.0;

      // A. Bottom Plate Fabric Layer
      const botMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.75 });
      const bottomPlate = new THREE.Mesh(new THREE.BoxGeometry(cL, 0.15, cW), botMat);
      bottomPlate.position.y = 0.08;
      bottomPlate.userData = {
        metadata: {
          name: 'Bottom Fabric Panel & Breathable Mesh',
          category: 'Cushion Underlay',
          thickness: '0.12 in Upholstery Weave',
          spec: 'High-Tensile Fabric with Vent Grommets',
          volumeOrArea: `${(cL * cW).toFixed(1)} sq ft cut piece`,
          notes: 'Reinforced with surge-stitched edge seams and integrated hidden zipper flap.',
          colorBadge: '#1e3a8a',
        },
      };
      cushionGroup.add(bottomPlate);
      inspectables.push(bottomPlate);

      // B. High-Resilience Polyurethane Foam Core (Explodable)
      const foamMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.9,
      });
      const foamCore = new THREE.Mesh(new THREE.BoxGeometry(cL - 0.3, foamH, cW - 0.3), foamMat);
      foamCore.position.y = 0.15 + foamH / 2;
      foamCore.castShadow = true;
      foamCore.userData = {
        metadata: {
          name: 'High-Resilience HR Foam Core',
          category: 'Cushion Core',
          thickness: '5.0 in Molded Slab',
          spec: '2.8 lb Density · 35 ILD Firmness',
          volumeOrArea: '1 Cushion Core Block',
          notes: 'Commercial seating grade polyurethane with dual Dacron wrap crown for plush resilience.',
          colorBadge: '#fef08a',
        },
      };
      cushionGroup.add(foamCore);
      inspectables.push(foamCore);
      explodables.push({ obj: foamCore, baseY: foamCore.position.y, explodeFactor: 0.6 });

      // C. Top Plate Fabric & Piping Cord (Explodable)
      const topMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.7 });
      const topPlate = new THREE.Mesh(new THREE.BoxGeometry(cL, 0.18, cW), topMat);
      topPlate.position.y = 0.15 + foamH + 0.1;
      topPlate.castShadow = true;
      topPlate.userData = {
        metadata: {
          name: 'Top Fabric Boxing with Welted Piping',
          category: 'Cushion Face',
          thickness: '0.15 in Tailored Cover',
          spec: 'Water-Repellent Olefin Fabric',
          volumeOrArea: `${(cL * cW).toFixed(1)} sq ft face`,
          notes: 'Perimeter wrapped with matching 5/32" bias-cut piping welting cord.',
          colorBadge: '#2563eb',
        },
      };
      cushionGroup.add(topPlate);
      inspectables.push(topPlate);
      explodables.push({ obj: topPlate, baseY: topPlate.position.y, explodeFactor: 1.35 });

      // Welting Cord Perimeter
      const weltMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
      const weltN = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, cL, 8), weltMat);
      weltN.rotation.z = Math.PI / 2;
      weltN.position.set(0, 0.1, cW / 2);
      topPlate.add(weltN);

      itemGroup.add(cushionGroup);

      // Dimension Callouts
      addDimensionLine(
        dimensionsGroup,
        new THREE.Vector3(-cL / 2 + currentXOffset, 1.0 + foamH + 0.4, cW / 2 + 0.6),
        new THREE.Vector3(cL / 2 + currentXOffset, 1.0 + foamH + 0.4, cW / 2 + 0.6),
        'Cushion Width',
        '24 in × 24 in',
        new THREE.Vector3(0, 0, 0),
        0x3b82f6
      );
    }
    // ----------------------------------------------------
    // 6. Generic / Construction Block Fallback
    // ----------------------------------------------------
    else {
      const gL = 8;
      const gW = 6;
      const gH = 1.0;

      const subMesh = new THREE.Mesh(
        new THREE.BoxGeometry(gL, 0.4, gW),
        new THREE.MeshStandardMaterial({
          map: createProceduralGravelTexture(),
          roughness: 0.9,
        })
      );
      subMesh.position.y = 0.2;
      itemGroup.add(subMesh);
      inspectables.push(subMesh);

      const mainMesh = new THREE.Mesh(
        new THREE.BoxGeometry(gL, gH, gW),
        new THREE.MeshStandardMaterial({
          map: createProceduralConcreteTexture(),
          roughness: 0.6,
        })
      );
      mainMesh.position.y = 0.4 + gH / 2;
      mainMesh.castShadow = true;
      mainMesh.userData = {
        metadata: {
          name: item.name,
          category: item.category === 'fabric' ? 'Textile Yardage' : 'Construction Material',
          thickness: 'Custom Depth Specification',
          spec: item.secondarySummary || 'Architectural Material Layer',
          volumeOrArea: `${item.primaryQuantity} ${item.primaryUnit}`,
          notes: 'Standard site preparation and installation requirements apply as per project BOM.',
          colorBadge: '#059669',
        },
      };
      itemGroup.add(mainMesh);
      inspectables.push(mainMesh);
      explodables.push({ obj: mainMesh, baseY: mainMesh.position.y, explodeFactor: 1.0 });

      addDimensionLine(
        dimensionsGroup,
        new THREE.Vector3(-gL / 2 + currentXOffset, 0.4 + gH, gW / 2 + 0.6),
        new THREE.Vector3(gL / 2 + currentXOffset, 0.4 + gH, gW / 2 + 0.6),
        'Span Dimension',
        `${gL} ft`,
        new THREE.Vector3(0, 0, 0),
        0x10b981
      );
    }

    parent.add(itemGroup);
    currentXOffset += spacing;
  });

  // Center the scene along the X-axis
  const totalSpan = (activeItems.length - 1) * spacing;
  parent.position.x = -totalSpan / 2;
  dimensionsGroup.position.x = -totalSpan / 2;
}
