"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/** Lama urutan buka di CSS: pita lepas, sampul terbuka, halaman mendekat. */
const OPEN_MS = 4000;

export function Cover({ plate, page }: { plate: ReactNode; page: ReactNode }) {
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
      <div className={s.stage}>
        <div className={s.book}>
          <div className={s.pageEdges} />
          {/* Gambar halaman dalam baru dipasang saat dibuka, supaya bunganya tumbuh di depan tamu. */}
          <div className={s.firstPage}>{opened ? page : null}</div>
          <div className={s.board}>
            <div className={s.boardFront}>{plate}</div>
            <div className={s.boardBack} />
          </div>
          <div className={s.ribbon} />
        </div>
      </div>
      <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka undangan
      </button>
    </section>
  );
}
