/**
 * Separate 3D Orbital Animation for Abhinit Kumar's Transparent Portrait
 * Renders 3 thin tilted rotating elliptical rings at distinct speeds plus
 * glowing particles orbiting behind/around the full-body portrait without
 * touching the existing background Three.js scene or covering the face.
 */
(function () {
  const orbitCanvas = document.getElementById('portrait-orbit-canvas');
  const stage = document.getElementById('hero-3d-stage');
  if (!orbitCanvas || !stage) return;

  const ctx = orbitCanvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;

  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  window.addEventListener('pointermove', (event) => {
    pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
  });

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(300, Math.round(rect.width));
    height = Math.max(360, Math.round(rect.height));
    orbitCanvas.width = Math.round(width * dpr);
    orbitCanvas.height = Math.round(height * dpr);
    orbitCanvas.style.width = `${width}px`;
    orbitCanvas.style.height = `${height}px`;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 3 thin rotating elliptical rings in existing theme colours (#00d4ff, #9333ea, #38bdf8)
  const rings = [
    {
      rxFactor: 0.41,
      ryFactor: 0.145,
      yOffsetFactor: -0.02,
      tilt: -0.34,
      speed: 0.42,
      phase: 0.2,
      lineWidth: 1.75,
      color: 'rgba(0, 212, 255, 0.72)',
      glowColor: '#00d4ff',
      dash: []
    },
    {
      rxFactor: 0.45,
      ryFactor: 0.165,
      yOffsetFactor: 0.05,
      tilt: 0.38,
      speed: -0.29,
      phase: 1.9,
      lineWidth: 1.45,
      color: 'rgba(168, 85, 247, 0.68)',
      glowColor: '#9333ea',
      dash: []
    },
    {
      rxFactor: 0.36,
      ryFactor: 0.125,
      yOffsetFactor: 0.16,
      tilt: -0.14,
      speed: 0.56,
      phase: 3.4,
      lineWidth: 1.25,
      color: 'rgba(56, 189, 248, 0.55)',
      glowColor: '#38bdf8',
      dash: [7, 9]
    }
  ];

  // Subtle glowing particles orbiting around the elliptical rings
  const particles = Array.from({ length: 28 }, (_, idx) => ({
    ringIdx: idx % rings.length,
    angle: (idx / 28) * Math.PI * 2 + Math.random() * 0.4,
    speed: (idx % 2 === 0 ? 1 : -1) * (0.28 + (idx % 5) * 0.09),
    radialJitter: (Math.random() - 0.5) * 18,
    size: 1.6 + (idx % 3) * 0.9,
    color: idx % 3 === 0 ? '#00d4ff' : idx % 3 === 1 ? '#a855f7' : '#38bdf8',
    alpha: 0.55 + Math.random() * 0.4
  }));

  function projectRingPoint(ring, theta, cx, cy, baseRadius) {
    const rx = baseRadius * ring.rxFactor * 2.15;
    const ry = baseRadius * ring.ryFactor * 2.15;
    const localX = Math.cos(theta) * rx;
    const localY = Math.sin(theta) * ry;
    const cosT = Math.cos(ring.tilt);
    const sinT = Math.sin(ring.tilt);

    return {
      x: cx + (localX * cosT - localY * sinT),
      y: cy + ring.yOffsetFactor * height + (localX * sinT + localY * cosT),
      rx,
      ry
    };
  }

  let startTime = performance.now();

  function render(now) {
    requestAnimationFrame(render);

    const elapsed = prefersReducedMotion ? 0 : (now - startTime) * 0.001;

    pointer.x += (pointer.targetX - pointer.x) * 0.07;
    pointer.y += (pointer.targetY - pointer.y) * 0.07;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.5 + pointer.x * 8;
    const cy = height * 0.52 + pointer.y * 6;
    const baseRadius = Math.min(width, height * 0.96);

    // Subtle neon pedestal ellipse beneath the shoes
    const floorGrad = ctx.createRadialGradient(
      cx,
      height * 0.92,
      8,
      cx,
      height * 0.92,
      baseRadius * 0.34
    );
    floorGrad.addColorStop(0, 'rgba(0, 212, 255, 0.28)');
    floorGrad.addColorStop(0.55, 'rgba(147, 51, 234, 0.14)');
    floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.save();
    ctx.translate(cx, height * 0.92);
    ctx.scale(1.35, 0.24);
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 0.26, 0, Math.PI * 2);
    ctx.fillStyle = floorGrad;
    ctx.fill();
    ctx.restore();

    // Draw 3 thin tilted elliptical rings rotating at different speeds
    rings.forEach((ring, idx) => {
      const rx = baseRadius * ring.rxFactor * 2.15;
      const ry = baseRadius * ring.ryFactor * 2.15;
      const dynamicTilt = ring.tilt + Math.sin(elapsed * 0.45 + idx) * 0.05 + pointer.y * 0.04;
      const ringCenterY = cy + ring.yOffsetFactor * height;

      ctx.save();
      ctx.translate(cx, ringCenterY);
      ctx.rotate(dynamicTilt);

      // Subtle glowing base ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.lineWidth;
      ctx.setLineDash(ring.dash);
      ctx.shadowColor = ring.glowColor;
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Rotating bright orbital highlight arc along each ellipse
      const arcStart = elapsed * ring.speed + ring.phase;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, arcStart, arcStart + Math.PI * 0.55);
      ctx.strokeStyle = '#ffffff';
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = ring.lineWidth + 0.6;
      ctx.setLineDash([]);
      ctx.shadowColor = ring.glowColor;
      ctx.shadowBlur = 20;
      ctx.stroke();

      ctx.restore();
    });

    // Draw subtle glowing particles orbiting around the photograph
    particles.forEach((p) => {
      const ring = rings[p.ringIdx];
      const theta = p.angle + elapsed * p.speed;
      const pos = projectRingPoint(ring, theta, cx, cy, baseRadius);
      const px = pos.x + Math.cos(theta) * p.radialJitter;
      const py = pos.y + Math.sin(theta) * (p.radialJitter * 0.45);

      ctx.save();
      ctx.globalAlpha = p.alpha * (0.75 + 0.25 * Math.sin(elapsed * 2.2 + p.angle));
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();
  }

  requestAnimationFrame(render);
})();
