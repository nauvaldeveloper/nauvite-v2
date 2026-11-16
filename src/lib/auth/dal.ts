import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Lapisan akses data untuk login. Semua halaman dan Server Action yang butuh
 * login memanggil fungsi di sini, jadi pengecekan selalu terjadi di server.
 */

export type Role = "admin" | "client" | "partner";

export type CurrentUser = {
  id: string;
  email: string | null;
  role: Role;
  fullName: string | null;
  businessName: string | null;
};

/** User yang sedang login, atau null. Dihitung sekali per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  // getClaims memverifikasi token login, bukan sekadar membaca cookie.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, business_name")
    .eq("id", claims.sub)
    .single();
  if (!profile) return null;

  return {
    id: claims.sub,
    email: (claims.email as string | undefined) ?? null,
    role: profile.role as Role,
    fullName: profile.full_name,
    businessName: profile.business_name,
  };
});

/** Wajib login. Kalau belum, diarahkan ke halaman masuk. */
export async function requireUser(next?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/masuk?next=${encodeURIComponent(next)}` : "/masuk");
  return user;
}

/** Wajib admin. User lain diarahkan ke dasbornya sendiri. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (user.role !== "admin") redirect(homeFor(user.role));
  return user;
}

export function homeFor(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "partner") return "/mitra/dasbor";
  return "/dasbor";
}
