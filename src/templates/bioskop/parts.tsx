"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Urutan buka di CSS: tirai terbuka (0,3 - 1,5 dtk), hitung mundur pita film 3-2-1
 * (1,2 - 2,7 dtk), lalu sampul memudar (2,7 - 3 dtk) dan poster menyala seperti proyektor.
 */
const OPEN_MS = 3050;

const BULBS = 14;

/** Sampul berupa panggung bioskop: lampu sorot, tirai, papan nama berlampu, dan tiket untuk tamu. */
export function Cover({ children, guest }: { children: ReactNode; guest: ReactNode }) {
  const { opened, open } = useOpening();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => setGone(true), reduced ? 400 : OPEN_MS);
    return () => clearTimeout(id);
  }, [opened]);

  if (gone) return null;

  return (
    <section className={s.cover} data-opened={opened} aria-hidden={opened}>
      <div className={`${s.curtain} ${s.curtainLeft}`} aria-hidden="true" />
      <div className={`${s.curtain} ${s.curtainRight}`} aria-hidden="true" />
      <span className={`${s.beam} ${s.beamLeft}`} aria-hidden="true" />
      <span className={`${s.beam} ${s.beamRight}`} aria-hidden="true" />
      <div className={s.valance} aria-hidden="true" />
      <div className={s.stageFloor} aria-hidden="true" />
      <div className={s.coverStage}>
        <div className={s.board}>
          <span className={s.bulbs} aria-hidden="true">
            {Array.from({ length: BULBS }, (_, i) => (
              <i key={i} style={{ animationDelay: `${(i % 4) * 0.45}s` }} />
            ))}
          </span>
          {children}
          <span className={s.bulbs} aria-hidden="true">
            {Array.from({ length: BULBS }, (_, i) => (
              <i key={i} style={{ animationDelay: `${((i + 2) % 4) * 0.45}s` }} />
            ))}
          </span>
        </div>
        {guest}
        <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
          <IconEnvelope /> Buka undangan
        </button>
      </div>
      <div className={s.leader} aria-hidden="true">
        <div className={s.leaderDial}>
          <span className={s.leaderHand} />
          <b>3</b>
          <b>2</b>
          <b>1</b>
        </div>
        <span className={s.leaderGrain} />
      </div>
    </section>
  );
}

/** Poster halaman pertama: menyala seperti proyektor setelah hitung mundur selesai. */
export function PosterStage({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const { opened } = useOpening();
  return (
    <section id={id} className={className} data-opened={opened}>
      {children}
    </section>
  );
}

/** Lencana daun salam ala poster festival film. */
export function Laurel({ className }: { className?: string }) {
  const leaves: { x: number; y: number; rot: number }[] = [];
  for (let k = 0; k < 7; k++) {
    const a = ((118 + k * 15) * Math.PI) / 180;
    const x = 60 + Math.cos(a) * 34;
    const y = 36 + Math.sin(a) * 30;
    const rot = (a * 180) / Math.PI + 90 + 28;
    leaves.push({ x: +x.toFixed(1), y: +y.toFixed(1), rot: +rot.toFixed(1) });
  }
  return (
    <svg className={className} viewBox="0 0 120 72" aria-hidden="true">
      {[false, true].map((flip) => (
        <g key={String(flip)} transform={flip ? "translate(120 0) scale(-1 1)" : undefined}>
          <path d="M44 68C30 62 22 46 26 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          {leaves.map((l, i) => (
            <ellipse key={i} cx={l.x} cy={l.y} rx="2.6" ry="6.4" transform={`rotate(${l.rot} ${l.x} ${l.y})`} fill="currentColor" />
          ))}
        </g>
      ))}
      <text x="60" y="29" textAnchor="middle">PILIHAN</text>
      <text x="60" y="41.5" textAnchor="middle">KELUARGA</text>
      <text x="60" y="54" textAnchor="middle" className={s.laurelYear}>
        TERBAIK
      </text>
    </svg>
  );
}
