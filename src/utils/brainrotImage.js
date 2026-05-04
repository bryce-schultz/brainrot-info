// Vite resolves all matching PNGs at build time and emits them with content-hash
// filenames for long-lived caching. { eager: true } inlines the map into the bundle
// (no dynamic import overhead at runtime); { query: '?url', import: 'default' }
// gives us the final URL string rather than a module object.
const imageModules = import.meta.glob('/src/assets/*.png', { eager: true, query: '?url', import: 'default' });

// Returns the hashed asset URL for a brainrot's image, or null if no PNG exists yet.
export const getBrainrotImage = (asset) => {
  if (!asset) return null;
  const key = `/src/assets/${asset}.png`;
  return imageModules[key] ?? null;
};
