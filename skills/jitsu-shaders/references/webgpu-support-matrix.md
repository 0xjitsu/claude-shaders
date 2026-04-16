# WebGPU Support Matrix

## Global support (Q1 2026)

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 113+ (all platforms) | Stable |
| Edge | 113+ | Stable |
| Safari | 17.4+ (macOS, iOS) | Stable |
| Firefox | 121+ (Windows) | Stable; macOS/Linux flag-gated |
| Opera | 99+ | Stable |
| Samsung Internet | 24+ | Stable |

**Estimated total reach:** ~88–92% of global web traffic.

## Runtime detection

Always feature-detect at runtime. Never gate by user-agent string.

```ts
async function hasWebGPU(): Promise<boolean> {
  if (typeof navigator === "undefined") return false
  const gpu = (navigator as Navigator & { gpu?: GPU }).gpu
  if (!gpu) return false
  try {
    const adapter = await gpu.requestAdapter()
    return !!adapter
  } catch {
    return false
  }
}
```

## When to render the poster fallback

1. `navigator.gpu` is `undefined`
2. `requestAdapter()` returns `null` (software-only GPU, no hardware acceleration)
3. `requestAdapter()` throws (driver crash, security policy)
4. `prefers-reduced-motion: reduce` is set — accessibility override, fall back even on WebGPU-capable devices
5. Project `.env` has `JITSU_SHADERS=false` — opt-out flag checked at design time, not runtime

## Fallback asset requirements

Every preset ships a `poster.jpg`:
- Resolution: 1920x1080 (or composition native size)
- Format: JPEG, quality 85
- Content: gradient matching the composition's dominant palette (v1 placeholder), or a frame capture from the basement.studio editor (v1.1 refinement)
- Loaded unconditionally (cache-friendly), swapped to shader only after client-side detection confirms WebGPU

## Hydration safety

`<ShaderOrFallback>` renders `<img src={poster}>` on the server and during SSR hydration. The client-side `useEffect` runs detection asynchronously, then swaps to the shader `<canvas>` only on success. This guarantees identical server and pre-hydration client markup — no hydration mismatch.
