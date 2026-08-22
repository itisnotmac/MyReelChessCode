import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { HERO_PIECE_URLS, HERO_PIECE_ORDER } from '@/lib/heroPieceUrls';
import { HERO_BACKDROPS } from '@/lib/heroBackdrops';

const HAS_PIECES = HERO_PIECE_ORDER.some(k => HERO_PIECE_URLS[k]);

function load(loader, url) {
  return new Promise((res, rej) => loader.load(url, (g) => res(g), undefined, rej));
}

// Revolver-cylinder spotlight sequence: 1→4, 2→5, 3→6 (opposite pairs, crisscross)
const SEQUENCE = [0, 3, 1, 4, 2, 5];

export default function Cinematic3DHero() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!HAS_PIECES) return;

    const available = HERO_PIECE_ORDER.filter(k => HERO_PIECE_URLS[k]).map(k => ({ key: k, url: HERO_PIECE_URLS[k] }));
    const total = available.length;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      setFailed(true);
      return;
    }
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);

    const scene = new THREE.Scene();

    // Camera: person's eye level, looking at the pieces standing on the floor
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 1.8, 6);
    camera.lookAt(0, 0.5, 0);

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0); // transparent — composited over the lobby backdrop image
    container.appendChild(renderer.domElement);

    // ── LIGHTS ──
    // Zero ambient, zero fill — ONLY the piece under the spotlight is visible.
    scene.add(new THREE.AmbientLight(0xffffff, 0));

    // Ultra-tight spotlight from directly above the active piece. The narrow
    // cone (≈10°) + hard penumbra ensures the beam never spills onto adjacent
    // pieces in the circle.
    const SPOT_HEIGHT = 5.5;
    const spot = new THREE.SpotLight(0xfff5e0, 140, 10, Math.PI / 18, 0.12, 1.0);
    spot.position.set(0, SPOT_HEIGHT, 0);
    scene.add(spot);
    scene.add(spot.target);

    // Teal rim light that follows the active piece — short distance so it
    // doesn't bleed onto neighbouring pieces (circle spacing ≈ 2.2 units).
    const tealRim = new THREE.PointLight(0x3aafa9, 30, 2.0);
    tealRim.position.set(0, 1.5, 0);
    scene.add(tealRim);

    const group = new THREE.Group();
    scene.add(group);

    const pieces = [];
    const TARGET_H = 1.6;
    const CIRCLE_R = 2.3;
    const HOLD_TIME = 2.2; // seconds each piece holds the spotlight
    const SNAP_SPEED = 0.35; // fast lerp — aggressive sweep to next piece

    const placePiece = (obj, index) => {
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3(); box.getSize(size);
      obj.scale.setScalar(TARGET_H / Math.max(size.x, size.y, size.z));
      const box2 = new THREE.Box3().setFromObject(obj);
      const center = new THREE.Vector3(); box2.getCenter(center);

      // Arrange in a circle (revolver cylinder) — piece 0 at front (closest to camera)
      const angle = (index / total) * Math.PI * 2;
      const x = CIRCLE_R * Math.sin(angle);
      const z = CIRCLE_R * Math.cos(angle);

      const px = x - center.x;
      const pz = z - center.z;
      obj.position.set(px, -box2.min.y, pz);
      obj.traverse(c => { if (c.isMesh) { c.castShadow = false; c.receiveShadow = false; } });

      obj.userData = {
        baseX: px, baseY: -box2.min.y, baseZ: pz,
        rotAccum: 0,
        // Each piece rotates independently on its own axis at its own speed
        rotSpeed: 0.005 + Math.random() * 0.008,
      };
      group.add(obj);
      pieces.push(obj);
    };

    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(draco);

    let alive = true;
    Promise.all(available.map(p => load(loader, p.url)))
      .then(results => {
        if (!alive) return;
        results.forEach((gltf, i) => placePiece(gltf.scene, i));
      })
      .catch(err => { console.error('Hero GLB load failed', err); setFailed(true); });

    const clock = new THREE.Clock();
    let frame;
    let seqIndex = 0;
    let lastSwitch = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Advance through the revolver sequence (1→4→2→5→3→6→1→...)
      if (pieces.length > 0 && t - lastSwitch > HOLD_TIME) {
        seqIndex = (seqIndex + 1) % SEQUENCE.length;
        lastSwitch = t;
      }

      const activeIndex = pieces.length > 0 ? SEQUENCE[seqIndex] % pieces.length : 0;
      let activePiece = null;

      for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        // Every piece rotates continuously on its own axis — visible or not
        piece.userData.rotAccum += piece.userData.rotSpeed;
        piece.rotation.y = piece.userData.rotAccum;
        if (i === activeIndex) activePiece = piece;
      }

      // Spotlight snaps aggressively to the active piece — fast lerp for a
      // quick, dramatic sweep across the circle to the opposite side.
      if (activePiece) {
        spot.position.x = THREE.MathUtils.lerp(spot.position.x, activePiece.position.x, SNAP_SPEED);
        spot.position.z = THREE.MathUtils.lerp(spot.position.z, activePiece.position.z, SNAP_SPEED);
        spot.position.y = SPOT_HEIGHT;
        spot.target.position.lerp(activePiece.position, SNAP_SPEED);
        tealRim.position.x = THREE.MathUtils.lerp(tealRim.position.x, activePiece.position.x, SNAP_SPEED);
        tealRim.position.z = THREE.MathUtils.lerp(tealRim.position.z, activePiece.position.z, SNAP_SPEED);
      }

      // Gentle camera breathing — keeps the scene alive
      camera.position.y = 1.8 + Math.sin(t * 0.25) * 0.06;
      camera.lookAt(0, 0.5, 0);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      draco.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  if (failed || !HAS_PIECES) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <img src={HERO_BACKDROPS.cinematic3dHero} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}