import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SQUARE_SIZE = 1;
const BOARD_SIZE = 8;

// Colors
const LIGHT_SQUARE = new THREE.Color(0xc8a96e);
const DARK_SQUARE = new THREE.Color(0x4a2e1a);
const BOARD_BORDER = new THREE.Color(0x2a1a0a);
const WHITE_PIECE = new THREE.Color(0xd4af37);   // gold/bronze
const BLACK_PIECE = new THREE.Color(0x1a1a2e);   // dark iron
const SELECTED_COLOR = new THREE.Color(0xffff00);
const LEGAL_COLOR = new THREE.Color(0x00ff88);
const LAST_MOVE_COLOR = new THREE.Color(0xffa500);
const CHECK_COLOR = new THREE.Color(0xff2200);

function createMaterial(color, emissive = 0x000000, roughness = 0.4, metalness = 0.8) {
  return new THREE.MeshStandardMaterial({ color, emissive, roughness, metalness });
}

// ---------- piece geometry builders ----------

function buildPawn(color) {
  const group = new THREE.Group();
  const mat = createMaterial(color === 'white' ? WHITE_PIECE : BLACK_PIECE, 0x111111);

  // Base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.08, 16), mat);
  base.position.y = 0.04;
  group.add(base);

  // Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.28, 12), mat);
  stem.position.y = 0.22;
  group.add(stem);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), mat);
  head.position.y = 0.52;
  group.add(head);

  return group;
}

function buildRook(color) {
  const group = new THREE.Group();
  const mat = createMaterial(color === 'white' ? WHITE_PIECE : BLACK_PIECE, 0x111111);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 16), mat);
  base.position.y = 0.04;
  group.add(base);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.36, 12), mat);
  stem.position.y = 0.26;
  group.add(stem);

  // Tower body
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.22, 12), mat);
  tower.position.y = 0.55;
  group.add(tower);

  // Battlements (3 blocks on top)
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.1), mat);
    merlon.position.set(Math.cos(angle) * 0.16, 0.74, Math.sin(angle) * 0.16);
    group.add(merlon);
  }

  return group;
}

function buildKnight(color) {
  const group = new THREE.Group();
  const mat = createMaterial(color === 'white' ? WHITE_PIECE : BLACK_PIECE, 0x111111);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.08, 16), mat);
  base.position.y = 0.04;
  group.add(base);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.32, 10), mat);
  neck.position.y = 0.24;
  group.add(neck);

  // Horse head approximation — elongated box tilted forward
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.36), mat);
  head.position.set(0, 0.54, 0.08);
  head.rotation.x = -0.25;
  group.add(head);

  // Snout
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.2), mat);
  snout.position.set(0, 0.44, 0.26);
  group.add(snout);

  return group;
}

function buildBishop(color) {
  const group = new THREE.Group();
  const mat = createMaterial(color === 'white' ? WHITE_PIECE : BLACK_PIECE, 0x111111);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.08, 16), mat);
  base.position.y = 0.04;
  group.add(base);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 0.4, 12), mat);
  stem.position.y = 0.28;
  group.add(stem);

  // Collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.08, 12), mat);
  collar.position.y = 0.52;
  group.add(collar);

  // Tapered body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 0.3, 12), mat);
  body.position.y = 0.71;
  group.add(body);

  // Ball tip
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), mat);
  ball.position.y = 0.9;
  group.add(ball);

  // Point
  const point = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 8), mat);
  point.position.y = 1.04;
  group.add(point);

  return group;
}

function buildQueen(color) {
  const group = new THREE.Group();
  const mat = createMaterial(color === 'white' ? WHITE_PIECE : BLACK_PIECE, 0x111111);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 16), mat);
  base.position.y = 0.04;
  group.add(base);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.42, 14), mat);
  stem.position.y = 0.29;
  group.add(stem);

  // Waist ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 20), mat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.52;
  group.add(ring);

  // Upper body
  const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.28, 14), mat);
  upper.position.y = 0.7;
  group.add(upper);

  // Crown with 5 points
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 6), mat);
    point.position.set(Math.cos(angle) * 0.15, 0.97, Math.sin(angle) * 0.15);
    group.add(point);
  }

  // Crown ball center
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), mat);
  ball.position.y = 0.88;
  group.add(ball);

  return group;
}

function buildKing(color) {
  const group = new THREE.Group();
  const mat = createMaterial(color === 'white' ? WHITE_PIECE : BLACK_PIECE, 0x111111);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.08, 16), mat);
  base.position.y = 0.04;
  group.add(base);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 0.46, 14), mat);
  stem.position.y = 0.31;
  group.add(stem);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 8, 20), mat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.56;
  group.add(ring);

  const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.3, 14), mat);
  upper.position.y = 0.75;
  group.add(upper);

  // Cross top
  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.28, 0.07), mat);
  crossV.position.y = 1.01;
  group.add(crossV);

  const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.07), mat);
  crossH.position.y = 1.08;
  group.add(crossH);

  return group;
}

const PIECE_BUILDERS = {
  p: buildPawn, P: buildPawn,
  r: buildRook, R: buildRook,
  n: buildKnight, N: buildKnight,
  b: buildBishop, B: buildBishop,
  q: buildQueen, Q: buildQueen,
  k: buildKing, K: buildKing,
};

// ---------- main component ----------

export default function ChessBoard3D({ board, selectedSquare, legalMoves, onSquareClick, lastMove, checkSquare }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const squareMeshesRef = useRef([]);
  const pieceMeshesRef = useRef([]);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const orbitRef = useRef({ theta: Math.PI / 6, phi: Math.PI / 3.2, radius: 11 });

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff5e0, 1.6);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
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
      const { theta, phi, radius } = orbitRef.current;
      const cx = (BOARD_SIZE - 1) / 2;
      const cz = (BOARD_SIZE - 1) / 2;
      camera.position.set(
        cx + radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        cz + radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(cx, 0, cz);
      renderer.render(scene, camera);
    };
    animate();

    // Click detection
    const raycaster = new THREE.Raycaster();
    const handleClick = (e) => {
      if (isDragging.current) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);
      const flat = squareMeshesRef.current.flat();
      const intersects = raycaster.intersectObjects(flat);
      if (intersects.length > 0) {
        const { row, col } = intersects[0].object.userData;
        onSquareClick(row, col);
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
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) isDragging.current = true;
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
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging.current = true;
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

    const onWheel = (e) => {
      orbitRef.current.radius = Math.max(6, Math.min(18, orbitRef.current.radius + e.deltaY * 0.02));
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

  // Rebuild pieces when board changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old pieces
    pieceMeshesRef.current.forEach(p => scene.remove(p));
    pieceMeshesRef.current = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const builder = PIECE_BUILDERS[piece];
        if (!builder) continue;
        const color = piece === piece.toUpperCase() ? 'white' : 'black';
        const group = builder(color);

        // Scale and position
        group.scale.setScalar(0.72);
        group.position.set(c, 0.06, r);

        group.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(group);
        pieceMeshesRef.current.push(group);
      }
    }
  }, [board]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}