import { SUPABASE_URL } from "@/lib/supabase/env";
import type { InvitationContent, InvitationEvent } from "./content";

const TZ = "Asia/Jakarta";

/**
 * Alamat file untuk ditampilkan. Menerima:
 * - URL lengkap (data lama v1, mis. https://...supabase.co/...)
 * - path file bawaan di public/ (diawali "/")
 * - path storage v2 ("<id undangan>/foto.webp")
 */
export function mediaUrl(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src) || src.startsWith("/")) return src;
  return `${SUPABASE_URL}/storage/v1/object/public/invitation-media/${src
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

/** "2027-02-14" + "08:00" -> Date di zona WIB. */
export function toDate(date: string | undefined, time?: string): Date | null {
  if (!date) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!m) return null;
  const t = /^(\d{1,2})[:.](\d{2})/.exec(time ?? "") ?? ["", "00", "00"];
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T${t[1].padStart(2, "0")}:${t[2]}:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "Sabtu, 14 Februari 2027" */
export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(date);
}

/** "14.02.2027" */
export function formatShortDate(date: Date): string {
  const p = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TZ,
  }).formatToParts(date);
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")}`;
}

/** "08.00 - 10.00 WIB" atau "08.00 WIB - Selesai" */
export function formatTimeRange(event: InvitationEvent): string | null {
  const clean = (t?: string) => t?.replace(":", ".").trim();
  const start = clean(event.startTime);
  if (!start) return null;
  const end = clean(event.endTime);
  if (!end) return `${start} WIB`;
  if (/^\d/.test(end)) return `${start} - ${end} WIB`;
  return `${start} WIB - ${end}`;
}

/** Waktu acara utama: countdownDate, atau acara pertama, atau weddingDate. */
export function mainEventDate(content: InvitationContent): Date | null {
  if (content.countdownDate) {
    const [d, t] = content.countdownDate.split(/[T ]/);
    const parsed = toDate(d, t);
    if (parsed) return parsed;
  }
  const first = content.events[0];
  if (first) {
    const parsed = toDate(first.date, first.startTime);
    if (parsed) return parsed;
  }
  return toDate(content.weddingDate);
}

/** Link "Simpan ke Google Calendar" untuk satu acara. */
export function googleCalendarUrl(event: InvitationEvent, coupleTitle: string): string | null {
  const start = toDate(event.date, event.startTime);
  if (!start) return null;
  const endCandidate = /^\d/.test(event.endTime ?? "") ? toDate(event.date, event.endTime) : null;
  const end = endCandidate && endCandidate > start ? endCandidate : new Date(start.getTime() + 2 * 3600_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} ${coupleTitle}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: [event.location, event.address].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Nama tamu dari ?to=, dibersihkan. */
export function cleanGuestName(raw: string | string[] | undefined): string | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const name = v?.replace(/\s+/g, " ").trim().slice(0, 60);
  return name || null;
}

export function coupleTitle(content: InvitationContent): string {
  const g = content.couple.groom.name || "Mempelai Pria";
  const b = content.couple.bride.name || "Mempelai Wanita";
  return `${g} & ${b}`;
}

/** Tanggal acara untuk ditampilkan. Data lama v1 yang berupa teks ditampilkan apa adanya. */
export function eventDateText(event: InvitationEvent): string | null {
  const d = toDate(event.date, event.startTime);
  if (d) return formatLongDate(d);
  return event.date || null;
}

/** Baris orang tua: { prefix: "Putra kedua dari", names: "Bapak X dan Ibu Y" } */
export function parentsText(
  person: InvitationContent["couple"]["groom"],
  role: "Putra" | "Putri",
): { prefix: string; names: string } | null {
  const names = [person.father, person.mother].filter(Boolean).join(" dan ");
  if (!names) {
    // Kalimat lengkap yang tidak bisa dipecah (data lama): tampilkan apa adanya.
    const p = person.parentPrefix;
    return p && !/daris*$/i.test(p) ? { prefix: p, names: "" } : null;
  }
  return { prefix: person.parentPrefix || `${role} dari`, names };
}

/** Id video YouTube dari berbagai bentuk link (youtu.be, watch?v=, shorts, embed). */
export function youtubeId(url: string | undefined): string | null {
  if (!url) return null;
  const m =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/.exec(url);
  return m ? m[1] : null;
}

const BANK_LOGOS: [RegExp, string][] = [
  [/\bbca\b|central asia/i, "bca"],
  [/\bbsi\b|syariah indonesia/i, "bsi"],
  [/mandiri/i, "mandiri"],
  [/\bbni\b|negara indonesia/i, "bni"],
  [/\bbri\b|rakyat indonesia/i, "bri"],
  [/\bdana\b/i, "dana"], // \b supaya "Danamon" tidak ikut
  [/\bovo\b/i, "ovo"],
  [/go-?pay/i, "gopay"],
];

/** Logo bank/dompet digital dari nama yang diketik klien. null kalau tidak dikenal. */
export function bankLogo(bank: string): string | null {
  const hit = BANK_LOGOS.find(([re]) => re.test(bank));
  return hit ? `/banks/${hit[1]}.svg` : null;
}

/** "20 Maret 2027" */
export function formatDayDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(date);
}
