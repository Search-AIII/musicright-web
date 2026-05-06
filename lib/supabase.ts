import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

// Public client — for frontend use (RLS enforced)
export function getSupabaseClient() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

// Service client — for API routes only (bypasses RLS)
export function getSupabaseAdmin() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}
