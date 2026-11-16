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

  // Hanya izinkan tujuan di dalam situs ini.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : null;
  redirect(safeNext ?? homeFor((profile?.role as Role) ?? "client"));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/masuk");
}
