import type { CSSProperties } from "react";
import s from "./template.module.css";

/**
 * Bunga kering. Setiap huruf menentukan jenis bunga, dan seluruh lekuknya dihitung
 * dari teks (selalu sama untuk teks yang sama), jadi tiap nama punya rangkaian sendiri.
 */

const n = (v: number) => Number(v.toFixed(1));
const range = (c: number) => Array.from({ length: Math.max(0, c) }, (_, i) => i);
const delay = (d: number) => ({ "--d": `${d.toFixed(2)}s` }) as CSSProperties;

type Rng = () => number;

/** Angka acak yang selalu sama untuk teks yang sama. */
function rngFrom(text: string): Rng {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

const SPECIES = ["melati", "aster", "lavender", "mawar", "pakis", "kamboja", "krisan", "lonceng"] as const;
type Species = (typeof SPECIES)[number];

const letters = (text: string) =>
  [...text.normalize("NFD").toLowerCase()].filter((c) => c >= "a" && c <= "z");

function speciesOf(letter: string): Species {
  return SPECIES[(letter.charCodeAt(0) - 97) % SPECIES.length];
}

/** Nama jenis bunga dalam rangkaian, tanpa pengulangan. */
export function speciesList(text: string, max: number): string[] {
  return [...new Set(letters(text).slice(0, max).map(speciesOf))];
}

const GREENS = ["#7f8b5d", "#667a55", "#93966a", "#57694c"];

const petal = (len: number, w: number) =>
  `M0 0C${n(-w)} ${n(-len * 0.25)} ${n(-w)} ${n(-len * 0.8)} 0 ${n(-len)}C${n(w)} ${n(-len * 0.8)} ${n(w)} ${n(-len * 0.25)} 0 0Z`;

function Petals({ r, count, len, w, fill, vein, spread = 0.12, turn = 0 }: { r: Rng; count: number; len: number; w: number; fill: string; vein: string; spread?: number; turn?: number }) {
  return (
    <>
      {range(count).map((i) => {
        const l = len * (1 - spread + r() * spread * 2);
        const a = (360 / count) * i + turn + (r() - 0.5) * 14;
        return (
          <g key={i} transform={`rotate(${n(a)})`}>
            <path d={petal(l, w * (0.85 + r() * 0.3))} fill={fill} fillOpacity=".86" stroke={vein} strokeOpacity=".55" strokeWidth=".7" />
            <path d={`M0-3L${n((r() - 0.5) * 2)} ${n(-l * 0.82)}M0-4L${n(-w * 0.4)} ${n(-l * 0.62)}M0-4L${n(w * 0.4)} ${n(-l * 0.62)}`} stroke={vein} strokeOpacity=".5" strokeWidth=".6" fill="none" />
          </g>
        );
      })}
    </>
  );
}

/** Kepala bunga di ujung tangkai, pusat 0,0, arah atas. */
function Head({ kind, r }: { kind: Species; r: Rng }) {
  switch (kind) {
    case "melati":
      return (
        <>
          <Petals r={r} count={6} len={24} w={8} fill="#f6efdb" vein="#b79f6c" />
          <circle r="4" fill="#c9a04c" />
        </>
      );
    case "kamboja":
      return (
        <>
          <Petals r={r} count={5} len={27} w={13} fill="#f0d3c0" vein="#b98468" />
          <Petals r={r} count={5} len={12} w={6} fill="#e0a95a" vein="#b27a34" turn={8} />
        </>
      );
    case "aster":
      return (
        <>
          <Petals r={r} count={13} len={25} w={4.6} fill="#c98b9d" vein="#84475c" />
          <circle r="7" fill="#b98a3c" />
          <circle r="4" fill="#8d6427" fillOpacity=".6" />
        </>
      );
    case "krisan":
      return (
        <>
          <Petals r={r} count={16} len={28} w={4} fill="#d8a548" vein="#94651c" />
          <Petals r={r} count={12} len={18} w={3.6} fill="#e3bb6c" vein="#94651c" turn={10} />
          <circle r="4.5" fill="#9c6a1f" />
        </>
      );
    case "mawar":
      return (
        <>
          <Petals r={r} count={7} len={27} w={14} fill="#b4636a" vein="#6f2f3b" />
          <Petals r={r} count={6} len={19} w={10} fill="#c07a7d" vein="#6f2f3b" turn={25} />
          <Petals r={r} count={4} len={11} w={6} fill="#a35059" vein="#6f2f3b" turn={10} />
        </>
      );
    case "lonceng":
      return (
        <>
          {range(5).map((i) => {
            const side = i % 2 ? 1 : -1;
            return (
              <g key={i} transform={`translate(${n(side * (4 + r() * 3))} ${n(i * 13 - 6)}) rotate(${n(side * (112 + r() * 20))}) scale(${n(0.8 + i * 0.07)})`}>
                <path d="M0 0C-8-6-10-18-12-24L-6-21L0-25L6-21L12-24C10-18 8-6 0 0Z" fill="#7a8fbd" fillOpacity=".86" stroke="#435785" strokeOpacity=".6" strokeWidth=".8" />
                <path d="M0-3V-20M-2-4L-6-19M2-4L6-19" stroke="#435785" strokeOpacity=".5" strokeWidth=".6" />
              </g>
            );
          })}
        </>
      );
    case "lavender":
      return (
        <>
          {range(17).map((i) => {
            const y = i * 4.6 - 14;
            const side = i % 3 === 0 ? 0 : i % 3 === 1 ? -1 : 1;
            return (
              <path key={i} transform={`translate(${n(side * 3)} ${n(y)}) rotate(${n(side * 42 + (r() - 0.5) * 20)}) scale(${n(0.7 + Math.min(i, 8) * 0.05)})`} d={petal(12, 4.5)} fill={i % 2 ? "#8d7fb5" : "#a598c6"} fillOpacity=".88" stroke="#574a80" strokeOpacity=".5" strokeWidth=".6" />
            );
          })}
        </>
      );
    default:
      return null;
  }
}

/** Satu tangkai: batang, daun, dan bunga. Pangkal di 0,0 tumbuh ke atas. */
function Sprig({ kind, height, lean, r, d }: { kind: Species; height: number; lean: number; r: Rng; d: number }) {
  const bend = lean * 0.35 + (r() - 0.5) * 16;
  const at = (t: number) => ({
    x: 2 * t * (1 - t) * bend + t * t * lean,
    y: -height * t,
    a: (Math.atan2(2 * (1 - 2 * t) * bend + 2 * t * lean, height) * 180) / Math.PI,
  });
  const green = GREENS[Math.floor(r() * GREENS.length)];
  const fern = kind === "pakis";
  const count = fern ? Math.round(height / 11) : 3 + Math.floor(r() * 3);
  const top = at(1);
  return (
    <g>
      <path className={s.stem} style={delay(d)} pathLength={1} d={`M0 0Q${n(bend)} ${n(-height / 2)} ${n(lean)} ${n(-height)}`} fill="none" stroke={green} strokeWidth="2.2" strokeLinecap="round" />
      {range(count).flatMap((i) => {
        const t = fern ? 0.18 + (0.8 * i) / count : 0.22 + (0.55 * i) / count + r() * 0.05;
        const p = at(t);
        const sides = fern ? [-1, 1] : [i % 2 ? 1 : -1];
        return sides.map((side) => {
          const len = fern ? (1 - t) * 44 + 9 : 30 + r() * 18;
          const angle = p.a + side * (fern ? 62 : 38 + r() * 22);
          return (
            <g key={`${i}${side}`} transform={`translate(${n(p.x)} ${n(p.y)}) rotate(${n(angle)})`}>
              <g className={s.grow} style={delay(d + 0.3 + t * 0.8)}>
                <path d={petal(len, fern ? len * 0.13 + 2 : len * 0.24)} fill={green} fillOpacity=".84" stroke="#3f4a33" strokeOpacity=".4" strokeWidth=".7" />
                <path d={`M0-2V${n(-len * 0.9)}`} stroke="#3f4a33" strokeOpacity=".45" strokeWidth=".7" />
              </g>
            </g>
          );
        });
      })}
      <g transform={`translate(${n(top.x)} ${n(top.y)}) rotate(${n(top.a + (r() - 0.5) * 16)})`}>
        <g className={s.grow} style={delay(d + 1)}>
          <Head kind={kind} r={r} />
        </g>
      </g>
    </g>
  );
}

/** Rangkaian bunga dari sebuah teks, diikat di bawah. */
export function Bouquet({ text, max = 12, className }: { text: string; max?: number; className?: string }) {
  const list = letters(text).slice(0, max);
  const chars = list.length ? list : ["m", "a", "w"];
  const r = rngFrom(chars.join(""));
  const count = chars.length;
  // Yang di tengah lebih tinggi; digambar dari tepi ke tengah supaya bertumpuk rapi.
  const order = range(count).sort((a, b) => Math.abs(b - (count - 1) / 2) - Math.abs(a - (count - 1) / 2));
  return (
    <svg className={`${s.bouquet} ${className ?? ""}`} viewBox="0 0 320 400" aria-hidden="true">
      <g transform="translate(160 352)">
        {range(Math.min(5, count)).map((i) => (
          <path key={i} d={`M0 0L${n((i - 2) * 9 + (r() - 0.5) * 6)} ${n(34 + r() * 12)}`} stroke={GREENS[i % 4]} strokeWidth="2.2" strokeLinecap="round" />
        ))}
        {order.map((i, k) => {
          const pos = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
          const height = 290 - Math.abs(pos) * 120 - (i % 2) * 62 - r() * 18;
          return <Sprig key={i} kind={speciesOf(chars[i])} height={height} lean={pos * 122 + (r() - 0.5) * 14} r={r} d={0.1 + k * 0.07} />;
        })}
        <path d="M-15-7C-6-2 6-2 15-7L14 7C6 11-6 11-14 7Z" fill="var(--thread)" />
        <path d="M4 5C16 12 22 24 18 36M2 6C-2 18-12 24-16 34" fill="none" stroke="var(--thread)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Setangkai kecil untuk catatan dan lembar acara. */
export function Twig({ text, className }: { text: string; className?: string }) {
  const list = letters(text);
  const kind = speciesOf(list[0] ?? "a");
  const second = speciesOf(list[1] ?? "e");
  const r = rngFrom(text || "bunga");
  return (
    <svg className={`${s.twig} ${className ?? ""}`} viewBox="0 0 120 200" aria-hidden="true">
      <g transform="translate(52 192)">
        <Sprig kind={second} height={112} lean={34} r={r} d={0.2} />
        <Sprig kind={kind} height={150} lean={-8} r={r} d={0} />
      </g>
    </svg>
  );
}
