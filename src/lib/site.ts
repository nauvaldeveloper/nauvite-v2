import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

/** Data usaha yang tampil di landing page. Diatur admin di menu Pengaturan. */
export type SiteSettings = {
  businessName: string;
  whatsapp: string;
  /** Paket Hemat (tema tanpa foto): harga yang berlaku hari ini. */
  priceHemat: number;
  /** Harga normal Hemat kalau promo sedang berlaku, null kalau tidak promo. */
  hematNormal: number | null;
  /** Tanggal terakhir promo, "2026-12-31". null kalau tidak promo. */
  hematPromoUntil: string | null;
  priceBasic: number;
  pricePremium: number;
  /** Harga mitra per paket */
  partnerHemat: number;
  partnerBasic: number;
  partnerPremium: number;
};

export const SITE_SETTINGS_TAG = "site-settings";

/** Isi app_settings.pricing. */
export type Pricing = {
  default?: number;
  premium?: number;
  partner?: number;
  partnerPremium?: number;
  hemat?: number;
  hematPromo?: number;
  hematPromoUntil?: string;
  partnerHemat?: number;
};

export const HEMAT_DEFAULTS = { hemat: 50000, hematPromo: 39000, hematPromoUntil: "2026-12-31", partnerHemat: 25000 };

/** Biaya opsional kalau klien paket Hemat minta isinya diisikan admin. Basic dan Premium gratis. */
export const HEMAT_FILL_FEE = 15000;

/** Promo berlaku kalau tanggalnya belum lewat (WIB) dan harganya memang di bawah harga normal. */
function hematPrice(pricing: Pricing) {
  const normal = pricing.hemat ?? HEMAT_DEFAULTS.hemat;
  const promo = pricing.hematPromo ?? HEMAT_DEFAULTS.hematPromo;
  const until = pricing.hematPromoUntil ?? HEMAT_DEFAULTS.hematPromoUntil;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const active = promo > 0 && promo < normal && until >= today;
  return {
    priceHemat: active ? promo : normal,
    hematNormal: active ? normal : null,
    hematPromoUntil: active ? until : null,
  };
}

const DEFAULTS = {
  businessName: "Nauvite",
  whatsapp: "",
  priceBasic: 75000,
  pricePremium: 99000,
  partnerBasic: 50000,
  partnerPremium: 75000,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours"); // akhir promo terlambat paling lama beberapa jam
  cacheTag(SITE_SETTINGS_TAG);

  const { data } = await createPublicClient().from("app_settings").select("key, value");
  const get = (k: string) => data?.find((r) => r.key === k)?.value;
  const pricing = (get("pricing") as Pricing | undefined) ?? {};
  return {
    businessName: (get("business_name") as string) || DEFAULTS.businessName,
    whatsapp: (get("owner_whatsapp") as string) || DEFAULTS.whatsapp,
    ...hematPrice(pricing),
    partnerHemat: pricing.partnerHemat ?? HEMAT_DEFAULTS.partnerHemat,
    priceBasic: pricing.default ?? DEFAULTS.priceBasic,
    pricePremium: pricing.premium ?? DEFAULTS.pricePremium,
    partnerBasic: pricing.partner ?? DEFAULTS.partnerBasic,
    partnerPremium: pricing.partnerPremium ?? DEFAULTS.partnerPremium,
  };
}

/** Link WhatsApp ke admin dengan pesan yang sudah terisi. */
export function waLink(whatsapp: string, message: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function rupiah(n: number) {
  return `Rp${new Intl.NumberFormat("id-ID").format(n)}`;
}
