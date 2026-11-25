// Uji keamanan daftar tamu dan uji coba gratis di Supabase LOKAL (tanpa reset database).
// Jalankan: node scripts/test-tamu-uji-coba.mjs
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const { createClient } = createRequire(import.meta.url)("@supabase/supabase-js");
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]),
);
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
if (!/127\.0\.0\.1|localhost/.test(URL_)) throw new Error("Hanya untuk database lokal");
const client = (key) => createClient(URL_, key, { auth: { persistSession: false } });
const admin = client(env.SUPABASE_SERVICE_ROLE_KEY);
const anon = client(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const login = async (email) => {
  const c = client(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { error } = await c.auth.signInWithPassword({ email, password: "password123" });
  if (error) throw error;
  return c;
};
let fail = 0;
const check = (name, ok, info) => {
  if (!ok) fail++;
  console.log(ok ? "LULUS" : "GAGAL", name, ok ? "" : JSON.stringify(info));
};

const budi = await login("klien@nauvite.test");
const rina = await login("klien2@nauvite.test");
const { data: mine } = await budi.from("invitations").select("id, slug").limit(1).single();
const name = `Tamu uji ${Date.now()}`;

const ins = await budi.from("guests").insert({ invitation_id: mine.id, name }).select("id").single();
check("pemilik bisa menambah tamu", !ins.error, ins.error);
const dup = await budi.from("guests").insert({ invitation_id: mine.id, name: name.toUpperCase() });
check("nama kembar ditolak", dup.error?.code === "23505", dup);
const r1 = await rina.from("guests").select("id").eq("invitation_id", mine.id);
check("klien lain tidak melihat tamu", r1.data?.length === 0, r1);
const r2 = await rina.from("guests").insert({ invitation_id: mine.id, name: name + " x" });
check("klien lain tidak bisa menambah tamu", !!r2.error, r2);
const r3 = await rina.from("guests").update({ sent_at: new Date().toISOString() }).eq("id", ins.data.id).select();
check("klien lain tidak bisa mengubah tamu", !!r3.error || r3.data.length === 0, r3);
const r4 = await rina.from("guests").delete().eq("id", ins.data.id).select();
check("klien lain tidak bisa menghapus tamu", !!r4.error || r4.data.length === 0, r4);
const a1 = await anon.from("guests").select("id");
check("pengunjung tidak melihat tamu", !!a1.error || a1.data.length === 0, a1);
const mv = await budi.from("guests").update({ invitation_id: mine.id }).eq("id", ins.data.id);
check("tamu tidak bisa dipindah undangan", !!mv.error, mv);
for (const [who, c] of [["pengunjung", anon], ["klien", budi]]) {
  const t = await c.from("trial_signups").select("id");
  check(`${who} tidak bisa membaca catatan pendaftaran`, !!t.error, t);
}
const t1 = await budi.from("invitations").update({ trial_until: "2099-01-01" }).eq("id", mine.id).select();
check("klien tidak bisa memperpanjang uji coba", !!t1.error, t1);
const note = await budi.from("invitations").select("admin_note").eq("id", mine.id);
check("catatan admin tetap tertutup", !!note.error, note);
const msg = await budi.from("invitations").update({ guest_message: "tes {link}" }).eq("id", mine.id).select("id");
check("klien bisa menyimpan pesan WA", !msg.error, msg.error);
await admin.from("invitations").update({ guest_message: null }).eq("id", mine.id);

const slug = `uji-${Date.now()}`;
const { data: trial, error: te } = await admin.from("invitations")
  .insert({ slug, template_id: "surat-cinta", status: "draft", trial_until: new Date(Date.now() + 3600_000).toISOString() }).select("id").single();
if (te) throw te;
const g = () => anon.rpc("get_public_invitation", { p_slug: slug });
check("uji coba bisa dibuka dan bertanda", (await g()).data?.trial === true);
const wish = await anon.from("wishes").insert({ invitation_id: trial.id, name: "x", message: "x" });
check("ucapan ke undangan uji coba ditolak", !!wish.error, wish);
await admin.from("invitations").update({ trial_until: new Date(Date.now() - 1000).toISOString() }).eq("id", trial.id);
check("uji coba habis tidak bisa dibuka", (await g()).data === null);
await admin.from("invitations").update({ status: "active" }).eq("id", trial.id);
check("setelah diaktifkan tidak bertanda contoh", (await g()).data?.trial === false);
await admin.from("invitations").update({ status: "inactive", trial_until: new Date(Date.now() + 3600_000).toISOString() }).eq("id", trial.id);
check("undangan nonaktif tidak bisa dibuka lewat uji coba", (await g()).data === null);

await admin.from("guests").delete().eq("id", ins.data.id);
await admin.from("invitations").delete().eq("id", trial.id);
console.log(fail ? `${fail} GAGAL` : "Semua lulus");
process.exit(fail ? 1 : 0);
