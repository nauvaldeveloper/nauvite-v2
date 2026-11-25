"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { createLoginAccount } from "@/lib/auth/accounts";
import { toAuthEmail } from "@/lib/auth/login-id";
import { getCatalog } from "@/lib/demos";
import { DEFAULT_MUSIC } from "@/lib/invitation/music";
import { getPublicInvitation } from "@/lib/invitation/public";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

/** Pendaftaran uji coba gratis: membuat akun klien dan undangan draf yang bisa dilihat 24 jam. */

const TRIAL_HOURS = 24;
// Pembatas supaya pendaftaran tidak dibanjiri.
const MAX_PER_IP_PER_DAY = 3;
const MAX_TOTAL_PER_DAY = 60;
const WHATSAPP_COOLDOWN_DAYS = 30;

const DAY = 86400_000;

export type TrialState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  created?: { id: string; login: string };
};

const name = z.string().trim().min(1, "Isi namanya").max(40, "Maksimal 40 huruf");
const schema = z.object({
  demo: z.string(),
  groom: name,
  bride: name,
  date: z
    .string()
    .regex(/^20\d{2}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, "").replace(/^0/, "62"))
    .pipe(z.string().regex(/^628\d{7,12}$/, "Nomor WhatsApp belum benar, contoh 0812 3456 7890")),
  password: z.string().min(8, "Password minimal 8 huruf atau angka").max(72, "Password terlalu panjang"),
});

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function slugBase(groom: string, bride: string) {
  const base = `${slugify(groom).slice(0, 18)}-${slugify(bride).slice(0, 18)}`.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return base.length >= 3 ? base : "undangan";
}

const randomTail = () => Math.floor(1000 + Math.random() * 9000);

export async function startTrial(_prev: TrialState, formData: FormData): Promise<TrialState> {
  // Jebakan bot: kolom ini tidak terlihat oleh manusia.
  if (formData.get("website")) return { error: "Pendaftaran gagal. Coba lagi." };

  const get = (k: string) => String(formData.get(k) ?? "");
  const parsed = schema.safeParse({
    demo: get("demo"),
    groom: get("groom"),
    bride: get("bride"),
    date: get("date") || undefined,
    whatsapp: get("whatsapp"),
    password: get("password"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors };
  }
  const d = parsed.data;
  const item = getCatalog().find((t) => t.demos.some((x) => x.slug === d.demo));
  if (!item) return { fieldErrors: { demo: "Pilih tema" } };

  const admin = createAdminClient();
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "lokal";
  const ipHash = createHash("sha256").update(`${process.env.SUPABASE_SERVICE_ROLE_KEY}:${ip}`).digest("hex");
  const since = (days: number) => new Date(Date.now() - days * DAY).toISOString();
  const count = () => admin.from("trial_signups").select("id", { count: "exact", head: true });
  const [byIp, total, byWa] = await Promise.all([
    count().eq("ip_hash", ipHash).gt("created_at", since(1)),
    count().gt("created_at", since(1)),
    count().eq("whatsapp", d.whatsapp).gt("created_at", since(WHATSAPP_COOLDOWN_DAYS)),
  ]);
  if (byIp.error || total.error || byWa.error) return { error: "Pendaftaran sedang bermasalah. Coba lagi sebentar lagi." };
  if (byWa.count) {
    return { fieldErrors: { whatsapp: "Nomor ini sudah pernah dipakai uji coba. Silakan masuk, atau chat admin kalau lupa password." } };
  }
  if ((byIp.count ?? 0) >= MAX_PER_IP_PER_DAY || (total.count ?? 0) >= MAX_TOTAL_PER_DAY) {
    return { error: "Pendaftaran uji coba hari ini sudah penuh. Chat admin lewat WhatsApp, nanti kami buatkan." };
  }

  // Catat dulu, supaya kiriman ganda yang bersamaan ikut terhitung.
  const { data: record, error: recordError } = await admin
    .from("trial_signups")
    .insert({ ip_hash: ipHash, whatsapp: d.whatsapp })
    .select("id")
    .single();
  if (recordError) return { error: "Pendaftaran sedang bermasalah. Coba lagi sebentar lagi." };
  const undoRecord = () => admin.from("trial_signups").delete().eq("id", record.id);

  const template = await getPublicInvitation(d.demo);
  const options = (template?.templateOptions[item.id] ?? {}) as Record<string, unknown>;
  const content = {
    couple: { groom: { name: d.groom, fullname: "" }, bride: { name: d.bride, fullname: "" } },
    music: DEFAULT_MUSIC,
    ...(d.date ? { weddingDate: d.date } : {}),
  };

  const base = slugBase(d.groom, d.bride);
  for (let i = 0; i < 4; i++) {
    const slug = i === 0 ? base : `${base}-${randomTail()}`;
    const { data: used } = await admin.from("invitations").select("id").eq("slug", slug).maybeSingle();
    if (used) continue;
    const account = await createLoginAccount({
      login: slug,
      password: d.password,
      fullName: `${d.groom} & ${d.bride}`,
      whatsapp: d.whatsapp,
    });
    if (!account.ok) continue;

    const { data: inv, error } = await admin
      .from("invitations")
      .insert({
        slug,
        template_id: item.id,
        owner_id: account.userId,
        status: "draft",
        trial_until: new Date(Date.now() + TRIAL_HOURS * 3600_000).toISOString(),
        content,
        // Warna pilihan ikut demo. Isian lain memakai bawaan tema.
        template_options: (typeof options.palette === "string" ? { [item.id]: { palette: options.palette } } : {}) as { [key: string]: Json },
        admin_note: "Uji coba dari website",
      })
      .select("id")
      .single();
    if (error) {
      await admin.auth.admin.deleteUser(account.userId);
      continue;
    }

    const supabase = await createClient();
    await supabase.auth.signInWithPassword({ email: toAuthEmail(slug)!, password: d.password });
    return { created: { id: inv.id, login: slug } };
  }

  await undoRecord();
  return { error: "Akun gagal dibuat. Coba lagi, atau chat admin lewat WhatsApp." };
}
