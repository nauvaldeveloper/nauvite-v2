// Memindahkan satu undangan dari Nauvite v1 ke v2.
//
// Pemakaian:
//   node scripts/pindah-v1.mjs <slug>                 -> ke database LOKAL (.env.local)
//   node scripts/pindah-v1.mjs <slug> --cloud         -> ke database CLOUD (.env.cloud)
//   tambah --ganti untuk menimpa undangan v2 dengan slug yang sama
//
// Yang dibutuhkan di file env:
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (tujuan, v2)
//   V1_SUPABASE_URL, V1_SUPABASE_ANON_KEY                 (sumber, v1, hanya dibaca)
//
// v1 tidak diubah sama sekali. Foto dan lagu dari storage v1 disalin ke bucket
// v2 `invitation-media/<id undangan>/`, lalu alamatnya di config diganti.

import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const toCloud = args.includes("--cloud");
const replace = args.includes("--ganti");
if (!slug) {
  console.error("Tulis slug undangan, mis: node scripts/pindah-v1.mjs tria-alziad");
  process.exit(1);
}

function loadEnv(file) {
  const env = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const envFile = toCloud ? ".env.cloud" : ".env.local";
const env = { ...loadEnv(".env.local"), ...(toCloud ? loadEnv(".env.cloud") : {}) };
for (const k of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "V1_SUPABASE_URL", "V1_SUPABASE_ANON_KEY"]) {
  if (!env[k]) {
    console.error(`${k} belum diisi (dicari di ${envFile} / .env.local).`);
    process.exit(1);
  }
}
// Cukup alamat dasarnya (https://xxx.supabase.co), buang /rest/v1/ dsb. kalau ikut tertempel.
for (const k of ["NEXT_PUBLIC_SUPABASE_URL", "V1_SUPABASE_URL"]) env[k] = new URL(env[k].trim()).origin;

const v1 = createClient(env.V1_SUPABASE_URL, env.V1_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const v2 = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

console.log(`Tujuan: ${toCloud ? "CLOUD" : "LOKAL"} (${new URL(env.NEXT_PUBLIC_SUPABASE_URL).host})`);

// 1. Baca dari v1
const { data: inv, error: e1 } = await v1
  .from("invitations")
  .select("slug, config, expiry_days, created_at")
  .eq("slug", slug)
  .maybeSingle();
if (e1 || !inv) {
  console.error("Undangan tidak ditemukan di v1:", e1?.message ?? slug);
  process.exit(1);
}
const { data: wishes = [] } = await v1
  .from("wishes")
  .select("name, message, attendance, created_at")
  .eq("slug", slug);
const config = inv.config ?? {};
const templateId = config.theme || "royal-gold";
console.log(`Ditemukan: tema ${templateId}, ${wishes.length} ucapan`);

// 2. Cek slug di v2
const { data: existing } = await v2.from("invitations").select("id").eq("slug", slug).maybeSingle();
if (existing && !replace) {
  console.error(`Slug "${slug}" sudah ada di v2. Tambahkan --ganti kalau mau menimpa.`);
  process.exit(1);
}
const id = existing?.id ?? randomUUID();

// 3. Salin file dari storage v1
const v1Prefix = `${env.V1_SUPABASE_URL}/storage/v1/object/public/`;
const urls = new Set();
(function collect(v) {
  if (typeof v === "string" && v.startsWith(v1Prefix)) urls.add(v);
  else if (Array.isArray(v)) v.forEach(collect);
  else if (v && typeof v === "object") Object.values(v).forEach(collect);
})(config);

const moved = new Map();
let n = 0;
for (const url of urls) {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Lewati (gagal unduh ${res.status}): ${url}`);
    continue;
  }
  const type = res.headers.get("content-type") || "application/octet-stream";
  const base = decodeURIComponent(url.split("/").pop().split("?")[0]).replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${id}/v1-${++n}-${base}`;
  const { error } = await v2.storage
    .from("invitation-media")
    .upload(path, Buffer.from(await res.arrayBuffer()), { contentType: type, upsert: true });
  if (error) {
    console.warn(`  Lewati (gagal unggah: ${error.message}): ${base}`);
    continue;
  }
  moved.set(url, path);
}
console.log(`File disalin: ${moved.size} dari ${urls.size}`);

const content = JSON.parse(JSON.stringify(config), (_k, v) => (typeof v === "string" && moved.has(v) ? moved.get(v) : v));

// 4. Simpan undangan
const activeUntil = new Date(new Date(inv.created_at).getTime() + (inv.expiry_days ?? 90) * 86400000).toISOString();
const row = { id, slug, template_id: templateId, status: "active", active_until: activeUntil, content };
const { error: e2 } = existing
  ? await v2.from("invitations").update(row).eq("id", id)
  : await v2.from("invitations").insert(row);
if (e2) {
  console.error("Gagal menyimpan undangan:", e2.message);
  process.exit(1);
}

// 5. Ucapan (dilewati kalau undangan ditimpa, supaya tidak dobel)
const att = (a) => {
  const s = String(a ?? "").toLowerCase();
  if (/tidak|absen|no/.test(s)) return "tidak_hadir";
  if (/hadir|yes|ya/.test(s)) return "hadir";
  return s ? "belum_pasti" : null;
};
if (wishes.length && !existing) {
  const { error: e3 } = await v2.from("wishes").insert(
    wishes.map((w) => ({
      invitation_id: id,
      name: String(w.name || "Tamu").slice(0, 60),
      message: w.message ? String(w.message).slice(0, 500) : null,
      attendance: att(w.attendance),
      created_at: w.created_at,
    })),
  );
  if (e3) console.warn("Ucapan gagal dipindah:", e3.message);
}

console.log(`Selesai. Undangan aktif sampai ${activeUntil.slice(0, 10)}. Cek di /${slug}`);
