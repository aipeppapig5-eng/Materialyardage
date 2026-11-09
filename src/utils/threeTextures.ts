import * as THREE from 'three';

/**
 * Creates a procedural PBR canvas texture for concrete with fine aggregates and float finish
 */
export function createProceduralConcreteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base concrete tone
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle trowel sweep strokes
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(241, 245, 249, 0.25)' : 'rgba(148, 163, 184, 0.2)';
      ctx.fillRect(0, i * 18, 512, 12);
    }

    // Fine aggregate specks
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 2 + 0.5;
      const shade = Math.random() > 0.5 ? 'rgba(71, 85, 105, 0.35)' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Expansion / control joint line
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a procedural mulch texture with shredded hardwood bark fibers
 */
export function createProceduralMulchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark organic rich soil base
    ctx.fillStyle = '#2d1810';
    ctx.fillRect(0, 0, 512, 512);

    // Shredded bark fibers
    const colors = ['#4a2818', '#5c331e', '#3d2013', '#6b3d22', '#24140c'];
    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const length = Math.random() * 32 + 8;
      const angle = (Math.random() - 0.5) * Math.PI;
      const width = Math.random() * 3 + 1;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(-length / 2, -width / 2, length, width);
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a procedural gravel & crushed stone texture with multi-tone angular pebbles
 */
export function createProceduralGravelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#475569'; // slate-600 background
    ctx.fillRect(0, 0, 512, 512);

    const pebbleTones = ['#94a3b8', '#64748b', '#cbd5e1', '#334155', '#e2e8f0', '#78716c'];
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 7 + 3;

      ctx.fillStyle = pebbleTones[Math.floor(Math.random() * pebbleTones.length)];
      ctx.beginPath();
      // Angular pebble polygon
      const points = 5 + Math.floor(Math.random() * 3);
      for (let p = 0; p < points; p++) {
        const rad = (p / points) * Math.PI * 2;
        const dist = size * (0.8 + Math.random() * 0.4);
        const px = x + Math.cos(rad) * dist;
        const py = y + Math.sin(rad) * dist;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a procedural interlocking paver texture with joint sand
 */
export function createProceduralPaverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Joint sand background
    ctx.fillStyle = '#78716c';
    ctx.fillRect(0, 0, 512, 512);

    // Draw running bond paver bricks
    const brickW = 120;
    const brickH = 60;
    const gap = 6;

    for (let row = 0; row < 10; row++) {
      const offset = (row % 2) * (brickW / 2);
      for (let col = -1; col < 6; col++) {
        const bx = col * (brickW + gap) - offset;
        const by = row * (brickH + gap);

        // Brick gradient
        const grad = ctx.createLinearGradient(bx, by, bx + brickW, by + brickH);
        grad.addColorStop(0, '#c2410c');
        grad.addColorStop(0.5, '#ea580c');
        grad.addColorStop(1, '#9a3412');
        ctx.fillStyle = grad;
        ctx.fillRect(bx, by, brickW, brickH);

        // Bevel highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx + 2, by + 2, brickW - 4, brickH - 4);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a professional green self-healing cutting mat texture with 1" grid lines
 */
export function createProceduralCuttingMatTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Studio mat green
    ctx.fillStyle = '#065f46';
    ctx.fillRect(0, 0, 512, 512);

    // Fine 0.5" grid lines
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 512; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Bold 1" grid lines
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    for (let x = 0; x <= 512; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // 45 degree bias guidelines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(512, 512);
    ctx.moveTo(512, 0);
    ctx.lineTo(0, 512);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a procedural wood grain formwork texture for concrete forms and timber borders
 */
export function createProceduralWoodFormTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#b45309'; // warm pine lumber
    ctx.fillRect(0, 0, 512, 128);

    // Wood grain streaks
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#92400e' : '#d97706';
      ctx.globalAlpha = 0.35;
      const y = Math.random() * 128;
      const h = Math.random() * 8 + 2;
      ctx.fillRect(0, y, 512, h);
    }
    ctx.globalAlpha = 1.0;

    // Board joint lines
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 64);
    ctx.lineTo(512, 64);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
