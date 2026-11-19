import type { ToggleField } from "../manifest";
import { illustratedFields, type IllustratedFields, type IllustratedTheme } from "../illustrated/theme";

/**
 * Kerangka tema adat (kelas Premium).
 *
 * Memakai data dan fitur yang sama dengan tema ilustrasi (aset dasar ASSET_FILES,
 * palet, label), ditambah ciri adat:
 * - pintu kayu berukir sebagai sampul dan pemandangan berlapis di bagian pertama (SCENE_FILES),
 * - ornamen vektor emas: mahkota, atap rumah adat, pembatas, ronce, ukiran sudut, anyaman (ORNAMENT_FILES),
 * - aksara daerah kecil di atas setiap judul.
 *
 * Contoh lengkap: src/templates/sundanese-elegance/.
 */

/** Aset pemandangan dan pintu (WebP, diolah dengan scripts/olah-aset.mjs). */
export const SCENE_FILES = {
  sky: "langit.webp",
  clouds: "awan.webp",
  mountain: "gunung.webp",
  hills: "bukit.webp",
  front: "depan.webp",
  figureLeft: "tokoh-kiri.webp",
  figureRight: "tokoh-kanan.webp",
  doorLeft: "pintu-kiri.webp",
  doorRight: "pintu-kanan.webp",
} as const;

/** Ornamen vektor emas di public/templates/<id>/ornamen/ (nama file sama untuk semua tema adat). */
export const ORNAMENT_FILES = {
  /** Mahkota pengantin, di atas nama. */
  crown: "ornamen/mahkota.svg",
  /** Atap rumah adat, di atas bingkai foto. */
  roof: "ornamen/atap.svg",
  /** Pembatas di bawah judul. */
  divider: "ornamen/pembatas.svg",
  /** Untaian bunga yang menjuntai di sisi bingkai foto. */
  garland: "ornamen/untaian.svg",
  /** Ukiran sudut kartu. */
  corner: "ornamen/sudut.svg",
  /** Tekstur anyaman untuk bagian gelap (diulang). */
  weave: "ornamen/anyaman.svg",
} as const;

export type SceneKey = keyof typeof SCENE_FILES;
export type OrnamentKey = keyof typeof ORNAMENT_FILES;

export type SceneConfig = {
  /** Salam di pintu, mis. "Sampurasun". */
  greeting: string;
  /** Kalimat kecil di atas nama pada pintu dan pemandangan. */
  kicker: string;
};

/** Judul bagian yang bisa diberi aksara daerah kecil di atasnya. */
export type HeadingKey = "greeting" | "hero" | "couple" | "events" | "story" | "gallery" | "gifts" | "wishes" | "closing";

export type AdatTheme = IllustratedTheme & {
  scene: SceneConfig;
  /** Tulisan aksara daerah per judul (opsional). Harus dicek penutur asli. */
  aksara?: Partial<Record<HeadingKey, string>>;
};

export function defineAdatTheme(theme: AdatTheme) {
  return theme;
}

export function sceneUrl(theme: AdatTheme, key: SceneKey) {
  return `/templates/${theme.id}/${SCENE_FILES[key]}`;
}

export function ornamentUrl(theme: AdatTheme, key: OrnamentKey) {
  return `/templates/${theme.id}/${ORNAMENT_FILES[key]}`;
}

/** Isian editor tema adat: isian tema ilustrasi ditambah pilihan animasi pintu pembuka. */
export function adatFields(darkDefault: string, doorName: string): AdatFields {
  return [
    ...illustratedFields(darkDefault, {
      coverHelp: "Foto: foto pasangan tampil di bingkai rumah adat. Ilustrasi: bingkai berisi hiasan tanpa foto.",
    }),
    {
      key: "openingAnimation",
      type: "toggle",
      label: `Animasi pembuka (${doorName})`,
      help: "Pintu kayu berukir terbuka saat tamu menekan tombol buka. Kalau dimatikan, sampul cukup memudar.",
      default: true,
    },
  ];
}

export type AdatFields = readonly [...IllustratedFields, ToggleField & { key: "openingAnimation" }];
