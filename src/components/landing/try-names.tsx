"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { CatalogItem } from "@/lib/demos";
import { Phone } from "./phone";

/** Dikirim katalog saat tema dipilih untuk dicoba: { id, color }. */
export const TRY_THEME_EVENT = "nauvite:coba-tema";

const field =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] font-normal text-ink placeholder:text-ink/35 focus:border-brass focus:outline-none focus:ring-4 focus:ring-brass/15";

/** Ketik dua nama dan tanggal, lalu demo tema tampil dengan nama itu. */
export function TryNames({ items, whatsapp, siteUrl }: { items: CatalogItem[]; whatsapp: string; siteUrl: string }) {
  const [themeId, setThemeId] = useState(items[0].id);
  const [color, setColor] = useState(0);
  const [groom, setGroom] = useState("");
  const [bride, setBride] = useState("");
  const [date, setDate] = useState("");
  const [shown, setShown] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);

  const item = items.find((t) => t.id === themeId) ?? items[0];
  const demo = item.demos[color] ?? item.demos[0];

  const query = (g: string, b: string, d: string) => ({ pria: g.trim(), wanita: b.trim(), ...(d ? { tgl: d } : {}) });
  const names = query(groom, bride, date);
  const pathFor = (slug: string, n = names) => `/coba/${slug}?${new URLSearchParams(n)}`;
  const path = pathFor(demo.slug);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Dibaca dari kolomnya langsung: yang diketik sebelum halaman selesai dimuat belum masuk state.
    const form = new FormData(e.currentTarget);
    const [g, b, d] = ["pria", "wanita", "tgl"].map((k) => String(form.get(k) ?? ""));
    if (!g.trim() || !b.trim()) return;
    setGroom(g);
    setBride(b);
    setDate(d);
    setShown(pathFor(demo.slug, query(g, b, d)));
    if (window.innerWidth < 1024) {
      requestAnimationFrame(() =>
        document.getElementById("hasil-coba")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }

  function pick(id: string, c = 0) {
    setThemeId(id);
    setColor(c);
    const next = items.find((t) => t.id === id)!.demos[c];
    if (shown) setShown(pathFor(next.slug));
  }

  useEffect(() => {
    const on = (e: Event) => {
      const { id, color: c } = (e as CustomEvent<{ id: string; color: number }>).detail;
      setThemeId(id);
      setColor(c);
      setShown(null);
    };
    window.addEventListener(TRY_THEME_EVENT, on);
    return () => window.removeEventListener(TRY_THEME_EVENT, on);
  }, []);

  const share = `https://wa.me/?text=${encodeURIComponent(`Coba lihat, ini contoh undangan kita: ${siteUrl}${path}`)}`;
  const trial = `/daftar?${new URLSearchParams({ tema: demo.slug, ...names })}`;
  const order = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Halo, saya mau pesan undangan tema ${item.name}${demo.label ? ` warna ${demo.label}` : ""} untuk ${names.pria} & ${names.wanita}.`,
  )}`;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* action: kalau ditekan sebelum skrip siap, contohnya terbuka satu layar penuh */}
      <form action={`/coba/${demo.slug}`} method="get" onSubmit={submit} className="grid gap-4">
        <div className="mb-4">
          <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">Lihat undangan dengan nama kalian</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Ketik nama dan tanggalnya, undangan contohnya langsung jadi. Link-nya bisa dikirim ke pasangan.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[14px] font-semibold">
            Mempelai pria
            <input name="pria" className={field} value={groom} onChange={(e) => setGroom(e.target.value)} maxLength={40} required placeholder="Nama panggilan" />
          </label>
          <label className="grid gap-1.5 text-[14px] font-semibold">
            Mempelai wanita
            <input name="wanita" className={field} value={bride} onChange={(e) => setBride(e.target.value)} maxLength={40} required placeholder="Nama panggilan" />
          </label>
          <label className="grid gap-1.5 text-[14px] font-semibold">
            Tanggal acara
            <input name="tgl" className={field} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="grid gap-1.5 text-[14px] font-semibold">
            Tema
            <select className={field} value={themeId} onChange={(e) => pick(e.target.value)}>
              {[false, true].map((photo) => (
                <optgroup key={String(photo)} label={photo ? "Dengan foto" : "Tanpa foto"}>
                  {items
                    .filter((t) => t.withPhoto === photo)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>
        {item.demos.length > 1 ? (
          <div className="-ml-2 flex items-center gap-1" role="group" aria-label="Pilihan warna">
            {item.demos.map((d, i) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => pick(item.id, i)}
                aria-label={d.label}
                aria-pressed={i === color}
                className="grid size-11 place-items-center"
              >
                <span
                  className={`size-6 rounded-full ring-offset-2 ring-offset-paper ${i === color ? "ring-2 ring-ink" : "ring-1 ring-ink/15"}`}
                  style={{ background: `linear-gradient(135deg, ${d.color} 50%, ${d.accent} 50%)` }}
                />
              </button>
            ))}
            <span className="ml-1 text-[14px] text-muted">{demo.label}</span>
          </div>
        ) : null}
        <button type="submit" className="rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-[#f6f1e7] hover:bg-ink-2">
          Lihat undangannya
        </button>
        <p className="text-[14px] text-muted">Tidak perlu daftar. Alamat dan ceritanya masih contoh.</p>
      </form>

      <div id="hasil-coba" className="grid scroll-mt-20 justify-items-center gap-5">
        <div className="w-[272px]">
          <Phone>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={demo.cover} alt={`Sampul tema ${item.name}`} />
            {shown ? (
              <>
                {loaded === shown ? null : (
                  <p className="absolute inset-x-0 bottom-0 bg-ink/90 py-4 text-center text-[14px] font-semibold text-[#f6f1e7]" role="status">
                    Menyiapkan undangan...
                  </p>
                )}
                <iframe
                  key={shown}
                  src={`${shown}&bingkai=1`}
                  onLoad={() => setLoaded(shown)}
                  title="Contoh undangan dengan nama kalian"
                  className="absolute left-0 top-0 origin-top-left border-0"
                  style={{ width: 390, height: 844, transform: "scale(0.6513)", visibility: loaded === shown ? "visible" : "hidden" }}
                />
              </>
            ) : null}
          </Phone>
        </div>
        {shown ? (
          <div className="grid w-full max-w-sm gap-2.5 text-center text-[15px] font-semibold">
            <a href={trial} className="rounded-full bg-ink px-5 py-3 text-[#f6f1e7] hover:bg-ink-2">
              Isi sendiri, gratis 1 hari
            </a>
            <div className="grid grid-cols-2 gap-2.5">
              <a href={share} target="_blank" rel="noreferrer" className="rounded-full border border-ink/25 bg-card px-4 py-3 hover:border-ink/50">
                Kirim ke pasangan
              </a>
              <a href={order} target="_blank" rel="noreferrer" className="rounded-full border border-ink/25 bg-card px-4 py-3 hover:border-ink/50">
                Pesan lewat WA
              </a>
            </div>
            <a href={path} target="_blank" rel="noreferrer" className="py-2 text-[14px] text-brass hover:underline">
              Buka layar penuh
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
