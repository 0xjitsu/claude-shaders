"use client"

import { createPresetComponent } from "../../components/createPresetComponent"
import config from "./config.json"
import type { ShaderLabConfig } from "@basementstudio/shader-lab"

export const TransitionPixelate = createPresetComponent(
  config as unknown as ShaderLabConfig,
  new URL("./poster.jpg", import.meta.url).href
)
