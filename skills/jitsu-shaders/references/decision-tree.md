# jitsu-shaders vs shader-artist — Decision Tree

When a design task involves visual motion, hero sections, backgrounds, loaders, transitions, glass surfaces, or ambient effects, use this tree to choose the right shader skill.

## Decision flow

```
Is this a design task involving visual motion / hero / background / loader / transition / glass / ambient?
├── No → do not invoke either shader skill
└── Yes
    ├── Is `JITSU_SHADERS=false` set in the project's .env?
    │   └── Yes → use shader-artist (WebGL/GLSL/CSS)
    │
    ├── Does the audience explicitly require universal browser support?
    │   (Government sites, legacy enterprise, accessibility-mandated WebGL-only)
    │   └── Yes → use shader-artist
    │
    ├── Do you need custom GLSL math not expressible as a composition of shader-lab's layer types?
    │   (Mathematical art, generative geometry, custom ray marching, procedural terrain)
    │   └── Yes → use shader-artist
    │
    └── Default path → use jitsu-shaders
        ├── Match task intent to one of the 12 presets
        │   See ../presets/ for the full catalog
        │
        ├── Copy config.json + Component.tsx + poster.jpg into your project
        │   Target: src/components/shaders/<slug>/
        │
        ├── Copy shared utilities into a util location
        │   ShaderOrFallback.tsx + detectWebGPU.ts
        │
        ├── Import and mount the preset component
        │
        ├── Iterate via Preview MCP
        │   If the preset needs tweaks beyond configOverride:
        │   → re-author in the basement.studio hosted editor
        │   → see references/authoring-workflow.md
        │
        └── Done
```

## Skill summary

| Skill | Renderer | Strength | Weakness |
|-------|----------|----------|----------|
| **jitsu-shaders** (default) | WebGPU via `@basementstudio/shader-lab` | 20+ composable effect layers, timeline system, battle-tested runtime, poster fallback, SSR-safe | Requires WebGPU (~88-92% browser support); cannot do custom GLSL math beyond layer composition |
| **shader-artist** (fallback) | WebGL / GLSL / CSS | Works everywhere, full GLSL control, no peer dependencies, great for mathematical art | Manual GLSL authoring, no preset library, no built-in fallback system, no timeline |

## When both skills decline

If the task needs visual motion but:
- WebGPU is unavailable AND
- Custom GLSL is too complex AND
- The project is CSS-only

Then fall back to CSS-only techniques:
- `@keyframes` animations
- `backdrop-blur` + translucent layers
- CSS `linear-gradient()` with `background-position` animation
- `mix-blend-mode` overlays

These are not managed by either shader skill — implement directly in the component.
