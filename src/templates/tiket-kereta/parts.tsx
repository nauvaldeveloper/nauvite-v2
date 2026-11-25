"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import { HEART, Punch } from "./art";
import s from "./template.module.css";

/** Lama urutan buka di CSS: karcis dilubangi, potongan disobek, masuk lewat lubang. */
const OPEN_MS = 3700;
/** Papan keberangkatan mulai berputar saat sampul hampir hilang. */
const BOARD_MS = 3000;

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Cover({ ticket, stub }: { ticket: ReactNode; stub: ReactNode }) {
  const { opened, open } = useOpening();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const id = setTimeout(() => setGone(true), reducedMotion() ? 400 : OPEN_MS);
    return () => clearTimeout(id);
  }, [opened]);

  if (gone) return null;

  return (
    <section className={s.cover} data-opened={opened} aria-hidden={opened}>
      <div className={s.coverStage}>
        <div className={s.punchBack}>
          <Punch side="back" />
        </div>
        <div className={s.coverTicket}>
          <div className={s.coverMain}>{ticket}</div>
          <div className={s.coverStub}>{stub}</div>
          <svg className={s.hole} viewBox="-13 -13 26 24" aria-hidden="true">
            <path d={HEART} />
          </svg>
        </div>
        <svg className={s.chad} viewBox="-13 -13 26 24" aria-hidden="true">
          <path d={HEART} />
        </svg>
        <div className={s.punchFront}>
          <Punch side="front" />
        </div>
      </div>
      <button type="button" className={`${s.button} ${s.coverButton}`} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka undangan
      </button>
    </section>
  );
}

const GLYPHS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const IDLE = -1;
const DONE = 9999;

/** Papan keberangkatan: huruf berputar lalu berhenti satu per satu. */
export function Board({ rows, cols }: { rows: { label: string; text: string }[]; cols: number }) {
  const { opened } = useOpening();
  const [tick, setTick] = useState(IDLE);
  const end = cols * 2 + rows.length * 7 + 12;

  useEffect(() => {
    if (!opened) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const reduced = reducedMotion();
    const start = setTimeout(
      () => {
        if (reduced) return setTick(DONE);
        id = setInterval(() => setTick((t) => (t < end ? t + 1 : DONE)), 65);
      },
      reduced ? 0 : BOARD_MS,
    );
    const stop = setTimeout(() => clearInterval(id), BOARD_MS + (end + 4) * 80);
    return () => {
      clearTimeout(start);
      clearTimeout(stop);
      clearInterval(id);
    };
  }, [opened, end]);

  return (
    <div className={s.boardRows} style={{ "--cols": cols } as CSSProperties}>
      {rows.map((row, r) => (
        <div key={r} className={s.boardRow}>
          <span className={s.boardLabel}>{row.label}</span>
          <span className={s.srOnly}>{row.text}</span>
          <span className={s.flaps} aria-hidden="true">
            {Array.from({ length: cols }, (_, i) => {
              const target = row.text[i] ?? " ";
              const stop = 8 + i * 2 + r * 7;
              // Sebelum dibuka teks tetap ada (untuk tanpa JavaScript), saat dibuka papan dikosongkan dulu.
              const moving = opened && tick !== IDLE && tick < stop;
              const char = moving
                ? GLYPHS[(tick * 7 + i * 11 + r * 5) % GLYPHS.length]
                : opened && tick === IDLE
                  ? " "
                  : target;
              return (
                <span key={i} className={s.flap}>
                  <span key={moving ? tick : "end"} className={moving ? s.flipping : undefined}>
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Peron: kereta baru masuk setelah undangan dibuka. */
export function Platform({ children }: { children: ReactNode }) {
  const { opened } = useOpening();
  return (
    <div className={s.platform} data-opened={opened}>
      {children}
    </div>
  );
}

/** Jalur rute: garis terisi dan kereta kecil maju mengikuti gulungan layar. */
export function Route({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.55 - box.top) / box.height));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const ask = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", ask);
      removeEventListener("resize", ask);
    };
  }, []);

  return (
    <div ref={ref} className={s.route}>
      <span className={s.routeLine} aria-hidden="true" />
      {children}
      <svg className={s.routeTrain} viewBox="0 0 24 34" aria-hidden="true">
        <path d="M4 1H20Q23 1 23 4V26Q23 33 12 33Q1 33 1 26V4Q1 1 4 1Z" fill="var(--accent)" stroke="var(--paper-2)" strokeWidth="2" />
        <path d="M5 20H19V25Q18 28 12 28Q6 28 5 25Z" fill="var(--ticket)" />
        <path d="M6 6H18M6 10H18M6 14H18" stroke="var(--on-accent)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
