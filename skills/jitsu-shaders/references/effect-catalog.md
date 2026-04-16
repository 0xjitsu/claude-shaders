# @basementstudio/shader-lab — Effect Catalog

> Sourced directly from the package source at `packages/shader-lab-react/src/` on GitHub (basementstudio/shader-lab, `main` branch, April 2026). All property names, types, defaults, and ranges are verified against the actual `updateParams()` implementations in each `*-pass.ts` file.

---

## Top-Level Schema

### `ShaderLabConfig`

```ts
interface ShaderLabConfig {
  composition: {
    width: number   // canvas width in CSS pixels
    height: number  // canvas height in CSS pixels
  }
  layers: ShaderLabLayerConfig[]
  timeline: ShaderLabTimelineConfig
}
```

### `ShaderLabLayerConfig` (every layer shares these base fields)

```ts
interface ShaderLabLayerConfig {
  id: string                          // unique layer ID (any string)
  name: string                        // display name (any string)
  kind: "effect" | "source"          // discriminator: "source" generates pixels; "effect" transforms what's below
  type: ShaderLabLayerType            // see enums below
  visible: boolean                    // default: true
  opacity: number                     // 0–1, default: 1
  hue: number                         // hue rotation in degrees
  saturation: number                  // saturation multiplier
  blendMode: ShaderLabBlendMode       // see blend modes below
  compositeMode: "filter" | "mask"
  maskConfig?: ShaderLabMaskConfig
  params: Record<string, ShaderLabParameterValue>  // layer-specific params (see per-layer sections)
  asset?: ShaderLabAssetSource        // for image/video source layers
  sketch?: ShaderLabSketchSource      // for custom-shader layers
}
```

**`ShaderLabParameterValue`** — the union type for all param values:
```ts
type ShaderLabParameterValue =
  | number
  | string
  | boolean
  | [number, number]       // vec2
  | [number, number, number]  // vec3
```

### Layer Kind vs Type

The discriminator field is **`type`** (not `kind`). `kind` is a secondary categorization (`"source"` | `"effect"`).

**Source layer types** (`kind: "source"`) — generate pixels from scratch:
- `"custom-shader"` — custom TSL shader
- `"gradient"` — gradient generator
- `"image"` — static image
- `"live"` — live camera
- `"text"` — text rendering
- `"video"` — video playback

**Effect layer types** (`kind: "effect"`) — transform the composited result of layers below:
- `"ascii"` — ASCII art renderer
- `"circuit-bent"` — circuit-bent line scan effect *(added in source, not in plan)*
- `"directional-blur"` — motion/radial blur
- `"chromatic-aberration"` — RGB channel splitting
- `"crt"` — CRT monitor simulation
- `"displacement-map"` — self-displacement warping
- `"dithering"` — ordered/noise dithering
- `"edge-detect"` — Sobel edge detection
- `"fluted-glass"` — frosted/fluted glass refraction *(added in source, not in plan)*
- `"halftone"` — halftone dot rendering
- `"ink"` — fluid ink/bloom simulation
- `"particle-grid"` — instanced dot grid
- `"pattern"` — character/shape pattern atlas
- `"pixelation"` — blocky pixelation
- `"pixel-sorting"` — glitch pixel sorting
- `"plotter"` — pen plotter hatching *(added in source, not in plan)*
- `"posterize"` — colour level reduction
- `"slice"` — horizontal slice glitch
- `"smear"` — motion smear/streak *(added in source, not in plan)*
- `"threshold"` — binary luminance threshold *(added in source, not in plan)*

**Total: 20 effect/source types (5 undocumented in the plan: `circuit-bent`, `fluted-glass`, `plotter`, `smear`, `threshold`)**

### Blend Modes

```ts
type ShaderLabBlendMode =
  | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten"
  | "color-dodge" | "color-burn" | "hard-light" | "soft-light"
  | "difference" | "exclusion" | "hue" | "saturation" | "color" | "luminosity"
```

### Mask Config

```ts
interface ShaderLabMaskConfig {
  invert: boolean
  mode: "multiply" | "stencil"
  source: "luminance" | "alpha" | "red" | "green" | "blue"
}
```

---

## Timeline Schema

### `ShaderLabTimelineConfig`

```ts
interface ShaderLabTimelineConfig {
  duration: number    // total duration in seconds
  loop: boolean
  tracks: ShaderLabTimelineTrack[]
}
```

### `ShaderLabTimelineTrack`

```ts
interface ShaderLabTimelineTrack {
  id: string
  layerId: string    // ID of the layer this track targets
  enabled: boolean
  interpolation: "linear" | "smooth" | "step"
  binding: ShaderLabAnimatedPropertyBinding
  keyframes: ShaderLabTimelineKeyframe[]
}
```

### `ShaderLabAnimatedPropertyBinding`

Two discriminator shapes — **`kind: "layer"`** for built-in layer properties, **`kind: "param"`** for layer-specific params:

```ts
type ShaderLabAnimatedPropertyBinding =
  | {
      kind: "layer"
      label: string
      property: "hue" | "opacity" | "saturation" | "visible"
      valueType: "boolean" | "number"
    }
  | {
      kind: "param"
      key: string       // the exact param key name (e.g., "cellSize", "strength")
      label: string
      valueType: "boolean" | "color" | "number" | "select" | "vec2" | "vec3"
    }
```

### `ShaderLabTimelineKeyframe`

```ts
interface ShaderLabTimelineKeyframe {
  id: string
  time: number                         // seconds into the timeline
  value: ShaderLabParameterValue       // number | string | boolean | [n,n] | [n,n,n]
}
```

**Key insight**: to animate a param called `cellSize` on a layer with id `"layer-1"`, the track binding is `{ kind: "param", key: "cellSize", label: "Cell Size", valueType: "number" }` with `layerId: "layer-1"`. There is **no dot notation** in track bindings — `key` is just the flat param name.

---

## React Component API

### `ShaderLabComposition` (high-level — recommended)

```tsx
import { ShaderLabComposition, type ShaderLabConfig } from "@basementstudio/shader-lab"

<ShaderLabComposition
  config={config}                      // ShaderLabConfig
  onRuntimeError={(msg) => {}}         // optional error handler
/>
```

- Renders the composition into a managed canvas that preserves the exported aspect ratio and fills its container width.
- Client-only (`"use client"` required). Requires WebGPU support.

### `useShaderLab` (advanced — texture/postprocessing integration)

```ts
const { texture, canvas, postprocessing } = useShaderLab(config, { width, height })
```

- `texture` — `THREE.CanvasTexture | null` — ready-to-use texture for R3F/Three scenes
- `canvas` — raw `HTMLCanvasElement`
- `postprocessing` — handle for the postprocessing pipeline

### Lower-level APIs (for manual timing / external engines)

- `useShaderLabCanvasSource(config, { width, height })` → `{ canvas, ready, resize, update }`
- `useShaderLabPostProcessingSource(config, { renderer, width, height })` → `{ ready, error, resize, texture, update }`
- `useShaderLabTextureSource(config, { renderer, width, height })` → internal texture path
- Class equivalents: `ShaderLabCanvasSource`, `ShaderLabPostProcessingSource`, `ShaderLabTextureSource`

---

## Effect Layer Catalog

> For each layer: **`type` string** (exact, use this in JSON), **params object**, defaults and valid ranges extracted from source, visual description, use cases, GPU cost.

---

### `"ascii"`

**Kind:** `"effect"`

**Visual:** Renders the input through a character atlas where each cell's character is chosen by brightness. Supports full-colour, monochrome, and green-terminal colour modes. Optional bloom for glow.

**Use cases:** hero, overlay, postprocess (artistic terminal aesthetic)

**GPU cost:** Medium (atlas texture + bloom optional)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `cellSize` | `number` | `12` | `≥4` (integer, controls atlas rebuild) |
| `charset` | `string` | `"light"` | `"binary"` \| `"blocks"` \| `"custom"` \| `"dense"` \| `"hatching"` \| `"light"` |
| `customChars` | `string` | default chars | any string (used when `charset === "custom"`) |
| `fontWeight` | `string` | `"regular"` | `"bold"` \| `"regular"` \| `"thin"` |
| `colorMode` | `string` | `"monochrome"` | `"green-terminal"` \| `"monochrome"` \| `"source"` |
| `monoColor` | `string` | `"#f5f5f0"` | CSS hex or rgb() |
| `bgOpacity` | `number` | `0` | `0–1` |
| `invert` | `boolean` | `false` | — |
| `glyphSignalMode` | `string` | `"luminance"` | `"blue"` \| `"green"` \| `"lightness"` \| `"luminance"` \| `"red"` |
| `colorSignalMode` | `string` | `"luminance"` | same as above |
| `signalBlackPoint` | `number` | `0` | `0–1` |
| `signalWhitePoint` | `number` | `1` | `0–1` |
| `signalGamma` | `number` | `1` | `0.1–5` |
| `presenceThreshold` | `number` | `0` | `0–1` |
| `presenceSoftness` | `number` | `0` | `0–1` |
| `shimmerAmount` | `number` | `0` | `0–1` |
| `shimmerSpeed` | `number` | `1` | `0–10` |
| `directionBias` | `number` | `0` | `0–1` |
| `toneMapping` | `string` | `"none"` | `"none"` \| `"aces"` \| `"cinematic"` \| `"reinhard"` \| `"totos"` |
| `bloomEnabled` | `boolean` | `false` | — |
| `bloomIntensity` | `number` | `1.25` | `≥0` |
| `bloomThreshold` | `number` | `0.6` | `0–1` |
| `bloomRadius` | `number` | `6` | `≥0` |
| `bloomSoftness` | `number` | `0.35` | `0–1` |

**Animatable params (via `kind: "param"`):** `cellSize`, `bgOpacity`, `shimmerAmount`, `shimmerSpeed`, `directionBias`, `signalBlackPoint`, `signalWhitePoint`, `signalGamma`, `presenceThreshold`, `presenceSoftness`, `bloomIntensity`, `bloomThreshold`, `bloomRadius`, `bloomSoftness`

**Animatable layer props (via `kind: "layer"`):** `opacity`, `visible`, `hue`, `saturation`

---

### `"chromatic-aberration"`

**Kind:** `"effect"`

**Visual:** Splits R, G, B channels apart spatially — radial from a center point, or linear along a horizontal or vertical axis. Classic lens fringing or glitch look.

**Use cases:** overlay, glass, postprocess

**GPU cost:** Cheap (3 texture samples)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `intensity` | `number` | `5` | `0–50` (pixels) |
| `center` | `[number, number]` | `[0.5, 0.5]` | UV coordinates 0–1 each |
| `angle` | `number` | `0` | `0–360` (degrees, linear/vertical modes) |
| `direction` | `string` | `"radial"` | `"horizontal"` \| `"radial"` \| `"vertical"` |

---

### `"circuit-bent"`

**Kind:** `"effect"`

**Visual:** Circuit-bent scan-line distortion — horizontal lines scanned at variable pitch with noise-driven displacement, creating an analog circuit-fault aesthetic.

**Use cases:** overlay, hero glitch, postprocess

**GPU cost:** Medium

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `colorMode` | `string` | `"source"` | (not documented further in source grep) |
| `invert` | `boolean` | `false` | — |
| `lineAngle` | `number` | `0` | `0–180` (degrees) |
| `linePitch` | `number` | `6.4` | `2–48` |
| `lineThickness` | `number` | `0.5` | `0.5–8` |
| `monoColor` | `string` | `"#f5f0eb"` | CSS hex |
| `noiseMode` | `string` | turbulence | `"turbulence"` \| other noise modes |
| `noiseAmount` | `number` | `1` | `0–1` |
| `presenceSoftness` | `number` | `0.64` | `0–1` |
| `presenceThreshold` | `number` | `0.37` | `0–1` |
| `scrollSpeed` | `number` | `4` | `0–4` |
| `signalBlackPoint` | `number` | `0` | `0–1` |
| `signalGamma` | `number` | `3.07` | `0.1–5` |
| `signalWhitePoint` | `number` | `0.22` | `0–1` |

*(Note: This layer is present in the real package but absent from the plan's preset list. It is the renamed "plotter-scan" / circuit-bent glitch layer.)*

---

### `"crt"`

**Kind:** `"effect"`

**Visual:** Full CRT monitor simulation — phosphor slot mask/aperture grille/composite TV modes, barrel distortion, scanlines, chromatic aberration, bloom, vignette, flicker, and ghosting (history persistence). One of the most feature-rich layers.

**Use cases:** hero, overlay, postprocess (retro/technical)

**GPU cost:** Expensive (multi-pass with history buffer + optional bloom)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `crtMode` | `string` | `"slot-mask"` | `"aperture-grille"` \| `"composite-tv"` \| `"slot-mask"` |
| `cellSize` | `number` | `3` | `≥2` |
| `scanlineIntensity` | `number` | `0.17` | `0–1` |
| `maskIntensity` | `number` | `1` | `0–1` |
| `barrelDistortion` | `number` | `0.15` | `0–0.3` |
| `chromaticAberration` | `number` | `2` | `0–2` |
| `beamFocus` | `number` | `0.58` | `0–1` |
| `brightness` | `number` | `1.8` | `≥0.5` |
| `highlightDrive` | `number` | `1` | `≥1` |
| `highlightThreshold` | `number` | `0.62` | `0–1` |
| `shoulder` | `number` | `0.25` | `≥0` |
| `chromaRetention` | `number` | `1.15` | `0–2` |
| `shadowLift` | `number` | `0.16` | `0–1` |
| `persistence` | `number` | `0.18` | `0–1` (ghosting / motion blur) |
| `vignetteIntensity` | `number` | `0.45` | `0–1` |
| `flickerIntensity` | `number` | `0.2` | `0–0.2` |
| `glitchIntensity` | `number` | `0.13` | `0–1` |
| `glitchSpeed` | `number` | `5` | `0.1–5` |
| `signalArtifacts` | `number` | `0.45` | `0–1` |
| `bloomEnabled` | `boolean` | `true` | — |
| `bloomIntensity` | `number` | `1.93` | `≥0` |
| `bloomThreshold` | `number` | `0` | `0–1` |
| `bloomRadius` | `number` | `8` | `≥0` |
| `bloomSoftness` | `number` | `0.31` | `0–1` |

---

### `"directional-blur"`

**Kind:** `"effect"`

**Visual:** Motion or radial blur. Linear mode blurs along an angle; radial mode blurs outward from a center point.

**Use cases:** loader, transition, postprocess, glass

**GPU cost:** Medium (up to 16 samples)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `strength` | `number` | `18` | `0–96` (pixels) |
| `samples` | `number` | `8` | `1–16` (integer) |
| `angle` | `number` | `0` | degrees (any float) |
| `mode` | `string` | `"linear"` | `"linear"` \| `"radial"` |
| `center` | `[number, number]` | `[0.5, 0.5]` | UV coordinates 0–1 each (used only in radial mode) |

---

### `"displacement-map"`

**Kind:** `"effect"`

**Visual:** Self-displacement — samples the input image's own channel as a height map and uses it to warp the image UVs. Creates ripple, wave, or refraction effects.

**Use cases:** hero (organic warp), interactive hover, postprocess

**GPU cost:** Cheap (2 texture samples)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `strength` | `number` | `20` | `0–200` (pixels) |
| `midpoint` | `number` | `0.5` | `0–1` (zero-displacement value) |
| `direction` | `string` | `"both"` | `"both"` \| `"horizontal"` \| `"vertical"` |
| `channel` | `string` | `"luminance"` | `"blue"` \| `"green"` \| `"luminance"` \| `"red"` |

---

### `"dithering"`

**Kind:** `"effect"`

**Visual:** Ordered Bayer or noise dithering. Quantizes colour to N levels using a threshold matrix. Supports source colour, monochrome tint, and duo-tone modes. Optional animated dither, chromatic split, and dot-scale effects.

**Use cases:** loader, overlay, hero (retro/low-bit aesthetic)

**GPU cost:** Cheap

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `algorithm` | `string` | `"bayer-4x4"` | `"bayer-2x2"` \| `"bayer-4x4"` \| `"bayer-8x8"` \| `"noise"` |
| `levels` | `number` | `4` | `≥2` |
| `pixelSize` | `number` | `1` | `≥1` (integer) |
| `spread` | `number` | `0.5` | `0–1` |
| `colorMode` | `string` | `"source"` | `"duo-tone"` \| `"monochrome"` \| `"source"` |
| `monoColor` | `string` | `"#f5f5f0"` | CSS hex |
| `shadowColor` | `string` | `"#101010"` | CSS hex (duo-tone shadow) |
| `highlightColor` | `string` | `"#f5f2e8"` | CSS hex (duo-tone highlight) |
| `dotScale` | `number` | `1.0` | any float (dot size within cell) |
| `animateDither` | `boolean` | `false` | — |
| `ditherSpeed` | `number` | `1.0` | any float |
| `chromaticSplit` | `boolean` | `false` | — |

---

### `"edge-detect"`

**Kind:** `"effect"`

**Visual:** Sobel edge detection — traces luminance gradients to produce contour lines. Three colour modes: overlay (brighten edges over source), mono (custom line/bg colours), source (multiply source by edges only).

**Use cases:** postprocess (over 3D scenes), artistic overlay

**GPU cost:** Cheap (9 texture samples for Sobel kernel)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `threshold` | `number` | `0.1` | `0–1` |
| `strength` | `number` | `1` | `0.1–5` |
| `invert` | `boolean` | `false` | — |
| `colorMode` | `string` | `"overlay"` | `"mono"` \| `"overlay"` \| `"source"` |
| `lineColor` | `string` | `"#ffffff"` | CSS hex (mono mode) |
| `bgColor` | `string` | `"#000000"` | CSS hex (mono mode) |

---

### `"fluted-glass"`

**Kind:** `"effect"`

**Visual:** Frosted / fluted glass refraction — sinusoidal UV warping that mimics light passing through ribbed glass. Multiple presets control the warp profile.

**Use cases:** glass panels, overlay, hero accent

**GPU cost:** Cheap

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `preset` | `string` | not documented | preset name string |
| `frequency` | `number` | — | `2–100` |
| `amplitude` | `number` | — | `0–0.1` |
| `warp` | `number` | — | `0–1` |
| `irregularity` | `number` | — | `0–1` |
| `angle` | `number` | — | `0–360` (degrees) |

*(Note: `preset` values not fully enumerable from source grep; use the basement.studio editor to inspect available presets.)*

---

### `"halftone"`

**Kind:** `"effect"`

**Visual:** Halftone dot rendering with CMYK, monochrome, duotone, source, and custom colour modes. Full CMYK simulation with separate ink colours, angles, grey-component replacement, paper grain, registration offset, dot gain, and dot morph. Optional bloom on custom mode.

**Use cases:** hero, overlay, scroll reveal, artistic postprocess

**GPU cost:** Medium–Expensive (CMYK mode: 4 grid passes)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `colorMode` | `string` | `"cmyk"` | `"cmyk"` \| `"custom"` \| `"duotone"` \| `"monochrome"` \| `"source"` |
| `spacing` | `number` | `5` (default) / `12` (init) | `≥2` (pixels between dot centres) |
| `dotSize` | `number` | `1.0` | any float (relative to spacing) |
| `dotMin` | `number` | `0` | any float |
| `shape` | `string` | `"circle"` | `"circle"` \| `"diamond"` \| `"line"` \| `"square"` |
| `angle` | `number` | `0` | degrees |
| `contrast` | `number` | `1` | any float |
| `softness` | `number` | `0.25` | any float |
| `invertLuma` | `boolean` | `false` | — |
| `ink` | `string` | `"#0d1014"` | CSS hex (monochrome ink colour) |
| `duotoneLight` | `string` | `"#f5f5f0"` | CSS hex |
| `duotoneDark` | `string` | `"#1c1c1c"` | CSS hex |
| `customBgColor` | `string` | `"#F5F5F0"` | CSS hex |
| `customColorCount` | `number` | `4` | `2–4` |
| `customLuminanceBias` | `number` | `0` | `-1–1` |
| `customColor1`–`customColor4` | `string` | various | CSS hex |
| `cmykBlend` | `string` | `"subtractive"` | `"overprint"` \| `"subtractive"` |
| `cyanAngle` | `number` | `15` | degrees |
| `magentaAngle` | `number` | `75` | degrees |
| `yellowAngle` | `number` | `0` | degrees |
| `keyAngle` | `number` | `45` | degrees |
| `paperColor` | `string` | `"#F5F5F0"` | CSS hex |
| `paperGrain` | `number` | `0.15` | any float |
| `gcr` | `number` | `0.5` | Grey Component Replacement amount |
| `registration` | `number` | `0` | registration offset (pixels) |
| `inkCyan` | `string` | `"#00AEEF"` | CSS hex |
| `inkMagenta` | `string` | `"#EC008C"` | CSS hex |
| `inkYellow` | `string` | `"#FFF200"` | CSS hex |
| `inkKey` | `string` | `"#1a1a1a"` | CSS hex |
| `dotGain` | `number` | `0` | any float |
| `dotMorph` | `number` | `0` | `0–1` (meta-ball blending between dots) |
| `bloomEnabled` | `boolean` | `false` | (custom mode only) |
| `bloomIntensity` | `number` | `1.25` | `≥0` |
| `bloomThreshold` | `number` | `0.6` | `0–1` |
| `bloomRadius` | `number` | `6` | `≥0` |
| `bloomSoftness` | `number` | `0.35` | `0–1` |

---

### `"ink"`

**Kind:** `"effect"`

**Visual:** Multi-pass fluid ink simulation. Blurs input in a drip/flow direction with noise-driven turbulence, composites a crisp layer over the blurred one, applies a 4-stop colour gradient (background → edge → mid → core), optional film grain and bloom. Animated by default (smoke drifting).

**Use cases:** hero (organic/editorial), overlay, artistic postprocess

**GPU cost:** Expensive (12 blur passes + composite pass + optional bloom)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `blurDirection` | `number` | `68` | degrees |
| `blurPasses` | `number` | `12` | `≥1` (integer) |
| `crispPasses` | `number` | `3` | `≥1` (integer) |
| `blurStrength` | `number` | `0.02` | `≥0.001` |
| `crispBlend` | `number` | `0.75` | `0–1` |
| `dripLength` | `number` | `7.1` | `≥1` |
| `dripWeight` | `number` | `1.2` | `≥0.2` |
| `fluidNoise` | `number` | `0.2` | `≥0` |
| `noiseScale` | `number` | `1` | `≥0.5` |
| `smokeSpeed` | `number` | `0.2` | `≥0` (0 = static) |
| `smokeTurbulence` | `number` | `0.25` | `≥0` |
| `blurSpread` | `number` | `1.7` | `≥0.5` |
| `grainEnabled` | `boolean` | `true` | — |
| `grainIntensity` | `number` | `0.3` | `0–1` |
| `grainScale` | `number` | `1.5` | `≥0.5` |
| `backgroundColor` | `string` | `"#0a0b0d"` | CSS hex |
| `coreColor` | `string` | `"#fffde8"` | CSS hex |
| `midColor` | `string` | `"#c8f542"` | CSS hex |
| `edgeColor` | `string` | `"#00c9a7"` | CSS hex |
| `bloomEnabled` | `boolean` | `false` | — |
| `bloomIntensity` | `number` | `1.25` | `≥0` |
| `bloomThreshold` | `number` | `0.6` | `0–1` |
| `bloomRadius` | `number` | `6` | `≥0` |
| `bloomSoftness` | `number` | `0.35` | `0–1` |

---

### `"particle-grid"`

**Kind:** `"effect"`

**Visual:** A regular grid of instanced circular particles sampled from the input texture. Luma-driven Z-displacement creates a depth map relief. Optional simplex-noise animation drifts particles.

**Use cases:** hero (particle field), loader, artistic postprocess

**GPU cost:** Medium–Expensive (scales with `gridResolution²`, up to 512×512 = 262k instances)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `gridResolution` | `number` | `64` | `16–512` (integer; square grid NxN) |
| `pointSize` | `number` | `3` | any float (pixels) |
| `displacement` | `number` | `0.5` | any float (Z-axis depth from luma) |
| `backgroundColor` | `string` | `"#000000"` | CSS hex |
| `noiseAmount` | `number` | `0` | any float (0 = static) |
| `noiseScale` | `number` | `3` | any float |
| `noiseSpeed` | `number` | `0.5` | any float |
| `bloomEnabled` | `boolean` | `false` | — |
| `bloomIntensity` | `number` | `1.25` | `≥0` |
| `bloomThreshold` | `number` | `0.6` | `0–1` |
| `bloomRadius` | `number` | `6` | `≥0` |
| `bloomSoftness` | `number` | `0.35` | `0–1` |

**Note:** `gridResolution` changes trigger a full geometry rebuild. `pointSize` changes also trigger a rebuild. Both are therefore expensive to animate on the timeline.

---

### `"pattern"`

**Kind:** `"effect"`

**Visual:** Character/shape pattern atlas — divides the input into cells, maps each cell's luma to a pattern tile (bars, candles, shapes presets). Supports source, quantized, monochrome, and custom colour modes.

**Use cases:** hero (graphic), overlay, scroll reveal

**GPU cost:** Medium (async atlas build on preset/cellSize change)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `preset` | `string` | `"bars"` | `"bars"` \| `"candles"` \| `"shapes"` |
| `cellSize` | `number` | `12` | `≥4` (integer, triggers atlas rebuild) |
| `colorMode` | `string` | `"source"` | `"custom"` \| `"monochrome"` \| `"quantized"` \| `"source"` |
| `monoColor` | `string` | `"#f5f5f0"` | CSS hex |
| `bgOpacity` | `number` | `0` | `0–1` |
| `invert` | `boolean` | `false` | — |
| `customBgColor` | `string` | `"#F5F5F0"` | CSS hex |
| `customColorCount` | `number` | `4` | `2–4` |
| `customLuminanceBias` | `number` | `0` | `-1–1` |
| `customColor1`–`customColor4` | `string` | dark-to-light greys | CSS hex |
| `bloomEnabled` | `boolean` | `false` | — |
| `bloomIntensity` | `number` | `1.25` | `≥0` |
| `bloomThreshold` | `number` | `0.6` | `0–1` |
| `bloomRadius` | `number` | `6` | `≥0` |
| `bloomSoftness` | `number` | `0.35` | `0–1` |

**Important:** `"pattern"` is an **effect** layer — it transforms what is composited below it. To use it as a background, you typically combine it with a solid colour source layer underneath, or set `bgOpacity` to draw the source behind the pattern.

---

### `"pixelation"`

**Kind:** `"effect"`

**Visual:** Blocky pixelation — snaps each pixel to the centre of a rectangular cell. Cell aspect ratio can be non-1:1.

**Use cases:** transition (pixelate in/out), loader

**GPU cost:** Cheap (1 texture sample)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `cellSize` | `number` | `8` | `≥2` (integer) |
| `aspectRatio` | `number` | `1` | `0.25–4` (cell width/height ratio) |

---

### `"pixel-sorting"`

**Kind:** `"effect"`

**Visual:** Glitch pixel sorting using odd-even transposition sort. Sorts pixels horizontally or vertically by luma, hue (warmth), or saturation, constrained to a brightness band. Multiple passes create the characteristic streaky glitch look.

**Use cases:** hero (glitch), overlay, loader, postprocess

**GPU cost:** Expensive (O(n·passes) GPU render passes; default 150 passes)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `threshold` | `number` | `0.25` | `0–1` (lower band boundary) |
| `upperThreshold` | `number` | `1` | `0–1` (upper band boundary) |
| `direction` | `string` | `"horizontal"` | `"horizontal"` \| `"vertical"` |
| `mode` | `string` | `"luma"` | `"hue"` \| `"luma"` \| `"saturation"` |
| `reverse` | `boolean` | `false` | — |
| `range` | `number` | `0.3` | `0–1` (maps to pass count: `range × 300`, min 1) |

---

### `"plotter"`

**Kind:** `"effect"`

**Visual:** Pen plotter / hatching simulation — draws parallel lines or cross-hatch patterns at configurable angle, gap, and weight. Optional wobble for organic hand-drawn look.

**Use cases:** hero (editorial/print), overlay

**GPU cost:** Medium

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `colorMode` | `string` | — | colour mode string |
| `gap` | `number` | — | `10–120` |
| `weight` | `number` | — | `0.5–5` |
| `angle` | `number` | — | `0–180` (degrees) |
| `crosshatch` | `boolean` | `true` | — |
| `crossAngle` | `number` | — | `0–180` (degrees) |
| `threshold` | `number` | — | `0–1` |
| `wobble` | `number` | — | `0–1` |
| `paperColor` | `string` | — | CSS hex |
| `inkColor` | `string` | — | CSS hex |

---

### `"posterize"`

**Kind:** `"effect"`

**Visual:** Reduces colour to N discrete levels. RGB mode quantizes each channel independently; luma mode quantizes luminance then scales chroma. Optional gamma for non-linear distribution.

**Use cases:** transition (posterize ramp), overlay, artistic

**GPU cost:** Cheap

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `levels` | `number` | `5` | `2–16` (integer) |
| `gamma` | `number` | `1` | `0.4–2.5` |
| `mode` | `string` | `"rgb"` | `"luma"` \| `"rgb"` |

---

### `"slice"`

**Kind:** `"effect"`

**Visual:** Horizontal slice glitch — rows of pixels are horizontally displaced by varying amounts. Adds chromatic dispersion and a trailing smear. Speed, density, slice height, block width, and direction are all controllable.

**Use cases:** scroll reveal, hero (glitch), transition

**GPU cost:** Medium (4 texture samples per pixel)

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `amount` | `number` | `180` | `0–480` (max pixel displacement) |
| `sliceHeight` | `number` | `28` | `2–240` (pixels, integer) |
| `blockWidth` | `number` | `120` | `8–640` (pixels, integer) |
| `density` | `number` | `0.58` | `0–1` (fraction of blocks that glitch) |
| `dispersion` | `number` | `0.18` | `0–0.5` (chromatic split amount) |
| `speed` | `number` | `0.2` | `0–2` (0 = static) |
| `direction` | `string` | `"right"` | `"both"` \| `"left"` \| `"right"` |

---

### `"smear"`

**Kind:** `"effect"`

**Visual:** Directional motion smear / streak — samples pixels along an angle from `start` to `end` UV range with configurable strength and sample count.

**Use cases:** transition, hero (speed blur), overlay

**GPU cost:** Medium

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `angle` | `number` | — | `0–360` (degrees) |
| `start` | `number` | — | `0–1` (UV start of smear) |
| `end` | `number` | — | `0–1` (UV end of smear) |
| `strength` | `number` | — | `0–64` |
| `samples` | `number` | — | `4–MAX_SAMPLES` (integer) |

---

### `"threshold"`

**Kind:** `"effect"`

**Visual:** Binary luminance threshold — pixels above the threshold become white (or inverted), below become black. Optional softness for a smooth edge and noise for a organic/film grain threshold.

**Use cases:** overlay, transition (hard cut), artistic

**GPU cost:** Cheap

**Params:**

| Key | Type | Default | Valid Range / Options |
|-----|------|---------|----------------------|
| `threshold` | `number` | — | `0–1` |
| `softness` | `number` | — | `0–0.2` |
| `noise` | `number` | — | `0–0.3` |
| `invert` | `boolean` | `false` | — |

---

## Source Layer Catalog

Source layers generate pixels from scratch (not post-processing). They are used as base layers in compositions.

### `"gradient"` (source)

Built-in gradient generator. Params not fully exposed in pass source (managed internally). Use the basement.studio editor to configure and export gradient configs.

### `"image"` (source)

Renders a static image. Requires `layer.asset.src` (URL string) and `layer.asset.kind: "image"`.

### `"video"` (source)

Renders a video. Requires `layer.asset.src` (URL string) and `layer.asset.kind: "video"`.

### `"live"` (source)

Live camera input. No asset required; accesses `getUserMedia` on first render.

### `"text"` (source)

Text rendering layer. Params not fully documented in pass source. Use the editor.

### `"custom-shader"` (source/effect)

Custom TSL GPU shader. Requires `layer.sketch`:
- `{ mode: "inline", code: string, entryExport: string }` — inline TypeScript TSL code
- `{ mode: "module", sketch: unknown, entryExport?: string }` — pre-evaluated module

---

## Animatable Property Summary

All layers can animate these built-in layer properties via `{ kind: "layer" }` tracks:
- `opacity` (number, 0–1)
- `hue` (number, degrees)
- `saturation` (number)
- `visible` (boolean)

Layer-specific params are animated via `{ kind: "param", key: "<paramName>" }` tracks. The `key` must exactly match the param name from the sections above (flat, no dots, no nesting).

**Timeline interpolation modes:** `"linear"` | `"smooth"` | `"step"`
