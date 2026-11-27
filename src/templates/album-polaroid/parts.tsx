"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Lama urutan buka di CSS: sampul album terbuka (0 - 1,1 dtk), album didekatkan
 * sambil memudar (0,8 - 1,7 dtk). Halaman pertama mulai tersusun di 1,1 dtk.
 */
const OPEN_MS = 1800;

/** Sampul album kain dengan polaroid tertempel, terbuka seperti buku saat undangan dibuka. */
export function Cover({ children, photo }: { children: ReactNode; photo: ReactNode }) {
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
      <div className={s.book}>
        <div className={s.bookPage} aria-hidden="true" />
        <div className={s.bookCover}>
          <div className={s.bookFront}>
            <span className={s.spine} aria-hidden="true" />
            {photo ? (
              <figure className={`${s.polaroid} ${s.coverPolaroid}`}>
                <span className={s.tape} aria-hidden="true" />
                <div className={s.photo}>{photo}</div>
              </figure>
            ) : null}
            <div className={s.coverLabel}>{children}</div>
          </div>
          <div className={s.bookInside} aria-hidden="true" />
        </div>
      </div>
      <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka album
      </button>
    </section>
  );
}

/** Halaman pertama: polaroid jatuh satu per satu ke tempatnya setelah album dibuka. */
export function HeroStage({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const { opened } = useOpening();
  return (
    <section id={id} className={className} data-opened={opened}>
      {children}
    </section>
  );
}
