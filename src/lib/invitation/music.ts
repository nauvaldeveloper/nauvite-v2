import type { InvitationContent } from "./content";

/**
 * Isian `music` undangan punya tiga kemungkinan:
 * - DEFAULT_MUSIC: ikut lagu bawaan tema (berganti sendiri kalau temanya diganti)
 * - path file atau URL: lagu milik klien
 * - kosong: tanpa lagu
 */
export const DEFAULT_MUSIC = "bawaan";

/** Lagu bawaan per tema, path di storage. Tema yang tidak disebut memakai GENERAL. */
const GENERAL = "demo/lagu-demo-1.mp3";
const BY_TEMPLATE: Record<string, string> = {
  "sundanese-elegance": "demo/lagu-sunda-1.mp3",
  "javanese-keraton": "demo/lagu-jawa-1.mp3",
  "betawi-heritage": "demo/lagu-betawi-1.mp3",
};

export const defaultMusicFor = (templateId: string) => BY_TEMPLATE[templateId] ?? GENERAL;

/** Untuk halaman tamu dan pratinjau: ganti penanda bawaan menjadi file lagunya. */
export function withMusic(content: InvitationContent, templateId: string): InvitationContent {
  return content.music === DEFAULT_MUSIC ? { ...content, music: defaultMusicFor(templateId) } : content;
}
