import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Vite plugin that merges multiple JSON source files into a single minified
 * JSON asset served at `/${output}`.
 *
 * In dev mode  → a middleware intercepts the request and returns the merged
 *                 JSON on every request, so edits to source files are picked
 *                 up immediately on the next page reload.
 * In build mode → the merged, minified JSON is emitted as a static asset.
 *
 * @param {{ sources: Record<string, string>, output?: string }} options
 *   sources – map of JSON key → path relative to project root
 *   output  – output filename (default: 'data.json')
 */
export function combineJsonPlugin({ sources, output = 'data.json' }) {
  const buildJson = () => {
    const result = {};
    for (const [key, filePath] of Object.entries(sources)) {
      result[key] = JSON.parse(readFileSync(resolve(process.cwd(), filePath), 'utf-8'));
    }
    return JSON.stringify(result); // minified — no extra whitespace
  };

  return {
    name: 'combine-json',

    // Serve merged JSON in the Vite dev server.
    // Registered before Vite's own static-file middleware so it takes priority.
    configureServer(server) {
      server.middlewares.use(`/${output}`, (req, res, next) => {
        if (req.method !== 'GET') return next();
        try {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(buildJson());
        } catch (err) {
          next(err);
        }
      });
    },

    // Emit the minified combined file into the build output.
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: output,
        source: buildJson(),
      });
    },
  };
}
