"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope, IconPause, IconPlay } from "@/components/invitation/icons";
import s from "./template.module.css";

/**
 * Sampul layar penuh. Isi dibagi tiga: judul di atas, nama di tengah,
 * tamu + tombol di bawah, supaya layar HP terisi penuh.
 */
export function Cover({
  top,
  center,
  guestName,
  background,
}: {
  top: ReactNode;
  center: ReactNode;
  guestName: string | null;
  background: ReactNode;
}) {
  const { opened, open } = useOpening();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const id = setTimeout(() => setGone(true), 1100);
    return () => clearTimeout(id);
  }, [opened]);

  if (gone) return null;

  return (
    <section className={s.cover} data-opened={opened} aria-hidden={opened}>
      {background}
      <div className={s.coverInner}>
        <div className={`${s.coverTop} ${s.rise}`}>{top}</div>
        <div className={`${s.coverCenter} ${s.rise}`}>{center}</div>
        <div className={`${s.coverBottom} ${s.rise}`}>
          <div className={s.guest}>
            <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className={s.guestName}>{guestName ?? "Tamu Undangan"}</p>
          </div>
          <button type="button" className={s.openButton} onClick={open} disabled={opened}>
            <IconEnvelope /> Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}

/** Tombol musik di pojok, muncul setelah undangan dibuka. */
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
