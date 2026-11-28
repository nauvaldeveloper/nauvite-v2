"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Lama urutan buka di CSS: hiasan dan tulisan memudar (0 - 0,4 dtk), jendela lengkung melebar
 * memenuhi layar (0,2 - 1,3 dtk), lalu sampul memudar (1,25 - 1,75 dtk). Halaman pertama baru tersusun setelah itu.
 */
const OPEN_MS = 1800;

const LEAVES = [140, 118, 96, 75, 54, 34, 14];

/** Tangkai daun kering ala boho. `flip` untuk sisi kanan. */
export function Branch({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <span className={`${s.branchWrap} ${flip ? s.branchFlip : ""} ${className ?? ""}`} aria-hidden="true">
      <svg className={s.branch} viewBox="0 0 60 164">
        <path className={s.stem} d="M30 164C30 124 26 72 33 6" />
        {LEAVES.map((y, i) => {
          const x = 30 + (i > 3 ? (i - 3) * 1 : 0) - (i < 3 ? 1 : 0);
          return (
            <g key={y}>
              <ellipse cx={x - 8} cy={y} rx="4.2" ry="10.5" transform={`rotate(-38 ${x - 8} ${y})`} />
              {i < LEAVES.length - 1 ? (
                <ellipse cx={x + 8} cy={y - 10} rx="4.2" ry="10.5" transform={`rotate(38 ${x + 8} ${y - 10})`} />
              ) : null}
            </g>
          );
        })}
      </svg>
    </span>
  );
}

/** Pelangi boho seperempat lingkaran untuk sudut layar. */
function CornerRainbow({ className }: { className: string }) {
  return (
    <svg className={`${s.corner} ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M0 14a86 86 0 0 1 86 86" style={{ stroke: "var(--c1)" }} />
      <path d="M0 34a66 66 0 0 1 66 66" style={{ stroke: "var(--c2)" }} />
      <path d="M0 54a46 46 0 0 1 46 46" style={{ stroke: "var(--c3)" }} />
    </svg>
  );
}

/** Sampul: foto dalam jendela lengkung yang melebar memenuhi layar saat undangan dibuka. */
export function Cover({ children, photo }: { children: ReactNode; photo: string | undefined }) {
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
      <span className={s.grain} aria-hidden="true" />
      <div className={s.coverDecor} aria-hidden="true">
        <CornerRainbow className={s.cornerTop} />
        <CornerRainbow className={s.cornerBottom} />
        <span className={s.coverSun} />
        <span className={s.coverBackArch} />
        <svg className={s.curved} viewBox="0 0 130 70">
          <path id="lb-curve" d="M9 65A56 56 0 0 1 121 65" fill="none" />
          <text>
            <textPath href="#lb-curve" startOffset="50%" textAnchor="middle">
              Undangan Pernikahan
            </textPath>
          </text>
        </svg>
      </div>
      <div className={s.coverWindow}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" />
        ) : null}
      </div>
      <div className={s.coverBranches} aria-hidden="true">
        <Branch className={s.coverBranchL} />
        <Branch className={s.coverBranchR} flip />
      </div>
      <div className={s.coverText}>
        {children}
        <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
          <IconEnvelope /> Buka undangan
        </button>
      </div>
    </section>
  );
}

/** Halaman pertama: foto naik, pelangi tergambar mengelilinginya, matahari terbit, tangkai tumbuh. */
export function HeroStage({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const { opened } = useOpening();
  return (
    <section id={id} className={className} data-opened={opened}>
      {children}
    </section>
  );
}
