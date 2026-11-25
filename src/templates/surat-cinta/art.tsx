import type { CSSProperties } from "react";
import s from "./template.module.css";

/**
 * Semua gambar tema Surat Cinta dibuat di sini dengan SVG, tanpa file gambar.
 * Warna mengikuti variabel palet (--c-*) di template.module.css.
 */

const n = (v: number) => Number(v.toFixed(2));
const range = (count: number) => Array.from({ length: count }, (_, i) => i);
const delay = (d: string) => ({ "--d": d }) as CSSProperties;
const LEAF = "M0 0C9-9 11-25 0-42C-11-25-9-9 0 0Z";
const ROSE_PETAL = "M0 0C-20-8-22-27-8-31C2-34 18-29 17-15C16-6 8 0 0 0Z";

type Pt = [number, number];
type Curve = [Pt, Pt, Pt, Pt];
export type BloomKind = "melati" | "kamboja" | "mawar";

/** Titik dan arah pada kurva bezier kubik. */
function onCurve(p: Curve, t: number) {
  const u = 1 - t;
  const at = (k: 0 | 1) =>
    u ** 3 * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t ** 3 * p[3][k];
  const d = (k: 0 | 1) =>
    3 * u * u * (p[1][k] - p[0][k]) + 6 * u * t * (p[2][k] - p[1][k]) + 3 * t * t * (p[3][k] - p[2][k]);
  return { x: at(0), y: at(1), angle: (Math.atan2(d(1), d(0)) * 180) / Math.PI + 90 };
}

/** Satu bunga, pusat di 0,0, radius sekitar 30. */
function Bloom({ kind }: { kind: BloomKind }) {
  if (kind === "kamboja") {
    return (
      <g>
        {range(5).map((i) => (
          <g key={i} transform={`rotate(${i * 72})`}>
            <path d="M0 2C-16-5-20-25-7-34C6-37 17-22 14-11C12-4 6 1 0 2Z" fill="var(--c-petal)" />
            <path d="M0 2C-7-4-9-13-4-18C3-19 7-11 6-6Z" fill="var(--c-pollen)" opacity=".75" />
            <path d="M-7-34C6-37 17-22 14-11" fill="none" stroke="var(--c-petal-shade)" strokeWidth="1.4" />
          </g>
        ))}
      </g>
    );
  }
  if (kind === "mawar") {
    return (
      <g>
        {range(6).map((i) => (
          <path key={i} transform={`rotate(${i * 60})`} d={ROSE_PETAL} fill={i % 2 ? "var(--c-rose)" : "var(--c-rose-deep)"} />
        ))}
        {range(5).map((i) => (
          <path
            key={i}
            transform={`rotate(${i * 72 + 22}) scale(.66)`}
            d={ROSE_PETAL}
            fill={i % 2 ? "var(--c-rose-light)" : "var(--c-rose)"}
          />
        ))}
        <path
          d="M-7 3C-9-7 2-11 7-5C11 1 5 8-1 6C-6 4-4-3 1-3C5-2 4 3 1 3"
          fill="none"
          stroke="var(--c-rose-deep)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    );
  }
  return (
    <g>
      {range(7).map((i) => (
        <g key={i} transform={`rotate(${n((i * 360) / 7)})`}>
          <path d="M0 0C-11-7-11-23 0-32C11-23 11-7 0 0Z" fill="var(--c-petal)" stroke="var(--c-petal-shade)" strokeWidth=".8" />
          <path d="M0-4V-22" stroke="var(--c-petal-shade)" strokeWidth="1.2" />
        </g>
      ))}
      <circle r="5.5" fill="var(--c-pollen)" />
    </g>
  );
}

/** Ranting: batang tergambar, lalu daun dan bunga tumbuh bergiliran. */
function Sprig({
  curve,
  leaves = 10,
  size = 1,
  blooms = [],
}: {
  curve: Curve;
  leaves?: number;
  size?: number;
  blooms?: { t: number; kind: BloomKind; scale: number; dx?: number; dy?: number }[];
}) {
  const [a, b, c, d] = curve;
  return (
    <g>
      <path
        className={s.stem}
        pathLength={1}
        d={`M${a}C${b} ${c} ${d}`}
        fill="none"
        stroke="var(--c-stem)"
        strokeWidth={n(2 * size)}
        strokeLinecap="round"
      />
      {range(leaves).map((i) => {
        const t = 0.1 + (0.9 * i) / Math.max(1, leaves - 1);
        const p = onCurve(curve, t);
        const side = i === leaves - 1 ? 0 : i % 2 ? 48 : -48;
        const k = size * (1.05 - 0.45 * t);
        return (
          <g key={i} transform={`translate(${n(p.x)} ${n(p.y)}) rotate(${n(p.angle + side)}) scale(${n(k)})`}>
            <g className={s.grow} style={delay(`${n(0.2 + t * 1.1)}s`)}>
              <path d={LEAF} fill={i % 3 === 1 ? "var(--c-leaf-2)" : "var(--c-leaf)"} />
              <path d="M0-3V-34" stroke="var(--c-vein)" strokeWidth="1" />
            </g>
          </g>
        );
      })}
      {blooms.map((f, i) => {
        const p = onCurve(curve, f.t);
        return (
          <g key={`b${i}`} transform={`translate(${n(p.x + (f.dx ?? 0))} ${n(p.y + (f.dy ?? 0))}) scale(${f.scale})`}>
            <g className={s.grow} style={delay(`${n(0.7 + i * 0.25)}s`)}>
              <Bloom kind={f.kind} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

function GrownBloom({ at, kind, d }: { at: string; kind: BloomKind; d: string }) {
  return (
    <g transform={at}>
      <g className={s.grow} style={delay(d)}>
        <Bloom kind={kind} />
      </g>
    </g>
  );
}

/** Dua ranting melingkari inisial. */
export function Crest({ left, right }: { left: string; right: string }) {
  const curve: Curve = [[150, 268], [40, 262], [10, 130], [92, 44]];
  return (
    <svg className={s.crest} viewBox="0 0 300 300" aria-hidden="true">
      {[false, true].map((flip) => (
        <g key={String(flip)} transform={flip ? "translate(300 0) scale(-1 1)" : undefined}>
          <Sprig
            curve={curve}
            leaves={13}
            size={0.82}
            blooms={[
              { t: 0.4, kind: "melati", scale: 0.5, dx: -4 },
              { t: 0.72, kind: "kamboja", scale: 0.44 },
            ]}
          />
        </g>
      ))}
      <GrownBloom at="translate(116 266) scale(.62)" kind="kamboja" d=".5s" />
      <GrownBloom at="translate(184 266) scale(.6)" kind="melati" d=".6s" />
      <GrownBloom at="translate(150 262) scale(.92)" kind="mawar" d=".4s" />
      <text x="114" y="158" textAnchor="middle" className={s.crestLetter}>{left}</text>
      <text x="188" y="190" textAnchor="middle" className={s.crestLetter}>{right}</text>
      <path d="M126 200L176 104" stroke="currentColor" strokeWidth="1" opacity=".5" />
    </svg>
  );
}

/** Ranting besar warna senada di tepi sampul dan sisi layar desktop. */
export function Foliage({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 300 420" aria-hidden="true">
      <Sprig
        curve={[[20, 430], [40, 300], [150, 250], [140, 60]]}
        leaves={14}
        size={1.7}
        blooms={[{ t: 0.62, kind: "mawar", scale: 0.9, dx: 10 }]}
      />
      <Sprig
        curve={[[-10, 430], [110, 400], [180, 320], [262, 250]]}
        leaves={9}
        size={1.5}
        blooms={[
          { t: 0.5, kind: "kamboja", scale: 1 },
          { t: 0.86, kind: "melati", scale: 0.6 },
        ]}
      />
    </svg>
  );
}

/** Gambar perangko, satu jenis bunga untuk tiap mempelai. */
export function StampFlower({ kind }: { kind: BloomKind }) {
  return (
    <svg viewBox="0 0 140 168" className={s.stampArt} aria-hidden="true">
      <circle cx="70" cy="72" r="54" fill="var(--c-stamp-sun)" />
      <g transform={kind === "kamboja" ? "translate(140 0) scale(-1 1)" : undefined}>
        <Sprig
          curve={[[58, 176], [84, 130], [52, 100], [72, 52]]}
          leaves={8}
          size={0.95}
          blooms={[
            { t: 0.36, kind, scale: 0.5, dx: 30, dy: -12 },
            { t: 0.5, kind, scale: 0.62, dx: -30, dy: -6 },
            { t: 1, kind, scale: 0.98 },
          ]}
        />
      </g>
    </svg>
  );
}

/** Cap pos: nama melingkar, tanggal di tengah, garis gelombang di samping. */
export function Postmark({
  id,
  ring,
  day,
  month,
  year,
}: {
  id: string;
  ring: string;
  day: string;
  month: string;
  year: string;
}) {
  return (
    <svg className={s.postmark} viewBox="0 0 230 112" aria-hidden="true">
      <defs>
        <path id={id} d="M18 56a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" />
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="56" cy="56" r="52" />
        <circle cx="56" cy="56" r="32" strokeWidth="1.1" />
        {range(5).map((i) => (
          <path key={i} d={`M108 ${32 + i * 12}q10-7 20 0t20 0t20 0t20 0t20 0t20 0`} />
        ))}
      </g>
      <g fill="currentColor" textAnchor="middle" className={s.postmarkText}>
        <text fontSize="11" letterSpacing="1.2">
          <textPath href={`#${id}`} startOffset="25%">{ring}</textPath>
        </text>
        <text x="56" y="46" fontSize="11">{month}</text>
        <text x="56" y="64" fontSize="20" fontWeight="600">{day}</text>
        <text x="56" y="77" fontSize="11">{year}</text>
      </g>
    </svg>
  );
}

/** Segel lilin berinisial. */
export function Seal({ text }: { text: string }) {
  return (
    <svg viewBox="0 0 120 120" className={s.sealArt} aria-hidden="true">
      <path
        d="M60 5C75 2 84 13 96 19C111 25 112 41 115 55C119 71 108 81 102 94C94 109 79 108 65 114C50 119 40 109 27 103C12 97 12 82 6 68C1 53 10 42 16 29C23 14 44 8 60 5Z"
        fill="var(--c-wax)"
      />
      <path d="M60 11C73 9 82 18 92 23C104 29 105 43 108 55" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="60" r="39" fill="#000" fillOpacity=".13" />
      <circle cx="60" cy="61.5" r="39" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="1.5" />
      <text x="60" y="72" textAnchor="middle" className={s.sealText}>{text}</text>
    </svg>
  );
}

function Rings() {
  const curve: Curve = [[200, 178], [130, 190], [70, 160], [30, 88]];
  return (
    <>
      <circle cx="200" cy="104" r="84" fill="var(--c-stamp-sun)" />
      <Sprig curve={curve} leaves={11} size={0.95} blooms={[{ t: 0.5, kind: "melati", scale: 0.6 }, { t: 0.82, kind: "kamboja", scale: 0.48 }]} />
      <g transform="translate(400 0) scale(-1 1)">
        <Sprig curve={curve} leaves={11} size={0.95} blooms={[{ t: 0.5, kind: "kamboja", scale: 0.6 }, { t: 0.82, kind: "melati", scale: 0.48 }]} />
      </g>
      <g fill="none" strokeWidth="9">
        <circle cx="174" cy="106" r="42" stroke="var(--c-gold)" />
        <circle cx="226" cy="106" r="42" stroke="var(--c-gold-deep)" />
        <path d="M200 73A42 42 0 0 1 216 106" stroke="var(--c-gold)" />
      </g>
      <path d="M226 36l14 13-14 17-14-17z" fill="#fff" />
      <path d="M226 36l14 13h-28zM226 66l-5-17h10z" fill="var(--c-gem)" />
      <g transform="translate(200 178) scale(.8)"><Bloom kind="mawar" /></g>
    </>
  );
}

/** Gapura bunga resepsi: ranting tumbuh dari kiri dan kanan, lampu bergantung di tengah. */
function FloralArch() {
  const outer: Curve = [[84, 214], [44, 96], [92, 26], [200, 30]];
  const inner: Curve = [[112, 214], [84, 120], [118, 62], [196, 56]];
  const lamps: [number, number][] = [[150, 92], [176, 122], [200, 100], [224, 122], [250, 92]];
  return (
    <>
      <path d="M96 214V122C96 10 304 10 304 122V214Z" fill="var(--c-stamp-sun)" />
      {lamps.map(([x, y], i) => (
        <g key={x} className={s.hang} style={delay(`${i * 0.4}s`)}>
          <path d={`M${x} 40V${y}`} stroke="var(--c-gold-deep)" strokeWidth="1.2" />
          <circle cx={x} cy={y + 8} r="8" fill="var(--c-gold)" />
          <circle className={s.lamp} style={delay(`${i * 0.5}s`)} cx={x} cy={y + 8} r="5" fill="var(--c-lamp)" />
        </g>
      ))}
      {[false, true].map((flip) => (
        <g key={String(flip)} transform={flip ? "translate(400 0) scale(-1 1)" : undefined}>
          <Sprig curve={inner} leaves={12} size={0.75} />
          <Sprig
            curve={outer}
            leaves={15}
            size={1}
            blooms={[
              { t: 0.1, kind: "mawar", scale: 0.78, dx: 6 },
              { t: 0.24, kind: "melati", scale: 0.6, dx: 14 },
              { t: 0.4, kind: "kamboja", scale: 0.66 },
              { t: 0.58, kind: "melati", scale: 0.5, dx: 6 },
              { t: 0.76, kind: "mawar", scale: 0.6 },
              { t: 0.9, kind: "kamboja", scale: 0.48 },
            ]}
          />
        </g>
      ))}
      <GrownBloom at="translate(200 34) scale(.86)" kind="mawar" d="1.6s" />
    </>
  );
}

/** Buket untuk acara ketiga dan seterusnya. */
function Bouquet() {
  return (
    <>
      <circle cx="200" cy="96" r="86" fill="var(--c-stamp-sun)" />
      {([-76, -46, -18, 18, 46, 76] as const).map((x, i) => (
        <Sprig key={x} curve={[[200, 204], [200 + x * 0.2, 160], [200 + x, 130], [200 + x * 1.5, 46 + Math.abs(x) * 0.4]]} leaves={8} size={0.85} blooms={[{ t: 0.8, kind: i % 2 ? "melati" : "kamboja", scale: 0.6 }]} />
      ))}
      <GrownBloom at="translate(166 108) scale(.9)" kind="mawar" d=".8s" />
      <GrownBloom at="translate(236 104) scale(.9)" kind="mawar" d=".95s" />
      <GrownBloom at="translate(200 140) scale(1.05)" kind="mawar" d="1.1s" />
    </>
  );
}

const SCENES = [Rings, FloralArch, Bouquet];

/** Ilustrasi kartu pos acara, bergiliran: cincin, gapura bunga, buket. */
export function EventScene({ index }: { index: number }) {
  const Scene = SCENES[index % SCENES.length];
  return (
    <svg className={s.scene} viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="210" fill="var(--c-day)" />
      <Scene />
    </svg>
  );
}
