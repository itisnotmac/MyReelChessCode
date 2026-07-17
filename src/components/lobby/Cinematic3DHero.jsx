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

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.03);

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 2.4, 7);
    camera.lookAt(0, 0.9, 0);

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    // Lights — key for readable detail, teal rim for the brand glow, soft fill
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xfff5e0, 1.7);
    key.position.set(4, 9, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
    scene.add(key);
    const tealRim = new THREE.PointLight(0x3aafa9, 3.2, 20);
    tealRim.position.set(-4, 3.5, -3);
    scene.add(tealRim);
    const tealRim2 = new THREE.PointLight(0x3aafa9, 1.6, 18);
    tealRim2.position.set(4, 2, -4);
    scene.add(tealRim2);
    const fill = new THREE.DirectionalLight(0x6688ff, 0.3);
    fill.position.set(-5, 2, 4);
    scene.add(fill);

    // Reflective dark ground (the "board" surface)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x05050a, roughness: 0.25, metalness: 0.6 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const group = new THREE.Group();
    scene.add(group);

    const total = available.length;
    const SPACING = 1.7;
    const TARGET_H = total === 1 ? 2.3 : 1.9;

    const placePiece = (obj, index) => {
      // Normalize scale to target height, sit the base on the ground, center on x/z.
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3(); box.getSize(size);
      obj.scale.setScalar(TARGET_H / Math.max(size.x, size.y, size.z));
      const box2 = new THREE.Box3().setFromObject(obj);
      const center = new THREE.Vector3(); box2.getCenter(center);
      const x = (index - (total - 1) / 2) * SPACING;
      obj.position.set(x - center.x, -box2.min.y, -center.z);
      obj.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      group.add(obj);
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
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.22;
      group.position.y = Math.sin(t * 0.6) * 0.05;
      camera.position.y = 2.4 + Math.sin(t * 0.4) * 0.12;
      camera.lookAt(0, 0.9, 0);
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