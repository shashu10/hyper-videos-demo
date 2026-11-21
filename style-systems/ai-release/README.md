# AI Release style system

This system owns the dark, data-led visual language for AI reels.

- `design.md` — compact visual contract read by HyperFrames agents.
- `frame.md` — extended scene grammar, motion presets, and element catalog.
- `lib/` — reusable theme and deterministic GSAP helpers.
- `fonts/` and `assets/` — render-safe system assets.
- `gallery/` — runnable reference project for the available frame templates.

Preview the gallery from the repository root:

```bash
npm run dev -- @ai-release
```

New projects receive a snapshot of this system so later style changes do not
silently alter old renders.
