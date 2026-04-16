<div align="center">

# claude-shaders

**WebGPU shader baseline for Claude Code**

12 production-ready visual presets. Drop into any project. Poster fallback included.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?logo=gnu&logoColor=white)](LICENSE.md)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](https://github.com/0xjitsu/claude-shaders/releases/tag/v1.0.0)
[![Skills](https://img.shields.io/badge/skills-1-purple.svg?logo=anthropic&logoColor=white)](skills/jitsu-shaders/SKILL.md)
[![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-orange.svg?logo=anthropic&logoColor=white)](https://claude.ai/code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Quick Start](#quick-start) · [Presets](#whats-inside) · [How It Works](#how-it-works) · [Customize](#customization)

</div>

---

## Why This Exists

Shader effects should be a **baseline design consideration**, not an opt-in polish step added the week before launch.

Every landing hero, loading screen, route transition, and glass panel is a candidate for motion. But shader setup is a barrier — GPU detection, poster fallback, hydration safety, and config authoring all have to be figured out from scratch each time.

`claude-shaders` packages that work as a Claude Code plugin: 12 ready-to-use compositions for the most common design slots, a `ShaderOrFallback` component that handles WebGPU detection and `prefers-reduced-motion` gracefully, and full reference docs so an AI agent can compose new effects without leaving the editor.

---

## Quick Start

### Option 1 — Claude Code plugin (recommended)

```bash
claude mcp install https://github.com/0xjitsu/claude-shaders
```

Claude Code will auto-discover the `jitsu-shaders` skill and invoke it when you ask for hero sections, loaders, transitions, or ambient motion.

### Option 2 — curl installer

```bash
curl -fsSL https://raw.githubusercontent.com/0xjitsu/claude-shaders/main/install.sh | bash
```

Installs to `~/.claude/skills/jitsu-shaders/`. Restart Claude Code to pick it up.

### Option 3 — manual copy

```bash
git clone --depth 1 https://github.com/0xjitsu/claude-shaders
cp -R claude-shaders/skills/jitsu-shaders ~/.claude/skills/
```

### Add the dependency to your project

```bash
bun add @basementstudio/shader-lab three
# or
npm install @basementstudio/shader-lab three
```

---

## What's Inside

12 production-ready compositions across the most common design slots:

| Preset | Design Slot | Primary Layers |
|--------|------------|----------------|
| `01-hero-aurora` | Landing hero | gradient + particle-grid + directional-blur |
| `02-hero-terminal` | Technical / dev hero | gradient + ascii + crt |
| `03-hero-inkwash` | Editorial / research hero | gradient + ink |
| `04-loader-pulse` | App loader | gradient + dithering + directional-blur |
| `05-loader-scanline` | Technical loader | gradient + crt + pixel-sorting |
| `06-scroll-reveal-halftone` | Scroll reveal | gradient + halftone |
| `07-scroll-reveal-slice` | Dramatic reveal | gradient + slice |
| `08-glass-chromatic` | Glass panel accent | chromatic-aberration + fluted-glass |
| `09-transition-pixelate` | Route transition | gradient + pixelation |
| `10-transition-posterize` | Route transition | gradient + posterize |
| `11-postfx-edge-detect` | 3D scene overlay | edge-detect |
| `12-postfx-smear-hover` | Interactive tile hover | smear |

Each preset includes:
- `config.json` — fully-typed `ShaderLabConfig` composition
- `Component.tsx` — drop-in React component using `ShaderOrFallback`
- `poster.jpg` — static fallback frame for no-WebGPU environments

---

## How It Works

### Decision tree

```
Does the design need motion or atmosphere?
  └── yes → invoke jitsu-shaders (this skill)
        └── WebGPU available AND prefers-reduced-motion: no?
              ├── yes → render live shader composition
              └── no  → render poster.jpg (server-side safe, no hydration flash)
                    └── need custom GLSL or non-WebGPU guarantee?
                          └── defer to shader-artist skill
```

### ShaderOrFallback component

The `ShaderOrFallback` component in `skills/jitsu-shaders/components/` handles:

1. **SSR safety** — renders the poster on the server unconditionally (no hydration mismatch)
2. **WebGPU detection** — `detectWebGPU.ts` checks GPU availability client-side after mount
3. **Reduced motion** — respects `prefers-reduced-motion: reduce` by staying on poster
4. **Swap** — replaces poster with live shader only when all conditions pass

```tsx
import { ShaderOrFallback } from '~/.claude/skills/jitsu-shaders/components/ShaderOrFallback'
import config from '~/.claude/skills/jitsu-shaders/presets/01-hero-aurora/config.json'
import poster from '~/.claude/skills/jitsu-shaders/presets/01-hero-aurora/poster.jpg'

export function HeroSection() {
  return (
    <ShaderOrFallback
      config={config}
      poster={poster}
      className="w-full h-screen"
    />
  )
}
```

---

## Project Structure

```
claude-shaders/
├── .claude-plugin/
│   └── plugin.json              # Claude Code plugin manifest
├── skills/
│   └── jitsu-shaders/
│       ├── SKILL.md             # Skill definition + trigger rules
│       ├── components/
│       │   ├── ShaderOrFallback.tsx    # Drop-in component
│       │   ├── detectWebGPU.ts         # GPU detection utility
│       │   └── createPresetComponent.tsx
│       ├── presets/
│       │   ├── 01-hero-aurora/
│       │   │   ├── config.json
│       │   │   ├── Component.tsx
│       │   │   └── poster.jpg
│       │   └── ... (12 presets total)
│       └── references/
│           ├── effect-catalog.md       # Full layer type reference
│           ├── decision-tree.md        # When to use each skill
│           ├── authoring-workflow.md   # Create custom compositions
│           └── webgpu-support-matrix.md
├── scripts/
│   └── sync-from-jitsu-os.sh   # One-way sync from source repo
├── install.sh                   # curl installer
├── LICENSE.md                   # AGPL v3 + dual-license
└── CONTRIBUTING.md              # Contribution guide + CLA
```

---

## Customization

To compose a new shader effect:

1. Open [basement.studio/shader-lab](https://basement.studio/shader-lab)
2. Build your composition visually using the layer editor
3. Export the JSON config
4. Create a new preset folder: `skills/jitsu-shaders/presets/XX-your-name/`
5. Add `config.json`, `Component.tsx` (copy any existing one), and `poster.jpg`

See `skills/jitsu-shaders/references/authoring-workflow.md` for the full workflow and `references/effect-catalog.md` for all 20+ layer types with property schemas.

---

<details>
<summary>Developer setup — syncing from jitsu-os</summary>

This repo is a downstream distribution package. The canonical source of the `jitsu-shaders` skill lives in [jitsu-os](https://github.com/0xjitsu/jitsu-os).

To sync updates from the source:

```bash
# With jitsu-os cloned at ~/jitsu-os (default)
./scripts/sync-from-jitsu-os.sh

# Or with a custom path
JITSU_OS=/path/to/jitsu-os ./scripts/sync-from-jitsu-os.sh
```

The sync script copies only distributable files — SKILL.md, references/, components/, presets/ — and strips test files and node_modules.

</details>

---

## Powered by

Built on [**@basementstudio/shader-lab**](https://github.com/basementstudio/shader-lab) by [basement.studio](https://basement.studio) — a portable React runtime for composing, stacking, and animating WebGPU shader layers. The visual authoring editor is hosted at [basement.studio/shader-lab](https://basement.studio/shader-lab).

Part of [**jitsu-os**](https://github.com/0xjitsu/jitsu-os) — an open-source AI agent skill system.

---

## Tech Stack

| Library | Role |
|---------|------|
| [![@basementstudio/shader-lab](https://img.shields.io/badge/@basementstudio%2Fshader--lab-latest-black.svg)](https://github.com/basementstudio/shader-lab) | WebGPU composition engine |
| [![three](https://img.shields.io/badge/three.js-peer_dep-049EF4.svg?logo=threedotjs&logoColor=white)](https://threejs.org) | 3D runtime (peer dependency) |
| [![React](https://img.shields.io/badge/React-18%2B-61DAFB.svg?logo=react&logoColor=black)](https://react.dev) | Component model |
| [![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6.svg?logo=typescript&logoColor=white)](https://typescriptlang.org) | Type safety |
| [![WebGPU](https://img.shields.io/badge/WebGPU-native-005A9C.svg)](https://gpuweb.github.io/gpuweb/) | GPU rendering API |

---

## License

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?logo=gnu&logoColor=white)](LICENSE.md)
[![Commercial License Available](https://img.shields.io/badge/Commercial_License-available-gold.svg)](https://github.com/0xjitsu/claude-shaders/issues)

This project is licensed under **AGPL v3** — free for open source use. Modifications must be shared under the same license.

A **commercial license** is available for proprietary use. Contact [@0xjitsu](https://github.com/0xjitsu) on GitHub.

**Note:** `@basementstudio/shader-lab` is a separate open-source project by [basement.studio](https://basement.studio) under its own license. This plugin wraps it as a Claude Code skill but does not modify or redistribute the library itself — it is installed as a standard npm dependency in your project.

Contributions require agreeing to the [CLA in CONTRIBUTING.md](CONTRIBUTING.md), which grants the maintainer perpetual relicensing rights to support the dual-license model.

---

<div align="center">

**shader effects should be a baseline, not an afterthought**

[Install](https://github.com/0xjitsu/claude-shaders#quick-start) · [Report a Bug](https://github.com/0xjitsu/claude-shaders/issues) · [Request a Preset](https://github.com/0xjitsu/claude-shaders/issues)

</div>
