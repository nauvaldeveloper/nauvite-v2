"use client";

import { useState } from "react";
import type { CatalogItem } from "@/lib/demos";
import { Phone } from "./phone";
import s from "./landing.module.css";

/** Katalog tema dengan filter. Sentuh/arahkan kursor ke kartu untuk melihat isi undangan. */
export function Catalog({
  items,
  prices,
  whatsapp,
}: {
  items: CatalogItem[];
  prices: { basic: string; premium: string };
  whatsapp: string;
}) {
  const ready = items.filter((i) => i.demo);
  const soon = items.filter((i) => !i.demo);
  const filters = [
    { value: "semua", label: "Semua" },
    { value: "premium", label: "Premium" },
    ...[...new Set(ready.map((i) => i.category))].map((c) => ({
      value: c,
      label: ready.find((i) => i.category === c)!.categoryLabel,
    })),
  ];
  const [filter, setFilter] = useState("semua");
  const shown = ready.filter((i) => filter === "semua" || i.category === filter || (filter === "premium" && i.tier === "premium"));

  return (
    <>
      <div className="-mx-5 mb-10 flex justify-start gap-2 overflow-x-auto px-5 sm:justify-center">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
              filter === f.value ? "border-ink bg-ink text-[#f6f1e7]" : "border-line bg-card text-ink/75 hover:border-ink/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Baris terakhir yang tidak penuh tetap di tengah */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-6">
        {shown.map((t) => {
          const price = t.tier === "premium" ? prices.premium : prices.basic;
          const order = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo, saya mau pesan undangan tema ${t.name}.`)}`;
          return (
            <article
              key={t.id}
              className={`${s.themeCard} group grid w-[calc((100%-16px)/2)] content-start gap-3 sm:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)]`}
            >
              <div className="relative">
                {t.demo ? (
                  <a href={`/${t.demo.slug}?to=Tamu+Undangan`} target="_blank" rel="noreferrer" aria-label={`Lihat demo ${t.name}`}>
                    <Phone className="transition-transform duration-500 group-hover:-translate-y-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.demo.inside} alt="" loading="lazy" className={s.themeShot} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.demo.cover}
                        alt={`Tema ${t.name}`}
                        loading="lazy"
                        className={`${s.themeShot} ${s.themeShotCover}`}
                      />
                    </Phone>
                  </a>
                ) : (
                  <Phone>
                    <div
                      className="absolute inset-0 grid place-items-center p-4 text-center"
                      style={{ background: t.swatch.background, color: t.swatch.text }}
                    >
                      <div>
                        <p className="font-display text-2xl italic">{t.name}</p>
                        <p className="mt-2 text-[12px] font-semibold opacity-75">Segera hadir</p>
                      </div>
                    </div>
                  </Phone>
                )}
                <div className="absolute -left-1 top-9 flex flex-col items-start gap-1">
                  {t.tier === "premium" ? (
                    <span className="rounded-full bg-brass px-2.5 py-1 text-[11px] font-bold text-white shadow">Premium</span>
                  ) : null}
                  {t.isNew ? (
                    <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-bold text-ink shadow">Baru</span>
                  ) : null}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-muted">
                  {t.categoryLabel}
                  {t.region ? `, ${t.region}` : ""}
                </p>
                <h3 className="font-display text-xl font-medium leading-tight sm:text-2xl">{t.name}</h3>
                <p className="mt-1 text-[14px] font-semibold text-brass">{t.demo ? price : "Segera hadir"}</p>
              </div>
              {t.demo ? (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/${t.demo.slug}?to=Tamu+Undangan`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-line bg-card px-3.5 py-2 text-[13px] font-semibold hover:border-ink/30"
                  >
                    Lihat demo
                  </a>
                  <a
                    href={order}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-ink px-3.5 py-2 text-[13px] font-semibold text-[#f6f1e7] hover:bg-ink-2"
                  >
                    Pesan
                  </a>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {soon.length > 0 ? (
        <div className="mt-14 rounded-3xl border border-dashed border-ink/20 px-5 py-6 text-center sm:px-8">
          <p className="text-[14px] font-semibold text-muted">Segera hadir</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
            {soon.map((t) => (
              <li
                key={t.id}
                className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card py-1.5 pl-1.5 pr-4 text-[14px] font-semibold"
              >
                <span
                  className="size-7 rounded-full ring-2 ring-white"
                  style={{ background: `linear-gradient(135deg, ${t.swatch.background} 55%, ${t.swatch.accent} 55%)` }}
                  aria-hidden="true"
                />
                {t.name}
                {t.region ? <span className="font-normal text-muted">{t.region}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
