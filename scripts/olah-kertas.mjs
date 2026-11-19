// Mengolah tekstur kertas dari Canva menjadi ubin latar yang mulus.
// - Noda besar dipudarkan (supaya tidak terlihat berpola saat diulang), serat kertas dipertahankan.
// - Sambungan antarubin dihilangkan dengan memadukan gambar dengan versi geser setengahnya.
// Pakai: node scripts/olah-kertas.mjs <masukan.png> <keluaran.webp> [kekuatan noda 0..1, bawaan 0.35] [ukuran, bawaan 900]
import sharp from "sharp";

const [, , input, output, strengthArg, sizeArg] = process.argv;
if (!input || !output) {
  console.log("Pakai: node scripts/olah-kertas.mjs <masukan.png> <keluaran.webp> [kekuatan noda] [ukuran]");
  process.exit(1);
}
const STRENGTH = Number(strengthArg ?? 0.35);
const SIZE = Number(sizeArg ?? 900);

const base = sharp(input).removeAlpha().resize(SIZE, SIZE);
const { data: img } = await base.clone().raw().toBuffer({ resolveWithObject: true });
const { data: low } = await base.clone().blur(SIZE / 30).raw().toBuffer({ resolveWithObject: true });

// Warna rata-rata kertas
const mean = [0, 0, 0];
for (let i = 0; i < img.length; i += 3) for (let c = 0; c < 3; c++) mean[c] += img[i + c];
for (let c = 0; c < 3; c++) mean[c] /= img.length / 3;

// Serat tetap, noda besar dipudarkan
const flat = new Float32Array(img.length);
for (let i = 0; i < img.length; i++) {
  const c = i % 3;
  flat[i] = mean[c] + (img[i] - low[i]) + (low[i] - mean[c]) * STRENGTH;
}

// Hilangkan sambungan: tengah dari gambar asli, tepi dari versi geser setengah
const out = Buffer.alloc(img.length);
const half = SIZE / 2;
const smooth = (t) => t * t * (3 - 2 * t);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const d = Math.max(Math.abs(x - half), Math.abs(y - half)) / half; // 0 di tengah, 1 di tepi
    const w = 1 - smooth(Math.min(1, Math.max(0, (d - 0.55) / 0.4)));
    const sx = (x + half) % SIZE, sy = (y + half) % SIZE;
    for (let c = 0; c < 3; c++) {
      const a = flat[(y * SIZE + x) * 3 + c];
      const b = flat[(sy * SIZE + sx) * 3 + c];
      out[(y * SIZE + x) * 3 + c] = Math.max(0, Math.min(255, Math.round(a * w + b * (1 - w))));
    }
  }
}

await sharp(out, { raw: { width: SIZE, height: SIZE, channels: 3 } }).webp({ quality: 82 }).toFile(output);
console.log(`ok ${output} (${SIZE}x${SIZE}, noda ${STRENGTH}, warna rata-rata rgb(${mean.map(Math.round).join(",")}))`);
