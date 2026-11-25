"use client";

import { useState, useTransition } from "react";
import { IconSearch, IconWhatsapp } from "@/components/invitation/icons";
import { Button, Card, CardTitle, cx, Notice, Textarea } from "@/components/ui";
import { addGuests, removeGuest, saveGuestMessage, setGuestSent } from "@/lib/invitation/guest-actions";
import { DEFAULT_MESSAGE, fillMessage, guestLink, MESSAGE_PRESETS } from "@/lib/invitation/guest-message";
import type { GuestRow } from "@/lib/invitation/guests";

const FILTERS = [
  { value: "semua", label: "Semua" },
  { value: "belum", label: "Belum dikirim" },
  { value: "sudah", label: "Sudah dikirim" },
] as const;

const PAGE = 100;

export function GuestBoard({
  invitationId,
  slug,
  active,
  couple,
  date,
  initialGuests,
  initialMessage,
}: {
  invitationId: string;
  slug: string;
  active: boolean;
  couple: string;
  date: string | null;
  initialGuests: GuestRow[];
  initialMessage: string | null;
}) {
  const [guests, setGuests] = useState(initialGuests);
  const [raw, setRaw] = useState("");
  const [message, setMessage] = useState(initialMessage ?? DEFAULT_MESSAGE);
  const [saved, setSaved] = useState(initialMessage ?? DEFAULT_MESSAGE);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("semua");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [note, setNote] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [adding, startAdd] = useTransition();
  const [saving, startSave] = useTransition();

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const textFor = (name: string) => fillMessage(message, { name, couple, date, link: guestLink(site, slug, name) });
  const sent = guests.filter((g) => g.sentAt).length;
  const s = q.trim().toLowerCase();
  const shown = guests.filter(
    (g) =>
      (filter === "semua" || (filter === "sudah") === Boolean(g.sentAt)) &&
      (!s || g.name.toLowerCase().includes(s) || (g.phone ?? "").includes(s)),
  );
  const fail = (text: string) => setNote({ tone: "error", text });

  function add() {
    startAdd(async () => {
      const res = await addGuests(invitationId, raw);
      if (!res.ok) return fail(res.message);
      setGuests((list) => [...list, ...res.added]);
      setRaw("");
      setNote({
        tone: "success",
        text: `${res.added.length} nama ditambahkan${res.skipped ? `, ${res.skipped} dilewati karena sudah ada` : ""}.`,
      });
    });
  }

  async function mark(g: GuestRow, value: boolean) {
    const set = (sentAt: string | null) => setGuests((list) => list.map((x) => (x.id === g.id ? { ...x, sentAt } : x)));
    set(value ? new Date().toISOString() : null);
    const res = await setGuestSent(g.id, value);
    if (!res.ok) {
      set(g.sentAt);
      fail(res.message);
    }
  }

  async function remove(g: GuestRow) {
    if (!confirm(`Hapus "${g.name}" dari daftar tamu?`)) return;
    const res = await removeGuest(g.id);
    if (res.ok) setGuests((list) => list.filter((x) => x.id !== g.id));
    else fail(res.message);
  }

  async function copy(g: GuestRow) {
    await navigator.clipboard.writeText(textFor(g.name));
    setCopied(g.id);
    setTimeout(() => setCopied(null), 2000);
  }

  function save() {
    startSave(async () => {
      const res = await saveGuestMessage(invitationId, message);
      if (!res.ok) return fail(res.message);
      const text = message.trim() || DEFAULT_MESSAGE;
      setMessage(text);
      setSaved(text);
      setNote({ tone: "success", text: "Pesan tersimpan." });
    });
  }

  return (
    <div className="grid gap-6 pb-24 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="grid gap-4 lg:order-2">
        <Card>
          <CardTitle hint="Satu nama per baris. Nomor WA boleh ditambahkan di belakangnya.">Tambah tamu</CardTitle>
          <Textarea
            aria-label="Nama tamu"
            rows={6}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={"Bapak Rudi\nIbu Sari dan keluarga\nAndi, 0812 3456 7890"}
          />
          <Button type="button" onClick={add} disabled={adding || !raw.trim()} className="mt-3 w-full">
            {adding ? "Menyimpan..." : "Simpan ke daftar"}
          </Button>
        </Card>

        <details className="rounded-2xl border border-line bg-card p-5 sm:p-6">
          <summary className="cursor-pointer font-display text-xl font-medium tracking-tight">Atur pesan WhatsApp</summary>
          <p className="mb-4 mt-1 text-[13px] text-muted">Pilih gaya bahasanya, lalu ubah sesuka kalian.</p>
          <div className="mb-3 flex gap-2">
            {MESSAGE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setMessage(p.text)}
                className={cx(
                  "rounded-full border px-4 py-2 text-[13px] font-semibold",
                  message === p.text ? "border-ink bg-ink text-[#f6f1e7]" : "border-line hover:border-ink/30",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Textarea aria-label="Isi pesan" rows={11} maxLength={1500} value={message} onChange={(e) => setMessage(e.target.value)} />
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            {"{nama}, {mempelai}, {tanggal}, dan {link} terisi otomatis untuk setiap tamu."}
          </p>
          <Button type="button" variant="secondary" onClick={save} disabled={saving || message === saved} className="mt-3 w-full">
            {saving ? "Menyimpan..." : message === saved ? "Pesan tersimpan" : "Simpan pesan"}
          </Button>
        </details>
      </div>

      <div className="grid gap-4">
        {note ? <Notice tone={note.tone}>{note.text}</Notice> : null}
        {active ? null : (
          <Notice>Undangan belum aktif, jadi belum bisa dikirim. Nama tamu sudah bisa disiapkan dari sekarang.</Notice>
        )}

        <div className="rounded-2xl bg-ink p-5 text-[#f3eee5]">
          <p className="font-display text-3xl font-medium tabular-nums">
            {sent} dari {guests.length} <span className="text-lg text-[#c9d2cc]">undangan terkirim</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${guests.length ? (sent / guests.length) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-0 flex-1 basis-56">
            <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama"
              aria-label="Cari nama"
              className="w-full rounded-full border border-line bg-card py-2.5 pl-10 pr-4 text-[15px] focus:border-brass focus:outline-none focus:ring-4 focus:ring-brass/15"
            />
          </div>
          <div className="flex gap-1 rounded-full border border-line bg-card p-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cx(
                  "rounded-full px-3 py-1.5 text-[13px] font-semibold",
                  filter === f.value ? "bg-ink text-[#f6f1e7]" : "text-muted hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/20 px-6 py-14 text-center">
            <p className="font-display text-2xl">{guests.length ? "Tidak ada yang cocok" : "Daftar tamu masih kosong"}</p>
            <p className="mt-2 text-muted">
              {guests.length ? "Coba kata lain atau ganti saringannya." : "Tempel nama-nama tamu di kotak Tambah tamu."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
            {shown.slice(0, limit).map((g) => (
              <li key={g.id} className="grid gap-3 px-4 py-3.5 sm:flex sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold">{g.name}</p>
                  <p className="text-[13px] text-muted">
                    {g.phone ? `+${g.phone}` : "Tanpa nomor, pilih kontaknya di WhatsApp"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <label className="mr-1 inline-flex min-h-10 cursor-pointer items-center gap-2 text-[13px] font-semibold">
                    <input type="checkbox" checked={Boolean(g.sentAt)} onChange={(e) => mark(g, e.target.checked)} className="size-4 accent-ink" />
                    Terkirim
                  </label>
                  <button type="button" onClick={() => copy(g)} className="min-h-10 rounded-full px-3 text-[13px] font-semibold hover:bg-ink/5">
                    {copied === g.id ? "Tersalin" : "Salin"}
                  </button>
                  <button type="button" onClick={() => remove(g)} className="min-h-10 rounded-full px-3 text-[13px] font-semibold text-red-700 hover:bg-red-50">
                    Hapus
                  </button>
                  {active ? (
                    <a
                      href={`https://wa.me/${g.phone ?? ""}?text=${encodeURIComponent(textFor(g.name))}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => void mark(g, true)}
                      className={cx(
                        "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold",
                        g.sentAt ? "border border-line" : "bg-ink text-[#f6f1e7] hover:bg-ink-2",
                      )}
                    >
                      <IconWhatsapp /> {g.sentAt ? "Kirim lagi" : "Kirim"}
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
        {shown.length > limit ? (
          <Button type="button" variant="secondary" onClick={() => setLimit((n) => n + PAGE)}>
            Tampilkan {Math.min(PAGE, shown.length - limit)} nama lagi
          </Button>
        ) : null}
      </div>
    </div>
  );
}
