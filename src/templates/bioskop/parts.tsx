"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/** Lama urutan buka di CSS: lampu meredup, tirai terbuka, sampul memudar. */
const OPEN_MS = 2400;

const BULBS = 14;

/** Sampul berupa panggung bioskop: papan nama berlampu di depan tirai yang terbuka saat undangan dibuka. */
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
      <div className={s.valance} aria-hidden="true" />
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
    </section>
  );
}
