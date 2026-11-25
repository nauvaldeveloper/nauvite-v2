"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/dal";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { cleanTemplateOptions, mergeTemplateOptions } from "@/templates/options";
import { getManifest } from "@/templates/registry";
import { editorPayloadSchema } from "./editor-schema";
import { DEFAULT_MUSIC } from "./music";
import { invitationTag } from "./public";

export type SaveState =
  | { status: "idle" }
  | { status: "ok"; savedAt: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

/** Semua teks yang ada di data lama, untuk mengizinkan file lama tetap dipakai. */
function collectStrings(value: unknown, out = new Set<string>()) {
  if (typeof value === "string") out.add(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

/**
 * Menyimpan isi undangan dari editor. Bisa dipanggil klien pemilik, mitra, atau
 * admin. Hak akses dicek dua kali: di sini (undangan harus terbaca oleh user)
 * dan oleh RLS database saat update.
 */
export async function saveInvitationContent(invitationId: string, payload: unknown): Promise<SaveState> {
  await requireUser();
  if (!z.guid().safeParse(invitationId).success) {
    return { status: "error", message: "Undangan tidak dikenal." };
  }

  const supabase = await createClient();
  const { data: inv } = await supabase
    .from("invitations")
    .select("id, slug, template_id, content, template_options")
    .eq("id", invitationId)
    .maybeSingle();
  if (!inv) return { status: "error", message: "Undangan tidak ditemukan atau kamu tidak punya akses." };

  const parsed = editorPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { status: "error", message: issue ? `${issue.path.join(" > ")}: ${issue.message}` : "Data tidak valid." };
  }
  const d = parsed.data;

  // File hanya boleh dari folder undangan ini, file bawaan situs, atau file yang memang sudah ada sebelumnya.
  const known = collectStrings(inv.content);
  const okPath = (p?: string) => !p || p.startsWith(`${invitationId}/`) || p.startsWith("/") || known.has(p);
  const paths = [
    d.couple.groom.image,
    d.couple.bride.image,
    d.coverImage,
    d.music === DEFAULT_MUSIC ? undefined : d.music,
    ...d.gallery,
    ...d.stories.map((s) => s.image),
  ];
  if (!paths.every(okPath)) return { status: "error", message: "Ada file yang bukan milik undangan ini." };

  // Isian khusus tema, dicek terhadap manifest tema yang dipakai.
  const manifest = getManifest(inv.template_id);
  let templateOptions = (inv.template_options ?? {}) as Record<string, unknown>;
  if (manifest) {
    const cleaned = cleanTemplateOptions(manifest, d.templateOptions, { invitationId });
    if (!cleaned.ok) {
      return { status: "error", message: "Ada isian tema yang tidak valid.", fieldErrors: cleaned.errors };
    }
    templateOptions = mergeTemplateOptions(templateOptions, manifest.id, cleaned.value);
  }

  const toPerson = (p: typeof d.couple.groom, role: "groom" | "bride") => ({
    name: p.name,
    fullname: p.fullname,
    [role === "groom" ? "sonOf" : "daughterOf"]: p.parentPrefix,
    father: p.father,
    mother: p.mother,
    instagram: p.socialHandle,
    socialIcon: p.socialHandle ? p.socialKind : undefined,
    image: p.image,
  });

  const firstEvent = d.events.find((e) => e.date);
  const old = (inv.content ?? {}) as Record<string, unknown>;
  const content = {
    ...old, // pertahankan field yang tidak diedit di sini (mis. ogImage)
    couple: { groom: toPerson(d.couple.groom, "groom"), bride: toPerson(d.couple.bride, "bride") },
    events: d.events,
    stories: d.stories,
    gallery: d.gallery,
    gifts: d.gifts.filter((g) => g.accountNumber),
    quotes: d.quotes,
    quotesSource: d.quotesSource,
    coverImage: d.coverImage,
    music: d.music,
    youtubeUrl: d.youtubeUrl,
    weddingDate: firstEvent?.date ?? old.weddingDate,
    // Hitung mundur mengikuti acara pertama.
    countdownDate: firstEvent ? `${firstEvent.date} ${firstEvent.startTime || "08:00"}:00` : old.countdownDate,
  };

  const { error } = await supabase
    .from("invitations")
    .update({
      content: JSON.parse(JSON.stringify(content)) as { [key: string]: Json },
      template_options: templateOptions as { [key: string]: Json },
    })
    .eq("id", invitationId);
  if (error) return { status: "error", message: `Gagal menyimpan: ${error.message}` };

  updateTag(invitationTag(inv.slug));
  refresh();
  return { status: "ok", savedAt: new Date().toISOString() };
}
