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

export default function Cinematic3DHero() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!HAS_PIECES) return;

    const available = HERO_PIECE_ORDER.filter(k => HERO_PIECE_URLS[k]).map(k => ({ key: k, url: HERO_PIECE_URLS[k] }));
    const total = available.length;

    let renderer;
    try {
      // alpha: true so the lobby background image shows through the canvas
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

    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
    camera.position.set(0, 1.8, 8);
    camera.lookAt(0, 0.8, 0);

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0); // transparent — composited over the lobby backdrop image
    container.appendChild(renderer.domElement);

    // ── LIGHTS ──
    // Very low ambient so inactive pieces read as dark silhouettes.
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    // Key spotlight that follows the active piece — the signature of the
    // "Spotlight Cycle" direction. Target is added to the scene and lerped
    // towards whichever piece is currently lit.
    const spot = new THREE.SpotLight(0xfff5e0, 8, 14, Math.PI / 5.5, 0.45, 1.8);
    spot.position.set(0, 5.5, 3);
    scene.add(spot);
    scene.add(spot.target);

    // Teal rim light that also follows the active piece for the brand glow.
    const tealRim = new THREE.PointLight(0x3aafa9, 4, 9);
    tealRim.position.set(-2, 2.5, 1.5);
    scene.add(tealRim);

    // Soft cool fill so silhouettes aren't pure black.
    const fill = new THREE.DirectionalLight(0x4466aa, 0.12);
    fill.position.set(-5, 2, 4);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    const pieces = [];
    const TARGET_H = 1.8;
    const SWITCH_INTERVAL = 4; // seconds each piece holds the spotlight
    const STEP_FORWARD = 1.0; // how far the active piece steps toward camera
    const ROT_SPEED = 0.012; // active piece rotation per frame

    const placePiece = (obj, index) => {
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3(); box.getSize(size);
      obj.scale.setScalar(TARGET_H / Math.max(size.x, size.y, size.z));
      const box2 = new THREE.Box3().setFromObject(obj);
      const center = new THREE.Vector3(); box2.getCenter(center);

      // Shallow arc — all pieces at roughly the same depth so the spotlight
      // can pick any of them out without the camera needing to move.
      const spread = Math.min(Math.PI * 0.45, (total - 1) * 0.22);
      const theta = -spread / 2 + spread * (index / Math.max(1, total - 1));
      const R = 3.2;
      const x = R * Math.sin(theta);
      const z = R * Math.cos(theta) - R;

      const baseX = x - center.x;
      const baseZ = -center.z + z;
      obj.position.set(baseX, -box2.min.y, baseZ);
      obj.rotation.y = theta;
      obj.traverse(c => { if (c.isMesh) { c.castShadow = false; c.receiveShadow = false; } });

      obj.userData = {
        baseX, baseZ, baseY: -box2.min.y, baseRotY: theta,
        activeness: index === 0 ? 1 : 0, // first piece starts lit
        rotAccum: 0,
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
    let activeIndex = 0;
    let lastSwitch = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Advance the spotlight to the next piece on a steady cadence.
      if (pieces.length > 0 && t - lastSwitch > SWITCH_INTERVAL) {
        activeIndex = (activeIndex + 1) % pieces.length;
        lastSwitch = t;
      }

      // Per-piece activeness lerp + spotlight follow
      let activeX = 0;
      for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const target = (i === activeIndex) ? 1 : 0;
        piece.userData.activeness = THREE.MathUtils.lerp(piece.userData.activeness, target, 0.035);
        const a = piece.userData.activeness;

        // Step forward (toward camera) when active
        piece.position.z = piece.userData.baseZ + a * STEP_FORWARD;
        // Slight lift
        piece.position.y = piece.userData.baseY + a * 0.08;
        // Accumulate rotation only while active (no snap-back when dimming)
        piece.userData.rotAccum += a * ROT_SPEED;
        piece.rotation.y = piece.userData.baseRotY + piece.userData.rotAccum;

        if (i === activeIndex) activeX = piece.position.x;
      }

      // Spotlight + teal rim follow the active piece's x position
      if (pieces.length > 0) {
        spot.position.x = THREE.MathUtils.lerp(spot.position.x, activeX, 0.05);
        spot.target.position.set(activeX, 0.8, 0);
        tealRim.position.x = THREE.MathUtils.lerp(tealRim.position.x, activeX - 1.8, 0.05);
      }

      // Gentle camera breathing — keeps the scene alive without spinning
      camera.position.y = 1.8 + Math.sin(t * 0.3) * 0.07;
      camera.lookAt(0, 0.8, 0);
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