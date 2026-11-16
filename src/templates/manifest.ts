/**
 * Format manifest template Nauvite.
 *
 * Setiap template punya satu file manifest.ts di foldernya sendiri. Manifest
 * menjelaskan data katalog (nama, kategori, daerah, label) dan daftar isian
 * khusus template. Editor dan validasi server membaca daftar isian ini, jadi
 * menambah template baru tidak perlu mengubah editor maupun database.
 *
 * Nilai isian disimpan di kolom invitations.template_options, dikelompokkan per
 * id template: { "<id template>": { "<key isian>": nilai } }. Isian yang kosong
 * tidak disimpan; template memakai nilai bawaan (`default`) dari manifest.
 */

export type TemplateCategory = "signature" | "adat" | "clean" | "floral";

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  signature: "Signature",
  adat: "Adat",
  clean: "Clean",
  floral: "Floral",
};

/**
 * Paket = level tema. Basic: tema Signature/Clean dan sejenisnya. Premium: tema ilustrasi
 * berlapis dengan animasi kaya. Fitur undangan sama di kedua paket.
 */
export type TemplateTier = "basic" | "premium";

export const TIER_LABELS: Record<TemplateTier, string> = {
  basic: "Basic",
  premium: "Premium",
};

export type TemplateBadge = "baru" | "populer";

/**
 * Gambar atau video. `src` berupa path di storage (`<id undangan>/file.mp4`) atau
 * URL file bawaan di public/. `poster`: gambar diam untuk video, tampil selama video
 * dimuat dan untuk pengunjung yang mematikan animasi.
 */
export type MediaValue = { kind: "image" | "video"; src: string; poster?: string };

type BaseField = {
  /** Nama isian di JSON. Huruf kecil/camelCase, jangan diganti setelah template dipakai klien. */
  key: string;
  /** Label di editor. */
  label: string;
  /** Penjelasan singkat di bawah isian. */
  help?: string;
};

export type TextField = BaseField & {
  type: "text" | "textarea";
  default: string;
  maxLength?: number;
};

export type ColorField = BaseField & {
  type: "color";
  /** Warna hex, mis. "#1f3a2e". */
  default: string;
};

export type SelectField = BaseField & {
  type: "select";
  options: { value: string; label: string }[];
  default: string;
};

export type ToggleField = BaseField & {
  type: "toggle";
  default: boolean;
};

export type MediaField = BaseField & {
  type: "media";
  /** Jenis file yang boleh diunggah klien. */
  accept: ("image" | "video")[];
  /** File bawaan template (di folder public/). null kalau tanpa bawaan. */
  default: MediaValue | null;
};

export type TemplateField = TextField | ColorField | SelectField | ToggleField | MediaField;

export type TemplateManifest = {
  /** Id unik, sama dengan nama folder template. Disimpan di invitations.template_id. */
  id: string;
  name: string;
  category: TemplateCategory;
  tier: TemplateTier;
  /** Asal daerah untuk tema adat, mis. "Sunda". */
  region?: string;
  description: string;
  badges?: TemplateBadge[];
  /** false untuk versi tanpa foto (paket hemat). */
  withPhoto: boolean;
  /** Gambar pratinjau untuk katalog, di folder public/. */
  thumbnail?: string;
  /** Warna khas tema untuk kartu di panel dan katalog: latar, aksen, teks. */
  swatch: { background: string; accent: string; text: string };
  /** Naikkan kalau isian berubah besar, supaya data lama bisa disesuaikan. */
  version: number;
  fields: readonly TemplateField[];
};

/** Membantu TypeScript mengecek manifest saat ditulis. */
export function defineManifest<const M extends TemplateManifest>(manifest: M): M {
  return manifest;
}

/** Tipe nilai isian hasil resolveOptions, diturunkan dari manifest. */
type FieldValue<F> = F extends { type: "toggle" }
  ? boolean
  : F extends { type: "media" }
    ? MediaValue | null
    : string;

export type OptionsOf<M extends TemplateManifest> = {
  [F in M["fields"][number] as F["key"]]: FieldValue<F>;
};
