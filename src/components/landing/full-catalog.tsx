"use client";

import { useState } from "react";
import type { CatalogItem } from "@/lib/demos";

type Tier = CatalogItem["tier"];

const TIERS: { tier: Tier; title: string; note: string }[] = [
  {
    tier: "premium",
    title: "Premium",
    note: "Pakai foto, dengan ilustrasi dan animasi berlapis. Tema adat lengkap dengan ornamen dan pembuka khas daerahnya.",
  },
  {
    tier: "basic",
    title: "Basic",
    note: "Pakai foto mempelai dan galeri. Setiap tema punya konsep dan animasi pembuka sendiri, sebagian ada pilihan warna.",
  },
  {
    tier: "hemat",
    title: "Hemat",
    note: "Tanpa foto, cocok untuk yang ingin undangan rapi dengan harga paling ringan. Fitur RSVP, ucapan, dan amplop tetap ada.",
  },
];

/** Katalog lengkap: semua tema dikelompokkan per paket, dengan sampul, isi, pilihan warna, dan tombol langsung. */
export function FullCatalog({
  items,
  prices,
  hematNormal,
  whatsapp,
}: {
  items: CatalogItem[];
  prices: Record<Tier, string>;
  hematNormal: string | null;
  whatsapp: string;
}) {
  const ready = items.filter((i) => i.demos.length > 0);
  const soon = items.filter((i) => i.demos.length === 0);
  const [filter, setFilter] = useState<"semua" | Tier>("semua");
  const [variant, setVariant] = useState<Record<string, number>>({});

  const count = (t: Tier) => ready.filter((i) => i.tier === t).length;
  const chips = [
    { value: "semua" as const, label: "Semua", n: ready.length },
    ...TIERS.filter((t) => count(t.tier) > 0).map((t) => ({ value: t.tier, label: t.title, n: count(t.tier) })),
  ];

  const groups = TIERS.filter((t) => filter === "semua" || filter === t.tier).map((t) => ({
    ...t,
    // Tema Basic terbaru ada di akhir daftar tema, jadi dibalik supaya tampil lebih dulu.
    list: t.tier === "basic" ? ready.filter((i) => i.tier === t.tier).reverse() : ready.filter((i) => i.tier === t.tier),
  }));

  return (
    <>
      <div className="sticky top-[60px] z-30 -mx-5 mb-10 border-y border-line bg-[#f3eee5]/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
          {chips.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={filter === c.value}
              onClick={() => {
                setFilter(c.value);
                window.scrollTo({ top: document.getElementById("katalog")!.offsetTop - 80, behavior: "smooth" });
              }}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                filter === c.value ? "border-ink bg-ink text-[#f6f1e7]" : "border-line bg-card text-ink/75 hover:border-ink/30"
              }`}
            >
              {c.label}
              <span className={`text-[12px] ${filter === c.value ? "text-[#f6f1e7]/70" : "text-muted"}`}>{c.n}</span>
            </button>
          ))}
        </div>
      </div>

      <div id="katalog" className="grid gap-20">
        {groups
          .filter((g) => g.list.length > 0)
          .map((g) => (
            <section key={g.title} aria-labelledby={`paket-${g.title}`}>
              <div className="mb-8 grid gap-3 border-b border-line pb-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <h2 id={`paket-${g.title}`} className="font-display text-[34px] font-medium leading-tight sm:text-[40px]">
                    {g.title}
                    <span className="ml-3 align-middle text-[15px] font-semibold text-muted">{g.list.length} tema</span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-ink/75">{g.note}</p>
                </div>
                <p className="font-display text-[26px] font-medium text-brass sm:text-right">
                  {g.tier === "hemat" && hematNormal ? <s className="mr-2 text-[16px] font-normal text-muted">{hematNormal}</s> : null}
                  {prices[g.tier]}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
                {g.list.map((t) => (
                  <ThemeCard
                    key={t.id}
                    item={t}
                    at={variant[t.id] ?? 0}
                    onPick={(n) => setVariant((v) => ({ ...v, [t.id]: n }))}
                    whatsapp={whatsapp}
                  />
                ))}
              </div>
            </section>
          ))}
      </div>

      {soon.length > 0 ? (
        <p className="mt-16 text-center text-[14px] text-muted">
          Segera hadir: <span className="font-semibold text-ink">{soon.map((t) => t.name).join(", ")}</span>
        </p>
      ) : null}
    </>
  );
}

function ThemeCard({
  item,
  at,
  onPick,
  whatsapp,
}: {
  item: CatalogItem;
  at: number;
  onPick: (n: number) => void;
  whatsapp: string;
}) {
  const demo = item.demos[at];
  const color = item.demos.length > 1 ? ` warna ${demo.label}` : "";
  const order = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo, saya mau pesan undangan tema ${item.name}${color}.`)}`;
  const demoHref = `/${demo.slug}?to=Tamu+Undangan`;

  return (
    <article className="flex flex-col">
      <a
        href={demoHref}
        target="_blank"
        rel="noreferrer"
        className="group relative block overflow-hidden rounded-2xl border border-line bg-card"
        aria-label={`Lihat demo ${item.name}${color}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={demo.card}
          alt=""
          loading="lazy"
          className="block aspect-[5/8] w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          style={{ objectPosition: item.cardPosition }}
        />
        {/* Di desktop, arahkan kursor untuk melihat tampilan lainnya. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={demo.card === demo.cover ? demo.inside : demo.cover}
          alt=""
          loading="lazy"
          className="absolute inset-0 block size-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </a>

      <h3 className="mt-2.5 font-display text-[17px] font-medium leading-tight sm:text-[19px]">{item.name}</h3>
      <p className="mt-0.5 text-[12.5px] font-semibold text-muted">
        {item.region ?? item.categoryLabel}
        {item.withPhoto ? "" : ", tanpa foto"}
      </p>

      {item.demos.length > 1 ? (
        <div className="-ml-2 mt-0.5 flex" role="group" aria-label={`Warna ${item.name}`}>
          {item.demos.map((d, i) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => onPick(i)}
              aria-label={d.label}
              aria-pressed={i === at}
              title={d.label}
              className="grid size-8 place-items-center"
            >
              <span
                className={`size-[18px] rounded-full ring-offset-2 ring-offset-[#f3eee5] ${i === at ? "ring-2 ring-ink" : "ring-1 ring-ink/15"}`}
                style={{ background: `linear-gradient(135deg, ${d.color} 50%, ${d.accent} 50%)` }}
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex gap-1.5 pt-2.5 text-[13px] font-semibold">
        <a href={demoHref} target="_blank" rel="noreferrer" className="flex-1 rounded-full border border-ink/20 bg-card py-2 text-center hover:border-ink/45">
          Demo
        </a>
        <a href={order} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-ink py-2 text-center text-[#f6f1e7] hover:bg-ink-2">
          Pesan
        </a>
      </div>
    </article>
  );
}
