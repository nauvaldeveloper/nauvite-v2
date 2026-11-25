"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/dal";
import { generatePassword, toAuthEmail } from "@/lib/auth/login-id";
import { invitationTag } from "@/lib/invitation/public";
import { SITE_SETTINGS_TAG } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { isTemplateId } from "@/templates/registry";

/**
 * Aksi panel admin. Setiap aksi memanggil requireAdmin() lebih dulu, karena
 * Server Action bisa dipanggil langsung dari luar, bukan hanya dari tombol di panel.
 */

const SLUG_RE = /^[a-z0-9]([a-z0-9-]{1,48}[a-z0-9])$/;
const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(SLUG_RE, "3-50 karakter: huruf kecil, angka, dan tanda minus (-), tidak boleh diawali/diakhiri minus");

const uuid = z.guid();
const optionalUuid = z
  .string()
  .optional()
  .transform((v) => (v ? v : null))
  .pipe(uuid.nullable());

function addDays(from: Date, days: number) {
  return new Date(from.getTime() + days * 86400_000);
}

function friendlyDbError(message: string, code?: string) {
  if (code === "23505") return "Slug ini sudah dipakai undangan lain.";
  if (code === "23514") return "Slug tidak boleh dipakai (kata khusus sistem) atau formatnya salah.";
  return `Gagal menyimpan: ${message}`;
}

// ---------------------------------------------------------------------------
// Membuat akun login (klien / mitra)
// ---------------------------------------------------------------------------

async function createLoginAccount(input: {
  login: string;
  fullName?: string;
  whatsapp?: string;
  role?: "client" | "partner";
  businessName?: string;
  businessUrl?: string;
}): Promise<{ ok: true; userId: string; password: string } | { ok: false; error: string }> {
  const email = toAuthEmail(input.login);
  if (!email) return { ok: false, error: "Username/email login tidak valid." };

  const password = generatePassword();
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

export type Credentials = { login: string; password: string; whatsapp?: string | null };

// ---------------------------------------------------------------------------
// Buat undangan baru
// ---------------------------------------------------------------------------

export type CreateInvitationState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  created?: { id: string; slug: string; credentials?: Credentials };
};

const createSchema = z.object({
  slug: slugSchema,
  templateId: z.string().refine(isTemplateId, "Pilih tema"),
  groomName: z.string().trim().max(40).optional(),
  brideName: z.string().trim().max(40).optional(),
  weddingDate: z
    .string()
    .optional()
    .transform((v) => v || undefined)
    .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  partnerId: optionalUuid,
  activeDays: z.coerce.number().int().min(0).max(3650),
  createAccount: z.boolean(),
  login: z.string().trim().toLowerCase().optional(),
  whatsapp: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.replace(/[^\d]/g, "").replace(/^0/, "62") : undefined)),
});

export async function createInvitation(
  _prev: CreateInvitationState,
  formData: FormData,
): Promise<CreateInvitationState> {
  await requireAdmin();

  const parsed = createSchema.safeParse({
    slug: formData.get("slug") ?? "",
    templateId: formData.get("templateId") ?? "",
    groomName: formData.get("groomName") ?? undefined,
    brideName: formData.get("brideName") ?? undefined,
    weddingDate: formData.get("weddingDate") ?? undefined,
    partnerId: formData.get("partnerId") ?? undefined,
    activeDays: formData.get("activeDays") ?? 0,
    createAccount: formData.get("createAccount") === "on",
    login: formData.get("login") ?? undefined,
    whatsapp: formData.get("whatsapp") ?? undefined,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const { data: existing } = await supabase.from("invitations").select("id").eq("slug", d.slug).maybeSingle();
  if (existing) return { fieldErrors: { slug: "Slug ini sudah dipakai undangan lain." } };

  let account: Awaited<ReturnType<typeof createLoginAccount>> | null = null;
  const login = d.login || d.slug;
  if (d.createAccount) {
    account = await createLoginAccount({
      login,
      fullName: [d.groomName, d.brideName].filter(Boolean).join(" & "),
      whatsapp: d.whatsapp,
    });
    if (!account.ok) return { fieldErrors: { login: account.error } };
  }

  const content: Record<string, unknown> = {
    couple: { groom: { name: d.groomName ?? "", fullname: "" }, bride: { name: d.brideName ?? "", fullname: "" } },
  };
  if (d.weddingDate) content.weddingDate = d.weddingDate;

  const { data: inv, error } = await supabase
    .from("invitations")
    .insert({
      slug: d.slug,
      template_id: d.templateId,
      owner_id: account?.ok ? account.userId : null,
      partner_id: d.partnerId,
      status: d.activeDays > 0 ? "active" : "draft",
      active_until: d.activeDays > 0 ? addDays(new Date(), d.activeDays).toISOString() : null,
      content: content as { [key: string]: Json },
    })
    .select("id")
    .single();

  if (error || !inv) {
    // Batalkan akun yang terlanjur dibuat supaya tidak ada akun yatim.
    if (account?.ok) await createAdminClient().auth.admin.deleteUser(account.userId);
    return { error: friendlyDbError(error?.message ?? "tidak diketahui", error?.code) };
  }

  updateTag(invitationTag(d.slug));
  return {
    created: {
      id: inv.id,
      slug: d.slug,
      credentials: account?.ok ? { login, password: account.password, whatsapp: d.whatsapp } : undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Status dan masa aktif
// ---------------------------------------------------------------------------

export async function setInvitationStatus(id: string, formData: FormData) {
  await requireAdmin();
  uuid.parse(id);
  const supabase = await createClient();
  const { data: inv } = await supabase
    .from("invitations")
    .select("slug, active_until")
    .eq("id", id)
    .single();
  if (!inv) return;

  const kind = String(formData.get("kind"));
  let patch: { status: "draft" | "active" | "inactive"; active_until?: string | null };

  if (kind === "extend") {
    const days = z.coerce.number().int().min(1).max(3650).parse(formData.get("days"));
    // Perpanjang dari tanggal berakhir yang lama kalau masih berlaku, kalau tidak dari hari ini.
    const current = inv.active_until ? new Date(inv.active_until) : null;
    const base = current && current > new Date() ? current : new Date();
    patch = { status: "active", active_until: addDays(base, days).toISOString() };
  } else if (kind === "until") {
    const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(formData.get("date"));
    patch = { status: "active", active_until: new Date(`${date}T23:59:59+07:00`).toISOString() };
  } else if (kind === "forever") {
    patch = { status: "active", active_until: null };
  } else if (kind === "deactivate") {
    patch = { status: "inactive" };
  } else if (kind === "draft") {
    patch = { status: "draft" };
  } else {
    return;
  }

  await supabase.from("invitations").update(patch).eq("id", id);
  updateTag(invitationTag(inv.slug));
  refresh();
}

// ---------------------------------------------------------------------------
// Data undangan (slug, tema, mitra, catatan)
// ---------------------------------------------------------------------------

export type SimpleState = { error?: string; ok?: string };

export async function updateInvitationMeta(
  id: string,
  _prev: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  await requireAdmin();
  uuid.parse(id);

  const parsed = z
    .object({
      slug: slugSchema,
      templateId: z.string().refine(isTemplateId, "Tema tidak dikenal"),
      partnerId: optionalUuid,
      adminNote: z.string().max(2000).optional(),
    })
    .safeParse({
      slug: formData.get("slug") ?? "",
      templateId: formData.get("templateId") ?? "",
      partnerId: formData.get("partnerId") ?? undefined,
      adminNote: formData.get("adminNote") ?? undefined,
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { data: before } = await supabase.from("invitations").select("slug").eq("id", id).single();
  const { error } = await supabase
    .from("invitations")
    .update({
      slug: parsed.data.slug,
      template_id: parsed.data.templateId,
      partner_id: parsed.data.partnerId,
      admin_note: parsed.data.adminNote || null,
    })
    .eq("id", id);
  if (error) return { error: friendlyDbError(error.message, error.code) };

  if (before) updateTag(invitationTag(before.slug));
  updateTag(invitationTag(parsed.data.slug));
  refresh();
  return { ok: "Tersimpan." };
}

// ---------------------------------------------------------------------------
// Akun klien: buat akun untuk undangan lama, atau reset password
// ---------------------------------------------------------------------------

export type AccountState = { error?: string; credentials?: Credentials };

export async function createOwnerAccount(
  id: string,
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  await requireAdmin();
  uuid.parse(id);
  const supabase = await createClient();
  const { data: inv } = await supabase.from("invitations").select("slug, owner_id, content").eq("id", id).single();
  if (!inv) return { error: "Undangan tidak ditemukan." };
  if (inv.owner_id) return { error: "Undangan ini sudah punya akun klien." };

  const login = String(formData.get("login") || inv.slug).trim().toLowerCase();
  const whatsapp = String(formData.get("whatsapp") ?? "").replace(/[^\d]/g, "").replace(/^0/, "62") || undefined;
  const account = await createLoginAccount({ login, whatsapp });
  if (!account.ok) return { error: account.error };

  await supabase.from("invitations").update({ owner_id: account.userId }).eq("id", id);
  refresh();
  return { credentials: { login, password: account.password, whatsapp } };
}

export async function resetPassword(userId: string, login: string, whatsapp: string | null): Promise<AccountState> {
  await requireAdmin();
  uuid.parse(userId);
  const password = generatePassword();
  const { error } = await createAdminClient().auth.admin.updateUserById(userId, { password });
  if (error) return { error: `Gagal mengganti password: ${error.message}` };
  return { credentials: { login, password, whatsapp } };
}

// ---------------------------------------------------------------------------
// Hapus undangan
// ---------------------------------------------------------------------------

export async function deleteInvitation(id: string, formData: FormData) {
  await requireAdmin();
  uuid.parse(id);
  const supabase = await createClient();
  const { data: inv } = await supabase.from("invitations").select("slug").eq("id", id).single();
  if (!inv) redirect("/admin/undangan");
  if (String(formData.get("confirm")).trim() !== inv.slug) {
    // Konfirmasi salah: jangan hapus apa pun.
    redirect(`/admin/undangan/${id}?hapus=salah`);
  }

  // Hapus file foto/video/lagu milik undangan ini dari storage.
  const admin = createAdminClient();
  const { data: files } = await admin.storage.from("invitation-media").list(id, { limit: 1000 });
  if (files?.length) {
    await admin.storage.from("invitation-media").remove(files.map((f) => `${id}/${f.name}`));
  }

  await supabase.from("invitations").delete().eq("id", id);
  updateTag(invitationTag(inv.slug));
  redirect("/admin/undangan?dihapus=1");
}

// ---------------------------------------------------------------------------
// Mitra
// ---------------------------------------------------------------------------

export type PartnerState = { error?: string; credentials?: Credentials & { businessName: string } };

export async function createPartner(_prev: PartnerState, formData: FormData): Promise<PartnerState> {
  await requireAdmin();
  const parsed = z
    .object({
      businessName: z.string().trim().min(2, "Isi nama usaha").max(100),
      businessUrl: z
        .string()
        .trim()
        .optional()
        .transform((v) => v || undefined)
        .pipe(z.string().url("Link harus diawali https://").optional()),
      fullName: z.string().trim().max(100).optional(),
      login: z.string().trim().toLowerCase().min(3, "Isi username login"),
      whatsapp: z
        .string()
        .trim()
        .optional()
        .transform((v) => (v ? v.replace(/[^\d]/g, "").replace(/^0/, "62") : undefined)),
    })
    .safeParse({
      businessName: formData.get("businessName") ?? "",
      businessUrl: formData.get("businessUrl") ?? undefined,
      fullName: formData.get("fullName") ?? undefined,
      login: formData.get("login") ?? "",
      whatsapp: formData.get("whatsapp") ?? undefined,
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const d = parsed.data;

  const account = await createLoginAccount({ ...d, role: "partner" });
  if (!account.ok) return { error: account.error };
  refresh();
  return { credentials: { login: d.login, password: account.password, whatsapp: d.whatsapp, businessName: d.businessName } };
}

// ---------------------------------------------------------------------------
// Pengaturan bisnis
// ---------------------------------------------------------------------------

export async function saveSettings(_prev: SimpleState, formData: FormData): Promise<SimpleState> {
  await requireAdmin();
  const parsed = z
    .object({
      businessName: z.string().trim().min(1, "Isi nama usaha").max(60),
      ownerWhatsapp: z
        .string()
        .trim()
        .transform((v) => v.replace(/[^\d]/g, "").replace(/^0/, "62"))
        .pipe(z.string().min(9, "Nomor WhatsApp terlalu pendek")),
      priceDefault: z.coerce.number().int().min(0),
      pricePremium: z.coerce.number().int().min(0),
      priceHemat: z.coerce.number().int().min(0),
      priceHematPromo: z.coerce.number().int().min(0),
      hematPromoUntil: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Tanggal akhir promo tidak valid"),
      pricePartnerHemat: z.coerce.number().int().min(0),
      pricePartner: z.coerce.number().int().min(0),
      pricePartnerPremium: z.coerce.number().int().min(0),
    })
    .safeParse({
      businessName: formData.get("businessName") ?? "",
      ownerWhatsapp: formData.get("ownerWhatsapp") ?? "",
      priceDefault: formData.get("priceDefault") ?? 0,
      pricePremium: formData.get("pricePremium") ?? 0,
      priceHemat: formData.get("priceHemat") ?? 0,
      priceHematPromo: formData.get("priceHematPromo") ?? 0,
      hematPromoUntil: formData.get("hematPromoUntil") ?? "",
      pricePartnerHemat: formData.get("pricePartnerHemat") ?? 0,
      pricePartner: formData.get("pricePartner") ?? 0,
      pricePartnerPremium: formData.get("pricePartnerPremium") ?? 0,
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("app_settings").upsert([
    { key: "business_name", value: d.businessName, is_public: true },
    { key: "owner_whatsapp", value: d.ownerWhatsapp, is_public: true },
    { key: "pricing", value: {
        default: d.priceDefault,
        premium: d.pricePremium,
        partner: d.pricePartner,
        partnerPremium: d.pricePartnerPremium,
        hemat: d.priceHemat,
        hematPromo: d.priceHematPromo,
        hematPromoUntil: d.hematPromoUntil,
        partnerHemat: d.pricePartnerHemat,
      }, is_public: true },
  ]);
  if (error) return { error: `Gagal menyimpan: ${error.message}` };
  updateTag(SITE_SETTINGS_TAG);
  return { ok: "Pengaturan tersimpan. Landing page ikut diperbarui." };
}
