import type { ColorField, SelectField, ToggleField } from "../manifest";

/**
 * Kerangka tema ilustrasi (kelas Premium).
 *
 * Satu tampilan dipakai banyak tema. Setiap tema cukup menyediakan:
 * 1. Folder aset di public/templates/<id>/ dengan nama file standar (ASSET_FILES).
 * 2. Palet warna, dan kalau perlu label bahasa daerah serta penyesuaian posisi aset.
 * 3. manifest.ts yang memakai illustratedFields().
 *
 * Contoh lengkap: src/templates/sage-garden/.
 */

/** Nama file aset yang wajib ada di setiap tema ilustrasi. Daftar prompt Canva: docs/PROMPT-CANVA-PREMIUM.md. */
export const ASSET_FILES = {
  /** Tekstur kertas, diulang (tile). Lebar disarankan 1200px. */
  paper: "kertas.webp",
  /** Buket sudut kiri atas sampul dan pembuka. */
  left: "buket-kiri.webp",
  /** Buket sudut kanan atas. */
  right: "buket-kanan.webp",
  /** Rangkaian kecil yang menempel di atas bingkai foto. */
  clusterA: "buket-bingkai-a.webp",
  /** Rangkaian kecil melebar di bawah bingkai foto, kartu, dan penutup. */
  clusterB: "buket-bingkai-b.webp",
  /** Pembatas panjang mendatar. */
  divider: "pembatas.webp",
  /** Noda cat air samar di latar. */
  stain: "noda.webp",
  /** Kelopak/daun kecil untuk animasi jatuh. */
  petal1: "kelopak-1.webp",
  petal2: "kelopak-2.webp",
  petal3: "kelopak-3.webp",
} as const;

export type AssetKey = keyof typeof ASSET_FILES;

export const DEFAULT_LABELS = {
  coverKicker: "Undangan Pernikahan",
  coverGuest: "Kepada Yth. Bapak/Ibu/Saudara/i",
  coverGuestFallback: "Tamu Undangan",
  open: "Buka Undangan",
  heroKicker: "The Wedding Of",
  heroLead: "Kami berharap Anda menjadi bagian dari hari bahagia kami.",
  saveDate: "Simpan Tanggal",
  couple: "Mempelai",
  events: "Waktu dan Tempat",
  map: "Lihat Lokasi",
  story: "Cerita Kami",
  gallery: "Galeri",
  gifts: "Tanda Kasih",
  giftsLead: "Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberikan tanda kasih, dapat melalui:",
  wishes: "Ucapan dan Doa",
  closing: "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
  closingKicker: "Kami yang berbahagia",
};

export type IllustratedLabels = typeof DEFAULT_LABELS;

export type IllustratedTheme = {
  /** Sama dengan id manifest dan nama folder aset. */
  id: string;
  palette: {
    /** Warna kertas (di bawah tekstur). */
    paper: string;
    /** Warna teks utama. */
    ink: string;
    muted: string;
    /** Aksen lembut: garis, fokus form. */
    accent: string;
    /** Aksen judul kecil dan nama panggilan. */
    gold: string;
    /** Teks di bagian gelap. */
    cream: string;
    /** Latar bingkai foto saat foto belum ada. */
    photoBg: string;
  };
  /** Ganti sebagian label, mis. untuk tema adat berbahasa daerah. */
  labels?: Partial<IllustratedLabels>;
  /**
   * Penyesuaian kecil untuk aset yang arah gambarnya berbeda, mis.
   * { "--cluster-top-rotate": "-40deg" }. Lihat template.module.css.
   */
  vars?: Record<`--${string}`, string>;
};

export function defineIllustratedTheme(theme: IllustratedTheme) {
  return theme;
}

export function assetUrl(theme: IllustratedTheme, key: AssetKey) {
  return `/templates/${theme.id}/${ASSET_FILES[key]}`;
}

/** Isian editor yang sama untuk semua tema ilustrasi. `darkDefault` = warna bagian gelap bawaan tema. */
export function illustratedFields(darkDefault: string): IllustratedFields {
  return [
    {
      key: "greeting",
      type: "select",
      label: "Salam pembuka",
      help: "Islami menampilkan kaligrafi Bismillah dan salam di awal undangan.",
      options: [
        { value: "umum", label: "Umum" },
        { value: "islami", label: "Islami" },
      ],
      default: "umum",
    },
    {
      key: "coverStyle",
      type: "select",
      label: "Gaya sampul",
      help: "Foto: foto sampul memudar ke kertas. Ilustrasi: hanya kertas dan bunga.",
      options: [
        { value: "foto", label: "Foto pasangan" },
        { value: "ilustrasi", label: "Ilustrasi saja" },
      ],
      default: "foto",
    },
    {
      key: "darkColor",
      type: "color",
      label: "Warna bagian gelap",
      help: "Warna latar bagian acara dan ucapan, juga warna tombol.",
      default: darkDefault,
    },
    {
      key: "petals",
      type: "toggle",
      label: "Kelopak berjatuhan",
      help: "Animasi kelopak bunga yang jatuh pelan di layar.",
      default: true,
    },
  ];
}

export type IllustratedFields = readonly [
  SelectField & { key: "greeting" },
  SelectField & { key: "coverStyle" },
  ColorField & { key: "darkColor" },
  ToggleField & { key: "petals" },
];
