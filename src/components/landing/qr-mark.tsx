/**
 * Gambar QR code hiasan untuk ilustrasi (bukan QR yang bisa dipindai).
 * Pola titiknya tetap (pseudo-acak dengan seed), supaya sama di server dan browser.
 */
const N = 25;

function modules() {
  const cells: [number, number][] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!inFinder(x, y) && rand() > 0.52) cells.push([x, y]);
    }
  }
  return cells;
}

const CELLS = modules();

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x + 0.5} y={y + 0.5} width={6} height={6} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="currentColor" />
    </>
  );
}

export function QrMark({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className={className} aria-hidden="true" shapeRendering="crispEdges">
      {CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={N - 7} y={0} />
      <Finder x={0} y={N - 7} />
    </svg>
  );
}
