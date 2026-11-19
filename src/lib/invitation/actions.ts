"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { getPublicInvitation, wishesTag } from "./public";

export type WishFormState = {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "message" | "attendance" | "guestCount", string>>;
};

const wishSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(60, "Nama terlalu panjang"),
  message: z.string().trim().max(500, "Ucapan maksimal 500 huruf"),
  attendance: z.enum(["hadir", "tidak_hadir", "belum_pasti"], {
    error: "Pilih konfirmasi kehadiran",
  }),
  guestCount: z.coerce.number().int().min(1).max(20).catch(1),
});

/** Tamu mengirim ucapan + konfirmasi kehadiran. */
export async function submitWish(
  slug: string,
  _prev: WishFormState,
  formData: FormData,
): Promise<WishFormState> {
  // Jebakan bot: kolom tersembunyi ini selalu kosong kalau yang mengisi manusia.
  if (formData.get("website")) return { status: "ok", message: "Terima kasih!" };

  const parsed = wishSchema.safeParse({
    name: formData.get("name") ?? "",
    message: formData.get("message") ?? "",
    attendance: formData.get("attendance") ?? undefined,
    guestCount: formData.get("guestCount") ?? 1,
  });
  if (!parsed.success) {
    const errors: WishFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<WishFormState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { status: "error", errors };
  }

  const invitation = await getPublicInvitation(slug);
  if (!invitation) {
    return { status: "error", message: "Undangan ini sudah tidak aktif." };
  }

  const { name, message, attendance, guestCount } = parsed.data;
  const { error } = await createPublicClient()
    .from("wishes")
    .insert({
      invitation_id: invitation.id,
      name,
      message: message || null,
      attendance,
      guest_count: attendance === "hadir" ? guestCount : 1,
    });

  if (error) {
    // Penolakan dari trigger database (lihat migration pengamanan)
    if (error.hint === "duplicate") {
      return { status: "ok", message: "Ucapan Anda sudah terkirim sebelumnya. Terima kasih!" };
    }
    if (error.hint === "rate_limit") {
      return { status: "error", message: "Sedang banyak ucapan masuk. Coba kirim lagi sebentar lagi." };
    }
    return { status: "error", message: "Ucapan gagal terkirim. Coba lagi sebentar lagi." };
  }

  updateTag(wishesTag(slug));
  return { status: "ok", message: "Terima kasih, ucapan dan konfirmasi Anda sudah terkirim." };
}
