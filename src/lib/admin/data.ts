import "server-only";
import { requireAdmin } from "@/lib/auth/dal";
import { displayLogin } from "@/lib/auth/login-id";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseContent } from "@/lib/invitation/content";
import { mainEventDate } from "@/lib/invitation/format";

/** Data untuk panel admin. Setiap fungsi memastikan pemanggilnya admin. */

export type InvitationStatus = "draft" | "active" | "inactive";

export type AdminInvitationRow = {
  id: string;
  slug: string;
  templateId: string;
  status: InvitationStatus;
  activeUntil: string | null;
  createdAt: string;
  ownerId: string | null;
  partnerId: string | null;
  coupleName: string;
  /** Foto sampul (path/URL mentah, belum lewat mediaUrl). */
  coverImage: string | null;
  /** Waktu acara utama, ISO. */
  eventAt: string | null;
};

type CoupleJson = { couple?: { groom?: { name?: string }; bride?: { name?: string } } };

function coupleName(content: unknown): string {
  const c = (content as CoupleJson | null)?.couple;
  const g = c?.groom?.name?.trim();
  const b = c?.bride?.name?.trim();
  return g || b ? `${g || "?"} & ${b || "?"}` : "(belum diisi)";
}

function cardExtras(raw: unknown) {
  const content = parseContent(raw);
  const event = mainEventDate(content);
  return {
    coverImage: content.coverImage ?? content.gallery[0] ?? null,
    eventAt: event ? event.toISOString() : null,
  };
}

export async function listInvitations(filter: { q?: string; status?: string } = {}) {
  await requireAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("invitations")
    .select("id, slug, template_id, status, active_until, created_at, owner_id, partner_id, content")
    .order("created_at", { ascending: false })
    .limit(500);
  if (filter.status && ["draft", "active", "inactive"].includes(filter.status)) {
    query = query.eq("status", filter.status);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let rows: AdminInvitationRow[] = (data ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    templateId: r.template_id,
    status: r.status as InvitationStatus,
    activeUntil: r.active_until,
    createdAt: r.created_at,
    ownerId: r.owner_id,
    partnerId: r.partner_id,
    coupleName: coupleName(r.content),
    ...cardExtras(r.content),
  }));

  const q = filter.q?.trim().toLowerCase();
  if (q) rows = rows.filter((r) => r.slug.includes(q) || r.coupleName.toLowerCase().includes(q));
  return rows;
}

export async function getInvitation(id: string) {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("id, slug, template_id, status, active_until, created_at, updated_at, owner_id, partner_id, content")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  // admin_note sengaja tidak bisa dibaca lewat sesi login (supaya klien/mitra tidak
  // bisa membacanya), jadi diambil dengan kunci server. Pemanggil sudah dicek admin.
  const { data: note } = await createAdminClient()
    .from("invitations")
    .select("admin_note")
    .eq("id", id)
    .maybeSingle();
  return { ...data, admin_note: note?.admin_note ?? null, coupleName: coupleName(data.content) };
}

export type AccountInfo = {
  id: string;
  login: string;
  fullName: string | null;
  whatsapp: string | null;
  role: string;
  businessName: string | null;
  businessUrl: string | null;
  lastSignIn: string | null;
};

/** Info akun (username/email login, WA) untuk beberapa user sekaligus. */
export async function getAccounts(ids: (string | null)[]): Promise<Map<string, AccountInfo>> {
  await requireAdmin();
  const unique = [...new Set(ids.filter((x): x is string => !!x))];
  const result = new Map<string, AccountInfo>();
  if (!unique.length) return result;

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role, full_name, whatsapp, business_name, business_url")
    .in("id", unique);

  // Email login hanya bisa dibaca lewat kunci admin Supabase.
  const admin = createAdminClient();
  const users = await Promise.all(unique.map((id) => admin.auth.admin.getUserById(id)));

  for (const p of profiles ?? []) {
    const u = users.find((x) => x.data.user?.id === p.id)?.data.user;
    result.set(p.id, {
      id: p.id,
      login: displayLogin(u?.email),
      fullName: p.full_name,
      whatsapp: p.whatsapp,
      role: p.role,
      businessName: p.business_name,
      businessUrl: p.business_url,
      lastSignIn: u?.last_sign_in_at ?? null,
    });
  }
  return result;
}

export async function listPartners() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, whatsapp, business_name, business_url, created_at")
    .eq("role", "partner")
    .order("business_name");
  return data ?? [];
}

export async function countByPartner(): Promise<Map<string, number>> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("invitations").select("partner_id").not("partner_id", "is", null);
  const map = new Map<string, number>();
  for (const r of data ?? []) map.set(r.partner_id!, (map.get(r.partner_id!) ?? 0) + 1);
  return map;
}

export async function getWishStats(invitationId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishes")
    .select("attendance, guest_count")
    .eq("invitation_id", invitationId);
  const rows = data ?? [];
  return {
    total: rows.length,
    hadir: rows.filter((r) => r.attendance === "hadir").length,
    tamuHadir: rows.filter((r) => r.attendance === "hadir").reduce((n, r) => n + r.guest_count, 0),
    tidakHadir: rows.filter((r) => r.attendance === "tidak_hadir").length,
    belumPasti: rows.filter((r) => r.attendance === "belum_pasti").length,
  };
}

export type BusinessSettings = {
  businessName: string;
  ownerWhatsapp: string;
  priceDefault: number;
  pricePremium: number;
  pricePartner: number;
  pricePartnerPremium: number;
};

export async function getSettings(): Promise<BusinessSettings> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("app_settings").select("key, value");
  const get = (k: string) => data?.find((r) => r.key === k)?.value;
  const pricing = (get("pricing") as { default?: number; premium?: number; partner?: number; partnerPremium?: number } | undefined) ?? {};
  return {
    businessName: (get("business_name") as string) ?? "Nauvite",
    ownerWhatsapp: (get("owner_whatsapp") as string) ?? "",
    priceDefault: pricing.default ?? 75000,
    pricePremium: pricing.premium ?? 99000,
    pricePartner: pricing.partner ?? 50000,
    pricePartnerPremium: pricing.partnerPremium ?? 75000,
  };
}


export type Overview = {
  rows: AdminInvitationRow[];
  active: number;
  drafts: AdminInvitationRow[];
  expiringSoon: AdminInvitationRow[];
  expired: AdminInvitationRow[];
  upcoming: AdminInvitationRow[];
  wishesThisWeek: number;
};

/** Ringkasan untuk beranda admin. */
export async function getOverview(): Promise<Overview> {
  const rows = await listInvitations();
  const now = Date.now();
  const day = 86400_000;
  const until = (r: AdminInvitationRow) => (r.activeUntil ? new Date(r.activeUntil).getTime() : Infinity);
  const isLive = (r: AdminInvitationRow) => r.status === "active" && until(r) > now;

  const supabase = await createClient();
  const { count } = await supabase
    .from("wishes")
    .select("id", { count: "exact", head: true })
    .gte("created_at", new Date(now - 7 * day).toISOString());

  return {
    rows,
    active: rows.filter(isLive).length,
    drafts: rows.filter((r) => r.status === "draft"),
    expiringSoon: rows
      .filter((r) => isLive(r) && until(r) - now <= 14 * day)
      .sort((a, b) => until(a) - until(b)),
    expired: rows.filter((r) => r.status === "active" && until(r) <= now),
    upcoming: rows
      .filter((r) => isLive(r) && r.eventAt && new Date(r.eventAt).getTime() > now)
      .sort((a, b) => new Date(a.eventAt!).getTime() - new Date(b.eventAt!).getTime())
      .slice(0, 5),
    wishesThisWeek: count ?? 0,
  };
}
