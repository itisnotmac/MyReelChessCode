import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { COMPRESSED_GLB_URLS } from '@/lib/compressedPieceUrls';
import { HERO_PIECE_URLS } from '@/lib/heroPieceUrls';

const SQUARE_SIZE = 1;
const BOARD_SIZE = 8;

// Colors — matched to 2D board palette
const LIGHT_SQUARE = new THREE.Color(0x2e2e4e);
const DARK_SQUARE = new THREE.Color(0x1a1a2e);
const BOARD_BORDER = new THREE.Color(0x0a0a1a);
const WHITE_PIECE = new THREE.Color(0xf5f0e8);
const BLACK_PIECE = new THREE.Color(0x1a3a3a);
const WHITE_GLOW = new THREE.Color(0xffffff);
const TEAL_GLOW = new THREE.Color(0x3aafa9);
const SELECTED_COLOR = new THREE.Color(0xffff00);
const LEGAL_COLOR = new THREE.Color(0x00ff88);
const LAST_MOVE_COLOR = new THREE.Color(0xffa500);
const CHECK_COLOR = new THREE.Color(0xff2200);

// Fresnel-based neon edge glow — only the silhouette edges emit light, not the whole surface
function applyMaterial(object3D, color, isWhite) {
  const glowColor = isWhite ? WHITE_GLOW : TEAL_GLOW;
  const glowIntensity = isWhite ? 2.2 : 2.8;
  const glowPower = 2.0;

  const mat = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.35,
    emissive: glowColor,
    emissiveIntensity: 0,
  });

  // Unique cache key per glow variant — prevents Three.js from reusing a cached
  // shader program that lacks our fresnel injection
  mat.customProgramCacheKey = () => isWhite ? 'fresnel_glow_white' : 'fresnel_glow_teal';

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uGlowColor = { value: glowColor };
    shader.uniforms.uGlowIntensity = { value: glowIntensity };
    shader.uniforms.uGlowPower = { value: glowPower };

    // Vertex: pass view-space normal and position via our own varyings
    shader.vertexShader =
      'varying vec3 vGlowNormal;\nvarying vec3 vGlowViewPos;\n' +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `#include <project_vertex>
       vGlowNormal = normalize(normalMatrix * normal);
       vGlowViewPos = mvPosition.xyz;`
    );

    // Fragment: compute fresnel from our own varyings — no dependency on built-in varyings
    shader.fragmentShader =
      'uniform vec3 uGlowColor;\nuniform float uGlowIntensity;\nuniform float uGlowPower;\n' +
      'varying vec3 vGlowNormal;\nvarying vec3 vGlowViewPos;\n' +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
       vec3 glowViewDir = normalize(-vGlowViewPos);
       float glowFresnel = pow(1.0 - max(0.0, dot(normalize(vGlowNormal), glowViewDir)), uGlowPower);
       totalEmissiveRadiance = uGlowColor * uGlowIntensity * glowFresnel;`
    );
  };

  object3D.traverse(child => {
    if (child.isMesh) {
      child.material = mat;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

// High-detail originals: keep each model's own geometry + normal/roughness maps
// (sculpted detail), drop only the baked diffuse so the white/black tint reads
// cleanly, then add the fresnel edge glow on top.
function enhanceMaterial(object3D, isWhite) {
  const tint = isWhite ? 0xf0ece4 : 0x1b2a2a;
  const glowColor = isWhite ? WHITE_GLOW : TEAL_GLOW;
  const glowIntensity = isWhite ? 1.5 : 2.0;
  const glowPower = 2.2;
  const cacheKey = isWhite ? 'orig_glow_white' : 'orig_glow_black';

  object3D.traverse(child => {
    if (!child.isMesh) return;
    const src = Array.isArray(child.material) ? child.material : [child.material];
    const newMats = src.map(orig => {
      const mat = orig.clone();
      mat.color = new THREE.Color(tint);
      mat.map = null; // remove baked diffuse (copper) so the tint shows
      mat.emissive = new THREE.Color(glowColor);
      mat.emissiveIntensity = 0;
      mat.customProgramCacheKey = () => cacheKey;
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uGlowColor = { value: glowColor };
        shader.uniforms.uGlowIntensity = { value: glowIntensity };
        shader.uniforms.uGlowPower = { value: glowPower };
        shader.vertexShader =
          'varying vec3 vGlowNormal;\nvarying vec3 vGlowViewPos;\n' +
          shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          '#include <project_vertex>',
          `#include <project_vertex>
           vGlowNormal = normalize(normalMatrix * normal);
           vGlowViewPos = mvPosition.xyz;`
        );
        shader.fragmentShader =
          'uniform vec3 uGlowColor;\nuniform float uGlowIntensity;\nuniform float uGlowPower;\n' +
          'varying vec3 vGlowNormal;\nvarying vec3 vGlowViewPos;\n' +
          shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           vec3 glowViewDir = normalize(-vGlowViewPos);
           float glowFresnel = pow(1.0 - max(0.0, dot(normalize(vGlowNormal), glowViewDir)), uGlowPower);
           totalEmissiveRadiance += uGlowColor * uGlowIntensity * glowFresnel;`
        );
      };
      return mat;
    });
    child.material = newMats.length === 1 ? newMats[0] : newMats;
    child.castShadow = true;
    child.receiveShadow = true;
  });
}

// ---------- main component ----------


export default function ChessBoard3D({ board, selectedSquare, legalMoves, onSquareClick, lastMove, checkSquare }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const squareMeshesRef = useRef([]);
  const pieceMeshesRef = useRef([]);
  const templatesRef = useRef({});
  const modelsReadyRef = useRef(false);
  const rebuildPiecesRef = useRef(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const orbitRef = useRef({ theta: Math.PI / 6, phi: Math.PI / 3.2, radius: 11, tx: 0, tz: 0 });
  const onSquareClickRef = useRef(onSquareClick);

  // Keep ref in sync with latest prop so the stable Three.js listener always calls the current callback
  useEffect(() => {
    onSquareClickRef.current = onSquareClick;
  }, [onSquareClick]);

  useEffect(() => {
    const container = mountRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff5e0, 1.6);
    dirLight.position.set(6, 14, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
    // Aim the shadow frustum at the board center (default target is the origin,
    // which is a board corner — pieces on the far side fell outside the default
    // ±5 ortho frustum and cast no shadow). Widen it to cover the full 8×8 board.
    const lightTarget = new THREE.Object3D();
    lightTarget.position.set((BOARD_SIZE - 1) / 2, 0, (BOARD_SIZE - 1) / 2);
    scene.add(lightTarget);
    dirLight.target = lightTarget;
    dirLight.shadow.camera.left = -7;
    dirLight.shadow.camera.right = 7;
    dirLight.shadow.camera.top = 7;
    dirLight.shadow.camera.bottom = -7;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.camera.updateProjectionMatrix();
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-6, 4, -6);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xd4af37, 0.8, 20);
    pointLight.position.set(4, 8, 4);
    scene.add(pointLight);

    // Board border
    const borderGeo = new THREE.BoxGeometry(BOARD_SIZE + 0.6, 0.15, BOARD_SIZE + 0.6);
    const borderMesh = new THREE.Mesh(borderGeo, new THREE.MeshStandardMaterial({ color: BOARD_BORDER, roughness: 0.6, metalness: 0.5 }));
    borderMesh.position.set((BOARD_SIZE - 1) / 2, -0.08, (BOARD_SIZE - 1) / 2);
    borderMesh.receiveShadow = true;
    scene.add(borderMesh);

    // Squares
    const squares = [];
    for (let r = 0; r < 8; r++) {
      squares[r] = [];
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0;
        const geo = new THREE.BoxGeometry(SQUARE_SIZE, 0.12, SQUARE_SIZE);
        const mat = new THREE.MeshStandardMaterial({
          color: isLight ? LIGHT_SQUARE : DARK_SQUARE,
          roughness: 0.55,
          metalness: 0.2,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(c, 0, r);
        mesh.receiveShadow = true;
        mesh.userData = { row: r, col: c, baseColor: isLight ? LIGHT_SQUARE.clone() : DARK_SQUARE.clone() };
        scene.add(mesh);
        squares[r][c] = mesh;
      }
    }
    squareMeshesRef.current = squares;

    // Animate
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const { theta, phi, radius, tx, tz } = orbitRef.current;
      const cx = (BOARD_SIZE - 1) / 2;
      const cz = (BOARD_SIZE - 1) / 2;
      const targetX = cx + tx;
      const targetZ = cz + tz;
      camera.position.set(
        targetX + radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        targetZ + radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(targetX, 0, targetZ);
      renderer.render(scene, camera);
    };
    animate();

    // Click detection
    const raycaster = new THREE.Raycaster();
    const handleClick = (e) => {
      if (isDragging.current) return;
      const rect = container.getBoundingClientRect();
      const touch = e.changedTouches ? e.changedTouches[0] : (e.touches ? e.touches[0] : null);
      const clientX = touch ? touch.clientX : e.clientX;
      const clientY = touch ? touch.clientY : e.clientY;
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);
      const flat = squareMeshesRef.current.flat();
      const intersects = raycaster.intersectObjects(flat);
      if (intersects.length > 0) {
        const { row, col } = intersects[0].object.userData;
        onSquareClickRef.current(row, col);
      }
    };

    // Orbit controls
    const onMouseDown = (e) => {
      isDragging.current = false;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseup', onMouseUp);
    };
    const onMouseMove = (e) => {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isDragging.current = true;
      orbitRef.current.theta -= dx * 0.008;
      orbitRef.current.phi = Math.max(0.3, Math.min(Math.PI / 2.1, orbitRef.current.phi + dy * 0.006));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = (e) => {
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      if (!isDragging.current) handleClick(e);
    };

    // Touch orbit
    let lastTouchDist = null;
    const onTouchStart = (e) => {
      isDragging.current = false;
      if (e.touches.length === 1) {
        lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastMouse.current.x;
        const dy = e.touches[0].clientY - lastMouse.current.y;
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) isDragging.current = true;
        orbitRef.current.theta -= dx * 0.008;
        orbitRef.current.phi = Math.max(0.3, Math.min(Math.PI / 2.1, orbitRef.current.phi + dy * 0.006));
        lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if (e.touches.length === 2 && lastTouchDist !== null) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = lastTouchDist - dist;
        orbitRef.current.radius = Math.max(6, Math.min(18, orbitRef.current.radius + delta * 0.04));
        lastTouchDist = dist;
      }
    };
    const onTouchEnd = (e) => {
      if (!isDragging.current && e.changedTouches.length === 1) handleClick(e.changedTouches[0]);
      lastTouchDist = null;
    };

    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();
    const onWheel = (e) => {
      const t = orbitRef.current;
      const oldRadius = t.radius;
      const newRadius = Math.max(6, Math.min(18, oldRadius + e.deltaY * 0.02));
      if (newRadius === oldRadius) return;
      // Project the mouse onto the board plane and keep that world point
      // stationary as the camera zoomes — the view zooms toward the cursor.
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x: nx, y: ny }, camera);
      if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
        const cx = (BOARD_SIZE - 1) / 2;
        const cz = (BOARD_SIZE - 1) / 2;
        const ratio = newRadius / oldRadius;
        t.tx = (hitPoint.x - cx) + (cx + t.tx - hitPoint.x) * ratio;
        t.tz = (hitPoint.z - cz) + (cz + t.tz - hitPoint.z) * ratio;
        // Keep the orbit target within the board so we don't pan off into space
        t.tx = Math.max(-3, Math.min(3, t.tx));
        t.tz = Math.max(-3, Math.min(3, t.tz));
      }
      t.radius = newRadius;
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('wheel', onWheel, { passive: true });

    const handleResize = () => {
      const W2 = container.clientWidth;
      const H2 = container.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // Update square colors when selection/moves change
  useEffect(() => {
    const squares = squareMeshesRef.current;
    if (!squares.length) return;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const mesh = squares[r][c];
        if (!mesh) continue;
        const base = mesh.userData.baseColor;
        let color = base.clone();

        if (checkSquare && checkSquare[0] === r && checkSquare[1] === c) {
          color = CHECK_COLOR.clone();
        } else if (selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c) {
          color = SELECTED_COLOR.clone();
        } else if (legalMoves.some(([lr, lc]) => lr === r && lc === c)) {
          color = LEGAL_COLOR.clone();
        } else if (lastMove && (
          (lastMove.from[0] === r && lastMove.from[1] === c) ||
          (lastMove.to[0] === r && lastMove.to[1] === c)
        )) {
          color = LAST_MOVE_COLOR.clone();
        }

        mesh.material.color.copy(color);
      }
    }
  }, [selectedSquare, legalMoves, lastMove, checkSquare]);

  // Build piece templates once — load Draco-compressed GLB models (~500 KB each)
  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    // Desktop loads the original high-detail sculpts (CDN-hosted, no GitHub
    // fetch); mobile keeps the Draco-compressed set for performance.
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
    const useOriginal = !isMobile;
    const urlSet = useOriginal ? HERO_PIECE_URLS : COMPRESSED_GLB_URLS;

    const keys = ['p', 'r', 'n', 'b', 'q', 'k'];

    const processTemplate = (gltfScene, key) => {
      // Knight GLB faces -Z by default; other pieces face +X and need π/2 to face -Z
      const isKnight = key === 'n';
      const wRotY = isKnight ? 0 : Math.PI / 2;
      const bRotY = isKnight ? Math.PI : -Math.PI / 2;

      // White variant — face -Z (towards black at row 0)
      const wTmpl = gltfScene.clone(true);
      if (useOriginal) enhanceMaterial(wTmpl, true); else applyMaterial(wTmpl, WHITE_PIECE, true);
      wTmpl.rotation.y = wRotY;
      const wBox = new THREE.Box3().setFromObject(wTmpl);
      const wSize = new THREE.Vector3();
      wBox.getSize(wSize);
      wTmpl.scale.setScalar(0.75 / Math.max(wSize.x, wSize.y, wSize.z));
      const wBox2 = new THREE.Box3().setFromObject(wTmpl);
      const wCenter = new THREE.Vector3();
      wBox2.getCenter(wCenter);
      templatesRef.current[key.toUpperCase()] = { mesh: wTmpl, offsetX: wCenter.x, offsetZ: wCenter.z, yOffset: -wBox2.min.y + 0.06 };

      // Black variant — face +Z (towards white at row 7)
      const bTmpl = gltfScene.clone(true);
      if (useOriginal) enhanceMaterial(bTmpl, false); else applyMaterial(bTmpl, BLACK_PIECE, false);
      bTmpl.rotation.y = bRotY;
      const bBox = new THREE.Box3().setFromObject(bTmpl);
      const bSize = new THREE.Vector3();
      bBox.getSize(bSize);
      bTmpl.scale.setScalar(0.75 / Math.max(bSize.x, bSize.y, bSize.z));
      const bBox2 = new THREE.Box3().setFromObject(bTmpl);
      const bCenter = new THREE.Vector3();
      bBox2.getCenter(bCenter);
      templatesRef.current[key.toLowerCase()] = { mesh: bTmpl, offsetX: bCenter.x, offsetZ: bCenter.z, yOffset: -bBox2.min.y + 0.06 };
    };

    Promise.all(keys.map(key =>
      new Promise((resolve, reject) => {
        loader.load(urlSet[key], (gltf) => resolve({ key, scene: gltf.scene }), undefined, reject);
      })
    )).then(results => {
      if (cancelled) return;
      for (const { key, scene } of results) {
        processTemplate(scene, key);
      }
      modelsReadyRef.current = true;
      rebuildPiecesRef.current && rebuildPiecesRef.current();
    }).catch(err => {
      console.error('Failed to load GLB models:', err);
    });

    return () => {
      cancelled = true;
      dracoLoader.dispose();
    };
  }, []);

  // Rebuild pieces when board changes — clones pre-built templates, no material/bbox work per move
  useEffect(() => {
    const rebuild = () => {
      const scene = sceneRef.current;
      if (!scene || !modelsReadyRef.current) return;

      pieceMeshesRef.current.forEach(p => scene.remove(p));
      pieceMeshesRef.current = [];

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (!piece) continue;
          const tmpl = templatesRef.current[piece];
          if (!tmpl) continue;
          const clone = tmpl.mesh.clone(true);
          clone.position.set(c - tmpl.offsetX, tmpl.yOffset, r - tmpl.offsetZ);
          scene.add(clone);
          pieceMeshesRef.current.push(clone);
        }
      }
    };

    rebuildPiecesRef.current = rebuild;
    rebuild();
  }, [board]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}