# Design System — AI Release

The default visual identity for AI model releases, benchmarks, comparisons,
architecture explainers, market numbers, and Gen AI Meetup reels.

`frame.md` contains the extended scene grammar and template catalog. This file
is the compact visual contract HyperFrames agents must follow.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#0B0B0D` | Matte near-black canvas |
| `bg-panel` | `#141418` | Primary tiles and panels |
| `bg-panel-2` | `#1C1C22` | Nested surfaces |
| `ink` | `#F4EEE2` | Primary warm text |
| `ink-dim` | `#A7A29A` | Supporting text and labels |
| `ink-faint` | `#6B6760` | Metadata and axes |
| `accent` | `#D97757` | Hero, capital, and scale |
| `win` | `#4ADE80` | Winners and successful outcomes only |
| `alert` | `#EF4444` | Failures, bans, and warnings only |
| `entity-3` | `#5B8DEF` | Third comparison entity |
| `entity-4` | `#B07CF0` | Fourth comparison entity |
| `entity-5` | `#E0A93B` | Fifth comparison entity |

Never use pure black or pure white. Green and red always carry meaning; they
are not decoration. Use the faint 96px warm grid on full-frame dark scenes.

## Typography

| Role | Font | Guidance |
| --- | --- | --- |
| Display | `Anton` | Condensed headlines and hero numbers, 120–220px |
| UI | `Inter` | Titles, labels, body copy, 30–60px |
| Data | `JetBrains Mono` | Specs, ranks, values, source notes, 28–52px |

Fonts live in `fonts/` and must be copied into every reel. Use tabular numerals
for values and counters. Text must read clearly on a phone at arm's length.

## Layout

- Portrait canvas: 1080×1920.
- Use the upper frame for graphics when talking-head footage or captions occupy
  the bottom third: `120px 64px 640px` safe padding.
- Bento tiles use 20–24px corners, a subtle warm border, and dark lifted panels.
- One dominant data or diagram family per scene. Avoid dashboard soup.
- Kicker tags identify the beat: `MODEL RELEASE`, `BENCHMARK`, `THE MONEY`, etc.

## Motion

Engineering-grade and precise: assemble, count, draw, and lock into place.

- Default entrances: `power3.out`; draws: `power2.inOut`; emphasis: `expo.out`.
- Use tight 0.05–0.08s staggers and deterministic, seekable GSAP timelines.
- Small overshoot is reserved for a hero element or mascot. Never use elastic
  or general-purpose bounce.
- Multi-scene reels use transitions. The transition is the scene exit.
- The extended named presets are documented in `frame.md` and implemented in
  `lib/animations.js`.

## Recurring motifs

- Faint warm engineering grid.
- Large numbers and mono labels.
- Bento tiles for logos, people, and model families.
- Crimson robot mascot as a restrained edge-peek reaction, never the focus.
- Coral underline or sweep for the central claim.

## What not to do

- No light lifestyle aesthetic, paper collage, wellness imagery, or serif-led
  editorial layouts in this system.
- No unsourced comparisons, fabricated quotes, or benchmark dumps.
- No generic neon gradients, decorative red/green, tiny labels, or flat black
  scenes without the grid.
- No hard cuts between authored scenes and no pre-transition fade-outs.
