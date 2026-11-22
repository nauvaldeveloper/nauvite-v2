import "server-only";
import { requireAdmin } from "@/lib/auth/dal";
import { createAdminClient } from "@/lib/supabase/admin";
import { parsePrintSettings } from "./public";
import type { PrintDesign, PrintSettings } from "./shared";

export type AdminPrintDesign = PrintDesign & {
  active: boolean;
  sort: number;
  vendorCode: string | null;
  cost: number | null;
};

/**
 * Kode vendor dan harga modal tidak bisa dibaca lewat klien biasa (izin kolom),
 * jadi dibaca dengan service role setelah dipastikan pemanggilnya admin.
 */
export async function listPrintDesignsForAdmin(): Promise<AdminPrintDesign[]> {
  await requireAdmin();
  const { data } = await createAdminClient().from("print_designs").select("*").order("sort").order("code");
  return (data ?? []).map(toAdmin);
}

export async function getPrintDesignForAdmin(id: string): Promise<AdminPrintDesign | null> {
  await requireAdmin();
  const { data } = await createAdminClient().from("print_designs").select("*").eq("id", id).maybeSingle();
  return data ? toAdmin(data) : null;
}

export async function getPrintSettingsForAdmin(): Promise<PrintSettings> {
  await requireAdmin();
  const { data } = await createAdminClient().from("app_settings").select("value").eq("key", "print").maybeSingle();
  return parsePrintSettings(data?.value);
}

type Row = {
  id: string;
  code: string;
  name: string;
  tier: string;
  format: string;
  orientation: string;
  foil: string;
  price: number;
  note: string | null;
  images: string[];
  featured: boolean;
  active: boolean;
  sort: number;
  vendor_code: string | null;
  cost: number | null;
};

function toAdmin(r: Row): AdminPrintDesign {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    tier: r.tier as AdminPrintDesign["tier"],
    format: r.format as AdminPrintDesign["format"],
    orientation: r.orientation as AdminPrintDesign["orientation"],
    foil: r.foil as AdminPrintDesign["foil"],
    price: r.price,
    note: r.note,
    images: r.images,
    featured: r.featured,
    active: r.active,
    sort: r.sort,
    vendorCode: r.vendor_code,
    cost: r.cost,
  };
}
