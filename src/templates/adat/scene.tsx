"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import type { IllustratedLabels } from "../illustrated/theme";
import type { OrnamentKey, SceneConfig, SceneKey } from "./theme";
import s from "./scene.module.css";

/**
 * Pintu kayu berukir sebagai sampul (dibuka saat tamu menekan tombol), lalu
 * pemandangan berlapis sebagai bagian pertama undangan. Lapisan masuk bergiliran
 * setelah pintu terbuka, lalu bergerak pelan terus.
 */

export type SceneAssets = Record<SceneKey, string>;
export type OrnamentAssets = Record<OrnamentKey, string>;

const delay = (sec: number) => ({ "--sd": `${sec}s` }) as CSSProperties;

/** Sampul berupa dua daun pintu. Tanpa animasi pintu, sampul cukup memudar. */
export function DoorCover({
  sa,
  orn,
  scene,
  script,
  labels,
  names,
  guestName,
  animate,
}: {
  sa: SceneAssets;
  orn: OrnamentAssets;
  scene: SceneConfig;
  /** Salam dalam aksara daerah (opsional). */
  script?: string;
  labels: IllustratedLabels;
  names: ReactNode;
  guestName: string | null;
  animate: boolean;
}) {
  const { opened, open } = useOpening();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const id = setTimeout(() => setGone(true), animate ? 2100 : 900);
    return () => clearTimeout(id);
  }, [opened, animate]);

  if (gone) return null;

  return (
    <section className={s.doors} data-opened={opened} data-animate={animate} aria-hidden={opened}>
      <div className={`${s.door} ${s.doorLeft}`} style={{ backgroundImage: `url("${sa.doorLeft}")` }} />
      <div className={`${s.door} ${s.doorRight}`} style={{ backgroundImage: `url("${sa.doorRight}")` }} />
      <div className={s.doorShade} />

      <div className={s.card}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.cardCrown} src={orn.crown} alt="" />
        {script ? (
          <p className={s.script} lang="su">
            {script}
          </p>
        ) : null}
        <p className={s.greeting}>{scene.greeting}</p>
        <p className={s.cardKicker}>{scene.kicker}</p>
        <div className={s.cardNames}>{names}</div>
        <div className={s.guest}>
          <p>{labels.coverGuest}</p>
          <p className={s.guestName}>{guestName ?? labels.coverGuestFallback}</p>
        </div>
        <button type="button" className={s.openButton} onClick={open} disabled={opened}>
          <IconEnvelope /> {labels.open}
        </button>
      </div>
    </section>
  );
}

/** Pemandangan berlapis: langit, awan, gunung, bukit, tokoh di kiri-kanan, bunga depan. */
export function SceneHero({
  sa,
  orn,
  scene,
  names,
  date,
  photo,
  className,
}: {
  sa: SceneAssets;
  orn: OrnamentAssets;
  scene: SceneConfig;
  names: ReactNode;
  date: string | null;
  /** Foto pasangan di tengah, di antara kedua tokoh (hanya bila gaya sampul "Foto"). */
  photo?: string;
  className?: string;
}) {
  const { opened } = useOpening();
  return (
    <section className={`${s.scene} ${className ?? ""}`} data-opened={opened} aria-label={scene.kicker}>
      <div className={`${s.layer} ${s.sky}`} style={{ ...delay(0), backgroundImage: `url("${sa.sky}")` }} />

      <div className={`${s.layer} ${s.clouds}`} style={delay(0.2)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.cloudsImg} src={sa.clouds} alt="" />
      </div>

      <div className={`${s.text} ${s.layer}`} style={delay(1.4)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.crown} src={orn.crown} alt="" />
        <p className={s.sceneKicker}>{scene.kicker}</p>
        {names}
        {date ? <p className={s.sceneDate}>{date}</p> : null}
      </div>

      <div className={`${s.layer} ${s.band} ${s.mountain}`} style={{ ...delay(0.35), backgroundImage: `url("${sa.mountain}")` }} />
      <div className={`${s.layer} ${s.band} ${s.hills}`} style={{ ...delay(0.6), backgroundImage: `url("${sa.hills}")` }} />

      {photo ? (
        <div className={`${s.layer} ${s.photoRow}`} style={delay(0.95)}>
          <div className={s.photoFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.photoRoof} src={orn.roof} alt="" />
            <div className={s.photoBody}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" />
            </div>
          </div>
        </div>
      ) : null}

      <div className={`${s.layer} ${s.figure} ${s.figureLeft}`} style={delay(1.0)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sa.figureLeft} alt="" />
      </div>
      <div className={`${s.layer} ${s.figure} ${s.figureRight}`} style={delay(1.1)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sa.figureRight} alt="" />
      </div>

      <div className={`${s.layer} ${s.front}`} style={delay(0.85)}>
        <div className={s.frontImg} style={{ backgroundImage: `url("${sa.front}")` }} />
      </div>
    </section>
  );
}
