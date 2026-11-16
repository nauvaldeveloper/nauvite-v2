"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number, now: number): Parts | null {
  const ms = target - now;
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const LABELS: [keyof Parts, string][] = [
  ["days", "Hari"],
  ["hours", "Jam"],
  ["minutes", "Menit"],
  ["seconds", "Detik"],
];

/** Hitung mundur ke acara. Tampilan diatur lewat className dari template. */
export function Countdown({
  target,
  className,
  itemClassName,
  doneText = "Acara sedang atau sudah berlangsung",
}: {
  /** Waktu acara, ISO string. */
  target: string;
  className?: string;
  itemClassName?: string;
  doneText?: string;
}) {
  const t = new Date(target).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Sebelum terhubung ke browser, tampilkan kerangka kosong supaya tidak ada
  // angka dari server yang langsung berubah.
  const parts = now === null ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : diff(t, now);

  if (!parts) return <p className={className}>{doneText}</p>;

  return (
    <div className={className} role="timer" aria-live="off">
      {LABELS.map(([key, label]) => (
        <div key={key} className={itemClassName}>
          <span suppressHydrationWarning>{now === null ? "--" : String(parts[key]).padStart(2, "0")}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}
