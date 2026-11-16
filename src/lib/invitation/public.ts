import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { parseContent, type InvitationContent } from "./content";

export type PublicInvitation = {
  id: string;
  slug: string;
  templateId: string;
  content: InvitationContent;
  templateOptions: Record<string, unknown>;
  partner: { name: string | null; url: string | null } | null;
};

export type PublicWish = { id: string; name: string; message: string; createdAt: string };

export const invitationTag = (slug: string) => `invitation:${slug}`;
export const wishesTag = (slug: string) => `wishes:${slug}`;

const SLUG_RE = /^[a-z0-9]([a-z0-9-]{1,48}[a-z0-9])$/;

/**
 * Undangan aktif untuk halaman tamu. null kalau tidak ada, masih draf, atau
 * sudah lewat masa aktif. Hasilnya di-cache beberapa menit supaya undangan
 * yang dibuka ratusan tamu tidak membebani database. Saat klien menyimpan
 * perubahan, cache dihapus lewat updateTag(invitationTag(slug)).
 */
export async function getPublicInvitation(slug: string): Promise<PublicInvitation | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(invitationTag(slug));

  if (!SLUG_RE.test(slug)) return null;

  const { data, error } = await createPublicClient().rpc("get_public_invitation", {
    p_slug: slug,
  });
  if (error) throw new Error(`Gagal memuat undangan: ${error.message}`);
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const row = data as Record<string, unknown>;
  const partner = row.partner as { name?: string | null; url?: string | null } | null;
  return {
    id: String(row.id),
    slug: String(row.slug),
    templateId: String(row.template_id),
    content: parseContent(row.content),
    templateOptions: (row.template_options as Record<string, unknown>) ?? {},
    partner: partner ? { name: partner.name ?? null, url: partner.url ?? null } : null,
  };
}

/** Ucapan terbaru untuk ditampilkan di undangan. */
export async function getPublicWishes(slug: string, limit = 30): Promise<PublicWish[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(wishesTag(slug));

  if (!SLUG_RE.test(slug)) return [];

  const { data, error } = await createPublicClient().rpc("get_public_wishes", {
    p_slug: slug,
    p_limit: limit,
  });
  if (error) throw new Error(`Gagal memuat ucapan: ${error.message}`);
  return (data ?? []).map((w) => ({
    id: w.id,
    name: w.name,
    message: w.message,
    createdAt: w.created_at,
  }));
}
