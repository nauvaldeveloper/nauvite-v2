"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PRINT_TAG } from "./public";
import { PRINT_FOILS, PRINT_FORMATS, PRINT_TIERS } from "./shared";

/** Aksi katalog cetak. Semua khusus admin (dicek lagi oleh RLS). */

export type PrintFormState = { status: "idle" | "ok" | "error"; message?: string };

const keys = <T extends object>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];
const rupiahInt = (label: string) =>
  z.coerce.number({ error: `${label} harus angka` }).int(`${label} harus angka bulat`).min(0).max(1_000_000);

const designSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{2,20}$/, "Kode 2-20 karakter: huruf, angka, dan tanda minus"),
  name: z.string().trim().min(1, "Isi nama desain").max(60),
  tier: z.enum(keys(PRINT_TIERS)),
  format: z.enum(keys(PRINT_FORMATS)),
  foil: z.enum(keys(PRINT_FOILS)),
  orientation: z.enum(["landscape", "portrait"]),
  price: rupiahInt("Harga jual"),
  cost: z
    .string()
    .trim()
    .transform((v) => (v ? Number(v) : null))
    .pipe(z.number().int().min(0).max(1_000_000).nullable()),
  vendorCode: z
    .string()
    .trim()
    .max(40)
    .transform((v) => v || null),
  note: z
    .string()
    .trim()
    .max(300)
    .transform((v) => v || null),
  sort: z.coerce.number().int().min(0).max(9999).catch(0),
  images: z
    .string()
    .transform((v, ctx) => {
      try {
        return JSON.parse(v || "[]");
      } catch {
        ctx.addIssue({ code: "custom", message: "Daftar gambar rusak" });
        return z.NEVER;
      }
    })
    .pipe(
      z
        .array(z.string().regex(/^(\/cetak\/[a-z0-9-]+\.webp|designs\/[a-f0-9-]{36}\.(webp|jpe?g|png))$/))
        .min(1, "Unggah minimal 1 foto")
        .max(8, "Maksimal 8 foto"),
    ),
});

/** Tambah (id null) atau ubah desain cetak. */
export async function savePrintDesign(id: string | null, _prev: PrintFormState, formData: FormData): Promise<PrintFormState> {
  await requireAdmin();
  if (id && !z.guid().safeParse(id).success) return { status: "error", message: "Desain tidak dikenal." };

  const parsed = designSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const v = parsed.data;
  const row = {
    code: v.code,
    name: v.name,
    tier: v.tier,
    format: v.format,
    foil: v.foil,
    orientation: v.orientation,
    price: v.price,
    cost: v.cost,
    vendor_code: v.vendorCode,
    note: v.note,
    sort: v.sort,
    images: v.images,
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("print_designs").update(row).eq("id", id)
    : await supabase.from("print_designs").insert(row);
  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Kode ini sudah dipakai desain lain." : `Gagal menyimpan: ${error.message}`,
    };
  }
  updateTag(PRINT_TAG);
  if (!id) redirect("/admin/cetak");
  refresh();
  return { status: "ok", message: "Tersimpan." };
}

export async function deletePrintDesign(id: string) {
  await requireAdmin();
  z.guid().parse(id);
  const supabase = await createClient();
  const { data } = await supabase.from("print_designs").select("images").eq("id", id).single();
  await supabase.from("print_designs").delete().eq("id", id);
  // Hapus juga foto unggahan (foto bawaan di /public dibiarkan)
  const uploaded = (data?.images ?? []).filter((p) => !p.startsWith("/"));
  if (uploaded.length) await supabase.storage.from("print-media").remove(uploaded);
  updateTag(PRINT_TAG);
  redirect("/admin/cetak");
}

const settingsSchema = z.object({
  minOrder: z.coerce.number({ error: "Minimal pesanan harus angka" }).int().min(1, "Minimal pesanan minimal 1").max(100000),
  leadDays: z.string().trim().min(1, "Isi lama produksi").max(20),
  plastic: z.coerce.number({ error: "Harga plastik harus angka" }).int().min(0).max(100000),
  label: z.coerce.number({ error: "Harga label harus angka" }).int().min(0).max(100000),
});

export async function savePrintSettings(_prev: PrintFormState, formData: FormData): Promise<PrintFormState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error } = await supabase
    .from("app_settings")
    .upsert({ key: "print", value: parsed.data, is_public: true });
  if (error) return { status: "error", message: `Gagal menyimpan: ${error.message}` };
  updateTag(PRINT_TAG);
  refresh();
  return { status: "ok", message: "Tersimpan." };
}
