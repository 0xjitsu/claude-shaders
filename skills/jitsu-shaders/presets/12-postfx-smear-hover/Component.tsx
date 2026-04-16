"use client"

import { ShaderLabComposition, type ShaderLabConfig } from "@basementstudio/shader-lab"
import { ShaderOrFallback } from "../../components/ShaderOrFallback"
import baseConfig from "./config.json"

type CursorState = {
  /** Normalized X position 0–1 */
  x: number
  /** Normalized Y position 0–1 */
  y: number
  /** Whether cursor is actively hovering */
  active: boolean
}

type Props = {
  cursor: CursorState
  className?: string
  onRuntimeError?: (message: string | null) => void
}

const poster = new URL("./poster.jpg", import.meta.url).href

export function PostfxSmearHover({ cursor, className, onRuntimeError }: Props) {
  // Map cursor activity to smear strength; derive angle from cursor position
  const strength = cursor.active ? 32 : 0
  // Angle based on horizontal cursor position: left = 180°, right = 0°
  const angle = Math.round((1 - cursor.x) * 180)

  const config: ShaderLabConfig = {
    ...(baseConfig as unknown as ShaderLabConfig),
    layers: (baseConfig as unknown as ShaderLabConfig).layers.map((layer) => {
      if (layer.id === "smear") {
        return {
          ...layer,
          params: { ...layer.params, strength, angle },
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
