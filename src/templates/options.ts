import { z } from "zod";
import type { MediaValue, OptionsOf, TemplateField, TemplateManifest } from "./manifest";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const TEXT_MAX = 2000;

type ValidateContext = {
  /** Id undangan yang sedang disimpan. File unggahan harus ada di folder undangan ini. */
  invitationId: string;
};

function fieldSchema(field: TemplateField, ctx: ValidateContext): z.ZodType {
  switch (field.type) {
    case "text":
    case "textarea":
      return z.string().trim().max(field.maxLength ?? TEXT_MAX);
    case "color":
      return z.string().regex(HEX_COLOR, "Warna harus format #RRGGBB");
    case "select":
      return z.enum(field.options.map((o) => o.value) as [string, ...string[]]);
    case "toggle":
      return z.boolean();
    case "media": {
      // File harus milik undangan ini, atau file bawaan template itu sendiri.
      const allowed = (path: string, defaultPath?: string) =>
        path.startsWith(`${ctx.invitationId}/`) || (!!defaultPath && path === defaultPath);
      return z.object({
        kind: z.enum(field.accept as [MediaValue["kind"], ...MediaValue["kind"][]]),
        src: z
          .string()
          .max(300)
          .refine((p) => allowed(p, field.default?.src), "File harus diunggah ke undangan ini"),
        poster: z
          .string()
          .max(300)
          .refine((p) => allowed(p, field.default?.poster), "File harus diunggah ke undangan ini")
          .optional(),
      });
    }
  }
}

export type CleanResult =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; errors: Record<string, string> };

/**
 * Membersihkan isian template dari editor sebelum disimpan ke database.
 * - Isian yang tidak ada di manifest dibuang.
 * - Isian kosong (string kosong, null) dibuang supaya memakai nilai bawaan.
 * - Isian yang tipenya salah ditolak dengan pesan per isian.
 */
export function cleanTemplateOptions(
  manifest: TemplateManifest,
  input: unknown,
  ctx: ValidateContext,
): CleanResult {
  const raw = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const value: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of manifest.fields) {
    const v = (raw as Record<string, unknown>)[field.key];
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) continue;

    const parsed = fieldSchema(field, ctx).safeParse(v);
    if (parsed.success) {
      value[field.key] = parsed.data;
    } else {
      errors[field.key] = parsed.error.issues[0]?.message ?? "Isian tidak valid";
    }
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

/**
 * Menggabungkan isian tersimpan dengan nilai bawaan manifest, untuk dipakai
 * template saat menampilkan undangan. Nilai tersimpan yang rusak diabaikan
 * (memakai bawaan) supaya undangan tamu tidak pernah error.
 *
 * @param stored seluruh isi kolom template_options
 */
export function resolveOptions<M extends TemplateManifest>(
  manifest: M,
  stored: unknown,
  invitationId: string,
): OptionsOf<M> {
  const all = stored && typeof stored === "object" ? (stored as Record<string, unknown>) : {};
  const mine = all[manifest.id];
  const raw = mine && typeof mine === "object" ? (mine as Record<string, unknown>) : {};

  const result: Record<string, unknown> = {};
  for (const field of manifest.fields) {
    const parsed = fieldSchema(field, { invitationId }).safeParse(raw[field.key]);
    result[field.key] = parsed.success ? parsed.data : field.default;
  }
  return result as OptionsOf<M>;
}

/**
 * Menyimpan isian satu template tanpa menghapus isian template lain,
 * supaya klien yang mencoba ganti tema lalu kembali tidak kehilangan datanya.
 */
export function mergeTemplateOptions(
  stored: unknown,
  templateId: string,
  cleaned: Record<string, unknown>,
): Record<string, unknown> {
  const all = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  return { ...(all as Record<string, unknown>), [templateId]: cleaned };
}
