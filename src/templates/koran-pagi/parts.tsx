"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import { IconEnvelope } from "@/components/invitation/icons";
import type { Puzzle } from "./crossword";
import s from "./template.module.css";

/** Lama urutan buka di CSS: pita sobek, koran dibentangkan, lalu mendekat. */
const OPEN_MS = 4000;

export function Cover({
  foliage,
  top,
  bottom,
  band,
}: {
  foliage: ReactNode;
  top: ReactNode;
  bottom: ReactNode;
  band: ReactNode;
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
      {foliage}
      <div className={s.stage}>
        <div className={s.newspaper}>
          <div className={s.lower}>
            <div className={s.lowerFront}>{bottom}</div>
            <div className={s.lowerBack} />
          </div>
          <div className={s.edges} aria-hidden="true" />
          <div className={s.upper}>{top}</div>
          <div className={`${s.band} ${s.bandLeft}`}>{band}</div>
          <div className={`${s.band} ${s.bandRight}`} aria-hidden="true">
            {band}
          </div>
        </div>
      </div>
      <button type="button" className={s.coverButton} onClick={open} disabled={opened}>
        <IconEnvelope /> Buka undangan
      </button>
    </section>
  );
}

/** Teka-teki silang yang bisa diisi tamu. Huruf benar ikut berwarna. */
export function Crossword({ puzzle }: { puzzle: Puzzle }) {
  const cells = new Map<string, { answer: string; no?: number }>();
  for (const w of puzzle.words) {
    [...w.word].forEach((ch, i) => {
      const key = `${w.x + (w.down ? 0 : i)},${w.y + (w.down ? i : 0)}`;
      const old = cells.get(key);
      cells.set(key, { answer: ch, no: i === 0 ? w.no : old?.no });
    });
  }
  const [fill, setFill] = useState<Record<string, string>>({});
  const grid = useRef<HTMLDivElement>(null);
  /** Arah mengetik terakhir, supaya kursor pindah ke kotak berikutnya. */
  const down = useRef(false);

  const done = [...cells].every(([k, c]) => fill[k] === c.answer);

  function focus(x: number, y: number) {
    grid.current?.querySelector<HTMLInputElement>(`[data-cell="${x},${y}"]`)?.focus();
  }

  function type(x: number, y: number, raw: string) {
    const ch = raw.replace(/[^a-z]/gi, "").slice(-1).toUpperCase();
    setFill((f) => ({ ...f, [`${x},${y}`]: ch }));
    if (!ch) return;
    const next = (d: boolean): [number, number] => (d ? [x, y + 1] : [x + 1, y]);
    for (const d of [down.current, !down.current]) {
      const [nx, ny] = next(d);
      if (cells.has(`${nx},${ny}`)) {
        down.current = d;
        focus(nx, ny);
        return;
      }
    }
  }

  function reveal() {
    const order = [...cells];
    order.forEach(([k, c], i) => setTimeout(() => setFill((f) => ({ ...f, [k]: c.answer })), i * 60));
  }

  return (
    <div>
      <div
        ref={grid}
        className={s.grid}
        style={{ gridTemplateColumns: `repeat(${puzzle.width}, 1fr)`, maxWidth: puzzle.width * 44 }}
      >
        {Array.from({ length: puzzle.width * puzzle.height }, (_, i) => {
          const x = i % puzzle.width;
          const y = Math.floor(i / puzzle.width);
          const key = `${x},${y}`;
          const c = cells.get(key);
          if (!c) return <span key={key} />;
          const v = fill[key] ?? "";
          return (
            <label key={key} className={s.cell} data-state={v ? (v === c.answer ? "benar" : "salah") : "kosong"}>
              {c.no ? <small>{c.no}</small> : null}
              <input
                data-cell={key}
                value={v}
                onChange={(e) => type(x, y, e.target.value)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  const move = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key];
                  if (!move) return;
                  e.preventDefault();
                  down.current = move[1] !== 0;
                  focus(x + move[0], y + move[1]);
                }}
                aria-label={`Baris ${y + 1} kolom ${x + 1}`}
                autoComplete="off"
                autoCapitalize="characters"
                enterKeyHint="next"
                spellCheck={false}
              />
            </label>
          );
        })}
      </div>
      <div className={s.clues}>
        {[false, true].map((d) => {
          const list = puzzle.words.filter((w) => w.down === d);
          return list.length ? (
            <div key={String(d)}>
              <h3>{d ? "Menurun" : "Mendatar"}</h3>
              <ul>
                {list.map((w) => (
                  <li key={w.word}>
                    <b>{w.no}</b> {w.clue} ({w.word.length} huruf)
                  </li>
                ))}
              </ul>
            </div>
          ) : null;
        })}
      </div>
      {done ? (
        <p className={s.solved} role="status">
          Betul semua! Sampai bertemu di hari pernikahan.
        </p>
      ) : (
        <button type="button" className={s.ghost} onClick={reveal}>
          Lihat jawaban
        </button>
      )}
    </div>
  );
}
