"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/** Lama urutan buka amplop di CSS: balik, segel lepas, tutup terbuka, surat keluar. */
const OPEN_MS = 4800;

export function Cover({
  heading,
  front,
  seal,
  letter,
  foliage,
}: {
  heading: ReactNode;
  front: ReactNode;
  seal: ReactNode;
  letter: ReactNode;
  foliage: ReactNode;
}) {
  const { opened, open } = useOpening();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => setGone(true), reduced ? 500 : OPEN_MS);
    return () => clearTimeout(id);
  }, [opened]);

  if (gone) return null;

  return (
    <section className={s.cover} data-opened={opened} aria-hidden={opened}>
      {foliage}
      <div className={s.coverHead}>{heading}</div>
      <div className={s.envelopeStage}>
        <div className={s.envelope}>
          <div className={s.front}>{front}</div>
          <div className={s.back}>
            <div className={s.backPanel} />
            <div className={s.flap} />
            <div className={s.letterCard}>{letter}</div>
            <div className={s.pocketSides} />
            <div className={s.pocket} />
            <div className={s.seal}>{seal}</div>
          </div>
        </div>
      </div>
      <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka undangan
      </button>
    </section>
  );
}
