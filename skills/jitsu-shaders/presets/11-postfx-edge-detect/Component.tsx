"use client"

import { useShaderLabPostProcessingSource } from "@basementstudio/shader-lab"
import type { ShaderLabConfig } from "@basementstudio/shader-lab"
import type { WebGPURenderer } from "three/webgpu"
import baseConfig from "./config.json"

export type UsePostfxEdgeDetectOptions = {
  renderer?: WebGPURenderer
  width?: number
  height?: number
  pixelRatio?: number
  enabled?: boolean
}

/**
 * Hook: usePostfxEdgeDetect
 *
 * Runs the edge-detect postprocessing pipeline over an existing Three.js
 * WebGPU scene. Pass your scene's WebGPURenderer and target dimensions.
 * The returned `texture` is available when `ready === true`.
 *
 * @example
 * ```tsx
 * const { texture, ready, update } = usePostfxEdgeDetect({ renderer, width: 1920, height: 1080 })
 * // In your render loop: update(sceneTexture, clock.elapsedTime, delta)
 * ```
 */
export function usePostfxEdgeDetect(options: UsePostfxEdgeDetectOptions) {
  const config = baseConfig as unknown as ShaderLabConfig
  return useShaderLabPostProcessingSource(config, options)
}

/**
 * PostfxEdgeDetect
 *
 * A thin component wrapper around `usePostfxEdgeDetect`. Because this preset
 * operates as a postprocessing source (not a standalone canvas composition),
 * it does not render DOM output — it returns null and exposes its texture via
 * the `onTexture` callback once ready.
 *
 * For direct hook usage, prefer `usePostfxEdgeDetect` instead.
 */
type Props = UsePostfxEdgeDetectOptions & {
  onReady?: (texture: import("three").Texture) => void
  onRuntimeError?: (error: Error) => void
}

export function PostfxEdgeDetect({
  renderer,
  width,
  height,
  pixelRatio,
  enabled,
  onReady,
  onRuntimeError,
}: Props) {
  const { ready, error, texture } = usePostfxEdgeDetect({
    renderer,
    width,
    height,
    pixelRatio,
    enabled,
  })

  if (error && onRuntimeError) {
    onRuntimeError(error)
  }

  if (ready && texture && onReady) {
    onReady(texture)
  }

  return null
}
