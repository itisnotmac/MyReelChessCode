// Asset IDs only: keep retired photos out of profiles without retaining their
// names or image URLs. Custom uploads and the built-in presets remain valid.
const RETIRED_AVATAR_ASSET_IDS = new Set([
  '02c16919b', '326238419', '71489e4cc', 'ff6f1a039', 'ffd2fbc25',
  'a9ef79a15', '8984503ad', '1d0e42eac', '849ec4fc8',
]);

export const DEFAULT_AVATAR = 'preset:♔';

export function normalizeAvatarUrl(value) {
  if (typeof value !== 'string' || !value) return DEFAULT_AVATAR;
  try {
    const url = new URL(value);
    const file = url.pathname.split('/').pop();
    if (url.hostname === 'media.base44.com'
      && url.pathname.startsWith('/images/public/69ab30c24c8c7db2b8432adf/')
      && RETIRED_AVATAR_ASSET_IDS.has(file.split('_')[0])) {
      return DEFAULT_AVATAR;
    }
  } catch {
    // Preset identifiers are also valid avatar values.
  }
  return value;
}
