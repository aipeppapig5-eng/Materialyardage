import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BOMItem } from '../types';
import {
  X,
  Box,
  Layers,
  RotateCw,
  Maximize2,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Camera,
  Info,
} from 'lucide-react';

interface Project3DPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BOMItem[];
  projectName?: string;
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
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'front'>('iso');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1); // -1 = all items
  const [showControls, setShowControls] = useState<boolean>(true);

  // References to keep animation loop & Three.js state stable
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);

  // Layer objects that respond to exploded view slider
  const explodableLayersRef = useRef<{ obj: THREE.Object3D; baseY: number; explodeFactor: number }[]>([]);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    // 1. Detect software WebGL as per Three.js directives
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

    // 2. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9); // slate-100
    scene.fog = new THREE.Fog(0xf1f5f9, 45, 120);
    sceneRef.current = scene;

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(18, 14, 22);
    cameraRef.current = camera;

    // 4. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 5. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Lighting Rig (Key, Fill, Ground Hemisphere)
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.8); // warm key light
    keyLight.position.set(15, 25, 15);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 80;
      keyLight.shadow.camera.left = -20;
      keyLight.shadow.camera.right = 20;
      keyLight.shadow.camera.top = 20;
      keyLight.shadow.camera.bottom = -20;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.9); // sky/ground contrast
    scene.add(hemiLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-15, 12, -15);
    scene.add(fillLight);

    // 7. Ground Plane Grid & Shadow Receiver
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(50, 50, 0x94a3b8, 0xcbd5e1);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 8. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // prevent going below ground
    controls.minDistance = 5;
    controls.maxDistance = 80;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // 9. Build 3D Schematic Models based on BOM items
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    objectsGroupRef.current = rootGroup;
    explodableLayersRef.current = [];

    buildProjectSchematic(rootGroup, items, selectedItemIndex, explodableLayersRef.current);

    // 10. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.update();
      }

      // Smoothly interpolate exploded layer positions
      const targetSep = (explodedPercent / 100) * 8.0;
      explodableLayersRef.current.forEach(layer => {
        const targetY = layer.baseY + targetSep * layer.explodeFactor;
        layer.obj.position.y = THREE.MathUtils.damp(layer.obj.position.y, targetY, 8.0, delta);
      });

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
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
    };
  }, [isOpen, selectedItemIndex]);

  // Update Wireframe mode on all materials
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

  // Camera presets
  const setCameraPreset = (view: 'iso' | 'top' | 'front') => {
    setCameraView(view);
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (view === 'iso') {
      cam.position.set(18, 14, 22);
      ctrl.target.set(0, 1.5, 0);
    } else if (view === 'top') {
      cam.position.set(0.01, 32, 0);
      ctrl.target.set(0, 0, 0);
    } else if (view === 'front') {
      cam.position.set(0, 4, 26);
      ctrl.target.set(0, 1.5, 0);
    }
    ctrl.update();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden text-white relative">
        {/* Top Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 rounded-lg">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{projectName}</h3>
                <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60">
                  Interactive 3D Schematic
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Layered architectural & textile preview with exploded view disassembly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

          {/* Top-Left Item Filter Selector */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 p-2.5 rounded-xl text-xs max-w-xs shadow-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Focus Model
            </span>
            <select
              value={selectedItemIndex}
              onChange={e => setSelectedItemIndex(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-medium"
            >
              <option value={-1}>All BOM Items (Combined Site Scene)</option>
              {items.map((it, i) => (
                <option key={it.id} value={i}>
                  {i + 1}. {it.name.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>

          {/* Viewport Floating Info Callout (Top Right) */}
          <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs text-slate-300 pointer-events-none">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Click & drag to rotate · Scroll to zoom · Right-click to pan</span>
          </div>

          {/* Collapsible Bottom Control Dock (Three.js Directive: zero viewport occlusion) */}
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-300 ${
              showControls ? 'translate-y-0 opacity-100' : 'translate-y-[calc(100%-36px)] opacity-90'
            }`}
          >
            {/* Dock Collapse Toggle Tab */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>3D Viewport Controls & Exploded Disassembly</span>
              </span>
              <button
                type="button"
                onClick={() => setShowControls(!showControls)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium px-2 py-0.5 rounded hover:bg-slate-800"
              >
                <span>{showControls ? 'Minimize' : 'Expand Controls'}</span>
                {showControls ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Controls Content */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Exploded View Slider */}
              <div className="space-y-1.5 md:col-span-1">
                <div className="flex justify-between font-semibold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exploded Layers:</span>
                  </span>
                  <span className="font-mono text-emerald-400">{explodedPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explodedPercent}
                  onChange={e => setExplodedPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <div className="text-[10px] text-slate-400">
                  Separates sub-base, sand, and surface layers
                </div>
              </div>

              {/* Camera Presets */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-300 block">Camera Perspective:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCameraPreset('iso')}
                    className={`flex-1 py-1.5 rounded-lg border text-center transition-colors font-medium ${
                      cameraView === 'iso'
                        ? 'bg-emerald-800 border-emerald-600 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Isometric
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraPreset('top')}
                    className={`flex-1 py-1.5 rounded-lg border text-center transition-colors font-medium ${
                      cameraView === 'top'
                        ? 'bg-emerald-800 border-emerald-600 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Top
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraPreset('front')}
                    className={`flex-1 py-1.5 rounded-lg border text-center transition-colors font-medium ${
                      cameraView === 'front'
                        ? 'bg-emerald-800 border-emerald-600 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Front
                  </button>
                </div>
              </div>

              {/* Render Modes & Auto-Rotate */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-300 block">Render Options:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWireframeMode(!wireframeMode)}
                    className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-colors flex items-center justify-center gap-1 font-medium ${
                      wireframeMode
                        ? 'bg-amber-900/80 border-amber-600 text-amber-200'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{wireframeMode ? 'Wireframe' : 'Solid PBR'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-colors flex items-center justify-center gap-1 font-medium ${
                      autoRotate
                        ? 'bg-emerald-800 border-emerald-600 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
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
 * Builds the composite 3D schematic models for BOM items
 */
function buildProjectSchematic(
  parent: THREE.Group,
  items: BOMItem[],
  focusIndex: number,
  explodables: { obj: THREE.Object3D; baseY: number; explodeFactor: number }[]
) {
  // If BOM is empty, provide a default comprehensive showcase
  const activeItems = items.length > 0
    ? (focusIndex === -1 ? items : [items[focusIndex]])
    : [
        {
          id: 'demo_slab',
          name: 'Concrete Patio Slab (20ft × 10ft × 4in)',
          category: 'construction' as const,
          calculatorType: 'Concrete Calculator',
          primaryQuantity: 2.7,
          primaryUnit: 'cu yards',
          secondarySummary: '123 bags (80 lb) on 4" compacted road base',
          unitPrice: 145,
          timestamp: Date.now(),
        },
        {
          id: 'demo_mulch',
          name: 'Shredded Hardwood Bark Mulch (300 sq ft @ 3" depth)',
          category: 'construction' as const,
          calculatorType: 'Mulch & Soil Calculator',
          primaryQuantity: 3.0,
          primaryUnit: 'cu yards',
          secondarySummary: '40 bags (2 cu ft) · 1.02 tons',
          unitPrice: 38,
          timestamp: Date.now(),
        },
      ];

  let currentXOffset = 0;
  const spacing = 14;

  activeItems.forEach((item, itemIdx) => {
    const itemGroup = new THREE.Group();
    itemGroup.position.x = currentXOffset;

    const lowerName = item.name.toLowerCase();
    const lowerType = item.calculatorType.toLowerCase();

    // 1. Concrete Slab with sub-base
    if (lowerType.includes('concrete') || lowerName.includes('slab')) {
      const slabW = 10;
      const slabL = 12;
      const slabThickness = 0.5; // ~4-6 inches scaled
      const baseThickness = 0.4;

      // Layer 1: Compacted Gravel Sub-base
      const gravelMat = new THREE.MeshStandardMaterial({
        color: 0x64748b, // slate-500
        roughness: 0.9,
        metalness: 0.1,
      });
      const gravelGeo = new THREE.BoxGeometry(slabL + 0.6, baseThickness, slabW + 0.6);
      const gravelMesh = new THREE.Mesh(gravelGeo, gravelMat);
      gravelMesh.position.y = baseThickness / 2;
      gravelMesh.receiveShadow = true;
      itemGroup.add(gravelMesh);

      // Layer 2: Concrete Poured Slab (Explodable)
      const concreteMat = new THREE.MeshStandardMaterial({
        color: 0xd1d5db, // light concrete gray
        roughness: 0.7,
        metalness: 0.05,
      });
      const concreteGeo = new THREE.BoxGeometry(slabL, slabThickness, slabW);
      const concreteMesh = new THREE.Mesh(concreteGeo, concreteMat);
      concreteMesh.position.y = baseThickness + slabThickness / 2;
      concreteMesh.castShadow = true;
      concreteMesh.receiveShadow = true;
      itemGroup.add(concreteMesh);

      explodables.push({ obj: concreteMesh, baseY: concreteMesh.position.y, explodeFactor: 1.0 });

      // Rebar wireframe grid inside slab
      const rebarMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4, metalness: 0.8 });
      for (let rx = -slabL / 2 + 1; rx < slabL / 2; rx += 2) {
        const barGeo = new THREE.CylinderGeometry(0.04, 0.04, slabW - 0.4, 8);
        const bar = new THREE.Mesh(barGeo, rebarMat);
        bar.rotation.x = Math.PI / 2;
        bar.position.set(rx, 0, 0);
        concreteMesh.add(bar);
      }
    }
    // 2. Mulch / Soil Garden Bed
    else if (lowerType.includes('mulch') || lowerName.includes('mulch') || lowerName.includes('soil')) {
      const bedW = 8;
      const bedL = 10;
      const soilDepth = 0.6;
      const mulchDepth = 0.4;

      // Sub-grade soil base
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x3f2e21, roughness: 0.95 });
      const soilGeo = new THREE.BoxGeometry(bedL, soilDepth, bedW);
      const soilMesh = new THREE.Mesh(soilGeo, soilMat);
      soilMesh.position.y = soilDepth / 2;
      soilMesh.receiveShadow = true;
      itemGroup.add(soilMesh);

      // Organic Mulch Surface Layer (Explodable)
      const mulchMat = new THREE.MeshStandardMaterial({
        color: 0x543310, // dark organic bark brown
        roughness: 0.9,
      });
      const mulchGeo = new THREE.BoxGeometry(bedL - 0.2, mulchDepth, bedW - 0.2);
      const mulchMesh = new THREE.Mesh(mulchGeo, mulchMat);
      mulchMesh.position.y = soilDepth + mulchDepth / 2;
      mulchMesh.castShadow = true;
      itemGroup.add(mulchMesh);

      explodables.push({ obj: mulchMesh, baseY: mulchMesh.position.y, explodeFactor: 1.2 });

      // Timber Edging Border around bed
      const timberMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
      const borderL1 = new THREE.Mesh(new THREE.BoxGeometry(bedL + 0.6, soilDepth + mulchDepth, 0.4), timberMat);
      borderL1.position.set(0, (soilDepth + mulchDepth) / 2, bedW / 2 + 0.2);
      itemGroup.add(borderL1);

      const borderL2 = new THREE.Mesh(new THREE.BoxGeometry(bedL + 0.6, soilDepth + mulchDepth, 0.4), timberMat);
      borderL2.position.set(0, (soilDepth + mulchDepth) / 2, -bedW / 2 - 0.2);
      itemGroup.add(borderL2);
    }
    // 3. Paver Patio & Walkway
    else if (lowerType.includes('paver') || lowerName.includes('paver')) {
      const pW = 8;
      const pL = 10;

      // Base Gravel
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(pL + 0.4, 0.4, pW + 0.4),
        new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
      );
      baseMesh.position.y = 0.2;
      itemGroup.add(baseMesh);

      // Screeded Sand Layer
      const sandMesh = new THREE.Mesh(
        new THREE.BoxGeometry(pL + 0.2, 0.2, pW + 0.2),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.95 })
      );
      sandMesh.position.y = 0.5;
      itemGroup.add(sandMesh);
      explodables.push({ obj: sandMesh, baseY: 0.5, explodeFactor: 0.6 });

      // Paver Blocks Grid (Explodable)
      const paversGroup = new THREE.Group();
      paversGroup.position.y = 0.75;
      const paverMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 });

      for (let px = -pL / 2 + 0.5; px <= pL / 2 - 0.5; px += 1.0) {
        for (let pz = -pW / 2 + 0.5; pz <= pW / 2 - 0.5; pz += 0.5) {
          const block = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.3, 0.44), paverMat);
          block.position.set(px, 0, pz);
          block.castShadow = true;
          paversGroup.add(block);
        }
      }
      itemGroup.add(paversGroup);
      explodables.push({ obj: paversGroup, baseY: 0.75, explodeFactor: 1.4 });
    }
    // 4. Fabric Bolt & Cutting Table
    else if (lowerType.includes('fabric') || lowerType.includes('quilt') || lowerName.includes('fabric')) {
      // Wooden Cutting Table
      const tableTop = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.3, 7),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
      );
      tableTop.position.y = 2.5;
      itemGroup.add(tableTop);

      // Table Legs
      const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
      [[-4.5, -3], [4.5, -3], [-4.5, 3], [4.5, 3]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.5, 12), legMat);
        leg.position.set(lx, 1.25, lz);
        itemGroup.add(leg);
      });

      // Fabric Roll Bolt
      const rollMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.7 });
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 5.5, 24), rollMat);
      roll.rotation.x = Math.PI / 2;
      roll.position.set(-3.8, 2.5 + 0.6, 0);
      itemGroup.add(roll);

      // Unrolled Fabric Sheet on Table (Explodable)
      const sheetMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.8 });
      const sheet = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 5.2), sheetMat);
      sheet.rotation.x = -Math.PI / 2;
      sheet.position.set(0.3, 2.5 + 0.18, 0);
      itemGroup.add(sheet);
      explodables.push({ obj: sheet, baseY: 2.5 + 0.18, explodeFactor: 0.8 });
    }
    // 5. Upholstery Box Cushions
    else if (lowerType.includes('upholstery') || lowerName.includes('cushion')) {
      const cushionGroup = new THREE.Group();
      cushionGroup.position.y = 1.0;

      // Bottom Plate
      const bottomPlate = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 0.1, 4.5),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.7 })
      );
      bottomPlate.position.y = 0.05;
      cushionGroup.add(bottomPlate);

      // Foam Core (Explodable)
      const foamCore = new THREE.Mesh(
        new THREE.BoxGeometry(4.3, 1.2, 4.3),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 })
      );
      foamCore.position.y = 0.7;
      cushionGroup.add(foamCore);
      explodables.push({ obj: foamCore, baseY: 0.7, explodeFactor: 0.5 });

      // Top Plate with Piping Trim (Explodable)
      const topPlate = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 0.15, 4.5),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.65 })
      );
      topPlate.position.y = 1.35;
      cushionGroup.add(topPlate);
      explodables.push({ obj: topPlate, baseY: 1.35, explodeFactor: 1.2 });

      itemGroup.add(cushionGroup);
    }
    // 6. Default Fallback Item Block
    else {
      const genericBlock = new THREE.Mesh(
        new THREE.BoxGeometry(6, 1.2, 6),
        new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.7 })
      );
      genericBlock.position.y = 0.6;
      itemGroup.add(genericBlock);
      explodables.push({ obj: genericBlock, baseY: 0.6, explodeFactor: 1.0 });
    }

    parent.add(itemGroup);
    currentXOffset += spacing;
  });

  // Center entire scene around origin
  const totalSpan = (activeItems.length - 1) * spacing;
  parent.position.x = -totalSpan / 2;
}
