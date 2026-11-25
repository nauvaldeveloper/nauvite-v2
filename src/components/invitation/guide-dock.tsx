"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useOpening } from "./opening";
import { IconChat, IconPause, IconPlay } from "./icons";
import s from "./guide-dock.module.css";

/**
 * Bilah bawah dengan gulir otomatis. Setelah undangan dibuka, halaman berjalan
 * pelan sendiri dan berhenti di bagian RSVP. Sentuhan, roda mouse, tombol panah,
 * atau mengisi form langsung menghentikannya, supaya tamu tidak berebut layar.
 * Warna diatur template lewat --dock-bg, --dock-ink, --dock-line, --dock-accent.
 */

const SPEEDS = [1, 2, 3];
const PX_PER_SECOND = 48;

export type GuideItem = { id: string; label: string };

export function GuideDock({
  items,
  autoStart = true,
  startDelay = 2000,
  rsvpId = "ucapan",
}: {
  items: GuideItem[];
  autoStart?: boolean;
  /** Jeda setelah tombol buka ditekan, samakan dengan lama animasi sampul. */
  startDelay?: number;
  rsvpId?: string;
}) {
  const { opened, playing, toggleMusic, hasMusic } = useOpening();
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [menu, setMenu] = useState(false);
  const dock = useRef<HTMLElement>(null);

  // Mulai otomatis sekali, kecuali tamu mematikan animasi atau sudah menggulir duluan.
  useEffect(() => {
    if (!opened || !autoStart) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => {
      if (window.scrollY < 40) setRunning(true);
    }, startDelay);
    return () => clearTimeout(id);
  }, [opened, autoStart, startDelay]);

  useEffect(() => {
    if (!running) return;
    const rsvp = document.getElementById(rsvpId);
    const top = rsvp ? rsvp.getBoundingClientRect().top + window.scrollY : Infinity;
    // Kalau tamu menekan Putar saat sudah di RSVP, lanjut sampai bawah.
    const stopAtRsvp = window.scrollY < top - 4;
    let y = window.scrollY;
    let last = performance.now();
    let raf = 0;
    const step = (now: number) => {
      y += (PX_PER_SECOND * SPEEDS[speed] * Math.min(now - last, 100)) / 1000;
      last = now;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Posisi RSVP dihitung tiap langkah karena gambar bisa mengubah tinggi halaman.
      const target = rsvp && stopAtRsvp ? rsvp.getBoundingClientRect().top + window.scrollY : max;
      const end = Math.min(max, target);
      window.scrollTo({ top: Math.min(y, end), behavior: "instant" });
      if (y >= end) setRunning(false);
      else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const stop = (e: Event) => {
      if (dock.current?.contains(e.target as Node)) return;
      setRunning(false);
    };
    const events = ["wheel", "touchstart", "mousedown", "keydown", "focusin"] as const;
    events.forEach((n) => window.addEventListener(n, stop, { passive: true }));
    return () => {
      cancelAnimationFrame(raf);
      events.forEach((n) => window.removeEventListener(n, stop));
    };
  }, [running, speed, rsvpId]);

  const go = useCallback((id: string) => {
    setRunning(false);
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (!opened) return null;

  return (
    <nav ref={dock} className={s.dock} aria-label="Navigasi undangan" style={{ "--dock-wait": `${startDelay}ms` } as CSSProperties}>
      {menu ? (
        <ul className={s.menu}>
          {items.map((i) => (
            <li key={i.id}>
              <button type="button" onClick={() => go(i.id)}>
                {i.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className={s.bar}>
        <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M5 7h14M5 12h14M5 17h9" />
          </svg>
          <span>Isi</span>
        </button>
        <button type="button" onClick={() => go(rsvpId)}>
          <IconChat />
          <span>RSVP</span>
        </button>
        <button type="button" className={s.play} data-running={running} onClick={() => setRunning((r) => !r)}>
          {running ? <IconPause /> : <IconPlay />}
          <span>{running ? "Berhenti" : "Jalan"}</span>
        </button>
        <button
          type="button"
          onClick={() => setSpeed((v) => (v + 1) % SPEEDS.length)}
          aria-label={`Kecepatan ${SPEEDS[speed]} kali, ketuk untuk mengganti`}
        >
          <b>{SPEEDS[speed]}x</b>
          <span>Kecepatan</span>
        </button>
        {hasMusic ? (
          <button type="button" onClick={toggleMusic} aria-label={playing ? "Matikan musik" : "Putar musik"}>
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0ZM19 16a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" />
              {playing ? null : <path d="M3 3l18 18" />}
            </svg>
            <span>Musik</span>
          </button>
        ) : null}
      </div>
    </nav>
  );
}
