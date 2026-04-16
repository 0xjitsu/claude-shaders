---
name: jitsu-shaders
version: 1.0.0
description: Use when any task involves visual design, hero sections, backgrounds, landing pages, loaders, transitions, glass morphism, ambient motion, scroll reveals, atmospheric effects, postprocessing, or "make this feel alive". Default shader path for jitsu-os. Ships 12 WebGPU presets via @basementstudio/shader-lab with graceful poster fallback.
trigger: visual design, hero, background, landing, loader, transition, glass, motion, scroll reveal, atmospheric, ambient, shader, postprocessing, "feel alive"
category: frontend
---

# jitsu-shaders

The default shader skill for jitsu-os. Ships 12 production-ready WebGPU shader compositions built on `@basementstudio/shader-lab`, with automatic fallback to a static poster when WebGPU is unavailable or `prefers-reduced-motion` is set.

## When to invoke

Invoke this skill when a design task touches any of:
- Hero sections or landing backgrounds
- Loading screens / skeleton states
- Scroll-triggered reveals
- Route or section transitions
- Glass morphism surfaces
- Post-processing over a Three.js scene
- "Ambient motion" / "atmospheric" / "make this feel alive" briefs

This is the **first** shader skill to consider in jitsu-os. Only defer to `shader-artist` if the decision tree in `references/decision-tree.md` says so.

## Quick start

```bash
bun add @basementstudio/shader-lab three
```

1. Pick a preset from `presets/` matching your design intent
2. Copy `config.json`, `Component.tsx`, `poster.jpg` into `src/components/shaders/<slug>/` in your project
3. Copy `components/ShaderOrFallback.tsx` and `components/detectWebGPU.ts` into a shared util location
4. Import and mount:

```tsx
import { HeroAurora } from "@/components/shaders/hero-aurora/Component"

export default function Page() {
  return (
    <div className="relative h-screen">
      <HeroAurora className="absolute inset-0 -z-10" />
      <main className="relative z-10">{/* your content */}</main>
    </div>
  )
}
```

## Preset catalog

See `presets/` for all 12. Quick index:

| Slug | Design slot | Primary layers |
|---|---|---|
| `01-hero-aurora` | Landing hero | gradient + particle-grid + directional-blur |
| `02-hero-terminal` | Technical/dev hero | gradient + ascii + crt |
| `03-hero-inkwash` | Editorial/research hero | gradient + ink |
| `04-loader-pulse` | App loader | gradient + dithering + directional-blur |
| `05-loader-scanline` | Technical loader | gradient + crt + pixel-sorting |
| `06-scroll-reveal-halftone` | Scroll reveal | gradient + halftone |
| `07-scroll-reveal-slice` | Dramatic reveal | gradient + slice |
| `08-glass-chromatic` | Glass panel accent | chromatic-aberration + fluted-glass |
| `09-transition-pixelate` | Route transition | gradient + pixelation |
| `10-transition-posterize` | Route transition | gradient + posterize |
| `11-postfx-edge-detect` | 3D scene overlay | edge-detect |
| `12-postfx-smear-hover` | Interactive tile hover | smear |

## Decision tree

See `references/decision-tree.md`. Short version: default is `jitsu-shaders`; only defer to `shader-artist` for WebGPU-unsafe universal-support audiences, custom GLSL math, or when `JITSU_SHADERS=false` is set.

## Authoring custom compositions

See `references/authoring-workflow.md`. Short version: open basement.studio/shader-lab, compose visually, export JSON, drop it into a new preset folder alongside a poster frame.

## Fallback behavior

`<ShaderOrFallback>` renders the poster unconditionally on the server, then detects WebGPU on the client and swaps to the shader only if supported AND `prefers-reduced-motion` is not set. No hydration mismatch. No user-agent gating.

## Effect catalog

See `references/effect-catalog.md` for the full schema reference — all 20+ layer types with their exact property names, types, defaults, and ranges.

## Cross-referenced skills

- `frontend-design` — considers `jitsu-shaders` as part of every visual treatment
- `baseline-ui` — same
- `shader-artist` — explicit fallback for non-WebGPU contexts
