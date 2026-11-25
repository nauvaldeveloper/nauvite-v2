import type { CSSProperties } from "react";
import s from "./template.module.css";

/** Ilustrasi gaya cukil/ukiran: garis tinta, arsiran, satu warna cetak. Semua SVG. */

const n = (v: number) => Number(v.toFixed(2));
const range = (c: number) => Array.from({ length: c }, (_, i) => i);
const delay = (d: number) => ({ "--d": `${n(d)}s` }) as CSSProperties;

type Pt = [number, number];
type Curve = [Pt, Pt, Pt, Pt];

function onCurve(p: Curve, t: number) {
  const u = 1 - t;
  const at = (k: 0 | 1) => u ** 3 * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t ** 3 * p[3][k];
  const d = (k: 0 | 1) => 3 * u * u * (p[1][k] - p[0][k]) + 6 * u * t * (p[2][k] - p[1][k]) + 3 * t * t * (p[3][k] - p[2][k]);
  return { x: at(0), y: at(1), angle: (Math.atan2(d(1), d(0)) * 180) / Math.PI + 90 };
}

/** Daun: separuh polos, separuh diarsir. */
function Leaf() {
  return (
    <g strokeLinecap="round">
      <path d="M0 0C13-10 15-32 0-52C-15-32-13-10 0 0Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="M0 0C13-10 15-32 0-52Z" fill="var(--ink)" opacity=".1" />
      <g stroke="var(--ink)" strokeWidth=".9">
        <path d="M0 0V-48" />
        {range(7).map((i) => (
          <path key={i} d={`M0 ${-6 - i * 5.6}L${n(9.6 - Math.abs(i - 2.6) * 1.5)} ${n(-11.5 - i * 5.6)}`} />
        ))}
      </g>
    </g>
  );
}

type Kind = "mawar" | "aster" | "kuncup";

function Flower({ kind }: { kind: Kind }) {
  if (kind === "aster") {
    return (
      <g stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round">
        {range(12).map((i) => (
          <g key={i} transform={`rotate(${i * 30})`}>
            <path d="M0-6C-7-14-7-28 0-34C7-28 7-14 0-6Z" fill="var(--paper)" />
            <path d="M0-11V-22M2.5-12V-18" strokeWidth=".8" />
          </g>
        ))}
        <circle r="9" fill="var(--spot)" />
        {range(8).map((i) => (
          <circle key={i} cx={n(Math.cos((i * Math.PI) / 4) * 5)} cy={n(Math.sin((i * Math.PI) / 4) * 5)} r="1" fill="var(--ink)" stroke="none" />
        ))}
      </g>
    );
  }
  if (kind === "kuncup") {
    return (
      <g stroke="var(--ink)" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M0 6C-15 0-15-20 0-32C15-20 15 0 0 6Z" fill="var(--spot)" />
        <path d="M0-30C-5-18-5-6 0 4M4-25C9-16 9-6 4 3" fill="none" strokeWidth=".9" />
        <path d="M-12-4C-8 4-4 8 0 8C4 8 8 4 12-4C6 0-6 0-12-4Z" fill="var(--paper)" />
      </g>
    );
  }
  const ring = (count: number, r: number, k: number, turn: number, fill: string) =>
    range(count).map((i) => (
      <g key={`${r}-${i}`} transform={`rotate(${n((360 / count) * i + turn)}) translate(0 ${-r}) scale(${k})`}>
        <path d="M0 14C-20 10-24-12-10-19C0-24 18-20 20-6C21 4 12 12 0 14Z" fill={fill} stroke="var(--ink)" strokeWidth={n(1.4 / k)} />
        <path d="M-12-10C-6-16 6-17 12-11M-13-4C-7-10 8-11 14-5M-11 2C-5-3 6-4 11 0" fill="none" stroke="var(--ink)" strokeWidth={n(0.8 / k)} strokeLinecap="round" />
      </g>
    ));
  return (
    <g>
      {ring(7, 24, 0.95, 0, "var(--spot)")}
      {ring(5, 14, 0.8, 24, "var(--spot-2)")}
      {ring(3, 6, 0.6, 50, "var(--spot)")}
      <path d="M-5 2C-6-5 3-7 5-1C6 4-1 6-2 2" fill="none" stroke="var(--ink)" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function Grown({ at, kind, d }: { at: string; kind: Kind; d: number }) {
  return (
    <g transform={at}>
      <g className={s.grow} style={delay(d)}>
        <Flower kind={kind} />
      </g>
    </g>
  );
}

function Branch({ curve, leaves = 8, size = 1, tip, d0 = 0 }: { curve: Curve; leaves?: number; size?: number; tip?: Kind; d0?: number }) {
  const [a, b, c, e] = curve;
  return (
    <g>
      <path className={s.stem} style={delay(d0)} pathLength={1} d={`M${a}C${b} ${c} ${e}`} fill="none" stroke="var(--ink)" strokeWidth={n(2.2 * size)} strokeLinecap="round" />
      {range(leaves).map((i) => {
        const t = 0.14 + (0.8 * i) / Math.max(1, leaves - 1);
        const p = onCurve(curve, t);
        return (
          <g key={i} transform={`translate(${n(p.x)} ${n(p.y)}) rotate(${n(p.angle + (i % 2 ? 50 : -50))}) scale(${n(size * (1 - t * 0.35))})`}>
            <g className={s.grow} style={delay(d0 + 0.25 + t)}>
              <Leaf />
            </g>
          </g>
        );
      })}
      {tip ? <Grown at={`translate(${n(e[0])} ${n(e[1])}) scale(${n(size * 0.75)})`} kind={tip} d={d0 + 1.2} /> : null}
    </g>
  );
}

/** Gambar berita utama: rangkaian bunga besar dengan inisial di plakat. */
export function Feature({ left, right }: { left: string; right: string }) {
  return (
    <svg className={s.feature} viewBox="0 0 400 300" aria-hidden="true">
      <Halftone id="raster-utama" />
      <rect width="400" height="300" fill="url(#raster-utama)" />
      {[false, true].map((flip) => (
        <g key={String(flip)} transform={flip ? "translate(400 0) scale(-1 1)" : undefined}>
          <Branch curve={[[200, 250], [120, 240], [60, 190], [34, 60]]} leaves={11} size={1.05} tip="kuncup" />
          <Branch curve={[[200, 262], [130, 290], [60, 270], [18, 214]]} leaves={7} size={0.9} tip="aster" d0={0.2} />
          <Branch curve={[[190, 60], [150, 20], [110, 20], [76, 34]]} leaves={5} size={0.7} tip="kuncup" d0={0.4} />
          <Grown at="translate(84 204) scale(.95)" kind="aster" d={0.9} />
          <Grown at="translate(120 246) scale(.9)" kind="mawar" d={0.8} />
          <Grown at="translate(54 140) scale(.62)" kind="mawar" d={1.1} />
        </g>
      ))}
      <g stroke="var(--ink)">
        <ellipse cx="200" cy="136" rx="92" ry="104" fill="var(--paper)" strokeWidth="2.5" />
        <ellipse cx="200" cy="136" rx="84" ry="96" fill="none" strokeWidth="1" />
      </g>
      <text x="162" y="142" textAnchor="middle" className={s.monogram}>{left}</text>
      <text x="238" y="186" textAnchor="middle" className={s.monogram}>{right}</text>
      <text x="201" y="160" textAnchor="middle" className={s.monogramAnd}>&amp;</text>
      <Grown at="translate(200 250) scale(1.2)" kind="mawar" d={0.6} />
      <Grown at="translate(156 262) scale(.66)" kind="aster" d={0.95} />
      <Grown at="translate(244 262) scale(.66)" kind="aster" d={1} />
      <Grown at="translate(200 36) scale(.6)" kind="mawar" d={1.2} />
    </svg>
  );
}

/** Titik raster cetak koran. */
function Halftone({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <circle cx="3.5" cy="3.5" r="1.5" fill="var(--spot)" opacity=".28" />
      </pattern>
    </defs>
  );
}

/** Potret lonjong berinisial untuk kolom profil. */
export function Cameo({ letter, flip }: { letter: string; flip?: boolean }) {
  const pid = flip ? "raster-b" : "raster-a";
  return (
    <svg className={s.cameo} viewBox="0 0 160 200" aria-hidden="true">
      <Halftone id={pid} />
      <ellipse cx="80" cy="92" rx="66" ry="82" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.2" />
      <ellipse cx="80" cy="92" rx="59" ry="75" fill={`url(#${pid})`} stroke="var(--ink)" strokeWidth=".9" />
      <text x="80" y="124" textAnchor="middle" className={s.cameoLetter}>{letter}</text>
      <g transform={flip ? "translate(160 0) scale(-1 1)" : undefined}>
        <Branch curve={[[84, 186], [40, 190], [10, 150], [10, 84]]} leaves={7} size={0.66} tip="kuncup" />
        <Branch curve={[[84, 186], [120, 190], [142, 170], [150, 136]]} leaves={5} size={0.56} tip="aster" d0={0.2} />
        <Grown at="translate(66 184) scale(.62)" kind="mawar" d={0.6} />
        <Grown at="translate(104 188) scale(.46)" kind="aster" d={0.8} />
      </g>
    </svg>
  );
}

/** Hiasan kepala agenda, tiap acara beda susunan. */
export function AgendaArt({ index }: { index: number }) {
  const kind = (["mawar", "aster", "kuncup"] as const)[index % 3];
  return (
    <svg className={s.agendaArt} viewBox="0 0 400 110" aria-hidden="true">
      {[false, true].map((flip) => (
        <g key={String(flip)} transform={flip ? "translate(400 0) scale(-1 1)" : undefined}>
          <Branch curve={[[200, 66], [140, 92], [80, 80], [26, 34]]} leaves={9} size={0.78} tip="kuncup" />
          <Branch curve={[[190, 60], [150, 34], [116, 30], [84, 34]]} leaves={5} size={0.56} tip="aster" d0={0.25} />
        </g>
      ))}
      <Grown at="translate(200 60) scale(1)" kind={kind === "kuncup" ? "aster" : kind} d={0.5} />
      <Grown at="translate(152 70) scale(.6)" kind={kind === "mawar" ? "aster" : "mawar"} d={0.7} />
      <Grown at="translate(248 70) scale(.6)" kind={kind === "mawar" ? "aster" : "mawar"} d={0.8} />
    </svg>
  );
}

/** Ranting senada di latar sampul. */
export function CoverBranch({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 300 420" aria-hidden="true">
      <Branch curve={[[20, 430], [40, 300], [150, 250], [140, 60]]} leaves={12} size={1.6} tip="kuncup" />
      <Branch curve={[[-10, 430], [110, 400], [180, 320], [262, 250]]} leaves={8} size={1.4} tip="aster" d0={0.2} />
      <Grown at="translate(84 296) scale(1.3)" kind="mawar" d={0.9} />
    </svg>
  );
}

export function Ornament() {
  return (
    <svg className={s.ornament} viewBox="0 0 120 24" aria-hidden="true">
      <path d="M2 12H46M74 12H118" stroke="var(--ink)" strokeWidth="1" />
      <g transform="translate(60 12) scale(.32)">
        <Flower kind="aster" />
      </g>
    </svg>
  );
}
