import type { TemplateManifest } from "./manifest";
import royalGold from "./royal-gold/manifest";
import floralLight from "./floral-light/manifest";
import midnightDark from "./midnight-dark/manifest";
import solidEditorial from "./solid-editorial/manifest";
import sundaneseElegance from "./sundanese-elegance/manifest";
import betawiHeritage from "./betawi-heritage/manifest";
import javaneseKeraton from "./javanese-keraton/manifest";
import batakUlos from "./batak-ulos/manifest";
import sageGarden from "./sage-garden/manifest";
import dustyRose from "./dusty-rose/manifest";
import lavenderMist from "./lavender-mist/manifest";
import koranPagi from "./koran-pagi/manifest";
import piringanHitam from "./piringan-hitam/manifest";
import herbarium from "./herbarium/manifest";
import tiketKereta from "./tiket-kereta/manifest";
import suratCinta from "./surat-cinta/manifest";
import bioskop from "./bioskop/manifest";

/**
 * Daftar semua template. Menambah template baru:
 * 1. Buat folder src/templates/<id>/ berisi manifest.ts (dan tampilannya).
 * 2. Impor dan tambahkan ke daftar ini.
 * Editor, katalog, dan validasi otomatis mengikuti.
 */
export const TEMPLATES = [
  royalGold,
  floralLight,
  midnightDark,
  solidEditorial,
  sundaneseElegance,
  betawiHeritage,
  javaneseKeraton,
  batakUlos,
  sageGarden,
  dustyRose,
  lavenderMist,
  suratCinta,
  koranPagi,
  piringanHitam,
  herbarium,
  tiketKereta,
  bioskop,
] as const satisfies readonly TemplateManifest[];

export type TemplateId = (typeof TEMPLATES)[number]["id"];

const byId = new Map<string, TemplateManifest>(TEMPLATES.map((t) => [t.id, t]));

export function getManifest(id: string): TemplateManifest | undefined {
  return byId.get(id);
}

export function isTemplateId(id: string): id is TemplateId {
  return byId.has(id);
}

// Cegah id kembar atau key isian kembar saat ada yang menambah template.
for (const t of TEMPLATES) {
  const keys = t.fields.map((f) => f.key);
  if (new Set(keys).size !== keys.length) {
    throw new Error(`Template ${t.id} punya key isian yang kembar`);
  }
}
if (byId.size !== TEMPLATES.length) {
  throw new Error("Ada id template yang kembar di registry");
}
