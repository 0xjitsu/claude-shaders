export { HeroAurora } from "./01-hero-aurora/Component"
export { HeroTerminal } from "./02-hero-terminal/Component"
export { HeroInkwash } from "./03-hero-inkwash/Component"
export { LoaderPulse } from "./04-loader-pulse/Component"
export { LoaderScanline } from "./05-loader-scanline/Component"
export { ScrollRevealHalftone } from "./06-scroll-reveal-halftone/Component"
export { ScrollRevealSlice } from "./07-scroll-reveal-slice/Component"
export { GlassChromatic } from "./08-glass-chromatic/Component"
export { TransitionPixelate } from "./09-transition-pixelate/Component"
export { TransitionPosterize } from "./10-transition-posterize/Component"
export { PostfxEdgeDetect, usePostfxEdgeDetect } from "./11-postfx-edge-detect/Component"
export { PostfxSmearHover } from "./12-postfx-smear-hover/Component"

export const PRESET_SLUGS = [
  "01-hero-aurora",
  "02-hero-terminal",
  "03-hero-inkwash",
  "04-loader-pulse",
  "05-loader-scanline",
  "06-scroll-reveal-halftone",
  "07-scroll-reveal-slice",
  "08-glass-chromatic",
  "09-transition-pixelate",
  "10-transition-posterize",
  "11-postfx-edge-detect",
  "12-postfx-smear-hover",
] as const

export type PresetSlug = (typeof PRESET_SLUGS)[number]
