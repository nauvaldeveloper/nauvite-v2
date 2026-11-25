import { CATEGORY_LABELS, TIER_LABELS, type TemplateManifest, type TemplateTier } from "@/templates/manifest";
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
  "piringan-hitam": "contoh-piringan-hitam",
  "koran-pagi": "contoh-koran-pagi",
  "surat-cinta": "contoh-surat-cinta",
  "solid-editorial": "dimas-laras",
  "royal-gold": "contoh-royal-gold",
  "floral-light": "contoh-floral-light",
  "midnight-dark": "contoh-midnight-dark",
};

/**
 * Tema dengan beberapa demo warna. Demo pertama memakai slug di DEMO_SLUG, sisanya
 * `<slug>-<warna>`. Nama warna diambil dari isian `palette` dan `paletteSwatches` manifest.
 */
const COLOR_DEMOS = new Set(["surat-cinta", "koran-pagi", "piringan-hitam"]);

/** Tema yang gambar kartunya memakai sampul (bukan isi), beserta titik potongnya. */
const CARD_COVER: Record<string, string> = { "surat-cinta": "50% 50%", "koran-pagi": "50% 50%", "piringan-hitam": "50% 50%" };

export type CatalogDemo = {
  slug: string;
  /** Nama dan warna bulatan, untuk tema yang punya beberapa warna. */
  label: string;
  color: string;
  cover: string;
  inside: string;
  card: string;
};

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  tier: TemplateTier;
  tierLabel: string;
  region?: string;
  isNew: boolean;
  withPhoto: boolean;
  swatch: { background: string; accent: string; text: string };
  /** Kosong kalau tema belum punya demo (segera hadir). */
  demos: CatalogDemo[];
  /** Bagian gambar yang tampil di kartu (object-position). */
  cardPosition: string;
};

export function getCatalog(): CatalogItem[] {
  const items = TEMPLATES.map((t: TemplateManifest) => {
    const slug = DEMO_SLUG[t.id];
    const useCover = t.id in CARD_COVER;
    const makeDemo = (suffix: string, label: string, color: string): CatalogDemo => {
      const cover = `/landing/${t.id}${suffix}-sampul.webp`;
      const inside = `/landing/${t.id}${suffix}-isi.webp`;
      return { slug: slug + suffix, label, color, cover, inside, card: useCover ? cover : inside };
    };
    const palette = t.fields.find((f) => f.key === "palette");
    let demos: CatalogDemo[] = [];
    if (slug && COLOR_DEMOS.has(t.id) && palette?.type === "select") {
      demos = palette.options.map((o, i) =>
        makeDemo(i === 0 ? "" : `-${o.value}`, o.label, t.paletteSwatches?.[o.value]?.background ?? t.swatch.background),
      );
    } else if (slug) {
      demos = [makeDemo("", "", t.swatch.background)];
    }
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      categoryLabel: CATEGORY_LABELS[t.category],
      tier: t.tier,
      tierLabel: TIER_LABELS[t.tier],
      region: t.region,
      isNew: t.badges?.includes("baru") === true,
      withPhoto: t.withPhoto,
      swatch: t.swatch,
      demos,
      cardPosition: CARD_COVER[t.id] ?? "50% 30%",
    };
  });
  // Adat premium dulu, lalu tema tanpa foto (supaya ikut tampil di layar pertama HP), premium lain,
  // sisanya, dan terakhir yang segera hadir.
  const rank = (i: CatalogItem) => (i.tier === "premium" && i.category === "adat" ? 3 : !i.withPhoto ? 2 : 1);
  return items.sort(
    (a, b) =>
      rank(b) - rank(a) ||
      Number(b.tier === "premium") - Number(a.tier === "premium") || Number(b.demos.length > 0) - Number(a.demos.length > 0),
  );
}
