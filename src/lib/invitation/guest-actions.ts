"use server";

import { z } from "zod";
import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { MAX_GUESTS, parseGuestLines } from "./guest-message";
import type { GuestRow } from "./guests";

/**
 * Daftar tamu. Hak akses (pemilik, mitra, admin) dijaga aturan RLS database;
 * di sini hanya memastikan sudah login dan isiannya benar.
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; message: string };
const COLS = "id, name, phone, sent_at";
const bad = (message: string) => ({ ok: false as const, message });
const isId = (v: unknown) => z.guid().safeParse(v).success;

export async function addGuests(invitationId: string, raw: string): Promise<Result<{ added: GuestRow[]; skipped: number }>> {
  await requireUser();
  if (!isId(invitationId) || typeof raw !== "string" || raw.length > 200_000) return bad("Isian tidak valid.");
  const guests = parseGuestLines(raw);
  if (!guests.length) return bad("Belum ada nama yang bisa dibaca.");
  if (guests.length > MAX_GUESTS) return bad(`Maksimal ${MAX_GUESTS} nama.`);

  const supabase = await createClient();
  const existing = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("guests")
      .select("name")
      .eq("invitation_id", invitationId)
      .order("id")
      .range(from, from + 999);
    if (error) return bad("Daftar tamu gagal dibaca. Coba lagi.");
    data.forEach((g) => existing.add(g.name.toLowerCase()));
    if (data.length < 1000) break;
  }

  const fresh = guests.filter((g) => !existing.has(g.name.toLowerCase()));
  if (existing.size + fresh.length > MAX_GUESTS) return bad(`Daftar tamu maksimal ${MAX_GUESTS} nama.`);
  const added: GuestRow[] = [];
  for (let i = 0; i < fresh.length; i += 500) {
    const { data, error } = await supabase
      .from("guests")
      .insert(fresh.slice(i, i + 500).map((g) => ({ ...g, invitation_id: invitationId })))
      .select(COLS);
    if (error) return bad(added.length ? `Baru ${added.length} nama yang tersimpan. Muat ulang lalu coba lagi.` : "Nama gagal disimpan. Coba lagi.");
    added.push(...data.map((g) => ({ id: g.id, name: g.name, phone: g.phone, sentAt: g.sent_at })));
  }
  return { ok: true, added, skipped: guests.length - fresh.length };
}

export async function setGuestSent(guestId: string, sent: boolean): Promise<Result> {
  await requireUser();
  if (!isId(guestId)) return bad("Tamu tidak dikenal.");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guests")
    .update({ sent_at: sent ? new Date().toISOString() : null })
    .eq("id", guestId)
    .select("id");
  return error || !data?.length ? bad("Tanda terkirim gagal disimpan.") : { ok: true };
}

export async function removeGuest(guestId: string): Promise<Result> {
  await requireUser();
  if (!isId(guestId)) return bad("Tamu tidak dikenal.");
  const supabase = await createClient();
  const { data, error } = await supabase.from("guests").delete().eq("id", guestId).select("id");
  return error || !data?.length ? bad("Nama gagal dihapus.") : { ok: true };
}

export async function saveGuestMessage(invitationId: string, text: string): Promise<Result> {
  await requireUser();
  const parsed = z.string().trim().max(1500, "Pesan maksimal 1500 huruf.").safeParse(text);
  if (!isId(invitationId) || !parsed.success) return bad(parsed.error?.issues[0]?.message ?? "Isian tidak valid.");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .update({ guest_message: parsed.data || null })
    .eq("id", invitationId)
    .select("id");
  return error || !data?.length ? bad("Pesan gagal disimpan.") : { ok: true };
}
