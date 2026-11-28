"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Urutan buka di CSS: tali beludru terlepas dan jatuh (0 - 0,8 dtk), lampu padam,
 * layar menggelap penuh (0,6 - 1,15 dtk). Di halaman pertama lampu galeri lalu menyala berkedip.
 */
const OPEN_MS = 1250;

/** Lampu sorot di rel langit-langit. */
function Lamps() {
  return (
    <div className={s.lamps} aria-hidden="true">
      <span className={s.track} />
      <span className={s.lamp} style={{ left: "18%" }} />
      <span className={s.lamp} style={{ left: "50%" }} />
      <span className={s.lamp} style={{ left: "82%" }} />
    </div>
  );
}

/** Sampul: dinding galeri bertuliskan nama, tali pembatas beludru, dan papan undangan untuk tamu. */
export function Cover({ children, guest }: { children: ReactNode; guest: string }) {
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
      <Lamps />
      <span className={s.floor} aria-hidden="true" />
      <span className={s.grain} aria-hidden="true" />
      <div className={s.coverText}>{children}</div>
      <div className={s.rope}>
        <span className={`${s.post} ${s.postLeft}`} aria-hidden="true" />
        <span className={`${s.post} ${s.postRight}`} aria-hidden="true" />
        <div className={s.swing}>
          <svg className={s.ropeLine} viewBox="0 0 340 80" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 4Q170 80 340 4" vectorEffect="non-scaling-stroke" />
            <path className={s.ropeSheen} d="M0 2Q170 76 340 2" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className={s.sign}>
            <p>Undangan khusus untuk</p>
            <p className={s.signName}>{guest}</p>
          </div>
        </div>
      </div>
      <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka undangan
      </button>
      <span className={s.dim} aria-hidden="true" />
    </section>
  );
}

/** Halaman pertama: ruang galeri yang lampunya menyala setelah undangan dibuka. */
export function HeroStage({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const { opened } = useOpening();
  return (
    <section id={id} className={className} data-opened={opened}>
      <Lamps />
      {children}
      <span className={s.lightsOff} aria-hidden="true" />
    </section>
  );
}
