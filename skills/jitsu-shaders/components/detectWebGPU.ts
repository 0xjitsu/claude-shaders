export async function detectWebGPU(): Promise<boolean> {
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
