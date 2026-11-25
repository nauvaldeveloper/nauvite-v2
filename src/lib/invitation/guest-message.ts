/** Pesan WA untuk tamu. Dipakai di server dan browser. */

export type MessageData = { name: string; couple: string; date: string | null; link: string };

export const MESSAGE_PRESETS: { id: string; label: string; text: string }[] = [
  {
    id: "formal",
    label: "Formal",
    text: `Kepada Yth.
{nama}

Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami, {mempelai}.

Info lengkap ada di link berikut:
{link}

Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Terima kasih.`,
  },
  {
    id: "islami",
    label: "Islami",
    text: `Assalamu'alaikum warahmatullahi wabarakatuh

Kepada Yth.
{nama}

Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami, {mempelai}, pada {tanggal}.

Info lengkap ada di link berikut:
{link}

Kehadiran dan doa restu Bapak/Ibu/Saudara/i sangat berarti bagi kami.

Wassalamu'alaikum warahmatullahi wabarakatuh`,
  },
  {
    id: "santai",
    label: "Santai",
    text: `Halo {nama}!

Kami mau nikah nih, tanggal {tanggal}. Kami senang sekali kalau kamu bisa datang.

Detail acaranya ada di sini:
{link}

Jangan lupa isi konfirmasi hadirnya ya. Sampai ketemu!

{mempelai}`,
  },
];

export const DEFAULT_MESSAGE = MESSAGE_PRESETS[0].text;

export function guestLink(site: string, slug: string, name: string) {
  return `${site}/${slug}${name ? `?to=${encodeURIComponent(name).replace(/%20/g, "+")}` : ""}`;
}

export function fillMessage(template: string, d: MessageData) {
  const values: Record<string, string> = {
    nama: d.name,
    mempelai: d.couple,
    tanggal: d.date ?? "hari bahagia kami",
    link: d.link,
  };
  const text = template.replace(/\{(nama|mempelai|tanggal|link)\}/gi, (_, k: string) => values[k.toLowerCase()]);
  // Link undangan selalu ikut walau klien menghapusnya dari pesan.
  return /\{link\}/i.test(template) ? text : `${text}\n\n${d.link}`;
}

export const MAX_GUESTS = 3000;

/** Satu nama per baris, boleh diikuti nomor WA: "Pak Rudi, 0812 3456 7890". */
export function parseGuestLines(raw: string): { name: string; phone: string | null }[] {
  const seen = new Set<string>();
  const result: { name: string; phone: string | null }[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const m = /(?:\+?62|0)[\s.-]*8(?:[\s.()-]*\d){7,12}\s*$/.exec(line);
    const digits = m?.[0].replace(/\D/g, "").replace(/^0/, "62") ?? null;
    const name = (m ? line.slice(0, m.index) : line)
      .replace(/\s+/g, " ")
      .replace(/^\s*(?:\d+[.)]|-)\s+/, "")
      .replace(/[\s,;:|-]+$/, "")
      .trim()
      .slice(0, 60);
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    result.push({ name, phone: digits });
  }
  return result;
}
