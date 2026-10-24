/**
 * Runtime configuration.
 *
 * build.mjs writes the populated config to config.js at build time, reading
 * from the host's environment variables. In local dev Vite serves public/, so
 * the populated copy is written to config.local.js instead — public/config.js
 * holds a committed placeholder with no keys in it.
 *
 * Load both scripts in index.html: config.js first, then config.local.js. The
 * second one only exists locally, so in production it is a harmless 404 and
 * config.js alone is used.
 */

export interface RuntimeConfig {
  geminiApiKey?: string
  supabaseUrl?: string
  supabaseAnonKey?: string
}

declare global {
  interface Window {
    __KSE_CONFIG__?: Partial<RuntimeConfig>
  }
}

/** The runtime config, or an empty object when nothing was provided. */
export function runtimeConfig(): Partial<RuntimeConfig> {
  return window.__KSE_CONFIG__ ?? {}
}

/** True when the Supabase client has everything it needs to connect. */
export function isSupabaseConfigured(): boolean {
  const cfg = runtimeConfig()
  return Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey)
}

/** True when the Gemini key is present, so the chat can call the API. */
export function isGeminiConfigured(): boolean {
  return Boolean(runtimeConfig().geminiApiKey)
}
