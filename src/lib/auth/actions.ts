"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homeFor, type Role } from "./dal";
import { toAuthEmail } from "./login-id";

export type LoginState = { error?: string; identifier?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!identifier || !password) {
    return { error: "Isi username/email dan password.", identifier };
  }
  const email = toAuthEmail(identifier);
  if (!email) return { error: "Username atau email tidak valid.", identifier };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { error: "Username/email atau password salah.", identifier };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect(safeNextPath(next) ?? homeFor((profile?.role as Role) ?? "client"));
}

/**
 * Hanya izinkan tujuan di dalam situs ini. Browser membaca "/\situs-lain.com" sama
 * dengan "//situs-lain.com" (alamat luar), jadi garis miring terbalik, spasi, dan
 * karakter kontrol ditolak, lalu hasilnya dicek ulang dengan parser URL.
 */
function safeNextPath(next: string): string | null {
  if (!next.startsWith("/") || /[\\\s\u0000-\u001f]/.test(next)) return null;
  try {
    const base = "https://nauvite.invalid";
    const url = new URL(next, base);
    return url.origin === base ? url.pathname + url.search + url.hash : null;
  } catch {
    return null;
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/masuk");
}
