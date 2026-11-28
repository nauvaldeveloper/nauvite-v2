"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Urutan buka di CSS: label bagasi dan boarding pass menyingkir (0 - 0,4 dtk), sampul paspor
 * terbuka (0,1 - 1 dtk), paspor didekatkan sambil memudar (0,85 - 1,8 dtk).
 */
const OPEN_MS = 1850;

/** Ikon pesawat dilihat dari atas. */
export function Plane({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

/** Latar peta: garis lintang-bujur dan pesawat yang terbang mengikuti jalur putus-putus. */
export function MapBackdrop({ className }: { className?: string }) {
  const id = `pc-flight-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg className={`${s.map} ${className ?? ""}`} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className={s.mapGrid}>
        {[100, 200, 300, 400, 500, 600, 700].map((y) => (
          <path key={y} d={`M-20 ${y}Q200 ${y - 26} 420 ${y}`} />
        ))}
        {[40, 120, 200, 280, 360].map((x) => (
          <path key={x} d={`M${x} -20Q${x + (x - 200) * 0.22} 400 ${x} 820`} />
        ))}
      </g>
      <path id={id} className={s.flight} d="M-30 150C80 60 170 230 250 120S380 60 440 110" />
      <g className={s.mapPlane}>
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="translate(12 -12) rotate(90) scale(1.1)" />
        <animateMotion dur="16s" repeatCount="indefinite" rotate="auto">
          <mpath href={`#${id}`} />
        </animateMotion>
      </g>
    </svg>
  );
}

/** Lambang emas timbul di sampul paspor: dua cincin dalam lingkaran. */
function Emblem() {
  return (
    <svg className={s.emblem} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="40" strokeDasharray="2 3" />
      <circle cx="41" cy="54" r="15" />
      <circle cx="59" cy="54" r="15" />
      <path d="M50 22l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" className={s.emblemStar} />
    </svg>
  );
}

/** Sampul: paspor kulit di atas peta, label bagasi bertuliskan nama tamu, dan boarding pass. */
export function Cover({ names, guest }: { names: ReactNode; guest: string }) {
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
      <MapBackdrop />
      <p className={s.coverKicker}>Undangan pernikahan</p>
      <div className={s.desk}>
        <div className={s.boarding} aria-hidden="true">
          <span className={s.boardingHead}>
            <Plane /> Boarding pass
          </span>
          <span className={s.barcode} />
        </div>
        <div className={s.passport}>
          <div className={s.ppPage} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={s.ppCover}>
            <div className={s.ppFront}>
              <p className={s.ppTitle}>Paspor Pernikahan</p>
              <Emblem />
              <div className={s.ppNames}>{names}</div>
              <span className={s.chip} aria-hidden="true" />
            </div>
            <div className={s.ppBack} aria-hidden="true" />
          </div>
        </div>
        <div className={s.tag}>
          <svg className={s.tagString} viewBox="0 0 60 50" aria-hidden="true">
            <path d="M58 4C30 0 8 18 6 46" />
          </svg>
          <span className={s.tagHole} aria-hidden="true" />
          <p className={s.tagLabel}>Penumpang</p>
          <p className={s.tagName}>{guest}</p>
          <p className={s.tagLabel}>Tujuan: hari bahagia kami</p>
        </div>
      </div>
      <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka undangan
      </button>
    </section>
  );
}

/** Halaman pertama: halaman data paspor muncul, lalu stempel imigrasi menghentak satu per satu. */
export function HeroStage({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const { opened } = useOpening();
  return (
    <section id={id} className={className} data-opened={opened}>
      {children}
    </section>
  );
}
