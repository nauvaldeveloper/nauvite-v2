import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Klien Supabase untuk Server Component, Server Action, dan Route Handler,
 * bertindak sebagai user yang sedang login (atau tamu kalau belum login).
 * Semua aturan RLS tetap berlaku.
 *
 * Membaca cookie, jadi hanya boleh dipanggil saat request (di dalam <Suspense>),
 * bukan di dalam fungsi 'use cache'. Buat baru di setiap request.
 */
export async function createClient() {
  // Menandai bahwa ini pekerjaan saat request. Library Supabase memakai jam
  // (Date.now) untuk mengecek masa berlaku login, yang hanya boleh dilakukan saat request.
  await connection();
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component tidak bisa menulis cookie. Aman diabaikan karena
          // sesi diperbarui oleh src/proxy.ts di setiap request.
        }
      },
    },
  });
}
