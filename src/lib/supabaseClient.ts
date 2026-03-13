import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const configured = Boolean(url && anonKey);

if (!configured) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Adawaty] Supabase not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. " +
      "Forms will degrade gracefully."
  );
}

// Use a valid placeholder URL so createClient() never throws.
// All actual requests will fail (network error) which we catch in supabaseService.ts.
const SAFE_URL = url && url.startsWith("https://") ? url : "https://placeholder.supabase.co";
const SAFE_KEY = anonKey ?? "placeholder-anon-key";

export const supabase: SupabaseClient = createClient(SAFE_URL, SAFE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

/** True only when real credentials are present */
export const supabaseReady = configured;
