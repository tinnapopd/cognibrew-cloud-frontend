/**
 * Runtime environment helper.
 *
 * In production the Docker entrypoint writes /config.js which sets
 * window.__ENV__. In development Vite's import.meta.env is used instead.
 */

interface RuntimeEnv {
  VITE_API_URL?: string
  VITE_EMBED_URL?: string
}

declare global {
  interface Window {
    __ENV__?: RuntimeEnv
  }
}

function getEnv(key: keyof RuntimeEnv): string {
  // 1. Runtime injection (K8s / Docker)
  // Ensure we accept explicit empty strings ("") without falling back
  if (typeof window !== "undefined" && typeof window.__ENV__ !== "undefined") {
    if (typeof window.__ENV__[key] === "string") {
      return window.__ENV__[key]
    }
  }

  // 2. Vite build-time fallback (dev server)
  const buildTime = import.meta.env[key] as string | undefined
  if (typeof buildTime === "string") return buildTime

  // 3. Empty string — will use relative URLs / Vite proxy
  return ""
}

export const ENV = {
  API_URL: getEnv("VITE_API_URL"),
  EMBED_URL: getEnv("VITE_EMBED_URL"),
} as const
