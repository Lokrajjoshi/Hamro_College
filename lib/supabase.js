import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client = null;

// Returns null when Supabase isn't configured, so the app can fall back
// to local data instead of crashing.
export function getSupabase() {
  if (!url || !anonKey) return null;
  if (!client) client = createClient(url, anonKey, { auth: { persistSession: false } });
  return client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);
