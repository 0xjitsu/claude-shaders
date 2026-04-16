"use client"

import { ShaderLabComposition, type ShaderLabConfig } from "@basementstudio/shader-lab"
import { ShaderOrFallback } from "../../components/ShaderOrFallback"
import baseConfig from "./config.json"

type Props = {
  /** Scroll progress: 0 (fully pixelated) → 1 (fully revealed) */
  progress: number
  className?: string
  onRuntimeError?: (message: string | null) => void
}

const poster = new URL("./poster.jpg", import.meta.url).href

export function ScrollRevealHalftone({ progress, className, onRuntimeError }: Props) {
  // Map progress 0→1 to spacing 80→2 (large dots at 0, fine dots at 1)
  const spacing = Math.max(2, Math.round(80 - progress * 78))

  const config: ShaderLabConfig = {
    ...(baseConfig as unknown as ShaderLabConfig),
    layers: (baseConfig as unknown as ShaderLabConfig).layers.map((layer) => {
      if (layer.id === "halftone") {
        return {
          ...layer,
          params: { ...layer.params, spacing },
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
