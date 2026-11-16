/**
 * Klien boleh masuk dengan username (tanpa email), seperti di v1 yang memakai slug.
 * Supabase Auth butuh email, jadi username disimpan sebagai email internal
 * "<username>@klien.nauvite.id". Alamat ini tidak pernah dipakai mengirim email.
 */
export const LOGIN_DOMAIN = "klien.nauvite.id";

const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{1,48}[a-z0-9]$/;

/** "budi-ani" -> "budi-ani@klien.nauvite.id"; email biasa dikembalikan apa adanya. */
export function toAuthEmail(identifier: string): string | null {
  const id = identifier.trim().toLowerCase();
  if (id.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id) ? id : null;
  return USERNAME_RE.test(id) ? `${id}@${LOGIN_DOMAIN}` : null;
}

/** Kebalikan toAuthEmail, untuk ditampilkan ke admin/klien. */
export function displayLogin(email: string | null | undefined): string {
  if (!email) return "";
  return email.endsWith(`@${LOGIN_DOMAIN}`) ? email.slice(0, -LOGIN_DOMAIN.length - 1) : email;
}

/** Password acak yang mudah dibaca dan diketik (tanpa huruf mirip seperti l/1/O/0). */
export function generatePassword(length = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}
