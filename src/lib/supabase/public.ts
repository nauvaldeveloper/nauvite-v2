import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Klien Supabase sebagai tamu (tanpa cookie, tanpa sesi).
 * Untuk data publik seperti halaman undangan, sehingga bisa dipakai
 * di dalam fungsi 'use cache'.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
