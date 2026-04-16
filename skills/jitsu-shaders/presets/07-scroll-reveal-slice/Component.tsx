"use client"

import { ShaderLabComposition, type ShaderLabConfig } from "@basementstudio/shader-lab"
import { ShaderOrFallback } from "../../components/ShaderOrFallback"
import baseConfig from "./config.json"

type Props = {
  /** Scroll progress: 0 (full glitch) → 1 (clean) */
  progress: number
  className?: string
  onRuntimeError?: (message: string | null) => void
}

const poster = new URL("./poster.jpg", import.meta.url).href

export function ScrollRevealSlice({ progress, className, onRuntimeError }: Props) {
  // Map progress 0→1 to amount 480→0 (heavy glitch at 0, clean at 1)
  const amount = Math.round((1 - progress) * 480)

  const config: ShaderLabConfig = {
    ...(baseConfig as unknown as ShaderLabConfig),
    layers: (baseConfig as unknown as ShaderLabConfig).layers.map((layer) => {
      if (layer.id === "slice") {
        return {
          ...layer,
          params: { ...layer.params, amount },
        }
      }
      return layer
    }),
  }

  return (
    <ShaderOrFallback poster={poster} className={className}>
      <div className={className}>
        <ShaderLabComposition config={config} onRuntimeError={onRuntimeError} />
      </div>
    </ShaderOrFallback>
  )
}
