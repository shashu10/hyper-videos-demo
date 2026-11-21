# frame.md — GenAIMeetup Visual & Motion System (HyperFrames)

The shared brand + motion system for every Gen AI Meetup composition. It defines the look (palette, type, grid, mascot), the **named animation presets**, and the **modular element templates** for the things this channel actually shows: benchmarks, people, companies, model releases, architecture, capital, and export controls.

**Where it sits.** `style-systems/ai-release/frame.md` is the extended visual and motion grammar for AI reels. It pairs with **`design.md`**, the compact HyperFrames visual contract. **`style-systems/ai-release/gallery/`** is the living reference gallery—one sub-composition per element template—using the shared `lib/theme.css` and `lib/animations.js`. New AI reels receive snapshots of these files through `scripts/new-reel.sh`.

**Engine.** HyperFrames = HTML + CSS + seekable GSAP timelines → deterministic MP4. Every preset here is expressed as `class="clip"` elements with `data-start` / `data-duration` / `data-track-index`, animated on a single paused timeline registered at `window.__timelines[id]`. **Deterministic only:** no `Math.random`, no `Date.now`, no async timeline construction — same input, same frames.

---

## 1. Brand foundation

### Palette

```css
:root {
  /* surfaces */
  --bg:          #0B0B0D;                    /* matte near-black — root, never pure #000 */
  --bg-panel:    #141418;                    /* bento tile / lifted panel */
  --bg-panel-2:  #1C1C22;                    /* nested panel */
  --grid-line:   rgba(245, 238, 226, 0.05);  /* faint warm grid (signature) */
  --border:      rgba(245, 238, 226, 0.10);  /* tile borders */

  /* ink (warm, never pure white) */
  --ink:         #F4EEE2;                     /* primary display + body */
  --ink-dim:     #A7A29A;                     /* labels, secondary */
  --ink-faint:   #6B6760;                     /* axis ticks, footnotes */

  /* mascot */
  --bot:         #9E2B3F;                     /* body / the red "." accent */
  --bot-hi:      #C2425A;                     /* highlight */
  --bot-lo:      #5A1822;                     /* outline / deep shadow */
  --bot-eye:     #E0A93B;                     /* amber eyes (sparing highlight) */

  /* signal colors — one job each */
  --accent:      #D97757;                     /* coral: money, scale, hero curves */
  --win:         #4ADE80;                     /* green: success / winner / yes (== caption-active) */
  --alert:       #EF4444;                     /* red: fail / ban / no */

  /* entity palette — assign per model/company in comparisons, in order */
  --e1: #D97757; --e2: #4ADE80; --e3: #5B8DEF; --e4: #B07CF0; --e5: #E0A93B;
}
```

**Color discipline (non-negotiable):** green = win/yes, red = fail/ban/no, coral = capital/scale/the hero. Never use green or red decoratively — they always carry meaning. Backgrounds are the matte near-black + grid, never flat pure black, never a gradient wash.

### Typography

| Role | Token | Use |
| --- | --- | --- |
| Display | `--font-display` — heavy condensed grotesque (Anton / Archivo Black class) | The logo, hero numbers (`$1T`), big kickers |
| UI | `--font-ui` — Inter (800 for titles/labels, 400–600 for body) | Titles, labels, captions-as-graphics, data values |
| Mono | `--font-mono` — JetBrains Mono / IBM Plex Mono | Code, terminal, kicker tags, axis numbers, model specs |

```css
--font-display: "Anton", "Archivo Black", system-ui;
--font-ui:      "Inter", system-ui;
--font-mono:    "JetBrains Mono", "IBM Plex Mono", monospace;
```

Match these to the exact fonts in the logo/thumbnails and **embed them** (HyperFrames renders headless — no system-font fallback at render time). Ship local `.woff2` files under `fonts/` and declare `@font-face` in shared theme CSS — never Google Fonts CDN links. The signature red period (`Podcast.`) is `--bot-hi`; reuse it as a full-stop accent on hero lines.

### Short-form type scale (9:16 phone)

Graphics must read on a phone at arm's length. At **1080×1920**, use this scale (double at 4K). Reference: `style-systems/ai-release/lib/theme.css`.

| Token | Size | Use |
| --- | --- | --- |
| `--type-hero` | 220px | Stat hero number (`$965B`) |
| `--type-display-lg` | 156px | Cold-open title |
| `--type-display-md` | 120px | Scene headlines |
| `--type-title` | 56px | Bar labels, rank names |
| `--type-body` | 52px | Primary labels, quote body |
| `--type-body-sm` | 44px | Secondary copy, logo tiles |
| `--type-kicker` | 34px | Scene kickers (`THE MONEY`, `BENCHMARK`) |
| `--type-mono-lg` | 52px | Bar values, spec numbers |
| `--type-mono-sm` | 28px | Footnotes, metadata |

When in doubt, go larger — never below `--type-mono-sm` for anything the viewer must read.

### The grid (signature background)

A faint warm grid is the channel's wallpaper — present in the cover, banner, and thumbnails. Default cell ≈ 96px at 1080p (≈192px at 4K). It sits at the very back, behind a subtle center-out vignette so the edges fall off.

```css
.bg {
  background:
    radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%),
    repeating-linear-gradient(0deg,  var(--grid-line) 0 1px, transparent 1px 96px),
    repeating-linear-gradient(90deg, var(--grid-line) 0 1px, transparent 1px 96px),
    var(--bg);
}
```

**Cold-open draw (optional).** On the first beat of a full-graphic Short, the grid can assemble criss-cross before content lands: horizontal lines wipe **L→R**, vertical lines **T→B** (~0.12s stagger), then the vignette sits on top. Split into layered divs (`.bg__grid-h`, `.bg__grid-v`, `.bg__vignette`) and drive with the `grid-draw` preset. All other scenes use the static `.bg` above.

### The mascot

The crimson, amber-eyed robot is the brand's face. **Use the channel asset** — `assets/mascot.png` (full-body illustration), not CSS/SVG stand-ins. Rules:
- **Peeks from the right edge, cropped** — top-right in 16:9, upper-right or bottom-right in 9:16 (bottom-right is preferred when content is top-heavy). Never centered, never full-body-in-frame in-video (full body is for the cover/banner only).
- **Never covers data or text.** Mark the image `data-layout-allow-occlusion` when it overlaps the frame edge only. It frames the composition; it doesn't sit on it.
- **One per scene, and it reacts — it doesn't perform.** A small head-tilt on a punchline (`mascot-react`), nothing more. It's a deadpan engineer, not a cartoon host.
- **Blending and Transparency:** For files with black backing assets, use `mix-blend-mode: lighten` to seamlessly blend the dark pixels against the near-black (`#0B0B0D`) screen background. Opacity can be lowered (e.g., `0.5` / `50%`) to keep the large bottom-right mascot background-subtle.
- **Motion:** Standard `mascot-peek` (`x +120→0`, `rotate 5→0` from right edge) or custom bottom-right peek (`x +350, y +350 -> 0`, `rotate -10 -> -30` tilted left) + optional `mascot-react` relative to its resting angle.

### Bento tiles (the dashboard motif)

From the banner: rounded-rect tiles (`border-radius: 20px`, `1px solid var(--border)`, `background: var(--bg-panel)`) holding one thing each — a logo, a photo, a diagram, a snippet. This is the layout primitive for landscape, logo-wall, and multi-entity scenes.

---

## 2. Motion principles

The feel is **engineering-grade, not consumer-bouncy.** Data *assembles with precision* — it counts, draws, and snaps into place. It does not boing.

- Default easing `power3.out`; wipes/draws `power2.inOut`; emphatic reveals `expo.out`. A small `back.out(1.4)` overshoot is allowed **only** on the hero element and the mascot. **Never** `elastic`, never cartoon bounce.
- Color transitions tween `none` (instant on the beat), like the caption karaoke.
- One thing moves at a time, or a tight stagger (0.05–0.08s). Avoid five things animating at once.
- Timing scale: `--t-fast 0.35s` (labels), `--t-base 0.5s` (elements), `--t-slow 0.8s` (numbers), `--t-draw 1.2s` (curves/lines).
- Everything is **seekable** off the master timeline (GSAP `tl.from/fromTo` with explicit positions). No wall-clock animation.

---

## 3. Animation presets

Reusable, named. Build each as a labeled segment or a small helper on the master timeline.

| Preset | For | Motion | Dur / ease |
| --- | --- | --- | --- |
| `rise-in` | default element entrance | `opacity 0→1, y +40→0` | 0.5 / power3.out |
| `mask-wipe` | headlines, labels, bars reveal | `clip-path inset(0 100% 0 0 → 0)` L→R | 0.6 / power2.inOut |
| `tile-snap` | bento tiles, logo wall | `scale 0.92→1 + opacity`, stagger 0.06 | 0.4 / back.out(1.4) |
| `count-up` | any number (`$1T`, ctx window, price) | tween value 0→target, formatted (`$`, `B/T`, `K`, `%`) | 0.8–1.1 / power2.out |
| `bar-grow` | benchmark bars | `scaleX 0→1` from left, stagger 0.08 | 0.7 / power3.out |
| `line-draw` | curves, timelines, router edges | SVG `stroke-dashoffset full→0` | 1.2 / power1.inOut |
| `node-pop` | points on a drawn line | `scale 0→1`, fired as the line passes each x | 0.3 / back.out(1.6) |
| `area-fill` | under a drawn curve | gradient `clip-path` wipes up after the line | 0.5 / power2.out |
| `timeline-advance` | agentic task steps | progress dot travels x-axis; `--win` fills behind it; `--alert` X + dashed on failure | per-step 0.25 |
| `highlight-sweep` | emphasis on a word/stat | `--accent` coral **underline** sweeps L→R (8px band); text stays `--ink` — never green fill | 0.4 / power2.inOut |
| `pulse-glow` | the winner / hero number | `box-shadow`/`scale` breathe ×2, then settle | 0.6 ×2 |
| `lock-in` | ranks, `#1`, `CONFIRMED` | `scale 1.25→1` + 1–2° settle, hard stop | 0.35 / back.out(2) |
| `stamp` | `BANNED` / `FAILED` / verdicts | slam in `scale 1.6→1, rotate -8→-4`, micro-shake | 0.3 / expo.out |
| `mascot-peek` | bring the bot on | `x +120→0, rotate 5→0` from right edge | 0.6 / back.out(1.2) |
| `mascot-react` | punchline beat | quick eye-pulse or 3° head-tilt and back | 0.3 |
| `kicker-stamp` | the scene category tag | mono caps snap in with a colored tick | 0.3 / expo.out |
| `grid-draw` | cold open / first beat | horizontals clip L→R, then verticals T→B (~0.12s stagger) | 1.0 / power2.inOut |
| `grid-wipe` | scene change | grid lines illuminate-sweep across; or catalog `flash-through-white` for hard topic cuts | 0.5 |

```js
// pattern — count-up (seekable, deterministic)
const tl = gsap.timeline({ paused: true });
const n = { v: 0 };
tl.to(n, {
  v: 965, duration: 0.9, ease: "power2.out",
  onUpdate: () => { el.textContent = "$" + Math.round(n.v) + "B"; }
}, 0.4);

// pattern — line-draw + node-pop
const len = path.getTotalLength();
gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
tl.to(path, { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" }, 0.2);
nodes.forEach((node, i) =>
  tl.fromTo(node, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(1.6)" }, 0.2 + i * 0.22)
);

window.__timelines = window.__timelines || {};
window.__timelines.main = tl;

// pattern — grid-draw (intro cold open)
gsap.set(".bg__grid-h", { clipPath: "inset(0 100% 0 0)" });
gsap.set(".bg__grid-v", { clipPath: "inset(0 0 100% 0)" });
tl.fromTo(".bg__grid-h", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)", duration: 1, ease: "power2.inOut" }, 0);
tl.fromTo(".bg__grid-v", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)", duration: 1, ease: "power2.inOut" }, 0.12);
```

---

## 4. Element templates

Modular scene types — the channel's branded "blocks." Each lists its purpose, the presets it uses, and how color carries meaning. **One element family per video's core (one spine).** Each maps to one of the channel's three title angles.

### A. Stat Hero — *macro-capital angle*
One enormous number, the metric, and the so-what. (`$1T`, `400K context`, `$0.50 / Mtok`.) Number in `--font-display`, `count-up` + `rise-in`, optional `pulse-glow`, mascot peeks. The cold-open default for a money/scale story.

### B. Benchmark Bars — *engineering-friction angle*
2–5 horizontal bars, model vs model on **one** metric. `bar-grow` + `count-up` values; winner bar `--win`, others from the entity palette; a one-line plain-English translation under it. **One metric per scene** — never a four-score dump (per the script skill's "no benchmark dump").

### C. Task Timeline
Horizontal step axis (0…N); an agent's progress dot advances with `timeline-advance`. Success spreads `--win`; failure hits an `--alert` X + a `stamp` ("Failed"). Two lanes to compare two agents (your GPT-5.5-vs-DeepSeek thumbnail). The visual for agentic / long-horizon execution.

### D. Growth Curve — *macro-capital angle*
Exponential SVG curve with `line-draw` → `area-fill` (coral gradient) → labeled `node-pop` points along it; the final node gets `count-up` + `pulse-glow`. Funding rounds, parameter counts, cost-over-time. The `$1T`/funding aesthetic.

### E. Ranking Board — *geopolitical / open-source-rivalry angle*
`#1 / #2 / #3` list with **country flags** + entity marks; ranks `lock-in` top-down. Your "Open Source AI Models — #1 🇨🇳 #2 🇺🇸" frame. The flag is the curiosity hook; keep ranks to ≤4.

### F. Person Card
Guest / prominent figure: photo in a bento tile, name + role + affiliation, optional **sourced** pull-quote. `tile-snap` + `mask-wipe` on the name. Use **real photos you have rights to**; for public figures, **only real, sourced quotes — never fabricated attributions.**

### G. Company Lockup
Single company: logo + one-line "what they do / why it matters" + one metric. `tile-snap` + `rise-in`. (You supply logos; this spec governs placement and motion, not logo reproduction.)

### H. Logo Wall / Competitive Landscape
Bento grid of company/model tiles (the banner motif), `tile-snap` staggered. Optional **model-router diagram** (user → GPT / Claude / Gemini / Llama, edges via `line-draw`). The "where everyone sits" beat.

### I. Model Release Card
New model: `kicker-stamp` "MODEL RELEASE" → name + lab → a **spec strip** (context window, price, modality) with `count-up` → the one-line builder translation. The three spec chips are **centered** in a row (`justify-content: center` on `.spec-strip`). Resist listing everything; lead with the spec that changes a workflow.

### J. Architecture Diagram — *engineering-friction angle; the "teach, don't react" element*
The mechanism explainer. A node-graph built from tiles + drawn edges — MoE (router → experts), attention, or "self-eval vs. a separate critic" (two flows side by side). The active path `highlight-sweep`s as the VO narrates each beat (`line-draw` edges, `node-pop` nodes, sequenced to the script). This is the channel's scarce, defensible visual — give it room.

### K. Export Ban / Control — *geopolitical angle*
The control beat. A two-node flow (e.g., advanced chips ⟶ a destination) or a region map; a red `stamp` ("BANNED" / "RESTRICTED") slams across the arrow, the flow line turns `--alert` with an X. `kicker-stamp` "EXPORT CONTROL." Keep it factual and neutral in copy; the drama is in the motion, not the wording.

### L. Quote / Receipt
A claim, a tweet-style card, or a "called it" receipt — the contrarian prediction the market later confirmed (the channel's credibility beat). `rise-in` + `highlight-sweep` (coral underline on the key phrase); a green `stamp` "CONFIRMED" + `--win` left border on the card when a past call proved right. **Green marks the verdict, not the highlight** — never fill quote text with `--win`. Real, sourced quotes only.

---

## 5. Scene grammar

- **Cold open on the element, not a bumper.** Open mid-graphic on the hottest stat/claim — no logo sting, no title card first. Optional: `grid-draw` on beat 0, then content. The mascot and any branding arrive *after* the hook lands.
- **One spine.** One element family carries the video's core. Chapter extra topics; don't stack five element types in 60 seconds.
- **Upper-frame layout (9:16 Shorts).** Center the graphics block vertically in the upper two-thirds: `.seg` uses `align-items: center`, `justify-content: center`, `text-align: center`. Reserve the lower third for talking-head captions (`design.md`) via padding (`--safe-bottom: 640px` at 1080×1920) — **no on-screen debug labels** (no "caption zone" guides, no template-ID corner tags in shipped videos).
- **Kicker tags every scene** (`MODEL RELEASE`, `BENCHMARK`, `EXPORT CONTROL`, `THE MONEY`…). In-scene kickers only — not production metadata burned into the frame.
- **End on the bridge.** Full-graphic Shorts close with the **Subscribe pill** (§7, catalog `instagram-follow` reskinned). Talking-head Shorts pair upper-frame graphics with the karaoke + subscribe beat from `design.md`. Never dead-end.
- **Duration badge** (the black `1:54:56` pill, bottom-right) is a **thumbnail** element for long-form only — not an in-video overlay.

---

## 6. Format specs

| Surface | Canvas | Notes |
| --- | --- | --- |
| Short (in-video) | 1080×1920 or 2160×3840 (9:16) | talking-head + lower-third captions + upper-frame graphics |
| Long (in-video) | 1920×1080 (16:9) | full element layouts; mascot top-right |
| Thumbnail | 1280×720 (16:9) | title top-left, content, mascot top-right, duration badge bottom-right |
| Podcast cover | 3000×3000 (1:1) | the GEN AI lockup; full mascot |
| Channel banner | 2560×1440, safe area 1546×423 centered | bento landscape; keep title/tagline in the safe area |

Scale tokens are written for 1080p; double font sizes and the grid cell at 4K (mirrors `design.md`).

---

## 7. HyperFrames implementation

### Reference gallery

`style-systems/ai-release/gallery/` demonstrates templates **A, B, E, H, I, K, L** plus intro + outro (~46.5s):

| File | Role |
| --- | --- |
| `lib/theme.css` | Palette, type scale, `.bg`, `.seg`, bento, template CSS |
| `lib/animations.js` | Named presets on `window.__hf` (`riseIn`, `gridDraw`, `countUp`, …) |
| `compositions/tpl-*.html` | One sub-composition per element template |
| `compositions/instagram-follow.html` | Branded Subscribe outro (catalog block, reskinned) |
| `assets/mascot.png` | Mascot peek (Stat Hero) |
| `assets/avatar.png` | Channel logo for Subscribe pill |
| `fonts/*.woff2` | Anton, Inter, JetBrains Mono (latin, render-safe) |

Preview from the repository root: `npm run dev -- @ai-release`. Check: `npm run check -- @ai-release`.

### Subscribe outro (full-graphic Shorts)

Install and reskin the catalog block — do not ship HeyGen defaults:

```bash
npx hyperframes add instagram-follow
```

Wire on **track 2** (overlay) after the last scene clip, ~4.5s duration. Brand tokens:

| Field | Value |
| --- | --- |
| Display name | Gen AI Podcast |
| Handle | @GenAIPod |
| Avatar | `assets/avatar.png` |
| Tagline | AI news & podcast (optional third line) |

**YouTube-style button** (not Instagram blue):

| State | Background | Text |
| --- | --- | --- |
| Subscribe | `#e8e8e8` | `#0f0f0f` |
| Subscribed (after tap anim) | `#ff0000` | `#ffffff` |

Pill placement at 1080×1920: `bottom: ~584px` (upper-lower third, above caption safe zone), `min-width: ~900px`, centered. Slide in from below; button press at ~1s; slide out at ~3.8s.

### General rules

- Put the palette/type/motion tokens in `:root` in every composition (or a shared `lib/theme.css`) so blocks share them.
- Build element templates as reusable HTML partials (`compositions/tpl-<name>.html`); build presets as labeled timeline segments or small helper functions on the single `window.__timelines[id]` timeline.
- Lean on the catalog where it fits, then skin it with brand tokens: `npx hyperframes add data-chart` (bars/curves), `flash-through-white` (hard topic-cut transition), `instagram-follow` (subscribe pill). Don't accept catalog defaults — restyle to the palette above.
- Clip model for every timed node: `class="clip" data-start data-duration data-track-index`; mark overlays `data-layout-allow-occlusion`; video tracks `muted playsinline`; audio on its own track. **No overlapping clips on the same track** — gap scene boundaries by ~0.01s or put overlays on a higher track index.
- Determinism: no `Math.random`, no `Date.now`, no async timeline build. `npm run check` before render.
- New video: `scripts/new-reel.sh <name>`, symlink `frame.md` + `design.md`, then pull captions from `design.md` and graphics from this file.

### Render-path rules learned from talking-head reels

The browser/Studio preview can look correct while the MP4 render is wrong. Treat render as a separate path and test it cheaply.

- **Final MP4 style correctness is the real acceptance test.** In the GLM-5.2 reel, the devserver/browser preview looked correct, but the rendered video lost key card styling: scene CSS flattened, card interiors collapsed, and graphic scenes bled over the talking-head layer. Do not call a scene fixed from the browser alone when the bug is render-only.
- **Copy the real camera video into the reel assets early.** The root composition should reference the project-local asset, not the original file in Movies/Downloads, so previews, transcripts, and renders all use the same media.
- **Do not caption from the script.** Use the uploaded script only as a scene/visual guide. Run transcription on the actual camera video, then align captions and visual beats to the real words and timings, because the spoken take will drift.
- **Reuse the local Whisper/model cache when bandwidth is bad.** Before downloading anything, check what the previous reel used and let the local transcription tool reuse the cached model. Public or slow Wi-Fi should not be part of the critical path.
- **Anchor visual beats to transcript phrases, not guessed scene blocks.** For example, use the exact phrase where the speaker says "first open source model..." to clear back to camera, then use the word "beat" as the trigger for the benchmark overlay.
- **Mounted-scene CSS must exist in the root render path.** Sub-composition `<style>` blocks can look right in isolated previews but fail when the scene is mounted inside `index.html`. Any CSS that must survive the final MP4 should be in a root-loaded stylesheet such as `lib/theme.css` or `lib/mounted-scenes.css`, linked from `index.html` after the base theme.
- **Use dual selectors for mounted scenes.** Scene-local rules should match both the standalone subcomposition id and the root host id: `:is(#scene-2-what-it-is, #scene-2) .spec-card { ... }`. The first selector keeps isolated previews useful; the second catches the root-mounted clip in render.
- **Do not rely on the inner `.scene` wrapper for opaque backgrounds.** If a graphic scene should hide the talking-head video, give the mounted host an explicit background: `:is(#scene-2-what-it-is, #scene-2) { background: var(--bg); overflow: hidden; }`. Otherwise the face video may bleed through under the graphics in the render.
- **Keep one source of truth for mounted fixes.** If a scene needs root-mounted CSS, add it to a shared root stylesheet rather than only patching the subcomposition file. Link order matters: base theme first, mounted-scene overrides second.
- **Full black graphic scenes should still use the frame grid.** Keep the matte black background, but draw the same subtle grid texture used by the AI release gallery so the scene feels branded instead of empty.
- **Never add camera placeholder frames around real footage.** Talking-head scenes may use lower-thirds, cards, subtle vignettes, and grid texture, but no squircle/camera-edge border around the face unless explicitly requested.
- **When an overlay should reveal the face, make only the overlay transparent.** The scene root can stay mounted while a specific overlay fades or exits. Put timing constants in the scene file and name them clearly (`clearToCameraAt`, `terminalCounterAt`, `sceneEndHoldAt`) so visual timing can be adjusted without hunting.
- **If a card should last to the scene end, tie it to the scene end.** Do not hard-code an early exit just because the next beat starts soon. For persistent cards like Terminal-Bench, derive the hold from `sceneEnd`/`data-duration` and keep it visible until the next scene actually takes over.

### Fast render verification

Do not use a full 60-90s render as the first debugging loop. Build tiny render checks that reproduce the exact failure mode.

- **Scene-only render is not always enough.** If the bug appears only in the full reel, create a short root-mounted check that includes the same underlying video layer and mounts only the suspect scene.
- **A browser screenshot is useful but insufficient for render bugs.** For style mismatches, render a tiny root-mounted clip and extract one proof frame. That catches the CSS/runtime path that the final MP4 actually uses.
- Put checks outside the root project entrypoint, e.g. `render-checks/scene-2-mounted-check.html`, so normal lint does not report multiple root compositions.
- Keep checks short and cheap: `data-duration="5"`, no audio unless audio is the bug, `--quality draft --fps 10 --workers 1 --browser-gpu`.
- Add reusable scripts:

```json
{
  "scripts": {
    "render:scene2-check": "npx --yes hyperframes@0.6.15 render --composition render-checks/scene-2-mounted-check.html --quality draft --fps 10 --workers 1 --browser-gpu --output renders/scene-2-mounted-check.mp4"
  }
}
```

- Extract one proof frame instead of watching the whole video:

```bash
ffmpeg -y -ss 00:00:04.50 -i renders/scene-2-mounted-check.mp4 -frames:v 1 /tmp/scene2-frame.png
```

- Run the full render only after: `lint` is clean, targeted `inspect --at ...` is clean, and the tiny root-mounted render frame matches the preview.

### Render performance and FFmpeg failures

- `FFmpeg exited with code 255 ... received signal 15` usually means the render was externally killed or timed out, not that the video frame/codec is corrupt. Look at elapsed time, fps, and the last encoded timestamp before changing content.
- If a render is crawling, first remove expensive CSS before blaming media:
  - avoid `backdrop-filter` over video;
  - avoid large full-screen `filter: blur(...)` glows;
  - avoid full-frame `repeating-linear-gradient` noise or grids when tiled `linear-gradient` backgrounds work;
  - prefer static radial gradients, tiled grid backgrounds, and ordinary semi-transparent panels.
- For local reliability, use `--workers 1 --browser-gpu`. Multiple workers can spawn extra Chrome instances and make public-Wi-Fi/library-laptop render sessions less predictable.
- After an interrupted render, check for leftover render/FFmpeg processes and stop them before rerunning. A half-dead render can keep CPU high and make the next run look broken.

### Phone-legibility guardrails

- Large typography is a production requirement for Shorts, not a styling preference. Assume the viewer watches at phone size. Anything important should be **44px minimum** at 1080x1920, and most labels/data should be 48-68px. Keep 36-40px only for truly secondary metadata.
- If a 30px label exists, treat it as a bug unless it is a nonessential footnote. When one tiny label is discovered, search the whole reel for that size or smaller and bump all of them together.
- When increasing fonts, add vertical spacing immediately. Larger type without larger gaps makes dense cards feel broken even if nothing technically overlaps.
- Kicker/subtitle labels above headers must be big enough to read on mobile and must have breathing room below them. Do not tuck a larger kicker tight against a headline.
- Charts need oversized labels and numbers. Bar values and model names should read before the viewer notices the bar shapes.
- Known small-font hotspots from the GLM-5.2 reel: Scene 3 model labels, Coding Win chart labels and numbers, Scene 4 kicker text like "Design Arena - Web Dev", Scene 5 Input/Output titles, tiny chips, chart captions, source labels, and model tags. Audit them after every type-size pass and raise any small text together, not one component at a time.
- After every font bump, increase vertical gaps, card padding, chip spacing, and chart label clearances. Bigger text without more air makes the scene feel crowded even when inspect reports no overlap.

---

## 8. Do / Don't

**Do:** matte black + faint grid; optional `grid-draw` on cold open; warm-cream type with the red-dot accent; one accent per meaning (green win / red fail-ban / coral capital + coral quote underlines); precise eased motion that assembles; one spine; in-scene kicker tags; centered upper-frame layout on 9:16; mascot image peeking and reacting; one metric per benchmark scene; YouTube-style Subscribe outro on full-graphic Shorts.

**Don't:** flat pure-black or gradient-wash backgrounds; green/red used decoratively (including green highlight fills on quote text); elastic/cartoon bounce on data UI (Subscribe pill press uses a short `power2` only); CSS-drawn mascot; the mascot centered, performing, or covering data; on-screen production metadata (template IDs, caption-zone guides); benchmark dumps; holding a stale graphic into the next beat; overlapping clips on the same track; wall-clock or random animation (breaks deterministic render); fabricated quotes or misused third-party logos; Google Fonts CDN in render paths.
