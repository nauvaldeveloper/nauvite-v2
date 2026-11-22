import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { PRINT_DEFAULTS, type PrintDesign, type PrintSettings } from "./shared";

export const PRINT_TAG = "print-designs";

const COLUMNS = "id, code, name, tier, format, orientation, foil, price, note, images, featured";

/** Desain cetak yang aktif (dijaga RLS), urut sesuai pilihan admin. */
export async function getPrintDesigns(): Promise<PrintDesign[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRINT_TAG);

  const { data } = await createPublicClient()
    .from("print_designs")
    .select(COLUMNS)
    .eq("active", true)
    .order("sort")
    .order("code");
  return (data ?? []) as PrintDesign[];
}

/** Minimal pesanan dan lama produksi, diatur admin di menu Cetak. */
export async function getPrintSettings(): Promise<PrintSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRINT_TAG);

  const { data } = await createPublicClient().from("app_settings").select("value").eq("key", "print").maybeSingle();
  return parsePrintSettings(data?.value);
}

export function parsePrintSettings(value: unknown): PrintSettings {
  const v = (value ?? {}) as Partial<PrintSettings>;
  return {
    minOrder: typeof v.minOrder === "number" && v.minOrder > 0 ? v.minOrder : PRINT_DEFAULTS.minOrder,
    leadDays: typeof v.leadDays === "string" && v.leadDays.trim() ? v.leadDays : PRINT_DEFAULTS.leadDays,
    plastic: typeof v.plastic === "number" && v.plastic >= 0 ? v.plastic : PRINT_DEFAULTS.plastic,
    label: typeof v.label === "number" && v.label >= 0 ? v.label : PRINT_DEFAULTS.label,
  };
}
