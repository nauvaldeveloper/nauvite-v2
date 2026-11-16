import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

/** Data usaha yang tampil di landing page. Diatur admin di menu Pengaturan. */
export type SiteSettings = {
  businessName: string;
  whatsapp: string;
  priceBasic: number;
  pricePremium: number;
  /** Harga mitra untuk paket Basic dan Premium */
  partnerBasic: number;
  partnerPremium: number;
};

export const SITE_SETTINGS_TAG = "site-settings";

const DEFAULTS: SiteSettings = {
  businessName: "Nauvite",
  whatsapp: "",
  priceBasic: 75000,
  pricePremium: 99000,
  partnerBasic: 50000,
  partnerPremium: 75000,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(SITE_SETTINGS_TAG);

  const { data } = await createPublicClient().from("app_settings").select("key, value");
  const get = (k: string) => data?.find((r) => r.key === k)?.value;
  const pricing = (get("pricing") as { default?: number; premium?: number; partner?: number; partnerPremium?: number } | undefined) ?? {};
  return {
    businessName: (get("business_name") as string) || DEFAULTS.businessName,
    whatsapp: (get("owner_whatsapp") as string) || DEFAULTS.whatsapp,
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
