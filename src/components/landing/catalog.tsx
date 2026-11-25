"use client";

import { useEffect, useRef, useState } from "react";
import type { CatalogItem } from "@/lib/demos";

/** Jumlah kartu di HP sebelum tombol "Lihat semua". */
const MOBILE_FIRST = 6;

/** Katalog tema: kartu ringkas berfilter, rincian dan tombol ada di lembar yang muncul saat kartu diketuk. */
export function Catalog({
  items,
  prices,
  hematNormal,
  whatsapp,
}: {
  items: CatalogItem[];
  prices: Record<CatalogItem["tier"], string>;
  /** Harga normal paket Hemat saat promo, tampil dicoret. */
  hematNormal: string | null;
  whatsapp: string;
}) {
  const ready = items.filter((i) => i.demos.length > 0);
  const soon = items.filter((i) => i.demos.length === 0);
  const filters = [
    { value: "semua", label: "Semua" },
    { value: "premium", label: "Premium" },
    ...(ready.some((i) => !i.withPhoto) ? [{ value: "tanpa-foto", label: "Tanpa foto" }] : []),
    ...[...new Set(ready.map((i) => i.category))].map((c) => ({
      value: c,
      label: ready.find((i) => i.category === c)!.categoryLabel,
    })),
  ];
  const [filter, setFilter] = useState("semua");
  const [all, setAll] = useState(false);
  /** Warna terpilih per tema (nomor urut demo). */
  const [variant, setVariant] = useState<Record<string, number>>({});
  const [openId, setOpenId] = useState<string | null>(null);

  const shown = ready.filter(
    (i) =>
      filter === "semua" ||
      i.category === filter ||
      (filter === "premium" && i.tier === "premium") ||
      (filter === "tanpa-foto" && !i.withPhoto),
  );
  const opened = ready.find((i) => i.id === openId) ?? null;
  const priceOf = (t: CatalogItem) => prices[t.tier];
  const normalOf = (t: CatalogItem) => (t.tier === "hemat" ? hematNormal : null);
  const pick = (id: string, i: number) => setVariant((v) => ({ ...v, [id]: i }));

  return (
    <>
      <div className="-mx-5 mb-7 flex justify-start gap-2 overflow-x-auto px-5 pb-1 sm:justify-center">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => {
              setFilter(f.value);
              setAll(false);
            }}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
              filter === f.value ? "border-ink bg-ink text-[#f6f1e7]" : "border-line bg-card text-ink/75 hover:border-ink/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4 lg:grid-cols-6">
        {shown.map((t, i) => {
          const at = variant[t.id] ?? 0;
          return (
            <article key={t.id} className={i >= MOBILE_FIRST && !all ? "hidden sm:block" : undefined}>
              <button type="button" onClick={() => setOpenId(t.id)} className="group block w-full text-left">
                <span className="relative block overflow-hidden rounded-2xl border border-line bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.demos[at].card}
                    alt=""
                    loading="lazy"
                    className="block aspect-[5/8] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ objectPosition: t.cardPosition }}
                  />
                  {t.tier === "premium" ? (
                    <span className="absolute left-2 top-2 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-[#f3d9a0]">
                      Premium
                    </span>
                  ) : null}
                  {t.withPhoto ? null : (
                    <span className="absolute left-2 top-2 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-ink">
                      Tanpa foto
                    </span>
                  )}
                </span>
                <span className="mt-2.5 block font-display text-[17px] font-medium leading-tight">{t.name}</span>
                <span className="mt-1 flex flex-wrap justify-between gap-x-2 text-[13px]">
                  <span className="text-muted">{t.region ?? t.categoryLabel}</span>
                  <span className="font-semibold text-brass">
                    {normalOf(t) ? <s className="mr-1.5 font-normal text-muted">{normalOf(t)}</s> : null}
                    {priceOf(t)}
                  </span>
                </span>
              </button>
              {t.demos.length > 1 ? (
                <Colors item={t} value={at} onChange={(n) => pick(t.id, n)} className="mt-1 -ml-2" />
              ) : null}
            </article>
          );
        })}
      </div>

      {!all && shown.length > MOBILE_FIRST ? (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="mx-auto mt-8 block rounded-full border border-ink/25 px-6 py-3 text-[15px] font-semibold sm:hidden"
        >
          Lihat semua tema ({shown.length})
        </button>
      ) : null}

      {soon.length > 0 ? (
        <p className="mt-10 text-center text-[14px] text-muted">
          Segera hadir: <span className="font-semibold text-ink">{soon.map((t) => t.name).join(", ")}</span>
        </p>
      ) : null}

      {opened ? (
        <Detail
          key={opened.id}
          item={opened}
          at={variant[opened.id] ?? 0}
          onPick={(n) => pick(opened.id, n)}
          price={priceOf(opened)}
          normal={normalOf(opened)}
          whatsapp={whatsapp}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </>
  );
}

/** Bulatan pilihan warna. */
function Colors({
  item,
  value,
  onChange,
  className = "",
}: {
  item: CatalogItem;
  value: number;
  onChange: (n: number) => void;
  className?: string;
}) {
  return (
    <div className={`flex ${className}`} role="group" aria-label={`Warna ${item.name}`}>
      {item.demos.map((d, i) => (
        <button
          key={d.slug}
          type="button"
          onClick={() => onChange(i)}
          aria-label={d.label}
          aria-pressed={i === value}
          title={d.label}
          className="grid size-9 place-items-center"
        >
          <span
            className={`size-5 rounded-full ring-offset-2 ring-offset-paper ${i === value ? "ring-2 ring-ink" : "ring-1 ring-ink/15"}`}
            style={{ background: d.color }}
          />
        </button>
      ))}
    </div>
  );
}

function Detail({
  item,
  at,
  onPick,
  price,
  normal,
  whatsapp,
  onClose,
}: {
  item: CatalogItem;
  at: number;
  onPick: (n: number) => void;
  price: string;
  normal: string | null;
  whatsapp: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const demo = item.demos[at];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.open) el.showModal();
    el.focus(); // bukan ke tombol warna pertama
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = before;
    };
  }, []);

  const color = item.demos.length > 1 ? ` warna ${demo.label}` : "";
  const order = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo, saya mau pesan undangan tema ${item.name}${color}.`)}`;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      aria-label={item.name}
      tabIndex={-1}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-paper p-0 text-ink outline-none backdrop:bg-ink/60 sm:m-auto sm:max-w-3xl sm:rounded-3xl"
    >
      <div className="relative grid gap-5 p-5 sm:grid-cols-[1.15fr_1fr] sm:gap-8 sm:p-8">
        <div className="grid grid-cols-2 gap-3">
          {[
            { src: demo.cover, label: "Sampul" },
            { src: demo.inside, label: "Isi" },
          ].map((v) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={v.label}
              src={v.src}
              alt={`${v.label} undangan ${item.name}`}
              className="aspect-[9/17] w-full rounded-2xl border border-line object-cover"
            />
          ))}
        </div>
        <div className="flex flex-col">
          <p className="pr-10 text-[13px] font-semibold text-muted">
            {item.categoryLabel}
            {item.region ? `, ${item.region}` : ""}
            {item.tier === "basic" ? "" : `, paket ${item.tierLabel}`}
            {item.withPhoto ? "" : ", tanpa foto"}
          </p>
          <h3 className="mt-1 font-display text-[28px] font-medium leading-tight">{item.name}</h3>
          <p className="mt-1 text-[17px] font-semibold text-brass">
            {price}
            {normal ? <s className="ml-2 text-[14px] font-normal text-muted">{normal}</s> : null}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{item.description}</p>
          {item.demos.length > 1 ? (
            <div className="mt-4">
              <p className="text-[14px] font-semibold">Warna: {demo.label}</p>
              <Colors item={item} value={at} onChange={onPick} className="-ml-2" />
            </div>
          ) : null}
          <div className="sticky bottom-0 -mx-5 mt-auto flex gap-2.5 bg-paper px-5 pb-1 pt-5 sm:static sm:mx-0 sm:px-0">
            <a
              href={`/${demo.slug}?to=Tamu+Undangan`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full border border-ink/25 bg-card px-4 py-3 text-center text-[15px] font-semibold hover:border-ink/50"
            >
              Lihat demo
            </a>
            <a
              href={order}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full bg-ink px-4 py-3 text-center text-[15px] font-semibold text-[#f6f1e7] hover:bg-ink-2"
            >
              Pesan
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Tutup"
          className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-card text-xl shadow"
        >
          &times;
        </button>
      </div>
    </dialog>
  );
}
