"use client"

import { ShaderLabComposition, type ShaderLabConfig } from "@basementstudio/shader-lab"
import { ShaderOrFallback } from "./ShaderOrFallback"

type PresetComponentProps = {
  className?: string
  configOverride?: Partial<ShaderLabConfig>
  onRuntimeError?: (message: string | null) => void
}

export function createPresetComponent(defaultConfig: ShaderLabConfig, poster: string) {
  return function PresetComponent({ className, configOverride, onRuntimeError }: PresetComponentProps) {
    const config: ShaderLabConfig = configOverride
      ? { ...defaultConfig, ...configOverride }
      : defaultConfig

    return (
      <ShaderOrFallback poster={poster} className={className}>
        <div className={className}>
          <ShaderLabComposition config={config} onRuntimeError={onRuntimeError} />
        </div>
      </ShaderOrFallback>
    )
  }
}
