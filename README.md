# Brainrot Info

A fast, dark-themed reference app for the Roblox game **Rotted**. Look up brainrot stats, plan your rebirth strategy, and calculate your income per second.

Live at **[brainrot-info.com](https://brainrot-info.com)**

---

## Features

- **Rebirth Guide** — all 18 rebirth tiers with required cash, required brainrots (colour-coded by rarity), and the bonus each tier grants. Click any brainrot tag to jump straight to its entry.
- **Calculator** — pick a brainrot, choose a mutation, and select any traits to see your exact income per second. Mutation and trait tiles show their colour and glow when selected.
- **Brainrots** — searchable list of all 251 brainrots with rarity, cost, and production stats. Shows artwork for any brainrot that has an image asset.

---

## Tech Stack

| | |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| Build tool | [Vite 5](https://vitejs.dev/) |
| Routing | Hash-based (`#rebirth`, `#calculator`, `#brainrots?q=…`) |
| Styling | Vanilla CSS with custom properties — no UI framework |
| Hosting | GitHub Pages via GitHub Actions |

---

## Project Structure

```
public/
  brainrots.json    # 251 brainrot entries (name, rarity, price, produces, asset)
  rebirth.json      # 18 rebirth tiers
  types.json        # 20 mutation types with multipliers and colours
  traits.json       # 11 traits with multipliers and colours
  CNAME             # Custom domain for GitHub Pages
  _headers          # HTTP security headers (Netlify / Cloudflare Pages)

src/
  App.vue                        # Root — hash routing, parallel data fetch
  components/
    Sidebar.vue                  # CSS-only collapsible navigation
    RebirthCard.vue              # Single rebirth tier card
    BrainrotCard.vue             # Single brainrot listing card
    BrainrotPortraitCard.vue     # Selected brainrot placard in the calculator
    BrainrotPickerModal.vue      # Searchable brainrot picker modal
    Calculator.vue               # Income calculator page
  utils/
    formatCash.js                # Dollar formatter (K / M / B / T / Qa / Qi)
    brainrotImage.js             # Vite glob image resolver
  assets/                        # Brainrot PNG images (drop <asset-name>.png here)
  style.css                      # All global styles and CSS variables
```

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

## Deployment

Pushes to `main` trigger the GitHub Actions workflow at `.github/workflows/deploy.yml`, which builds the project and deploys `dist/` to GitHub Pages.

For the custom domain, add these DNS records at your registrar:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `YOUR_USERNAME.github.io` |

---

## Security

- Content-Security-Policy meta tag blocks inline scripts and external resources.
- `public/_headers` ships equivalent headers for Netlify / Cloudflare Pages.
- Hash routing is parsed with a `VALID_PAGES` allowlist — unknown routes fall back to the Rebirth page.
- All `fetch` calls check `response.ok` before parsing JSON.
