# Brainrot Info

A fast, dark-themed reference app for the Fortnite game **Steal the Brainrot** (not to be confused with the Roblox game "Steal a Brainrot"). Look up brainrot stats, plan your rebirth strategy, and calculate your income per second.

Live at **[brainrot-info.com](https://brainrot-info.com)**

---

## Features

- **Rebirth Guide** — all 18 rebirth tiers with required cash, required brainrots (colour-coded by rarity), and the bonus each tier grants. Click any brainrot tag to jump straight to its entry.
- **Calculator** — pick a brainrot, choose a mutation, and select any traits to see your exact income per second. Mutation and trait tiles show their colour and glow when selected.
- **Brainrots** — searchable list of all 251 brainrots with rarity, cost, and production stats. Shows artwork for any brainrot that has an image asset.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build → dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## Adding Brainrot Images

1. Export the image as a PNG named after the brainrot's `asset` field in `brainrots.json` (e.g. `fishini-bossini.png`).
2. Drop it into `src/assets/`.

Vite picks it up automatically via `import.meta.glob` — no code changes needed.

---

## Custom Artwork — Coming Soon

Original artwork for the brainrots is being created by **Andres D.** and will be added to the site over time. Art will be released in batches covering a few brainrots at a time, so expect new illustrations to appear gradually.