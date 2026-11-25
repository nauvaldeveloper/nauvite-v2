import type { CSSProperties } from "react";
import s from "./template.module.css";

/** Gambar tema Piringan Hitam: piringan, bunga gemuk 70-an, kaset. Semua SVG. */

const range = (c: number) => Array.from({ length: c }, (_, i) => i);
const n = (v: number) => Number(v.toFixed(2));
const delay = (d: number) => ({ "--d": `${n(d)}s` }) as CSSProperties;
const PETAL = "M0 0C-30-12-36-56-14-72C-5-78 5-78 14-72C36-56 30-12 0 0Z";

function Ring({ count, r, k, color, turn = 0, d = 0 }: { count: number; r: number; k: number; color: string; turn?: number; d?: number }) {
  return (
    <g>
      {range(count).map((i) => (
        <g key={i} transform={`rotate(${n((360 / count) * i + turn)}) translate(0 ${-r}) scale(${k})`}>
          <path className={s.petal} style={delay(d + i * 0.04)} d={PETAL} fill={color} />
        </g>
      ))}
    </g>
  );
}

/** Piringan: alur, label berwarna, teks melingkar. Radius 100. */
function Vinyl({ id, ring, center, small }: { id: string; ring?: string; center?: string; small?: string }) {
  return (
    <g>
      <circle r="100" fill="var(--vinyl)" />
      <g fill="none" stroke="#fff">
        {range(13).map((i) => (
          <circle key={i} r={46 + i * 4} strokeOpacity={i % 4 === 0 ? 0.16 : 0.07} strokeWidth=".8" />
        ))}
      </g>
      <path d="M0 0L-38-92A100 100 0 0 1 8-99Z" fill="#fff" opacity=".09" />
      <path d="M0 0L38 92A100 100 0 0 1-8 99Z" fill="#fff" opacity=".07" />
      <circle r="38" fill="var(--label)" />
      <circle r="35" fill="none" stroke="var(--on-label)" strokeOpacity=".45" strokeWidth=".7" />
      <defs>
        <path id={id} d="M-29.5 0a29.5 29.5 0 1 1 59 0a29.5 29.5 0 1 1-59 0" />
      </defs>
      <g fill="var(--on-label)" textAnchor="middle">
        {ring ? (
          <text className={s.discRing}>
            <textPath href={`#${id}`} startOffset="25%">
              {ring}
            </textPath>
          </text>
        ) : null}
        {center ? (
          <text y="-7" className={s.discCenter}>
            {center}
          </text>
        ) : null}
        {small ? (
          <text y="20" className={s.discSmall}>
            {small}
          </text>
        ) : null}
      </g>
      {center?.length === 1 ? null : <circle className={s.hole} r="3.4" fill="var(--bg)" />}
    </g>
  );
}

/** Piringan yang dikelilingi kelopak. */
export function BloomDisc({
  id,
  ring,
  center,
  small,
  petals = 12,
}: {
  id: string;
  ring?: string;
  center?: string;
  small?: string;
  petals?: number;
}) {
  return (
    <svg className={s.disc} viewBox="-190 -190 380 380" aria-hidden="true">
      <Ring count={petals} r={84} k={1.28} color="var(--f1)" d={0.25} />
      <Ring count={petals} r={80} k={0.98} color="var(--f2)" turn={180 / petals} d={0.1} />
      <Ring count={petals} r={78} k={0.6} color="var(--f3)" />
      <g className={s.spin}>
        <Vinyl id={id} ring={ring} center={center} small={small} />
      </g>
    </svg>
  );
}

/** Piringan polos untuk sampul dan kartu acara. */
export function PlainDisc({ id, ring, center, small, className }: { id: string; ring?: string; center?: string; small?: string; className?: string }) {
  return (
    <svg className={className} viewBox="-101 -101 202 202" aria-hidden="true">
      <Vinyl id={id} ring={ring} center={center} small={small} />
    </svg>
  );
}

export function Flower({ kind = 0, d = 0 }: { kind?: number; d?: number }) {
  const a = kind % 2 ? "var(--f2)" : "var(--f1)";
  const b = kind % 2 ? "var(--f3)" : "var(--f2)";
  return (
    <g>
      <Ring count={8} r={10} k={1} color={a} d={d} />
      <Ring count={8} r={8} k={0.62} color={b} turn={22.5} d={d + 0.15} />
      <circle r="17" fill="var(--core)" />
      <circle r="8" fill="var(--f1)" opacity=".55" />
    </g>
  );
}

/** Tangkai melengkung dengan daun gemuk dan bunga di ujung. */
function Stem({ d, leaves, flower, k, delayBy = 0, kind = 0 }: { d: string; leaves: [number, number, number][]; flower: [number, number]; k: number; delayBy?: number; kind?: number }) {
  return (
    <g>
      <path className={s.stem} style={delay(delayBy)} pathLength={1} d={d} fill="none" stroke="var(--leaf)" strokeWidth="9" strokeLinecap="round" />
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path
            className={s.petal}
            style={delay(delayBy + 0.4 + i * 0.12)}
            d="M0 0C-30-18-30-62 0-92C30-62 30-18 0 0Z"
            fill={i % 2 ? "var(--leaf)" : "var(--leaf-2)"}
          />
        </g>
      ))}
      <g transform={`translate(${flower[0]} ${flower[1]}) scale(${k})`}>
        <Flower d={delayBy + 0.7} kind={kind} />
      </g>
    </g>
  );
}

/** Rumpun bunga di sudut layar. */
export function Garden({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 340 380" aria-hidden="true">
      <Stem d="M70 400C60 300 110 220 90 110" leaves={[[80, 330, -62], [88, 280, 58], [96, 220, -55]]} flower={[90, 100]} k={0.92} />
      <Stem d="M110 400C150 340 220 320 236 240" leaves={[[150, 352, 72], [206, 314, -18]]} flower={[238, 230]} k={0.74} delayBy={0.2} kind={1} />
      <Stem d="M40 400C20 350 30 300 12 250" leaves={[[28, 350, 50]]} flower={[14, 238]} k={0.6} delayBy={0.35} kind={1} />
    </svg>
  );
}

/** Pita bunga pembatas antarbagian. */
export function Band() {
  return (
    <svg className={s.band} viewBox="0 0 600 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {range(9).map((i) => (
        <g key={i} transform={`translate(${12 + i * 72} ${i % 2 ? 52 : 40}) scale(.46)`}>
          <Flower kind={i} d={i * 0.08} />
        </g>
      ))}
    </svg>
  );
}

/** Dua roda kaset yang berputar. */
export function Reels() {
  return (
    <svg className={s.reels} viewBox="0 0 220 70" aria-hidden="true">
      <rect x="1.5" y="1.5" width="217" height="67" rx="33" fill="var(--vinyl)" />
      <rect x="78" y="17" width="64" height="36" rx="5" fill="var(--paper)" opacity=".16" />
      {[40, 180].map((x) => (
        <g key={x} transform={`translate(${x} 35)`}>
          <circle r="24" fill="var(--paper)" />
          <g className={s.spin}>
            {range(6).map((i) => (
              <rect key={i} x="-3" y="-21" width="6" height="9" rx="1.5" fill="var(--vinyl)" transform={`rotate(${i * 60})`} />
            ))}
          </g>
          <circle r="8" fill="var(--vinyl)" />
        </g>
      ))}
    </svg>
  );
}

/** Lengan pemutar. Sudutnya diatur CSS lewat data-playing di induk. */
export function Tonearm() {
  return (
    <svg className={s.tonearm} viewBox="0 0 120 220" aria-hidden="true">
      <circle cx="90" cy="30" r="24" fill="var(--ink)" />
      <circle cx="90" cy="30" r="11" fill="var(--paper)" />
      <path d="M90 30V120C90 146 70 150 52 176" fill="none" stroke="var(--paper)" strokeWidth="7" strokeLinecap="round" />
      <path d="M58 164L36 196L48 205L68 176Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}
