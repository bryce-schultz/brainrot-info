// Vite resolves all matching PNGs at build time and emits them with content-hash
// filenames for long-lived caching. { eager: true } inlines the map into the bundle
// (no dynamic import overhead at runtime); { query: '?url', import: 'default' }
// gives us the final URL string rather than a module object.
//
// vite-imagetools generates resized WebP variants at build time for the thumb
// (128 px) and medium (256 px) sizes. Full-size (512 px original PNG) is the
// fallback. The browser never downloads a larger image than necessary.
const fullModules   = import.meta.glob('/src/assets/*.png', { eager: true, query: '?url', import: 'default' });
const thumbModules  = import.meta.glob('/src/assets/*.png', { eager: true, query: { w: 128, format: 'webp' }, import: 'default' });
const mediumModules = import.meta.glob('/src/assets/*.png', { eager: true, query: { w: 256, format: 'webp' }, import: 'default' });

// Derives the asset filename from a brainrot's display name.
// e.g. "Los Tung TungCitos" → "los-tung-tungcitos"
const nameToKey = (name) => `/src/assets/${name.toLowerCase().replace(/ /g, '-')}.png`;

/**
 * Returns the image URL for a brainrot at the requested size.
 * @param {string} name - The brainrot's display name.
 * @param {'sm'|'md'|'full'} size - 'sm' = 128px WebP, 'md' = 256px WebP, 'full' = original PNG.
 */
export const getBrainrotImage = (name, size = 'full') => {
  if (!name) return null;
  const key = nameToKey(name);
  if (size === 'sm')  return thumbModules[key]  ?? fullModules[key] ?? null;
  if (size === 'md')  return mediumModules[key] ?? fullModules[key] ?? null;
  return fullModules[key] ?? null;
};
