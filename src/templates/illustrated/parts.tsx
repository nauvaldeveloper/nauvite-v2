"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope, IconPause, IconPlay } from "@/components/invitation/icons";
import type { AssetKey, IllustratedLabels } from "./theme";
import s from "./template.module.css";

/** Alamat aset tema, dihitung di server lalu dikirim ke komponen browser. */
export type Assets = Record<AssetKey, string>;

/**
 * Sampul: kertas, foto pasangan memudar ke bawah, buket di sudut atas yang
 * bergoyang. Saat dibuka, buket terbang ke luar layar lalu sampul terangkat.
 */
export function Cover({
  a,
  labels,
  photo,
  names,
  guestName,
  petals,
}: {
  a: Assets;
  labels: IllustratedLabels;
  photo?: string;
  names: ReactNode;
  guestName: string | null;
  petals: boolean;
}) {
  const { opened, open } = useOpening();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const id = setTimeout(() => setGone(true), 1400);
    return () => clearTimeout(id);
  }, [opened]);

  if (gone) return null;

  return (
    <section className={s.cover} data-opened={opened} aria-hidden={opened}>
      <div className={s.paper} />
      {photo ? (
        <div className={s.coverPhoto}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={s.coverStain} src={a.stain} alt="" />
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${s.cornerLeft} ${s.coverCorner}`} src={a.left} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${s.cornerRight} ${s.coverCorner}`} src={a.right} alt="" />

      {petals ? <Petals a={a} count={7} /> : null}

      <div className={s.coverContent}>
        <p className={`${s.kicker} ${s.coverIn}`} style={{ ["--d" as string]: "0.5s" }}>
          {labels.coverKicker}
        </p>
        <div className={s.coverIn} style={{ ["--d" as string]: "0.7s" }}>
          {names}
        </div>
        <div className={`${s.coverGuest} ${s.coverIn}`} style={{ ["--d" as string]: "0.95s" }}>
          <p>{labels.coverGuest}</p>
          <p className={s.coverGuestName}>{guestName ?? labels.coverGuestFallback}</p>
        </div>
        <div className={s.coverIn} style={{ ["--d" as string]: "1.15s" }}>
          <button type="button" className={s.button} onClick={open} disabled={opened}>
            <IconEnvelope /> {labels.open}
          </button>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.coverBottomCluster} src={a.clusterB} alt="" />
    </section>
  );
}

// Posisi kelopak dibuat tetap (bukan acak) supaya tampilan server dan browser sama.
const PETAL_SPOTS = [
  { left: 6, delay: 0, dur: 13, size: 26, img: 1, drift: 40 },
  { left: 22, delay: 4.5, dur: 15, size: 20, img: 3, drift: -30 },
  { left: 38, delay: 9, dur: 12, size: 24, img: 2, drift: 50 },
  { left: 55, delay: 2.5, dur: 16, size: 18, img: 1, drift: -45 },
  { left: 70, delay: 7, dur: 14, size: 28, img: 3, drift: 35 },
  { left: 84, delay: 11, dur: 13, size: 22, img: 2, drift: -40 },
  { left: 94, delay: 5.5, dur: 17, size: 19, img: 1, drift: 25 },
  { left: 46, delay: 13, dur: 15, size: 21, img: 3, drift: -20 },
] as const;

/** Kelopak dan daun yang jatuh pelan sambil berputar. */
export function Petals({ a, count = 8 }: { a: Assets; count?: number }) {
  return (
    <div className={s.petals} aria-hidden="true">
      {PETAL_SPOTS.slice(0, count).map((p, i) => (
        <span
          key={i}
          className={s.petal}
          style={
            {
              left: `${p.left}%`,
              "--delay": `${p.delay}s`,
              "--dur": `${p.dur}s`,
              "--drift": `${p.drift}px`,
            } as CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a[`petal${p.img}`]} alt="" style={{ width: p.size }} />
        </span>
      ))}
    </div>
  );
}

/** Kelopak di seluruh layar, mulai turun setelah undangan dibuka. */
export function PagePetals({ a }: { a: Assets }) {
  const { opened } = useOpening();
  if (!opened) return null;
  return (
    <div className={s.pagePetals}>
      <Petals a={a} count={6} />
    </div>
  );
}

export function MusicButton() {
  const { opened, playing, toggleMusic, hasMusic } = useOpening();
  if (!opened || !hasMusic) return null;
  return (
    <button
      type="button"
      className={s.musicButton}
      onClick={toggleMusic}
      aria-label={playing ? "Matikan musik" : "Putar musik"}
      data-playing={playing}
    >
      {playing ? <IconPause /> : <IconPlay />}
    </button>
  );
}
