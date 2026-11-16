import { z } from "zod";

/**
 * Bentuk data yang dikirim editor. Lebih ketat dari parser tampilan
 * (content.ts): panjang teks dibatasi supaya data rapi dan tidak bisa dipakai
 * menyimpan sampah berukuran besar.
 *
 * Disimpan dalam bentuk yang juga bisa dibaca parser lama:
 * - orang tua: sonOf/daughterOf berisi awalan ("Putra kedua dari"), father, mother terpisah
 * - akun sosial: instagram (nama akun) + socialIcon ("instagram" | "tiktok" | "whatsapp")
 */

const text = (max: number) => z.string().trim().max(max).default("");
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || undefined);

/** Path file di storage, file bawaan (/...), atau URL lama dari v1. */
export const mediaPath = z.string().trim().max(500);

const person = z.object({
  name: text(40),
  fullname: text(100),
  parentPrefix: optional(60),
  father: optional(100),
  mother: optional(100),
  socialKind: z.enum(["instagram", "tiktok", "whatsapp"]).default("instagram"),
  socialHandle: optional(60),
  image: mediaPath.optional(),
});

const event = z.object({
  title: text(60),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal acara belum diisi")
    .or(z.literal("")),
  startTime: optional(10),
  endTime: optional(20),
  location: optional(120),
  address: optional(300),
  mapsUrl: optional(500),
  entertainment: optional(200),
});

const story = z.object({
  title: text(80),
  date: optional(60),
  description: optional(1000),
  image: mediaPath.optional(),
});

const gift = z.object({
  bank: text(40),
  accountNumber: text(40),
  accountName: text(80),
});

export const editorPayloadSchema = z.object({
  couple: z.object({ groom: person, bride: person }),
  events: z.array(event).max(6),
  stories: z.array(story).max(10),
  gallery: z.array(mediaPath).max(24),
  gifts: z.array(gift).max(5),
  quotes: optional(600),
  quotesSource: optional(80),
  coverImage: mediaPath.optional(),
  music: mediaPath.optional(),
  youtubeUrl: optional(300),
  /** Isian khusus template yang sedang dipakai (divalidasi terhadap manifest). */
  templateOptions: z.record(z.string(), z.unknown()).default({}),
});

export type EditorPayload = z.input<typeof editorPayloadSchema>;
export type EditorPerson = z.input<typeof person>;
export type EditorEvent = z.input<typeof event>;
export type EditorStory = z.input<typeof story>;
export type EditorGift = z.input<typeof gift>;
