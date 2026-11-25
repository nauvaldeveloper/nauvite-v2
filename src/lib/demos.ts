import { CATEGORY_LABELS, TIER_LABELS } from "@/templates/manifest";
import { TEMPLATES } from "@/templates/registry";

/**
 * Undangan demo untuk setiap tema di landing page. Gambar di public/landing dibuat
 * dari undangan demo ini (screenshot sampul dan isi).
 * Tema tanpa demo tampil sebagai "Segera hadir".
 *
 * Saat rilis, undangan demo ini juga harus ada di database produksi (lihat docs/DEPLOY.md).
 */
const DEMO_SLUG: Record<string, string> = {
  "sage-garden": "contoh-sage-garden",
  "dusty-rose": "contoh-dusty-rose",
  "lavender-mist": "contoh-lavender-mist",
  "sundanese-elegance": "contoh-sundanese-elegance",
  "javanese-keraton": "contoh-javanese-keraton",
  "betawi-heritage": "contoh-betawi-heritage",
  "surat-cinta": "contoh-surat-cinta",
  "solid-editorial": "dimas-laras",
  "royal-gold": "contoh-royal-gold",
  "floral-light": "contoh-floral-light",
  "midnight-dark": "contoh-midnight-dark",
};

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  tier: "basic" | "premium";
  tierLabel: string;
  region?: string;
  isNew: boolean;
  withPhoto: boolean;
  swatch: { background: string; accent: string; text: string };
  demo: { slug: string; inside: string } | null;
};

export function getCatalog(): CatalogItem[] {
  const items = TEMPLATES.map((t) => {
    const slug = DEMO_SLUG[t.id];
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      categoryLabel: CATEGORY_LABELS[t.category],
      tier: t.tier,
      tierLabel: TIER_LABELS[t.tier],
      region: "region" in t ? (t.region as string) : undefined,
      isNew: "badges" in t && (t.badges as readonly string[] | undefined)?.includes("baru") === true,
      withPhoto: t.withPhoto,
      swatch: t.swatch,
      demo: slug
        ? { slug, inside: `/landing/${t.id}-isi.webp` }
        : null,
    };
  });
  // Premium dulu, lalu yang punya demo, lalu yang segera hadir.
  return items.sort(
    (a, b) =>
      Number(b.tier === "premium") - Number(a.tier === "premium") || Number(!!b.demo) - Number(!!a.demo),
  );
}
