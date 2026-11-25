"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope, IconPause, IconPlay } from "@/components/invitation/icons";
import s from "./template.module.css";

/** Lama urutan buka di CSS: piringan keluar, berputar, lalu labelnya memenuhi layar. */
const OPEN_MS = 4000;

export function Cover({ foliage, sleeve, disc }: { foliage: ReactNode; sleeve: ReactNode; disc: ReactNode }) {
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
      {foliage}
      <div className={s.stage}>
        <div className={s.record}>{disc}</div>
        <div className={s.sleeve}>{sleeve}</div>
      </div>
      <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka undangan
      </button>
    </section>
  );
}

/**
 * Pemutar di halaman depan. Piringan bisa diputar tamu dengan menggeser ke samping,
 * dan tombolnya mengatur lagu kalau undangan punya musik.
 */
export function Turntable({ disc, arm }: { disc: ReactNode; arm: ReactNode }) {
  const { playing, toggleMusic, hasMusic, opened } = useOpening();
  const el = useRef<HTMLDivElement>(null);
  const turn = useRef({ angle: 0, speed: 0, last: 0, raf: 0 });

  useEffect(() => {
    const t = turn.current;
    return () => cancelAnimationFrame(t.raf);
  }, []);

  function paint() {
    if (el.current) el.current.style.transform = `rotate(${turn.current.angle}deg)`;
  }

  const angleAt = (e: PointerEvent) => {
    const r = el.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };

  function down(e: PointerEvent<HTMLDivElement>) {
    cancelAnimationFrame(turn.current.raf);
    turn.current.last = angleAt(e);
    turn.current.speed = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const a = angleAt(e);
    const delta = ((a - turn.current.last + 540) % 360) - 180;
    turn.current.last = a;
    turn.current.angle += delta;
    turn.current.speed = delta;
    paint();
  }

  function up() {
    const glide = () => {
      turn.current.speed *= 0.96;
      turn.current.angle += turn.current.speed;
      paint();
      if (Math.abs(turn.current.speed) > 0.05) turn.current.raf = requestAnimationFrame(glide);
    };
    turn.current.raf = requestAnimationFrame(glide);
  }

  return (
    <div className={s.turntable} data-playing={hasMusic ? playing : opened}>
      <div ref={el} className={s.platter} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {disc}
      </div>
      {arm}
      {hasMusic ? (
        <button type="button" className={s.playButton} onClick={toggleMusic}>
          {playing ? <IconPause /> : <IconPlay />} {playing ? "Jeda lagu" : "Putar lagu"}
        </button>
      ) : null}
    </div>
  );
}
