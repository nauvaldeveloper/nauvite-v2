import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_URL } from "./env";

/**
 * Klien Supabase dengan kunci service_role: MELEWATI semua aturan RLS.
 * Hanya untuk tugas server yang memang butuh, misalnya admin membuat akun
 * login klien. Selalu cek dulu bahwa pemanggilnya admin sebelum memakainya.
 * Jangan pernah diimpor dari komponen 'use client'.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local");
  }
  return createSupabaseClient<Database>(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
