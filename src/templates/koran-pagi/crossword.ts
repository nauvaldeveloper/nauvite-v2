/** Menyusun teka-teki silang kecil dari beberapa kata. */

export type Entry = { clue: string; word: string };
export type Placed = Entry & { x: number; y: number; down: boolean; no: number };
export type Puzzle = { width: number; height: number; words: Placed[] };

const MAX_WIDTH = 11;

export const cleanWord = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();

type Spot = Entry & { x: number; y: number; down: boolean };

const cells = (w: Spot) => [...w.word].map((ch, i) => ({ ch, x: w.x + (w.down ? 0 : i), y: w.y + (w.down ? i : 0) }));
const id = (x: number, y: number) => `${x},${y}`;

function bounds(spots: Spot[]) {
  const all = spots.flatMap(cells);
  const xs = all.map((c) => c.x);
  const ys = all.map((c) => c.y);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

/** Boleh ditaruh kalau hurufnya cocok di persilangan dan tidak menempel kata lain. */
function fits(spot: Spot, grid: Map<string, string>) {
  const [dx, dy] = spot.down ? [0, 1] : [1, 0];
  const list = cells(spot);
  const last = list[list.length - 1];
  if (grid.has(id(spot.x - dx, spot.y - dy)) || grid.has(id(last.x + dx, last.y + dy))) return 0;
  let crossings = 0;
  for (const c of list) {
    const there = grid.get(id(c.x, c.y));
    if (there === c.ch) crossings++;
    else if (there) return 0;
    else if (grid.has(id(c.x + dy, c.y + dx)) || grid.has(id(c.x - dy, c.y - dx))) return 0;
  }
  return crossings < list.length ? crossings : 0;
}

export function buildCrossword(entries: Entry[]): Puzzle | null {
  const seen = new Set<string>();
  const list = entries
    .map((e) => ({ ...e, word: cleanWord(e.word) }))
    .filter((e) => e.word.length >= 3 && e.word.length <= MAX_WIDTH && !seen.has(e.word) && seen.add(e.word));
  if (list.length < 2) return null;

  const placed: Spot[] = [{ ...list[0], x: 0, y: 0, down: false }];
  const waiting = list.slice(1);
  // Beberapa putaran: kata yang belum bisa menyilang dicoba lagi setelah kata lain masuk.
  for (let round = 0; round < 3 && waiting.length; round++) {
    for (const entry of [...waiting]) {
      const grid = new Map(placed.flatMap((p) => cells(p).map((c) => [id(c.x, c.y), c.ch] as const)));
      let best: { spot: Spot; score: number } | null = null;
      for (const p of placed) {
        for (const c of cells(p)) {
          [...entry.word].forEach((ch, k) => {
            if (ch !== c.ch) return;
            const down = !p.down;
            const spot = { ...entry, down, x: c.x - (down ? 0 : k), y: c.y - (down ? k : 0) };
            const crossings = fits(spot, grid);
            if (!crossings) return;
            const b = bounds([...placed, spot]);
            const w = b.x1 - b.x0 + 1;
            const h = b.y1 - b.y0 + 1;
            if (w > MAX_WIDTH || h > MAX_WIDTH + 1) return;
            const score = crossings * 20 - w * h * 0.5 - Math.abs(w - h);
            if (!best || score > best.score) best = { spot, score };
          });
        }
      }
      if (best) {
        placed.push((best as { spot: Spot }).spot);
        waiting.splice(waiting.indexOf(entry), 1);
      }
    }
  }
  if (placed.length < 2) return null;

  const b = bounds(placed);
  const moved = placed.map((p) => ({ ...p, x: p.x - b.x0, y: p.y - b.y0 })).sort((m, n) => m.y - n.y || m.x - n.x);
  const numbers = new Map<string, number>();
  const words = moved.map((p) => {
    const key = id(p.x, p.y);
    if (!numbers.has(key)) numbers.set(key, numbers.size + 1);
    return { ...p, no: numbers.get(key)! };
  });
  return { width: b.x1 - b.x0 + 1, height: b.y1 - b.y0 + 1, words };
}
