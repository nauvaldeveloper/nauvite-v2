"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Unggah file undangan langsung dari browser ke Supabase Storage.
 * File disimpan di folder "<id undangan>/", dan aturan storage memastikan hanya
 * pengelola undangan itu yang boleh mengunggah.
 */

export type UploadKind = "image" | "video" | "audio";

const LIMITS: Record<UploadKind, { bytes: number; label: string; types: RegExp }> = {
  image: { bytes: 15 * 1024 * 1024, label: "15 MB", types: /^image\/(jpeg|png|webp|heic|heif|avif|gif)$/ },
  video: { bytes: 25 * 1024 * 1024, label: "25 MB", types: /^video\/(mp4|webm|quicktime)$/ },
  audio: { bytes: 10 * 1024 * 1024, label: "10 MB", types: /^audio\/(mpeg|mp3|mp4|aac|ogg|x-m4a)$/ },
};

export const ACCEPT: Record<UploadKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/heic,image/heif",
  video: "video/mp4,video/webm",
  audio: "audio/mpeg,audio/mp3,audio/mp4,audio/aac,audio/x-m4a",
};

/** Perkecil foto (sisi terpanjang maks 1600px) dan ubah ke WebP supaya ringan. */
async function compressImage(file: File, maxSide = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  if (!blob) throw new Error("Browser tidak bisa memproses foto ini.");
  return blob;
}

export async function uploadInvitationFile(
  invitationId: string,
  file: File,
  kind: UploadKind,
): Promise<{ path: string } | { error: string }> {
  const limit = LIMITS[kind];
  if (file.size > limit.bytes) return { error: `Ukuran file maksimal ${limit.label}.` };
  if (file.type && !limit.types.test(file.type)) return { error: "Jenis file tidak didukung." };

  let body: Blob = file;
  let ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  let contentType = file.type;

  if (kind === "image" && file.type !== "image/gif") {
    try {
      body = await compressImage(file);
      ext = "webp";
      contentType = "image/webp";
    } catch {
      // Kalau browser tidak bisa mengompres (mis. HEIC di beberapa HP), unggah apa adanya.
    }
  }
  if (kind === "video" && ext === "mov") return { error: "Video .mov belum didukung. Pakai MP4." };
  if (kind === "audio" && contentType === "audio/mp3") contentType = "audio/mpeg";

  const path = `${invitationId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await createClient()
    .storage.from("invitation-media")
    .upload(path, body, { contentType, cacheControl: "31536000", upsert: false });
  if (error) return { error: `Gagal mengunggah: ${error.message}` };
  return { path };
}
