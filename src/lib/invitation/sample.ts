import type { PublicInvitation } from "./public";

export type SampleInput = { groom: string; bride: string; date: string | null };

const clean = (v: unknown) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, 40) : "");

/** Nama dan tanggal dari alamat /coba (atau /daftar), dibersihkan. */
export function parseSampleInput(sp: Record<string, string | string[] | undefined>): SampleInput {
  const date = typeof sp.tgl === "string" && /^20\d{2}-\d{2}-\d{2}$/.test(sp.tgl) ? sp.tgl : null;
  return {
    groom: clean(sp.pria),
    bride: clean(sp.wanita),
    date: date && !Number.isNaN(Date.parse(date)) ? date : null,
  };
}

/** Ganti nama lama di semua teks. Alamat file dan link tidak disentuh. */
function swapNames<T>(value: T, swaps: [RegExp, string][]): T {
  if (typeof value === "string") {
    if (/^(\/|https?:)/.test(value)) return value;
    return swaps.reduce<string>((text, [re, to]) => text.replace(re, () => to), value) as T;
  }
  if (Array.isArray(value)) return value.map((v) => swapNames(v, swaps)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, swapNames(v, swaps)])) as T;
  }
  return value;
}

/** Undangan demo dengan nama dan tanggal calon klien. Tidak ada yang disimpan. */
export function personalizeDemo(demo: PublicInvitation, input: SampleInput): PublicInvitation {
  const old = demo.content.couple;
  const groom = input.groom || old.groom.name;
  const bride = input.bride || old.bride.name;
  const word = (s: string) =>
    new RegExp(`(?<![\\p{L}])${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}])`, "gu");
  const swaps: [RegExp, string][] = [];
  for (const [person, name] of [[old.groom, groom], [old.bride, bride]] as const) {
    for (const s of [person.fullname, person.name]) if (s) swaps.push([word(s), name]);
  }
  const content = swapNames(demo.content, swaps);
  const person = (p: typeof old.groom, name: string, prefix: string) => ({
    ...p,
    name,
    fullname: name,
    parentPrefix: prefix,
    father: "Nama Ayah",
    mother: "Nama Ibu",
    social: undefined,
  });

  return {
    ...demo,
    // Bukan slug asli: ucapan yang dikirim dari contoh tidak masuk ke demo.
    slug: SAMPLE_SLUG,
    content: {
      ...content,
      couple: {
        groom: person(old.groom, groom, "Putra dari"),
        bride: person(old.bride, bride, "Putri dari"),
      },
      events: input.date ? content.events.map((e) => ({ ...e, date: input.date! })) : content.events,
      gifts: content.gifts.map((g, i) => ({ ...g, accountName: i % 2 ? bride : groom })),
      weddingDate: input.date ?? content.weddingDate,
      countdownDate: input.date ? undefined : content.countdownDate,
    },
    templateOptions: swapNames(demo.templateOptions, swaps),
  };
}

export const SAMPLE_SLUG = "coba";
