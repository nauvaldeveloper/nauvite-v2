// Alamat dan kunci publik Supabase. Aman dipakai di browser:
// yang menjaga data adalah aturan RLS di database, bukan kerahasiaan kunci ini.
export const SUPABASE_URL = required(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL",
);
export const SUPABASE_ANON_KEY = required(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
);

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} belum diisi. Cek file .env.local (lihat docs/DEPLOY.md).`);
  }
  return value;
}
