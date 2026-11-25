// Memasang satu lagu ke undangan demo tertentu, di database lokal dan produksi.
// Lagu disimpan di storage (bukan Git) supaya mudah diganti atau diturunkan.
// Pakai: node scripts/lagu-demo.mjs <file.mp3> <nama-di-storage> <slug> [slug ...]
// Hanya isian "music" yang diubah. Butuh .env.local (lokal) dan .env.cloud (produksi).
import { createRequire } from "node:module";
import fs from "node:fs";
const req = createRequire(import.meta.url);
const { createClient } = req("@supabase/supabase-js");

const [file, name, ...slugs] = process.argv.slice(2);
if (!file || !name || !slugs.length) throw new Error("Pakai: node scripts/lagu-demo.mjs <file.mp3> <nama> <slug ...>");
if (slugs.some((s) => s !== "dimas-laras" && !s.startsWith("contoh-"))) throw new Error("Hanya untuk undangan demo");

const readEnv = (path) =>
  Object.fromEntries(
    fs.readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.includes("=") && !l.startsWith("#"))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]),
  );

for (const path of [".env.local", ".env.cloud"]) {
  const env = readEnv(path);
  const key = env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY;
  const db = createClient(new URL(env.NEXT_PUBLIC_SUPABASE_URL).origin, key, { auth: { persistSession: false } });
  const target = `demo/${name}`;
  const { error: up } = await db.storage
    .from("invitation-media")
    .upload(target, fs.readFileSync(file), { contentType: "audio/mpeg", cacheControl: "31536000", upsert: true });
  if (up) throw up;
  const { data, error } = await db.from("invitations").select("id, slug, content").in("slug", slugs);
  if (error) throw error;
  for (const row of data) {
    const { error: e } = await db.from("invitations").update({ content: { ...row.content, music: target } }).eq("id", row.id);
    if (e) throw e;
  }
  const found = new Set(data.map((r) => r.slug));
  console.log(path, "terpasang:", found.size, "| tidak ada:", slugs.filter((s) => !found.has(s)).join(", ") || "-");
}
