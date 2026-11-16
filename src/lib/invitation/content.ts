import { z } from "zod";

/**
 * Bentuk data umum undangan (kolom invitations.content), dipakai semua template.
 * Menerima format `config` Nauvite v1 apa adanya, supaya data klien lama bisa
 * dipindah tanpa diubah, lalu merapikannya ke satu bentuk yang dipakai template.
 *
 * Skema ini sengaja longgar: field yang rusak diganti nilai kosong, bukan error,
 * supaya halaman undangan tamu tidak pernah gagal tampil karena data kurang rapi.
 */

const str = z.string().trim().catch("");
const optStr = z
  .string()
  .trim()
  .optional()
  .catch(undefined)
  .transform((v) => v || undefined);

export type SocialLink = { kind: "instagram" | "tiktok" | "whatsapp"; handle: string; url: string };

function socialFrom(handleRaw: string | undefined, icon: string | undefined): SocialLink | undefined {
  const handle = handleRaw?.replace(/^@/, "").trim();
  if (!handle) return undefined;
  if (icon?.includes("tiktok")) return { kind: "tiktok", handle, url: `https://www.tiktok.com/@${handle}` };
  if (icon?.includes("whatsapp")) {
    const num = handle.replace(/\D/g, "").replace(/^0/, "62");
    return { kind: "whatsapp", handle, url: `https://wa.me/${num}` };
  }
  return { kind: "instagram", handle, url: `https://instagram.com/${handle}` };
}

/** "Putra dari Bpk. Hendra & Ibu Wirda" -> { prefix: "Putra dari", father: "Bapak Hendra", mother: "Ibu Wirda" } */
function parseParentSentence(sentence: string | undefined) {
  if (!sentence) return null;
  const m = /^(.*?\bdari)\s+(?:Bpk\.?|Bapak)\s*(.*?)\s*&\s*(?:Ibu\s*)?(.*)$/i.exec(sentence);
  if (!m) return null;
  const father = m[2].trim();
  const mother = m[3].trim();
  // v1 menyimpan "Putra dari Bpk.  & Ibu " kalau klien tidak mengisi nama orang tua.
  if (!father && !mother) return { prefix: m[1].trim(), father: undefined, mother: undefined };
  return {
    prefix: m[1].trim(),
    father: father ? `Bapak ${father}` : undefined,
    mother: mother ? `Ibu ${mother}` : undefined,
  };
}

const EMPTY_PERSON = {
  name: "",
  fullname: "",
  image: undefined,
  parentPrefix: undefined,
  father: undefined,
  mother: undefined,
  social: undefined,
};

const person = z
  .object({
    name: str, // nama panggilan
    fullname: str,
    sonOf: optStr, // "Putra kedua dari" atau kalimat lengkap gaya v1
    daughterOf: optStr,
    father: optStr,
    mother: optStr,
    instagram: optStr, // v1: bisa berisi akun TikTok/WA, lihat socialIcon
    socialIcon: optStr,
    image: optStr,
  })
  .transform((p) => {
    const parsed = parseParentSentence(p.sonOf ?? p.daughterOf);
    const father = p.father ?? parsed?.father;
    const mother = p.mother ?? parsed?.mother;
    return {
      name: p.name,
      fullname: p.fullname,
      image: p.image,
      /** Misalnya "Putra kedua dari". */
      parentPrefix: parsed?.prefix ?? p.sonOf ?? p.daughterOf,
      father,
      mother,
      social: socialFrom(p.instagram, p.socialIcon),
    };
  })
  .catch(() => EMPTY_PERSON);

const event = z.object({
  title: str,
  date: str, // "2027-02-14" (v1 demo kadang berupa teks "Kamis, 13 Desember 2029")
  startTime: optStr, // "08:00"
  endTime: optStr, // "10:00" atau "Selesai"
  time: optStr, // v1 lama: "08:00 - Selesai WIB"
  location: optStr,
  address: optStr,
  mapsUrl: optStr,
  entertainment: optStr,
}).transform(({ time, ...e }) => {
  if (!e.startTime && time) {
    const [start, end] = time.replace(/\s*WIB\s*$/i, "").split(/\s*-\s*/);
    return { ...e, startTime: start || undefined, endTime: e.endTime ?? (end || undefined) };
  }
  return e;
});

const story = z.object({
  title: str,
  date: optStr,
  description: optStr,
  image: optStr,
});

const gift = z
  .object({
    bank: optStr,
    bankName: optStr, // nama lain di data demo v1
    accountNumber: str,
    accountName: optStr,
    accountHolder: optStr,
    logo: optStr,
  })
  .transform((g) => ({
    bank: g.bank ?? g.bankName ?? "",
    accountNumber: g.accountNumber,
    accountName: g.accountName ?? g.accountHolder ?? "",
    logo: g.logo,
  }))
  .refine((g) => g.accountNumber !== "");

/** Array yang membuang item rusak satu per satu, bukan seluruh array. */
function list<T extends z.ZodType>(item: T) {
  return z
    .array(z.unknown())
    .catch([])
    .transform((items) =>
      items.flatMap((i) => {
        const parsed = item.safeParse(i);
        return parsed.success ? [parsed.data as z.output<T>] : [];
      }),
    );
}


export const invitationContentSchema = z
  .object({
    couple: z
      .object({ groom: person, bride: person })
      .catch({ groom: EMPTY_PERSON, bride: EMPTY_PERSON }),
    events: list(event),
    stories: list(story),
    // v1 menyimpan galeri sebagai array URL; bentuk { url } juga diterima.
    gallery: list(
      z.union([z.string().min(1), z.object({ url: z.string().min(1) }).transform((g) => g.url)]),
    ),
    gifts: list(gift),
    music: optStr,
    youtubeUrl: optStr,
    quotes: optStr,
    quotesSource: optStr,
    coverImage: optStr,
    ogImage: optStr,
    weddingDate: optStr,
    countdownDate: optStr,
  })
  .catch({
    couple: { groom: EMPTY_PERSON, bride: EMPTY_PERSON },
    events: [],
    stories: [],
    gallery: [],
    gifts: [],
    music: undefined,
    youtubeUrl: undefined,
    quotes: undefined,
    quotesSource: undefined,
    coverImage: undefined,
    ogImage: undefined,
    weddingDate: undefined,
    countdownDate: undefined,
  });

export type InvitationContent = z.output<typeof invitationContentSchema>;
export type InvitationPerson = InvitationContent["couple"]["groom"];
export type InvitationEvent = InvitationContent["events"][number];

export function parseContent(raw: unknown): InvitationContent {
  return invitationContentSchema.parse(raw ?? {});
}
