import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { COMPRESSED_GLB_URLS } from '@/lib/compressedPieceUrls';
import { HERO_BACKDROPS } from '@/lib/heroBackdrops';

// Reused from the in-game 3D board: fresnel neon edge glow so only the
// silhouette of each piece emits light, matching the polished look in matches.
const WHITE_PIECE = new THREE.Color(0xf5f0e8);
const BLACK_PIECE = new THREE.Color(0x1a3a3a);
const WHITE_GLOW = new THREE.Color(0xffffff);
const TEAL_GLOW = new THREE.Color(0x3aafa9);

function applyMaterial(object3D, color, isWhite) {
  const glowColor = isWhite ? WHITE_GLOW : TEAL_GLOW;
  const glowIntensity = isWhite ? 2.2 : 2.8;
  const glowPower = 2.0;
  const mat = new THREE.MeshStandardMaterial({
    color, metalness: 0.3, roughness: 0.35, emissive: glowColor, emissiveIntensity: 0,
  });
  mat.customProgramCacheKey = () => isWhite ? 'fresnel_glow_white' : 'fresnel_glow_teal';
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uGlowColor = { value: glowColor };
    shader.uniforms.uGlowIntensity = { value: glowIntensity };
    shader.uniforms.uGlowPower = { value: glowPower };
    shader.vertexShader = 'varying vec3 vGlowNormal;\nvarying vec3 vGlowViewPos;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `#include <project_vertex>
       vGlowNormal = normalize(normalMatrix * normal);
       vGlowViewPos = mvPosition.xyz;`
    );
    shader.fragmentShader = 'uniform vec3 uGlowColor;\nuniform float uGlowIntensity;\nuniform float uGlowPower;\nvarying vec3 vGlowNormal;\nvarying vec3 vGlowViewPos;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
       vec3 glowViewDir = normalize(-vGlowViewPos);
       float glowFresnel = pow(1.0 - max(0.0, dot(normalize(vGlowNormal), glowViewDir)), uGlowPower);
       totalEmissiveRadiance = uGlowColor * uGlowIntensity * glowFresnel;`
    );
  };
  object3D.traverse(child => {
    if (child.isMesh) { child.material = mat; child.castShadow = true; child.receiveShadow = true; }
  });
}

function load(loader, url) {
  return new Promise((res, rej) => loader.load(url, (g) => res(g), undefined, rej));
}

export default function Cinematic3DHero() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
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
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 2.3, 6.6);
    camera.lookAt(0, 0.7, 0);

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    // Lights — scaled to match the in-game 3D board
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xfff5e0, 1.6);
    key.position.set(4, 9, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
    scene.add(key);
    const tealRim = new THREE.PointLight(0x3aafa9, 3, 18);
    tealRim.position.set(-3.5, 3.5, -3);
    scene.add(tealRim);
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

    const placePiece = (gltf, key, isWhite, x) => {
      const tmpl = gltf.scene.clone(true);
      applyMaterial(tmpl, isWhite ? WHITE_PIECE : BLACK_PIECE, isWhite);
      const isKnight = key === 'n';
      tmpl.rotation.y = isKnight ? (isWhite ? 0 : Math.PI) : (isWhite ? Math.PI / 2 : -Math.PI / 2);
      const box = new THREE.Box3().setFromObject(tmpl);
      const size = new THREE.Vector3(); box.getSize(size);
      tmpl.scale.setScalar(1.6 / Math.max(size.x, size.y, size.z));
      const box2 = new THREE.Box3().setFromObject(tmpl);
      tmpl.position.set(x, -box2.min.y, 0);
      group.add(tmpl);
    };

    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(draco);

    let alive = true;
    Promise.all([
      load(loader, COMPRESSED_GLB_URLS.k),
      load(loader, COMPRESSED_GLB_URLS.q),
      load(loader, COMPRESSED_GLB_URLS.n),
    ]).then(([king, queen, knight]) => {
      if (!alive) return;
      placePiece(king, 'k', true, -1.8);
      placePiece(queen, 'q', true, 0);
      placePiece(knight, 'n', false, 1.8);
    }).catch(err => { console.error('Hero GLB load failed', err); setFailed(true); });

    const clock = new THREE.Clock();
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.22;
      group.position.y = Math.sin(t * 0.6) * 0.05;
      camera.position.y = 2.3 + Math.sin(t * 0.4) * 0.12;
      camera.lookAt(0, 0.7, 0);
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

  if (failed) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <img src={HERO_BACKDROPS.cinematic3dHero} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}