"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { REVIEWS_TAG } from "./public";

export type ReviewFormState = { status: "idle" | "ok" | "error"; message?: string };

const reviewSchema = z.object({
  coupleName: z.string().trim().min(1, "Isi nama pasangan").max(80),
  city: z
    .string()
    .trim()
    .max(60)
    .optional()
    .transform((v) => v || null),
  rating: z.coerce.number().int().min(1, "Pilih bintang").max(5),
  message: z.string().trim().min(10, "Ulasan minimal 10 huruf").max(600, "Ulasan maksimal 600 huruf"),
});

/** Klien mengirim ulasan untuk undangannya. Status menunggu persetujuan admin. */
export async function submitReview(
  invitationId: string,
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const user = await requireUser();
  if (!z.guid().safeParse(invitationId).success) return { status: "error", message: "Undangan tidak dikenal." };

  const parsed = reviewSchema.safeParse({
    coupleName: formData.get("coupleName") ?? "",
    city: formData.get("city") ?? undefined,
    rating: formData.get("rating") ?? 0,
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    invitation_id: invitationId,
    author_id: user.id,
    couple_name: parsed.data.coupleName,
    city: parsed.data.city,
    rating: parsed.data.rating,
    message: parsed.data.message,
    consent: formData.get("consent") === "on",
    status: "pending",
    source: "client",
  });
  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Kalian sudah pernah mengirim ulasan untuk undangan ini." : "Ulasan gagal terkirim.",
    };
  }
  refresh();
  return { status: "ok", message: "Terima kasih! Ulasan kalian sudah terkirim." };
}

/** Admin menyetujui, menyembunyikan, atau mengembalikan ulasan ke status menunggu. */
export async function setReviewStatus(id: string, formData: FormData) {
  await requireAdmin();
  z.guid().parse(id);
  const status = z.enum(["pending", "approved", "hidden"]).parse(formData.get("status"));
  const supabase = await createClient();
  await supabase.from("reviews").update({ status }).eq("id", id);
  updateTag(REVIEWS_TAG);
  refresh();
}

export async function deleteReview(id: string) {
  await requireAdmin();
  z.guid().parse(id);
  const supabase = await createClient();
  await supabase.from("reviews").delete().eq("id", id);
  updateTag(REVIEWS_TAG);
  refresh();
}

/** Admin memasukkan ulasan klien lama (mis. dari chat WhatsApp), langsung tampil. */
export async function createReviewByAdmin(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  await requireAdmin();
  const parsed = reviewSchema.safeParse({
    coupleName: formData.get("coupleName") ?? "",
    city: formData.get("city") ?? undefined,
    rating: formData.get("rating") ?? 0,
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  if (formData.get("consent") !== "on") {
    return { status: "error", message: "Pastikan klien sudah mengizinkan ulasannya ditampilkan." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    couple_name: parsed.data.coupleName,
    city: parsed.data.city,
    rating: parsed.data.rating,
    message: parsed.data.message,
    consent: true,
    status: "approved",
    source: "admin",
  });
  if (error) return { status: "error", message: `Gagal menyimpan: ${error.message}` };
  updateTag(REVIEWS_TAG);
  refresh();
  return { status: "ok", message: "Ulasan ditambahkan dan langsung tampil." };
}
