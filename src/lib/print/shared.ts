/** Data katalog undangan cetak yang aman dipakai di server maupun browser. */

export const PRINT_TIERS = {
  hemat: { label: "Hemat", hint: "Blangko full color tanpa foil, untuk yang cari harga paling ramah." },
  foil: { label: "Foil", hint: "Ada kilau foil emas atau silver di kertas, terasa lebih mewah." },
  eksklusif: { label: "Eksklusif", hint: "Set lengkap dengan amplop, board, atau hard cover." },
} as const;

export const PRINT_FORMATS = {
  satu: "1 lembar",
  lipat: "Lipat 2 sisi",
  amplop: "Dengan amplop",
  hardcover: "Hard cover",
} as const;

export const PRINT_FOILS = { none: "Tanpa foil", emas: "Foil emas", silver: "Foil silver" } as const;

export type PrintTier = keyof typeof PRINT_TIERS;
export type PrintFormat = keyof typeof PRINT_FORMATS;
export type PrintFoil = keyof typeof PRINT_FOILS;

export type PrintDesign = {
  id: string;
  code: string;
  name: string;
  tier: PrintTier;
  format: PrintFormat;
  orientation: "landscape" | "portrait";
  foil: PrintFoil;
  price: number;
  note: string | null;
  images: string[];
  featured: boolean;
};

export type PrintSettings = {
  minOrder: number;
  leadDays: string;
  /** Tambahan opsional per pcs: plastik undangan dan label stiker nama tamu */
  plastic: number;
  label: number;
};
export const PRINT_DEFAULTS: PrintSettings = { minOrder: 50, leadDays: "3-7", plastic: 500, label: 200 };

/** Gambar bawaan ada di /public ("/cetak/..."), unggahan admin ada di bucket print-media. */
export function printImageUrl(path: string) {
  if (path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/print-media/${path}`;
}
