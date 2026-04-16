# Authoring Custom Shader Compositions

Use this workflow when none of the 12 bundled presets fit your design intent, or when you want to visually refine an existing preset.

## When to author a new composition

- Design intent doesn't map to any preset in `presets/`
- You need a layer combination not covered by existing presets
- Visual refinement of a preset's colors, timing, or layer parameters beyond what `configOverride` provides

## Step-by-step workflow

### 1. Open the basement.studio Shader Lab editor

Navigate to https://basement.studio/shader-lab (hosted editor). The editor runs in your browser and produces `ShaderLabConfig` JSON.

### 2. Compose your layers

- Add source layers (gradient, image, video, text, custom-shader) as your base
- Stack effect layers (see `references/effect-catalog.md` for the full catalog of 20+ layer types)
- Adjust parameters using the editor's visual controls
- Preview in real time — the editor renders via WebGPU

### 3. Configure the timeline

- Set duration and loop behavior
- Add keyframe tracks to animate layer parameters over time
- Preview the full loop to verify timing and transitions

### 4. Export the composition JSON

Use the editor's **Export** action to download the composition as a JSON file. This JSON conforms to the `ShaderLabConfig` type from `@basementstudio/shader-lab`.

Save it to your project as:
```
src/components/shaders/<your-preset-name>/config.json
```

### 5. Capture a poster frame

The poster is the static fallback image for non-WebGPU browsers and `prefers-reduced-motion` users.

1. In the editor, pause the timeline at the most representative moment (usually t=0 for looping compositions)
2. Screenshot the canvas at 1920x1080 (or your composition's native resolution)
3. Save as JPEG at quality 85
4. Place alongside the config: `src/components/shaders/<your-preset-name>/poster.jpg`

### 6. Create the React wrapper

Copy an existing preset's `Component.tsx` as a template. The wrapper uses `createPresetComponent`:

```tsx
import { createPresetComponent } from "../../components/createPresetComponent"
import config from "./config.json"
import type { ShaderLabConfig } from "@basementstudio/shader-lab"

export const YourPresetName = createPresetComponent(config as ShaderLabConfig, "./poster.jpg")
```

### 7. Verify via Preview MCP

```bash
bun run dev
```

Then use Preview MCP to:
1. Navigate to the route mounting your composition
2. Check `preview_console_logs` for runtime errors
3. `preview_screenshot` to capture visual output
4. Test with WebGPU disabled to confirm poster fallback works

### 8. Commit

```bash
git add src/components/shaders/<your-preset-name>/
git commit -m "feat(shaders): add <your-preset-name> composition"
```

## Replacing a preset's placeholder poster (v1 → v1.1 refinement)

v1 ships agent-authored JSON with placeholder gradient posters. To upgrade:

1. Open the basement.studio editor
2. Paste the existing `config.json` into the editor (import/paste action)
3. Optionally tweak layers, colors, timing visually
4. Re-export the config JSON (overwrites `config.json` in place)
5. Capture a new poster frame from the editor canvas
6. Replace `poster.jpg` in the preset folder
7. Leave `Component.tsx` untouched — it imports config dynamically
8. Re-run Preview MCP verification, commit updated screenshots

## Notes

- The `Component.tsx` wrapper does NOT need changes when you swap configs — it imports `config.json` dynamically
- Always test both WebGPU rendering AND poster fallback after any config change
- Keep poster file size under 200KB for fast loading (JPEG quality 85 at 1920x1080 is typically 80-150KB)
