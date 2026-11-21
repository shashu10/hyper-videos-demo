# Working agreement for this repo

Shashank is the **creative director**. The agent builds the visuals. These are standing preferences, recorded October 1, 2026.

## Roles

- Shashank gives high-level direction and quick yes/no calls on what looks good. He will not draw, sketch, storyboard by hand, or use illustration tools. Never propose a workflow that depends on him producing artwork.
- The agent does all the visual work: design, layout, motion, textures and assets, built with HyperFrames plus HTML/CSS/JS libraries (GSAP, Rough.js, Three.js, Lottie, etc.). Anything that should look hand-drawn is generated in code or with AI image tools, never by asking him to draw it.
- To get a decision, show options he can react to, like rendered frames, short clips or side-by-sides. Don't ask open-ended design questions.

## What he will supply

- Camera footage of himself (A-roll) and recorded audio.
- Real-object B-roll he can find and film.
- Access to image, video and music generation tools for generated assets. The agent writes the prompts.

## Style direction

- He wants **one general, reusable channel style** per collection, not a one-off look per video.
- Ruled out: retro finance-software looks (Quicken, Windows 95, Microsoft Money) and anything that depends on his own hand-drawing.
- Avoid the common "AI-generated" defaults: cream-and-terracotta brand palettes, stacks of simulated analog textures, default handwriting fonts, Excalidraw-style lines and placeholder content.

## Git

- Work directly on `main`. Don't create separate feature branches; commit and push to `main`.

## Render notes

- Bundle libraries and fonts inside each project (`lib/vendor/`, `assets/fonts/`). The cloud container's headless renderer can't load CDN scripts.
- Use image textures, not SVG-filter data URIs, for backgrounds. Those rendered black in the HyperFrames renderer.
