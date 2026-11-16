"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { wishesTag } from "./public";

/**
 * Menghapus ucapan (mis. spam). Hanya pengelola undangan (pemilik, mitra, admin)
 * yang bisa; aturan RLS database menolak yang lain.
 */
export async function deleteWish(wishId: string): Promise<{ ok: boolean; message?: string }> {
  await requireUser();
  if (!z.guid().safeParse(wishId).success) return { ok: false, message: "Ucapan tidak dikenal." };

  const supabase = await createClient();
  const { data: wish } = await supabase
    .from("wishes")
    .select("id, invitations(slug)")
    .eq("id", wishId)
    .maybeSingle();
  if (!wish) return { ok: false, message: "Ucapan tidak ditemukan." };

  const { data: deleted, error } = await supabase.from("wishes").delete().eq("id", wishId).select("id");
  if (error || !deleted?.length) return { ok: false, message: "Ucapan gagal dihapus." };

  const slug = (wish.invitations as { slug: string } | null)?.slug;
  if (slug) updateTag(wishesTag(slug));
  refresh();
  return { ok: true };
}
