"use client"

import { useEffect, useState, type ReactNode } from "react"
import { detectWebGPU } from "./detectWebGPU"

type Props = {
  children: ReactNode
  poster: string
  className?: string
  posterAlt?: string
}

type Status = "ssr" | "detecting" | "shader" | "poster"

function useShaderEligibility(): Status {
  const [status, setStatus] = useState<Status>("ssr")

  useEffect(() => {
    setStatus("detecting")
    let cancelled = false

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      setStatus("poster")
      return () => { cancelled = true }
    }

    detectWebGPU().then((ok) => {
      if (cancelled) return
      setStatus(ok ? "shader" : "poster")
    })

    return () => { cancelled = true }
  }, [])

  return status
}

export function ShaderOrFallback({ children, poster, className, posterAlt = "" }: Props) {
  const status = useShaderEligibility()

  if (status === "shader") {
    return <>{children}</>
  }

  return (
    <img
      src={poster}
      alt={posterAlt}
      aria-hidden={posterAlt === "" ? true : undefined}
      className={className}
      draggable={false}
    />
  )
}
