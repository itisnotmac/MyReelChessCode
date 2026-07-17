// High-detail (uncompressed) GLB models for the cinematic welcome-screen hero.
// Uploaded by the builder. The hero preserves each model's own materials and
// lights it with a teal rim, so texture / sculpted detail is kept (unlike the
// Draco-compressed in-game pieces). Add a URL as each piece is uploaded; null
// entries are skipped.
export const HERO_PIECE_URLS = {
  b: 'https://media.base44.com/files/public/69ab30c24c8c7db2b8432adf/41605d60e_BishopThreeD.glb',
  k: 'https://media.base44.com/files/public/69ab30c24c8c7db2b8432adf/a8f90524c_KingThreeD.glb',
  q: 'https://media.base44.com/files/public/69ab30c24c8c7db2b8432adf/87dce560d_QueenThreeD.glb',
  n: 'https://media.base44.com/files/public/69ab30c24c8c7db2b8432adf/e595a24e9_KnightThreeD.glb',
  r: 'https://media.base44.com/files/public/69ab30c24c8c7db2b8432adf/14eeda496_RookThreeD.glb',
  p: 'https://media.base44.com/files/public/69ab30c24c8c7db2b8432adf/169e2a1e0_PawnThreeD.glb',
};

// Display order for the rotating lineup (left -> right).
export const HERO_PIECE_ORDER = ['k', 'q', 'b', 'n', 'r', 'p'];