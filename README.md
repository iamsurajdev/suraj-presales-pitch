# Suraj Biswas · Enterprise pitch

A Slidev deck built as a cold-outreach pitch for Series A/B SaaS founders and CTOs.

```bash
npm install
npm run dev     # http://localhost:3030
npm run build   # static site in dist/ (deployed by Vercel via vercel.json)
```

## Structure

| Path | What it is |
| --- | --- |
| `slides.md` | The deck: 9 slides, all content and per-slide styles |
| `layouts/pitch.vue` | Base layout: grid + glow background, section kicker. Frontmatter props: `kicker`, `index`, `accent`, `center`, `orbs` |
| `global-top.vue` | On every slide: light/dark toggle, navigation dock (arrow keycaps, counter, first-slide hint), progress bar, scroll/trackpad navigation |
| `style.css` | Design tokens for light and dark, glass surfaces, buttons, entrance animations |
| `uno.config.ts` | Theme-aware colour utilities (`text-ink`, `text-muted`, `bg-surface`, `text-accent`, …) |
| `components/` | Timeline, timezone chart, count-up stats, tech visuals, avatar |

## Photos

Two optional images replace illustrated fallbacks when present:

- `public/suraj.jpg`: square portrait, used on the cover card (falls back to an "SB" monogram)
- `public/singapore.jpg`: the on-site Singapore photo on slide 7 (falls back to an illustrated Marina Bay skyline)
