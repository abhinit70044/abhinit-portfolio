/**
 * Interactive 3D Hero & Ambient Background Scene (Three.js + 2D Fallback)
 * Renders a futuristic neon holographic core with orbiting marketing skill nodes,
 * glowing energy rings, mouse/drag interactivity, and scroll-reactive depth.
 */
(function () {
  const canvas = document.getElementById('webgl-canvas');
  const stage = document.getElementById('hero-3d-stage');
  const portrait = document.getElementById('hero-portrait');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shared interaction state
  const state = {
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0.15,
    targetRotY: 0,
    dragRotX: 0,
    dragRotY: 0,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    scrollProgress: 0,
    focusBoost: 0
  };

  function updateScrollProgress() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    state.scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  window.addEventListener('pointermove', (event) => {
    const nx = (event.clientX / window.innerWidth) * 2 - 1;
    const ny = (event.clientY / window.innerHeight) * 2 - 1;
    state.mouseX = nx;
    state.mouseY = ny;

    if (portrait && !prefersReducedMotion) {
      const tiltY = nx * 5.5;
      const tiltX = -ny * 4.5;
      const shiftX = nx * 6;
      const shiftY = ny * 5;
      portrait.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    }

    if (state.isDragging) {
      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;
      state.dragRotY += dx * 0.008;
      state.dragRotX += dy * 0.008;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
    }
  });

  window.addEventListener('pointerup', () => {
    state.isDragging = false;
  });

  if (stage) {
    stage.addEventListener('pointerenter', () => {
      state.focusBoost = 1;
    });
    stage.addEventListener('pointerleave', () => {
      state.focusBoost = 0;
      if (portrait && !prefersReducedMotion) {
        portrait.style.transform = '';
      }
    });
  }

  // Attempt Three.js WebGL initialization
  if (typeof window.THREE !== 'undefined') {
    try {
      initThreeScene();
      return;
    } catch (error) {
      console.warn('WebGL unavailable, switching to 2D canvas fallback:', error);
    }
  }

  initFallbackCanvas();

  function initThreeScene() {
    const THREE = window.THREE;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x88aaff, 0.7);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x00d4ff, 2.8, 25);
    blueLight.position.set(4, 3, 5);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x9333ea, 2.8, 25);
    purpleLight.position.set(-4, -3, 4);
    scene.add(purpleLight);

    // 1. Deep Neon Particle Starfield
    const particleCount = window.innerWidth < 768 ? 750 : 1400;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const colorBlue = new THREE.Color(0x00d4ff);
    const colorPurple = new THREE.Color(0xa855f7);
    const colorWhite = new THREE.Color(0xdbeafe);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 28;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 18 - 3;

      const pick = Math.random();
      const chosen = pick < 0.45 ? colorBlue : pick < 0.85 ? colorPurple : colorWhite;
      particleColors[i3] = chosen.r;
      particleColors[i3 + 1] = chosen.g;
      particleColors[i3 + 2] = chosen.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 2. Original Hero Holographic 3D Background Core Group (kept intact in background depth)
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Inner faceted crystal
    const innerGeo = new THREE.IcosahedronGeometry(1.12, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.85,
      flatShading: true
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    heroGroup.add(innerCore);

    // Outer geodesic neon wireframe
    const wireGeo = new THREE.IcosahedronGeometry(1.52, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const outerWire = new THREE.Mesh(wireGeo, wireMat);
    heroGroup.add(outerWire);

    // Secondary purple wireframe cage
    const cageGeo = new THREE.OctahedronGeometry(1.88, 0);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    heroGroup.add(cageMesh);

    // Original Background Orbital Neon Rings
    const ringConfigs = [
      { radius: 2.15, tube: 0.018, color: 0x00d4ff, rotX: 1.15, rotY: 0.35 },
      { radius: 2.45, tube: 0.015, color: 0x9333ea, rotX: -0.95, rotY: 0.8 },
      { radius: 2.75, tube: 0.012, color: 0x38bdf8, rotX: 0.45, rotY: -1.1 }
    ];

    const rings = ringConfigs.map((cfg) => {
      const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 120);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.42
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = cfg.rotX;
      ring.rotation.y = cfg.rotY;
      heroGroup.add(ring);
      return ring;
    });

    // 5 Orbiting Skill Satellite Nodes
    const satellites = [];
    const satColors = [0x00d4ff, 0xa855f7, 0x3b82f6, 0x38bdf8, 0xc026d3];
    for (let i = 0; i < 5; i++) {
      const satGeo = new THREE.OctahedronGeometry(0.13, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: satColors[i],
        emissive: satColors[i],
        emissiveIntensity: 0.85,
        roughness: 0.25,
        metalness: 0.6
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      satellites.push({
        mesh: sat,
        radius: 2.25 + (i % 2) * 0.38,
        speed: 0.42 + i * 0.11,
        phase: (i * Math.PI * 2) / 5,
        tilt: (i % 2 === 0 ? 1 : -1) * 0.45
      });
      heroGroup.add(sat);
    }

    // Keep the original 3D geometric animation subtly in background depth behind the layout
    function getHeroTargetLayout() {
      const heroFactor = Math.max(0, 1 - state.scrollProgress * 3.8);
      const isDesktop = window.innerWidth > 1024;
      const baseX = isDesktop ? 2.2 : 0;
      const baseY = isDesktop ? 0.1 : -0.2;
      const scrolledX = isDesktop ? 2.65 : 0;
      const scrolledY = -0.2;

      return {
        x: THREE.MathUtils.lerp(scrolledX, baseX, heroFactor),
        y: THREE.MathUtils.lerp(scrolledY, baseY, heroFactor),
        z: THREE.MathUtils.lerp(-3.4, -2.1, heroFactor),
        scale: THREE.MathUtils.lerp(isDesktop ? 0.82 : 0.68, isDesktop ? 0.92 : 0.75, heroFactor),
        opacityFactor: THREE.MathUtils.lerp(0.22, 0.55, heroFactor)
      };
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const layout = getHeroTargetLayout();

      heroGroup.position.x += (layout.x - heroGroup.position.x) * 0.06;
      heroGroup.position.y += (layout.y - heroGroup.position.y) * 0.06;
      heroGroup.position.z += (layout.z - heroGroup.position.z) * 0.06;

      const boostScale = layout.scale * (1 + state.focusBoost * 0.04);
      heroGroup.scale.setScalar(
        heroGroup.scale.x + (boostScale - heroGroup.scale.x) * 0.08
      );

      if (!prefersReducedMotion) {
        const autoRotY = elapsed * 0.24;
        const targetY = autoRotY + state.mouseX * 0.35 + state.dragRotY;
        const targetX = state.mouseY * 0.24 + state.dragRotX;

        heroGroup.rotation.y += (targetY - heroGroup.rotation.y) * 0.06;
        heroGroup.rotation.x += (targetX - heroGroup.rotation.x) * 0.06;

        innerCore.rotation.x = elapsed * 0.35;
        innerCore.rotation.z = elapsed * 0.22;
        outerWire.rotation.y = -elapsed * 0.18;
        cageMesh.rotation.z = elapsed * 0.14;

        rings[0].rotation.z = elapsed * 0.38;
        rings[1].rotation.z = -elapsed * 0.31;
        rings[2].rotation.x = 0.45 + Math.sin(elapsed * 0.4) * 0.25;

        satellites.forEach((s) => {
          const angle = elapsed * s.speed + s.phase;
          s.mesh.position.set(
            Math.cos(angle) * s.radius,
            Math.sin(angle * 1.2) * s.tilt * 1.4,
            Math.sin(angle) * s.radius
          );
          s.mesh.rotation.x += 0.02;
          s.mesh.rotation.y += 0.03;
        });

        particles.rotation.y = elapsed * 0.025 + state.mouseX * 0.06;
        particles.rotation.x = state.mouseY * 0.04 + state.scrollProgress * 0.35;
      }

      wireMat.opacity = 0.42 * layout.opacityFactor;
      cageMat.opacity = 0.28 * layout.opacityFactor;
      rings.forEach((ring, idx) => {
        ring.material.opacity = (0.45 - idx * 0.06) * layout.opacityFactor;
      });

      renderer.render(scene, camera);
    }

    animate();
  }

  function initFallbackCanvas() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const nodes = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1.2,
      color: Math.random() > 0.5 ? '#00d4ff' : '#a855f7'
    }));

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      nodes.forEach((n) => {
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();
  }
})();
