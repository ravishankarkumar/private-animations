# AI / ML / DL / Foundation Models / Generative AI animations

The narration is split into 13 standalone Murali scenes. Each scene renders its own MP4, so timing and visuals can be revised without re-rendering the full video.

## Setup

```bash
cd /Users/ravishankar/personal-work/animation/private-animations/kavriq-long/what-ai-ai-ml
npm install
npm run build:deps
npm run typecheck
```

Both Murali dependencies use the local source checkouts requested for this project:

- `/Users/ravishankar/personal-work/animation/murali-js`
- `/Users/ravishankar/personal-work/animation/murali-scene-kit-js`

## Render

Render one scene while iterating:

```bash
npm run render -- scripts/03-inbox-four-systems.ts
```

Render every scene in narrative order:

```bash
npm run render:all
```

Join the rendered scenes into one video with a continuous Raag Pahadi music bed:

```bash
npm run render:master
```

Render the scenes and master video together:

```bash
npm run render:complete
```

Videos are written to `renders/`. The complete export is
`renders/what-is-ai-ml-dl-gen-ai.mp4`. Individual scenes include the same music
at 18% volume; the master replaces those per-scene tracks with one continuous
music bed.

## Scene map

1. `01-ai-headlines.ts` — newspaper montage and terminology overload
2. `02-concept-map.ts` — first high-level relationship map
3. `03-inbox-four-systems.ts` — email spine and four-system card layout
4. `04-ai-umbrella.ts` — AI as the broad umbrella
5. `05-applied-ai-stack.ts` — applied-AI product stack
6. `06-ml-training-inference.ts` — training versus inference
7. `07-ml-types-data-science.ts` — ML types and the Data Science comparison
8. `08-deep-learning.ts` — neural-network training and inference
9. `09-generative-ai.ts` — discriminative versus generative systems
10. `10-foundation-models.ts` — broad pre-training and downstream tasks
11. `11-next-token-generation.ts` — repeated next-token prediction
12. `12-risks-and-guardrails.ts` — hallucinations, risks, and safeguards
13. `13-recap-map.ts` — final map and email-spine recap

Shared palette and reusable UI builders live under `scripts/lib/`.
