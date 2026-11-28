"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Urutan buka di CSS: tulisan memudar (0 - 0,4 dtk), matahari tenggelam (0,1 - 1,5 dtk),
 * lalu ombak berwarna kertas naik menutup layar (0,45 - 1,6 dtk). Sampul dilepas setelah layar tertutup,
 * dan di halaman pertama ombak itu surut memperlihatkan foto.
 */
const OPEN_MS = 1750;

/** Barisan ombak: lapisan bergelombang yang bergeser pelan ke samping. */
export function Sea({ className }: { className?: string }) {
  return (
    <div className={`${s.sea} ${className ?? ""}`} aria-hidden="true">
      <span className={`${s.wave} ${s.wave1}`} />
      <span className={`${s.wave} ${s.wave2}`} />
      <span className={`${s.wave} ${s.wave3}`} />
    </div>
  );
}

/** Tiga burung kecil yang terbang melintas pelan. */
export function Birds({ className }: { className?: string }) {
  return (
    <div className={`${s.birds} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 90 40">
        <path className={s.bird} d="M2 14q7-8 14 0q7-8 14 0" />
        <path className={s.bird} d="M38 4q5-6 10 0q5-6 10 0" style={{ animationDelay: "-0.4s" }} />
        <path className={s.bird} d="M60 26q6-7 12 0q6-7 12 0" style={{ animationDelay: "-0.8s" }} />
      </svg>
    </div>
  );
}

/** Sampul: langit senja berawan, burung, matahari di garis laut beserta kilaunya, dan ombak. */
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
      <div className={s.coverSky} aria-hidden="true">
        <span className={`${s.cloud} ${s.cloud1}`} />
        <span className={`${s.cloud} ${s.cloud2}`} />
        <span className={`${s.cloud} ${s.cloud3}`} />
        <span className={s.coverSun} />
      </div>
      <Birds className={s.coverBirds} />
      <Sea className={s.coverSea} />
      <div className={s.glint} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className={s.grain} aria-hidden="true" />
      <div className={s.coverText}>
        {children}
        <div className={s.guestCard}>
          <p className={s.coverTo}>Kepada Yth.</p>
          <p className={s.coverGuest}>{guest}</p>
        </div>
        <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
          <IconEnvelope /> Buka undangan
        </button>
      </div>
      <div className={s.tide} aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

/** Halaman pertama: ombak surut memperlihatkan foto, lalu nama dan tanggal muncul bergiliran. */
export function HeroStage({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const { opened } = useOpening();
  return (
    <section id={id} className={className} data-opened={opened}>
      {children}
    </section>
  );
}
