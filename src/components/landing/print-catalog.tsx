"use client";

import { useEffect, useRef, useState } from "react";
import { IconWhatsapp } from "@/components/invitation/icons";
import {
  PRINT_FOILS,
  PRINT_FORMATS,
  PRINT_TIERS,
  printImageUrl,
  type PrintDesign,
  type PrintTier,
} from "@/lib/print/shared";

const rupiah = (n: number) => `Rp${new Intl.NumberFormat("id-ID").format(n)}`;

/** Katalog undangan cetak dengan filter kelas dan tampilan besar per desain. */
export function PrintCatalog({
  designs,
  whatsapp,
  businessName,
  minOrder,
  plastic,
  label,
}: {
  designs: PrintDesign[];
  whatsapp: string;
  businessName: string;
  minOrder: number;
  /** Tambahan opsional per pcs */
  plastic: number;
  label: number;
}) {
  const [filter, setFilter] = useState<"semua" | PrintTier>("semua");
  const [open, setOpen] = useState<PrintDesign | null>(null);
  const [photo, setPhoto] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);

  const tiers = (Object.keys(PRINT_TIERS) as PrintTier[]).filter((t) => designs.some((d) => d.tier === t));
  const shown = designs
    .filter((d) => filter === "semua" || d.tier === filter)
    // Favorit tampil lebih dulu, urutan lain mengikuti admin
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const orderLink = (d: PrintDesign) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      `Halo ${businessName}, saya mau pesan undangan cetak ${d.code} (${d.name}). Rencana jumlah: ... pcs (minimal ${minOrder}).`,
    )}`;

  return (
    <>
      <div className="-mx-5 mb-8 flex justify-start gap-2 overflow-x-auto px-5 sm:justify-center">
        {[{ value: "semua" as const, label: `Semua (${designs.length})` }, ...tiers.map((t) => ({ value: t, label: PRINT_TIERS[t].label }))].map(
          (f) => (
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
          ),
        )}
      </div>
      <p className="-mt-3 mb-8 text-center text-[14px] text-muted">
        {filter !== "semua" ? `${PRINT_TIERS[filter].hint} ` : ""}
        Harga per pcs, <strong className="font-semibold text-ink">belum termasuk plastik</strong> (+{rupiah(plastic)}) dan label
        nama tamu (+{rupiah(label)}).
      </p>

      <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              onClick={() => {
                setPhoto(0);
                setOpen(d);
              }}
              className="group block w-full overflow-hidden rounded-2xl border border-line bg-card text-left transition-[border-color,box-shadow] hover:border-ink/25 hover:shadow-[0_18px_36px_-24px_rgb(23_38_31/0.5)]"
            >
              <span className="relative block aspect-square bg-[#e9e1d2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={printImageUrl(d.images[0])}
                  alt={`Undangan cetak ${d.name}`}
                  loading="lazy"
                  className="absolute inset-0 m-auto max-h-[84%] max-w-[84%] object-contain shadow-[0_10px_20px_-12px_rgb(23_38_31/0.55)] transition-transform duration-500 group-hover:-translate-y-1"
                />
                {d.featured ? (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-gold">Favorit</span>
                ) : null}
              </span>
              <span className="block p-3.5 sm:p-4">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] font-bold tracking-wide text-brass">{d.code}</span>
                  {d.foil !== "none" ? (
                    <span className={`text-[11px] font-semibold ${d.foil === "emas" ? "text-[#96711f]" : "text-[#5f6b73]"}`}>
                      {PRINT_FOILS[d.foil]}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block truncate font-display text-lg font-medium leading-snug sm:text-xl">{d.name}</span>
                <span className="mt-0.5 block text-[13px] text-muted">{PRINT_FORMATS[d.format]}</span>
                <span className="mt-2 block text-[15px] font-semibold">
                  {rupiah(d.price)}
                  <span className="font-normal text-muted">/pcs</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
        className="m-auto max-h-[92dvh] w-[min(960px,calc(100vw-24px))] overflow-hidden rounded-3xl bg-card p-0 text-ink shadow-2xl backdrop:bg-[#17261f]/60 backdrop:backdrop-blur-sm"
      >
        {open ? (
          <div className="relative grid max-h-[92dvh] overflow-y-auto md:grid-cols-[1.4fr_1fr]">
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Tutup"
              className="sticky top-3 z-10 col-span-full -mb-11 mr-3 grid size-10 place-items-center justify-self-end rounded-full bg-card/95 text-2xl shadow-md hover:bg-white"
            >
              &times;
            </button>
            <div className="grid gap-3 bg-[#e9e1d2] p-4 sm:p-8">
              <div className="grid min-h-[260px] place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={printImageUrl(open.images[photo] ?? open.images[0])}
                  alt={`Undangan cetak ${open.name}`}
                  className="max-h-[56dvh] max-w-full object-contain shadow-[0_18px_36px_-18px_rgb(23_38_31/0.6)]"
                />
              </div>
              {open.images.length > 1 ? (
                <div className="flex justify-center gap-2">
                  {open.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setPhoto(i)}
                      aria-label={`Foto ${i + 1}`}
                      className={`size-14 overflow-hidden rounded-lg border-2 bg-white ${i === photo ? "border-ink" : "border-transparent opacity-70"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={printImageUrl(src)} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-[13px] font-bold tracking-wide text-brass">
                {open.code}, kelas {PRINT_TIERS[open.tier].label}
              </p>
              <h3 className="mt-1 font-display text-3xl font-medium leading-tight">{open.name}</h3>
              <dl className="mt-5 grid gap-2.5 text-[15px]">
                {[
                  ["Bentuk", PRINT_FORMATS[open.format]],
                  ["Kertas", PRINT_FOILS[open.foil]],
                  ...(open.note ? [["Isi", open.note]] : []),
                  ["Minimal", `${minOrder} pcs`],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-4 border-b border-line pb-2.5">
                    <dt className="w-20 shrink-0 text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 font-display text-4xl font-medium">
                {rupiah(open.price)}
                <span className="font-sans text-base font-normal text-muted"> /pcs</span>
              </p>
              <p className="mt-1 text-[14px] text-muted">Sudah termasuk cetak nama mempelai, detail acara, dan nama tamu.</p>
              <table className="mt-4 w-full text-[14px]">
                <tbody>
                  {[
                    ["Undangan saja", open.price],
                    ["Dengan plastik", open.price + plastic],
                    ["Dengan plastik dan label nama", open.price + plastic + label],
                  ].map(([k, v]) => (
                    <tr key={k as string} className="border-b border-line last:border-0">
                      <td className="py-1.5 text-muted">{k}</td>
                      <td className="py-1.5 text-right font-semibold">{rupiah(v as number)}/pcs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[13px] text-muted">
                Contoh {minOrder} pcs tanpa plastik: {rupiah(open.price * minOrder)}. Belum termasuk ongkir.
              </p>
              <div className="mt-auto pt-7">
                <a
                  href={orderLink(open)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-[#f6f1e7] hover:bg-ink-2"
                >
                  <IconWhatsapp className="text-lg" /> Pesan {open.code}
                </a>
                <p className="mt-3 text-center text-[13px] text-muted">Warna asli bisa sedikit berbeda dari layar.</p>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
