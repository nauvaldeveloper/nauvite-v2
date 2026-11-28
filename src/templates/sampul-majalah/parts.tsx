"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Urutan buka di CSS: cangkir dan label menyingkir (0 - 0,3 dtk), majalah terangkat lalu
 * membesar memenuhi layar (0,1 - 1,15 dtk), kilat kamera memutihkan layar (1,05 - 1,3 dtk).
 * Di halaman pertama kilat itu memudar memperlihatkan sampul penuh.
 */
const OPEN_MS = 1450;

/** Sampul: majalah di meja kafe bermarmer, secangkir kopi, dan label alamat bertuliskan nama tamu. */
export function Cover({
  magazine,
  photo,
  names,
  line,
  date,
  guest,
}: {
  magazine: string;
  photo: string | undefined;
  names: ReactNode;
  line: string;
  date: string;
  guest: string;
}) {
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
      <div className={s.cup} aria-hidden="true">
        <span className={s.saucer} />
        <span className={s.mug}>
          <svg viewBox="0 0 40 40" className={s.latte}>
            <path d="M20 31C11 25 8 20 9 15c1-5 7-6 11-1c4-5 10-4 11 1c1 5-2 10-11 16z" />
          </svg>
        </span>
        <span className={s.handle} />
        <span className={`${s.steam} ${s.steam1}`} />
        <span className={`${s.steam} ${s.steam2}`} />
      </div>
      <div className={s.mag} style={{ "--len": Math.max(magazine.length, 4) } as CSSProperties}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={s.magPhoto} src={photo} alt="" />
        ) : (
          <div className={s.magPhoto} />
        )}
        <span className={s.magShade} aria-hidden="true" />
        <p className={s.magMast}>{magazine}</p>
        <p className={s.magIssue}>
          <span>Edisi spesial pernikahan</span>
          <span>{date}</span>
        </p>
        <div className={s.magLines}>
          <p className={s.magNames}>{names}</p>
          <p className={s.magLine}>{line}</p>
        </div>
        <span className={s.magGloss} aria-hidden="true" />
        <div className={s.mailLabel}>
          <p>Kepada Yth.</p>
          <p className={s.mailName}>{guest}</p>
        </div>
      </div>
      <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka undangan
      </button>
      <span className={s.flash} aria-hidden="true" />
    </section>
  );
}

/** Halaman pertama: kilat kamera memudar, lalu isi sampul tersusun bergiliran. */
export function HeroStage({
  id,
  className,
  style,
  children,
}: {
  id: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { opened } = useOpening();
  return (
    <section id={id} className={className} style={style} data-opened={opened}>
      {children}
      <span className={s.flashOut} aria-hidden="true" />
    </section>
  );
}
