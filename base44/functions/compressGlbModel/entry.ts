import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { NodeIO } from 'npm:@gltf-transform/core@4.1.3';
import { KHRDracoMeshCompression } from 'npm:@gltf-transform/extensions@4.1.3';
import { draco, dedup, prune, simplify } from 'npm:@gltf-transform/functions@4.1.3';

const ORIGINAL_URLS = {
  p: 'https://base44.app/api/apps/69ab30c24c8c7db2b8432adf/files/mp/public/69ab30c24c8c7db2b8432adf/ae686f474_PawnThreeD.glb',
  r: 'https://base44.app/api/apps/69ab30c24c8c7db2b8432adf/files/mp/public/69ab30c24c8c7db2b8432adf/3173ccad6_RookThreeD.glb',
  n: 'https://base44.app/api/apps/69ab30c24c8c7db2b8432adf/files/mp/public/69ab30c24c8c7db2b8432adf/6c1050bde_KnightThreeD.glb',
  b: 'https://base44.app/api/apps/69ab30c24c8c7db2b8432adf/files/mp/public/69ab30c24c8c7db2b8432adf/ae1ab8cab_BishopThreeD.glb',
  q: 'https://base44.app/api/apps/69ab30c24c8c7db2b8432adf/files/mp/public/69ab30c24c8c7db2b8432adf/eedb484e3_QueenThreeD.glb',
  k: 'https://base44.app/api/apps/69ab30c24c8c7db2b8432adf/files/mp/public/69ab30c24c8c7db2b8432adf/1f88a60cd_KingThreeD.glb',
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { piece_type } = body;
    const url = ORIGINAL_URLS[piece_type];
    if (!url) return Response.json({ error: 'Invalid piece_type. Use p, r, n, b, q, or k' }, { status: 400 });

    // Download original GLB
    const response = await fetch(url);
    if (!response.ok) return Response.json({ error: `Failed to download: ${response.status}` }, { status: 500 });
    const originalBuffer = new Uint8Array(await response.arrayBuffer());
    const originalSize = originalBuffer.byteLength;

    // Set up gltf-transform with Draco extension
    const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]);

    // Read GLB into document
    const doc = await io.readBinary(originalBuffer);

    // Transform: simplify meshes (reduce 125K vertices → ~8K), dedup, prune unused, then Draco compress
    await doc.transform(
      simplify({ ratio: 0.1, error: 0.01 }),
      dedup(),
      prune(),
      draco({
        encodeSpeed: 5,
        quantizePosition: 14,
        quantizeNormal: 10,
        quantizeColor: 8,
        quantizeTexcoord: 12,
        quantizeGeneric: 12,
      })
    );

    // Write compressed GLB
    const compressedBuffer = await io.writeBinary(doc);
    const compressedSize = compressedBuffer.byteLength;

    // Upload compressed version to Base44 storage
    const base44 = createClientFromRequest(req);
    const blob = new Blob([compressedBuffer], { type: 'model/gltf-binary' });
    const file = new File([blob], `${piece_type}_draco.glb`, { type: 'model/gltf-binary' });
    const result = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    return Response.json({
      piece_type,
      original_size_kb: Math.round(originalSize / 1024),
      compressed_size_kb: Math.round(compressedSize / 1024),
      reduction_pct: ((1 - compressedSize / originalSize) * 100).toFixed(1),
      url: result.file_url,
    });
  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});