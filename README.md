# hyper-videos (demo)

A trimmed, public copy of the repo I use to make short-form AI videos with
[HyperFrames](https://github.com/heygen-com/hyperframes) (HTML compositions
rendered to video). It keeps the production tooling, one style system and one
finished sample reel, so you can run, change and render a real project
without any of my recordings or working notes.

## What's here

```text
hyper-videos-demo/
├── package.json             # root dev / check / render router
├── scripts/
│   ├── new-reel.sh          # scaffold a new reel from a style system
│   └── run-reel.mjs         # run a project script from the repo root
├── shared/hyperframes/      # style-neutral helpers (placeholder)
├── style-systems/
│   └── ai-release/          # dark, data-led style for AI news reels
│       ├── design.md        # palette, type, motion rules
│       ├── frame.md         # scene grammar
│       ├── lib/ fonts/ assets/
│       └── gallery/         # runnable template gallery
├── reels/
│   └── ai/
│       └── fable-5/         # sample: a 9:16 model-launch reel
└── .agents/skills/          # HyperFrames agent skill, pinned in skills-lock.json
```

The sample, `reels/ai/fable-5`, is a seven-scene vertical reel about a
model release: hook, leaderboard, benchmark, proof, pricing, a caveat and an
outro. Everything on screen is built from HTML, CSS and GSAP. There's no
footage or voiceover, so it renders with nothing else to download.

## Requirements

- Node.js 22 or newer
- FFmpeg
- Chrome is fetched by HyperFrames on first use (`npx hyperframes browser ensure`)

## Run the sample

From the repo root, pass `<collection>/<reel>` after `--`:

```bash
npm run dev -- ai/fable-5        # Studio preview in the browser
npm run check -- ai/fable-5      # lint, runtime, layout and contrast checks
npm run render -- ai/fable-5     # MP4 in reels/ai/fable-5/renders/
npm run dev -- @ai-release       # template gallery for the style system
```

The same scripts work from inside a project folder (`cd reels/ai/fable-5 && npm run check`).

## Make a new reel

```bash
./scripts/new-reel.sh my-model-launch --style ai
npm run dev -- ai/my-model-launch
```

The scaffold runs `hyperframes init` (portrait 1080×1920, Tailwind, blank
example) in `reels/ai/<name>/` and then snapshots the style system's
`design.md`, `frame.md`, `lib/`, `fonts/` and `assets/` into the project. A
`style.json` records where it came from. Snapshots are deliberate: changing
the style system later never silently alters an older video.

Extra `hyperframes init` flags pass straight through, for example
`--example kinetic-type`.

## Working on a composition

- Read the project's own `design.md` (and `frame.md`) before editing. There
  is no root-level design file on purpose; each project carries its own.
- Run `npm run check -- ai/<reel>` after every change to composition HTML.
- Renders go to each project's `renders/` folder and are ignored by Git.
- `CLAUDE.md` holds the working agreement that agents follow in this repo.

## Known gaps

- Each project pins its own HyperFrames version in `package.json`. The sample
  and gallery are on 0.9.74, but `new-reel.sh` scaffolds with
  `hyperframes@latest`, so later reels can drift.
- `npm run check` passes on the sample and gallery but still reports craft
  warnings: type under the 28 px phone floor, text outside platform safe
  zones, lines that leave before they can be read, and one 4-second still
  stretch.
- `fable-5` and the gallery load GSAP from a CDN. A headless renderer without
  network access needs a vendored copy under `lib/vendor/`.
- There are no automated tests or CI yet.
