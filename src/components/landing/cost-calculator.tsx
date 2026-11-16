"use client";

import { useState } from "react";

const PER_SHEET = [5000, 8000, 12000, 15000];

const rp = (n: number) => `Rp${new Intl.NumberFormat("id-ID").format(n)}`;

/**
 * Hitungan sederhana biaya undangan cetak vs Nauvite. Angkanya bisa diatur
 * pengunjung sendiri, supaya perbandingannya jujur dan bisa dicek.
 */
export function CostCalculator({ basic, premium }: { basic: number; premium: number }) {
  const [guests, setGuests] = useState(300);
  const [perSheet, setPerSheet] = useState(8000);
  const printed = guests * perSheet;

  return (
    <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
      <p className="text-[14px] font-semibold text-muted">Hitung sendiri</p>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="flex items-baseline justify-between text-[14px] font-semibold">
              Jumlah undangan
              <span className="font-display text-2xl font-medium tabular-nums">{guests}</span>
            </span>
            <input
              type="range"
              min={50}
              max={1000}
              step={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full accent-[#17261f]"
            />
          </label>
          <div className="grid gap-2">
            <span className="text-[14px] font-semibold">Harga cetak per lembar</span>
            <div className="flex flex-wrap gap-2">
              {PER_SHEET.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPerSheet(p)}
                  className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                    perSheet === p ? "border-ink bg-ink text-[#f6f1e7]" : "border-line bg-white hover:border-ink/30"
                  }`}
                >
                  {rp(p)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#ece5d8] p-4">
            <p className="text-[13px] font-semibold text-muted">Undangan cetak</p>
            <p className="mt-1 break-words font-display text-[19px] font-medium tabular-nums sm:text-3xl">{rp(printed)}</p>
            <p className="mt-1 text-[12px] text-muted">belum termasuk ongkir</p>
          </div>
          <div className="rounded-2xl bg-ink p-4 text-[#f3eee5]">
            <p className="text-[13px] font-semibold text-[#c9d2cc]">Nauvite</p>
            <p className="mt-1 font-display text-[19px] font-medium tabular-nums text-gold sm:text-3xl">{rp(basic)}</p>
            <p className="mt-1 text-[12px] text-[#9aa79f]">Premium {rp(premium)}, tamu tanpa batas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
