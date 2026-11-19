// Menyalin undangan demo dari database lokal ke database produksi (upsert berdasarkan slug).
// Pakai (dari folder project): node scripts/demo-ke-cloud.mjs <slug>
// Butuh: database lokal jalan (npx supabase start) dan file .env.cloud (alamat + kunci service_role Supabase cloud, tidak di-commit).
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
const req = createRequire(import.meta.url);
const { createClient } = req("@supabase/supabase-js");

const slug = process.argv[2];
if (!slug) throw new Error("slug wajib");

const env = Object.fromEntries(
  fs.readFileSync(".env.cloud", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]),
);
const base = new URL(env.NEXT_PUBLIC_SUPABASE_URL).origin; // .env.cloud berisi alamat REST, supabase-js butuh alamat dasar
const host = new URL(base).host;
if (!host.endsWith(".supabase.co")) throw new Error("Bukan database cloud: " + host);

// Ambil isi dari database lokal
const row = JSON.parse(
  execFileSync("docker", [
    "exec", "supabase_db_nauvite-v2", "psql", "-U", "postgres", "-tAc",
    `select json_build_object('template_id', template_id, 'content', content, 'template_options', template_options) from invitations where slug='${slug.replace(/'/g, "")}'`,
  ]).toString(),
);

const db = createClient(base, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Pastikan ini project yang benar: demo lain harus sudah ada
const { data: cek, error: e1 } = await db.from("invitations").select("slug").like("slug", "contoh-%");
if (e1) throw e1;
console.log("demo yang sudah ada di produksi:", cek.map((r) => r.slug).join(", "));

const { data, error } = await db
  .from("invitations")
  .upsert(
    { slug, template_id: row.template_id, status: "active", active_until: null, content: row.content, template_options: row.template_options },
    { onConflict: "slug" },
  )
  .select("slug, template_id, status, active_until");
if (error) throw error;
console.log("tersimpan:", JSON.stringify(data));
