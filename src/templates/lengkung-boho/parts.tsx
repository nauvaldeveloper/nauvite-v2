"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Lama urutan buka di CSS: tulisan memudar (0 - 0,4 dtk), jendela lengkung melebar
 * memenuhi layar (0,2 - 1,3 dtk), lalu sampul memudar (1,25 - 1,75 dtk). Halaman pertama baru tersusun setelah itu.
 */
const OPEN_MS = 1800;

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
      <span className={s.coverSun} aria-hidden="true" />
      <span className={s.coverOutline} aria-hidden="true" />
      <div className={s.coverWindow}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" />
        ) : null}
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

/** Halaman pertama: matahari terbit dan lengkung foto naik setelah undangan dibuka. */
export function HeroStage({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const { opened } = useOpening();
  return (
    <section id={id} className={className} data-opened={opened}>
      {children}
    </section>
  );
}
