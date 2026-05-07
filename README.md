# Brainrot Info

A fast, dark-themed reference app for the Fortnite game **Steal the Brainrot** (not to be confused with the Roblox game "Steal a Brainrot"). Look up brainrot stats, plan your rebirth strategy, calculate your income per second, and simulate the Eternal Machine.

Live at **[brainrot-info.com](https://brainrot-info.com)**

---

## Custom Artwork

The original artwork for the brainrots is created by **Andres D.** As more images become available, they will be added to the app.

---

## Features

- **Rebirth Guide** — all 18 rebirth tiers with required cash, required brainrots (colour-coded by rarity), and the bonus each tier grants. Click any brainrot tag to jump straight to its entry.
- **Calculator** — pick a brainrot, choose a mutation, and select any traits to see your exact income per second. Mutation and trait tiles show their colour and glow when selected.
- **Brainrots** — searchable list of all brainrots with rarity, cost, and production stats. Shows artwork for any brainrot that has an image asset.
- **Eternal Machine** — simulate the machine's merge logic using the same probability weights the game uses. Results give a sense of output frequency and rarity distribution; they are not a guarantee of any particular in-game outcome.

---

## Getting Started

### Dependencies
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build → dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## Adding Brainrot Images

1. Export the image as a PNG named after the brainrot's display name, lowercased with spaces replaced by hyphens (e.g. `fishini-bossini.png` for `"Fishini Bossini"`).
2. Drop it into `src/assets/`.

The asset filename is derived automatically from the brainrot's `name` field in `data.json` — no code changes needed. Vite picks it up via `import.meta.glob` at build time.

---