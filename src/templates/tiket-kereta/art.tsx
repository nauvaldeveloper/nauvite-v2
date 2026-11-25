import type { CSSProperties } from "react";
import s from "./template.module.css";

/** Cetakan karcis: pola pengaman, kode batang, kereta garis, dan denah kursi. Semua dari kode. */

const n = (v: number) => Number(v.toFixed(1));
const range = (c: number) => Array.from({ length: c }, (_, i) => i);

function hash(text: string) {
  let h = 2166136261;
  for (const c of text.trim().toLowerCase()) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h ^= h >>> 15;
  h = Math.imul(h, 2246822519);
  return (h ^ (h >>> 13)) >>> 0;
}

/** Nomor karcis enam angka dari sebuah teks. */
export const ticketNo = (text: string) => String(100000 + (hash(text) % 900000));

/** Pola garis pengaman seperti pada karcis cetak. */
export function Guilloche() {
  return (
    <svg className={s.guilloche} viewBox="0 0 320 400" preserveAspectRatio="none" aria-hidden="true">
      {range(26).map((i) => {
        const pts = range(41).map((k) => {
          const x = k * 8;
          return `${x} ${n(i * 16 + 12 * Math.sin(x / 26 + i * 0.42) + 7 * Math.sin(x / 11 - i * 0.3))}`;
        });
        return <path key={i} d={`M${pts.join("L")}`} fill="none" stroke="currentColor" strokeWidth=".7" />;
      })}
    </svg>
  );
}

export function Barcode({ text, className }: { text: string; className?: string }) {
  let h = hash(text) || 1;
  let x = 0;
  const bars: [number, number][] = [];
  while (x < 196) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    const w = 1 + ((h >>> 12) % 4);
    bars.push([x, w]);
    x += w + 1 + ((h >>> 20) % 3);
  }
  return (
    <svg className={className} viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
      {bars.map(([bx, w]) => (
        <rect key={bx} x={bx} width={w} height="40" fill="currentColor" />
      ))}
    </svg>
  );
}

export const HEART =
  "M0 10C-4 6-12 1-12-5C-12-9-9-12-5.8-12C-3-12-1-10.4 0-8C1-10.4 3-12 5.8-12C9-12 12-9 12-5C12 1 4 6 0 10Z";

function Wheel({ x, y, r, spokes = 8 }: { x: number; y: number; r: number; spokes?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={s.wheel}>
        <circle r={r} fill="var(--train)" strokeWidth="2" />
        <circle r={r - 3} fill="none" strokeWidth=".8" />
        {range(spokes).map((i) => {
          const a = (i / spokes) * Math.PI * 2;
          return <path key={i} d={`M0 0L${n(Math.cos(a) * (r - 3))} ${n(Math.sin(a) * (r - 3))}`} strokeWidth="1" />;
        })}
        {r > 13 ? (
          <path d={`M${n(-r * 0.72)} ${n(-r * 0.45)}A${n(r * 0.85)} ${n(r * 0.85)} 0 0 1 ${n(r * 0.72)} ${n(-r * 0.45)}Z`} fill="currentColor" />
        ) : null}
        <circle r={Math.max(2, r * 0.2)} fill="currentColor" />
      </g>
    </g>
  );
}

/** Batang penggerak yang ikut mengitari poros roda tanpa memutar dirinya sendiri. */
function Rod({ x, y, r, length }: { x: number; y: number; r: number; length: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={s.wheel}>
        <g transform={`translate(0 ${r})`}>
          <g className={s.unwheel}>
            <rect x="-4" y="-2.6" width={length + 8} height="5.2" rx="2.6" fill="var(--train)" strokeWidth="1.3" />
            {[0, 0.5, 1].map((t) => (
              <circle key={t} cx={length * t} r="1.5" fill="currentColor" />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
}

function Coach({ x, name }: { x: number; name: string }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M-2 38C2 29 10 26 22 26H146C158 26 166 29 170 38Z" fill="currentColor" fillOpacity=".86" />
      {range(4).map((i) => (
        <path key={i} d={`M${32 + i * 34} 26v-4h12v4`} fill="var(--train)" strokeWidth="1" />
      ))}
      <rect x="0" y="38" width="168" height="57" fill="var(--coach)" />
      <path d="M0 43H168M0 72H168M0 90H168" strokeWidth=".8" />
      {range(7).map((i) => (
        <g key={i} transform={`translate(${n(21.5 + i * 18.4)} 47)`}>
          <rect width="14" height="20" rx="3" fill="var(--train)" strokeWidth="1.1" />
          <path d="M0 7H14M2.5 17.5L8 10M6 18L11.5 10.5" strokeWidth=".7" />
        </g>
      ))}
      {[4, 153].map((dx) => (
        <g key={dx}>
          <rect x={dx} y="45" width="11" height="46" fill="var(--train)" strokeWidth="1" />
          <rect x={dx + 2.5} y="49" width="6" height="14" strokeWidth=".8" fill="none" />
          <circle cx={dx + 8.5} cy="72" r="1" fill="currentColor" />
        </g>
      ))}
      <text x="84" y="85.6" textAnchor="middle" className={s.coachName} textLength={name.length > 16 ? 128 : undefined} lengthAdjust="spacingAndGlyphs">
        {name}
      </text>
      <path d="M0 95H168L160 101H8ZM62 101L70 108H98L106 101" fill="var(--train)" strokeWidth="1.1" />
      {[18, 44, 124, 150].map((wx) => (
        <Wheel key={wx} x={wx} y={108} r={10} spokes={6} />
      ))}
      <path d="M10 99H52L48 105H14ZM116 99H158L154 105H120Z" fill="var(--train)" strokeWidth="1" />
      <path d="M168 99H180" strokeWidth="3" />
    </g>
  );
}

/** Lokomotif uap dengan dua gerbong bernama pasangan. `run` = roda terus berputar. */
export function Train({ first, second, run, className }: { first: string; second: string; run?: boolean; className?: string }) {
  return (
    <svg className={`${s.train} ${className ?? ""}`} data-run={run ? "true" : undefined} viewBox="0 0 620 128" aria-hidden="true">
      <g className={s.sleepers} fill="currentColor">
        {range(44).map((i) => (
          <rect key={i} x={i * 16 - 32} y="122" width="9" height="4" opacity=".75" />
        ))}
      </g>
      <path d="M-20 119.6H640" stroke="currentColor" strokeWidth="2.6" />
      <g className={s.trainBody} stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
        <Coach x={6} name={first} />
        <Coach x={186} name={second} />
        {/* Gerbong bahan bakar */}
        <path d="M366 52C370 44 378 45 384 47C390 41 398 43 404 46C410 42 418 44 422 52Z" fill="currentColor" />
        <path d="M364 52H424V96H364Z" fill="var(--coach)" />
        <path d="M364 57H424M364 90H424M369 61H419V86H369Z" fill="none" strokeWidth=".8" />
        {range(10).map((i) => (
          <path key={i} d={`M${371 + i * 5} 85v-23`} strokeWidth=".4" />
        ))}
        {[376, 412].map((x) => (
          <Wheel key={x} x={x} y={108} r={10} spokes={6} />
        ))}
        <path d="M362 98H426" strokeWidth="4" />
        {/* Kabin */}
        <path d="M430 40H474V98H430Z" fill="var(--coach)" />
        <path d="M424 40C430 34 440 31 452 31C464 31 474 34 480 40Z" fill="currentColor" />
        <rect x="436" y="46" width="14" height="20" rx="2" fill="var(--train)" strokeWidth="1" />
        <rect x="455" y="46" width="14" height="20" rx="2" fill="var(--train)" strokeWidth="1" />
        <path d="M434 71H470M434 92H470" strokeWidth=".8" />
        <circle cx="452" cy="81" r="7" fill="var(--train)" strokeWidth="1" />
        <path transform="translate(452 81.5) scale(.36)" d={HEART} fill="currentColor" />
        {/* Ketel */}
        <path d="M474 49H566C571 49 573 53 573 67C573 82 571 86 566 86H474Z" fill="var(--coach)" />
        {range(9).map((i) => (
          <path key={i} d={`M476 ${77 + i}H${n(571 - i * 0.4)}`} strokeWidth=".55" opacity=".8" />
        ))}
        <path d="M478 53H564" strokeWidth=".7" />
        {[494, 520, 546].map((x) => (
          <path key={x} d={`M${x} 49V86M${x + 4} 49V86`} strokeWidth="1" />
        ))}
        <path d="M486 62H560" strokeWidth="1.6" />
        {/* Kubah, peluit, cerobong, lampu */}
        <path d="M499 49C499 38 503 35 509 35C515 35 519 38 519 49Z" fill="var(--coach)" />
        <path d="M497 49H521M501 41H517" strokeWidth="1" />
        <path d="M529 49V43H539V49M534 43C529 43 530 36 534 35C538 36 539 43 534 43Z" fill="var(--train)" strokeWidth="1" />
        <path d="M552 49L550 25H566L564 49Z" fill="currentColor" />
        <path d="M546 19H570L567 25H549Z" fill="var(--coach)" />
        <path d="M573 58H580L584 54V70L580 66H573Z" fill="var(--train)" strokeWidth="1.2" />
        {/* Rangka, silinder, penghalau */}
        <path d="M428 92H592V97H428Z" fill="currentColor" />
        <path d="M562 86H590V92H562Z" fill="var(--coach)" strokeWidth="1" />
        <rect x="548" y="96" width="30" height="15" rx="3" fill="var(--coach)" />
        {range(6).map((i) => (
          <path key={i} d={`M${n(552 + i * 4.4)} 98v11`} strokeWidth=".5" />
        ))}
        <path d="M590 97L608 117H582L584 97Z" fill="var(--train)" strokeWidth="1.2" />
        <path d="M588 99L584 116M591 101L590 116M595 105L596 116M600 110L602 116" strokeWidth=".8" />
        {[448, 484, 520].map((x) => (
          <Wheel key={x} x={x} y={102} r={16.5} spokes={12} />
        ))}
        <Wheel x={564} y={110} r={8.5} spokes={6} />
        <Rod x={448} y={102} r={8} length={72} />
        {range(4).map((i) => (
          <g key={i} transform="translate(558 14)">
            <path
              className={s.smoke}
              style={{ "--i": i } as CSSProperties}
              d="M0 0C-7-1-9-9-3-11C-3-17 6-18 8-13C14-14 16-6 11-4C10 1 4 2 0 0ZM-2-6C1-9 4-8 5-5M5-10C8-10 9-8 8-6"
              fill="var(--train)"
              strokeWidth="1"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

const ROWS = 10;
const LETTERS = ["A", "B", "C", "D"];

export function seatOf(name: string) {
  const h = hash(name);
  const row = (h % ROWS) + 1;
  const col = (h >>> 8) % 4;
  return { coach: ((h >>> 16) % 6) + 1, row, col, label: `${row}${LETTERS[col]}` };
}

/** Denah gerbong dari atas, kursi tamu terisi. */
export function SeatMap({ row, col }: { row: number; col: number }) {
  return (
    <svg className={s.seatMap} viewBox="0 0 372 138" aria-hidden="true">
      <path d="M14 3H358Q369 3 369 16V122Q369 135 358 135H14Q3 135 3 122V16Q3 3 14 3Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 58H10M3 80H10M362 58H369M362 80H369" stroke="currentColor" strokeWidth="2" />
      {range(ROWS).map((r) =>
        LETTERS.map((l, c) => {
          const on = r + 1 === row && c === col;
          return (
            <g key={`${r}${l}`} transform={`translate(${29 + r * 34.5} ${24 + c * 24 + (c > 1 ? 18 : 0)})`}>
              <g className={on ? s.seatOn : s.seat} style={{ "--d": `${(r * 0.05 + c * 0.04).toFixed(2)}s` } as CSSProperties}>
                <rect x="-11" y="-9" width="22" height="18" rx="4" />
                <path d="M-7-9V9" />
                {on ? <path transform="translate(2 0) scale(.5)" d={HEART} className={s.seatHeart} /> : null}
              </g>
            </g>
          );
        }),
      )}
    </svg>
  );
}

/** Tang pelubang kondektur. Rahang belakang dan depan dipisah supaya karcis terjepit di antaranya. */
export function Punch({ side }: { side: "back" | "front" }) {
  const steel = `url(#tk-steel-${side})`;
  return (
    <svg className={s.punchSvg} viewBox="0 0 270 170" aria-hidden="true">
      <defs>
        <linearGradient id={`tk-steel-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6e8ea" />
          <stop offset=".45" stopColor="#a5abb2" />
          <stop offset="1" stopColor="#5b626b" />
        </linearGradient>
      </defs>
      {side === "back" ? (
        <g className={s.jawBack}>
          <path d="M14 92H62C80 92 92 88 108 80L128 74C160 62 206 40 252 30C262 28 268 38 260 44C216 60 176 84 138 100C116 110 92 114 66 114H20C12 114 8 92 14 92Z" fill={steel} stroke="#3b4148" strokeWidth="1.5" />
        </g>
      ) : (
        <>
          <g className={s.jawFront}>
            <path d="M12 46H52C76 46 92 56 112 70L136 82C170 102 210 122 254 132C264 135 268 146 257 148C212 146 164 124 128 102C104 90 84 76 56 74H40V84H18V74H12C6 74 6 46 12 46Z" fill={steel} stroke="#3b4148" strokeWidth="1.5" />
            <path d="M20 52H50C74 52 92 64 112 77" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
            <path d="M172 104C196 117 224 128 250 137" fill="none" stroke="#3b4148" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
          </g>
          <circle cx="122" cy="86" r="11" fill="#c9ced3" stroke="#3b4148" strokeWidth="1.5" />
          <path d="M115 86H129" stroke="#3b4148" strokeWidth="2.5" />
        </>
      )}
    </svg>
  );
}
