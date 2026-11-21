# Design System — fable-5 reel

Anthropic brand language for the "Fable 5 is the new #1" launch reel.
Warm paper, dark slate, one confident coral. Editorial, considered, expensive-looking —
the visual equivalent of a hardcover book about software.

## Palette (Anthropic)

| Token          | Hex       | Use                                                        |
| -------------- | --------- | ---------------------------------------------------------- |
| `ivory`        | `#FAF9F5` | Ivory light — primary light canvas                         |
| `ivory-deep`   | `#F0EEE6` | Ivory medium — card surfaces, secondary panels             |
| `slate`        | `#141413` | Slate dark — primary text on ivory, dark scene canvas      |
| `slate-mid`    | `#3D3D3A` | Secondary structural dark                                  |
| `text-muted`   | `#5E5D59` | Muted slate — supporting text, eyebrows on ivory           |
| `text-soft`    | `#87867F` | Anthropic gray — metadata, fine print (large sizes only)   |
| `coral`        | `#D97757` | Claude coral — THE accent. Fills, bars, glow, accents on slate |
| `crail`        | `#C15F3C` | Crail — accent TEXT on ivory (Anthropic link color; passes contrast) |
| `book-cloth`   | `#CC785C` | Book cloth — deeper coral for fills and flash frames       |
| `kraft`        | `#D4A27F` | Kraft — secondary warm accent, competitor bars, dividers   |
| `manilla`      | `#EBDBBC` | Manilla — soft warm wash, chips on slate                   |
| `ivory-onyx`   | `#FAF9F5` | Text color on slate scenes                                 |

**Use rules:**

- Two canvases: `ivory` (default) and `slate` (punch/twist frames). Alternate them
  for percussive rhythm — slate frames are the drumbeats.
- `coral` is the only loud color. It marks Fable 5 and nothing else.
  Competitors get `kraft` / neutrals. This is a deliberate narrative device.
- Never pure black `#000` or pure white `#FFF`.
- No blues, greens, or any cool digital color. The whole reel lives in warm paper tones.

## Typography

| Role        | Font                                  | Weight  | Size guidance          |
| ----------- | ------------------------------------- | ------- | ---------------------- |
| Display     | `Source Serif 4` (Tiempos stand-in)   | 560–700 | 96–200px at 1080×1920  |
| Emphasis    | `Source Serif 4` italic               | 480–560 | inline within display  |
| Body / UI   | `Archivo` (Styrene stand-in)          | 400–700 | 36–60px                |
| Eyebrow     | `Space Mono`                          | 400/700 | 26–34px, tracked +0.25em, uppercase |
| Data / mono | `Space Mono`                          | 400/700 | 24–40px, tabular by nature |

- Serif display does the talking; Archivo handles labels and chips; Space Mono carries
  data, eyebrows, and source credits.
- Display letter-spacing `-0.03em`. Avoid all-caps serif display.
- Fonts: `fonts/source-serif-4-*.woff2` + `fonts/archivo-*.woff2` (variable, latin),
  declared in `lib/theme.css`. Space Mono is compiler-embedded.

## Corners

Anthropic is softly rectangular — calm, bookish, not pill-shaped.

- Cards / panels: `border-radius: 16px`
- Chips: `border-radius: 10px`
- Bars (chart): `border-radius: 10px 10px 4px 4px`
- Never fully sharp `0`, never pill buttons for content.

## Spacing

Generous paper margins. Outer scene padding = Instagram safe zone
(`--safe-top: 280px`, `--safe-bottom: 420px`, `--safe-left: 100px`, `--safe-right: 180px`
in `lib/theme.css`). Block gap 40–72px, tight gap 16–24px.

## Depth

Flat warm paper with subtle weight.

- Soft shadow for floating cards: `0 12px 40px rgba(20, 20, 19, 0.10)`
- Hairlines: `1px solid rgba(20, 20, 19, 0.14)` on ivory, `1px solid rgba(250, 249, 245, 0.18)` on slate
- A localized coral glow is allowed ONLY behind the Fable hero bar and the Fable price card
  (`box-shadow: 0 0 80px rgba(217, 119, 87, 0.35)`); nothing else glows.
- Forbidden: neon, electric shadows, glassmorphism.

## Motion

- Entrances: `power3.out`, `expo.out`, `power4.out` for slams. Crossfades `power2.inOut`.
- Bars/counters: `power2.inOut` rise + count-up, then a hold. Let the 91 breathe.
- Durations: slams 0.3–0.45s, standard entrances 0.5–0.8s, chart rise 1.2–1.6s.
- First tween of every scene offset 0.15–0.3s.
- ≥3 distinct eases per scene. `back.out` allowed ONLY for the spark motif pop.

## Recurring motifs

- **The spark** — an 8-ray asterisk burst (Claude's starburst energy), coral, used as
  ghost background ornament and CTA mark. Slow continuous rotation when ambient.
- **Rank/`#1` numerals** in Space Mono.
- Hairline horizontal rules drawing in (`scaleX 0→1`) under headlines.

## What NOT to do

- ❌ Pure black / pure white
- ❌ Cool colors (blues, greens, purples) anywhere
- ❌ Coral on anything that isn't Fable 5
- ❌ Default web sans (Roboto/Helvetica) — Archivo and Space Mono only for non-serif
- ❌ Pie charts, gridlines, legends, multi-axis anything
- ❌ More than 3 stats in the whole reel: 91/63/62, $10/$50, months→day
- ❌ Bouncy `elastic` eases; `back.out` only on the spark
- ❌ Animating opacity to 0 before a segment ends (HF hard-cut IS the exit), except final scene
