import * as THREE from 'three';

function makeLathe(profile, segments = 32) {
  const points = profile.map(([x, y]) => new THREE.Vector2(Math.max(0.001, x), y));
  return new THREE.LatheGeometry(points, segments);
}

function meshify(geo) {
  const mesh = new THREE.Mesh(geo);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// All pieces: base at Y=0, centered on X/Z. Designed to be scaled to ~0.75 tall.

function createPawn() {
  return meshify(makeLathe([
    [0.00, 0.00], [0.26, 0.00], [0.26, 0.03], [0.22, 0.05],
    [0.17, 0.08], [0.13, 0.12], [0.12, 0.18], [0.14, 0.22],
    [0.10, 0.30], [0.12, 0.34], [0.17, 0.40], [0.19, 0.44],
    [0.16, 0.48], [0.08, 0.50], [0.00, 0.50],
  ]));
}

function createRook() {
  const group = new THREE.Group();
  group.add(meshify(makeLathe([
    [0.00, 0.00], [0.30, 0.00], [0.30, 0.03], [0.25, 0.06],
    [0.22, 0.09], [0.20, 0.12], [0.19, 0.40], [0.21, 0.44],
    [0.27, 0.48], [0.27, 0.54], [0.00, 0.54],
  ])));
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + Math.PI / 4;
    const batt = meshify(new THREE.BoxGeometry(0.08, 0.06, 0.08));
    batt.position.set(Math.cos(angle) * 0.22, 0.57, Math.sin(angle) * 0.22);
    group.add(batt);
  }
  return group;
}

function createBishop() {
  return meshify(makeLathe([
    [0.00, 0.00], [0.26, 0.00], [0.26, 0.03], [0.22, 0.05],
    [0.18, 0.08], [0.14, 0.12], [0.11, 0.24], [0.08, 0.36],
    [0.10, 0.40], [0.14, 0.44], [0.16, 0.48], [0.13, 0.52],
    [0.08, 0.54], [0.00, 0.54],
  ]));
}

function createQueen() {
  return meshify(makeLathe([
    [0.00, 0.00], [0.30, 0.00], [0.30, 0.03], [0.25, 0.06],
    [0.21, 0.09], [0.17, 0.13], [0.13, 0.30], [0.11, 0.44],
    [0.15, 0.50], [0.19, 0.56], [0.16, 0.60], [0.09, 0.62],
    [0.00, 0.62],
  ]));
}

function createKing() {
  const group = new THREE.Group();
  group.add(meshify(makeLathe([
    [0.00, 0.00], [0.30, 0.00], [0.30, 0.03], [0.25, 0.06],
    [0.21, 0.09], [0.17, 0.13], [0.13, 0.30], [0.11, 0.44],
    [0.15, 0.50], [0.19, 0.56], [0.16, 0.60], [0.09, 0.62],
    [0.05, 0.62], [0.00, 0.62],
  ])));
  const vert = meshify(new THREE.BoxGeometry(0.04, 0.10, 0.04));
  vert.position.set(0, 0.67, 0);
  const horiz = meshify(new THREE.BoxGeometry(0.08, 0.04, 0.04));
  horiz.position.set(0, 0.66, 0);
  group.add(vert, horiz);
  return group;
}

function createKnight() {
  const group = new THREE.Group();
  group.add(meshify(makeLathe([
    [0.00, 0.00], [0.26, 0.00], [0.26, 0.03], [0.22, 0.05],
    [0.18, 0.08], [0.16, 0.12], [0.00, 0.12],
  ])));
  const neck = meshify(new THREE.CylinderGeometry(0.09, 0.13, 0.26, 16));
  neck.position.set(0, 0.25, 0.02);
  neck.rotation.z = -0.25;
  group.add(neck);
  const head = meshify(new THREE.BoxGeometry(0.13, 0.11, 0.20));
  head.position.set(0, 0.39, 0.09);
  head.rotation.x = 0.25;
  group.add(head);
  const snout = meshify(new THREE.BoxGeometry(0.09, 0.07, 0.09));
  snout.position.set(0, 0.35, 0.19);
  snout.rotation.x = 0.45;
  group.add(snout);
  const earGeo = new THREE.ConeGeometry(0.035, 0.07, 8);
  for (const x of [-0.04, 0.04]) {
    const ear = meshify(earGeo);
    ear.position.set(x, 0.46, 0.05);
    group.add(ear);
  }
  return group;
}

const FACTORIES = { p: createPawn, r: createRook, n: createKnight, b: createBishop, q: createQueen, k: createKing };

export function createPiece(type) {
  const f = FACTORIES[type.toLowerCase()];
  return f ? f() : null;
}