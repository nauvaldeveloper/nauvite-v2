import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePassword, toAuthEmail } from "./login-id";

/**
 * Membuat akun login dengan kunci server. Pemanggil wajib mengecek izinnya dulu
 * (admin, atau pendaftaran uji coba yang sudah lolos pembatas).
 */
export async function createLoginAccount(input: {
  login: string;
  password?: string;
  fullName?: string;
  whatsapp?: string;
  role?: "client" | "partner";
  businessName?: string;
  businessUrl?: string;
}): Promise<{ ok: true; userId: string; password: string } | { ok: false; error: string }> {
  const email = toAuthEmail(input.login);
  if (!email) return { ok: false, error: "Username/email login tidak valid." };

  const password = input.password ?? generatePassword();
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: input.fullName ?? "" },
  });
  if (error || !data.user) {
    const taken = /already|registered|exists/i.test(error?.message ?? "");
    return { ok: false, error: taken ? "Username/email ini sudah dipakai akun lain." : `Gagal membuat akun: ${error?.message}` };
  }

  // Profil dibuat otomatis oleh database (role client). Lengkapi datanya.
  const { error: profileError } = await admin
    .from("profiles")
    .update({
      role: input.role ?? "client",
      full_name: input.fullName || null,
      whatsapp: input.whatsapp || null,
      business_name: input.businessName || null,
      business_url: input.businessUrl || null,
    })
    .eq("id", data.user.id);
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { ok: false, error: `Gagal menyimpan profil akun: ${profileError.message}` };
  }

  return { ok: true, userId: data.user.id, password };
}
