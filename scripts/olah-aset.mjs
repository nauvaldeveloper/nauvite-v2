// Mengolah aset mentah dari Canva (aset-mentah/<tema>/) menjadi WebP siap pakai (public/templates/<tema>/).
// - Latar putih dibuang hanya bila tersambung ke tepi gambar, jadi bunga putih (melati) tidak ikut bolong.
// - Tepi objek dihaluskan, sisa ruang kosong dipotong, ukuran dikecilkan, lalu disimpan sebagai WebP.
// Pakai: node scripts/olah-aset.mjs <tema>            (semua aset dalam daftar)
//        node scripts/olah-aset.mjs <tema> gapura     (satu aset)
// Daftar aset per tema ada di DAFTAR di bawah. Kertas diolah terpisah dengan scripts/olah-kertas.mjs.
import sharp from "sharp";
import fs from "node:fs";

// mode "potong": buang latar putih. mode "penuh": gambar penuh tanpa transparansi.
// maks: [lebar, tinggi] maksimal hasil (proporsi dijaga).
const DAFTAR = {
  "sundanese-elegance": [
    { dari: "02-buket-kiri-atas", ke: "buket-kiri", maks: [700, 900] },
    { dari: "03-buket-kanan-atas", ke: "buket-kanan", maks: [700, 900] },
    { dari: "04-buket-bingkai-a", ke: "buket-bingkai-a", maks: [520, 560] },
    { dari: "05-buket-bingkai-b", ke: "buket-bingkai-b", maks: [620, 420] },
    { dari: "06-pembatas", ke: "pembatas", maks: [900, 200] },
    { dari: "07-noda", ke: "noda", maks: [560, 560] },
    { dari: "08-kelopak-1", ke: "kelopak-1", maks: [110, 110], putih: 250 },
    { dari: "09-kelopak-2", ke: "kelopak-2", maks: [110, 110] },
    { dari: "10-kelopak-3", ke: "kelopak-3", maks: [110, 110] },
    { dari: "11-langit", ke: "langit", mode: "penuh", maks: [720, 1280] },
    { dari: "12-awan", ke: "awan", maks: [900, 600] },
    { dari: "13-gunung", ke: "gunung", maks: [1000, 500] },
    { dari: "14-kebun-teh", ke: "bukit", maks: [1000, 500] },
    { dari: "16-depan", ke: "depan", maks: [1000, 500] },
    { dari: "17-wayang-kiri", ke: "tokoh-kiri", maks: [400, 900] },
    { dari: "18-wayang-kanan", ke: "tokoh-kanan", maks: [400, 900] },
    { dari: "19-pintu-kiri", ke: "pintu-kiri", maks: [600, 1300] },
    { dari: "20-pintu-kanan", ke: "pintu-kanan", maks: [600, 1300] },
  ],
  "javanese-keraton": [
    { dari: "02-buket-kiri-atas", ke: "buket-kiri", maks: [700, 900] },
    { dari: "03-buket-kanan-atas", ke: "buket-kanan", maks: [700, 900] },
    { dari: "04-buket-bingkai-a", ke: "buket-bingkai-a", maks: [520, 560] },
    { dari: "05-buket-bingkai-b", ke: "buket-bingkai-b", maks: [620, 420] },
    { dari: "06-pembatas", ke: "pembatas", maks: [900, 200] },
    { dari: "07-noda", ke: "noda", maks: [560, 560] },
    { dari: "08-kelopak-1", ke: "kelopak-1", maks: [110, 110], putih: 250 },
    { dari: "09-kelopak-2", ke: "kelopak-2", maks: [110, 110], putih: 250 },
    { dari: "10-kelopak-3", ke: "kelopak-3", maks: [110, 110] },
    { dari: "11-langit", ke: "langit", mode: "penuh", maks: [720, 1280] },
    { dari: "12-awan", ke: "awan", maks: [900, 600] },
    { dari: "13-gunung", ke: "gunung", maks: [1000, 500] },
    { dari: "14-sawah", ke: "bukit", maks: [1000, 500] },
    { dari: "15-depan", ke: "depan", maks: [1000, 500] },
    { dari: "16-wayang-kiri", ke: "tokoh-kiri", maks: [400, 900], rongga: 300 },
    { dari: "17-wayang-kanan", ke: "tokoh-kanan", maks: [400, 900], rongga: 300 },
    { dari: "18-pintu-kiri", ke: "pintu-kiri", maks: [600, 1300] },
    { dari: "19-pintu-kanan", ke: "pintu-kanan", maks: [600, 1300] },
  ],
  "betawi-heritage": [
    { dari: "02-buket-kiri-atas", ke: "buket-kiri", maks: [700, 900] },
    { dari: "03-buket-kanan-atas", ke: "buket-kanan", maks: [700, 900] },
    { dari: "04-buket-bingkai-a", ke: "buket-bingkai-a", maks: [520, 560] },
    { dari: "05-buket-bingkai-b", ke: "buket-bingkai-b", maks: [620, 420] },
    { dari: "06-pembatas", ke: "pembatas", maks: [900, 200] },
    { dari: "07-noda", ke: "noda", maks: [560, 560] },
    { dari: "08-kelopak-1", ke: "kelopak-1", maks: [110, 110], putih: 250 },
    { dari: "09-kelopak-2", ke: "kelopak-2", maks: [110, 110] },
    { dari: "10-kelopak-3", ke: "kelopak-3", maks: [110, 110] },
    { dari: "11-langit", ke: "langit", mode: "penuh", maks: [720, 1280] },
    { dari: "12-awan", ke: "awan", maks: [900, 600] },
    { dari: "13-monas", ke: "gunung", maks: [1000, 500] },
    { dari: "14-setu", ke: "bukit", maks: [1000, 500] },
    { dari: "15-depan", ke: "depan", maks: [1000, 500] },
    { dari: "16-ondel-kiri", ke: "tokoh-kiri", maks: [400, 900] },
    { dari: "17-ondel-kanan", ke: "tokoh-kanan", maks: [400, 900] },
    { dari: "18-pintu-kiri", ke: "pintu-kiri", maks: [600, 1300] },
    { dari: "19-pintu-kanan", ke: "pintu-kanan", maks: [600, 1300] },
  ],
};

const [, , tema, satu] = process.argv;
if (!DAFTAR[tema]) {
  console.log(`Tema belum ada di DAFTAR. Pilihan: ${Object.keys(DAFTAR).join(", ")}`);
  process.exit(1);
}
const SRC = `aset-mentah/${tema}`;
const OUT = `public/templates/${tema}`;
fs.mkdirSync(OUT, { recursive: true });

const PUTIH = 236; // piksel dengan semua kanal di atas ini dianggap latar putih (bisa diubah per aset lewat "putih")

async function potongLatar(file, batas = PUTIH, rongga = 0) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const putih = (i) => data[i * 3] > batas && data[i * 3 + 1] > batas && data[i * 3 + 2] > batas;
  // Telusuri latar dari tepi gambar
  const latar = new Uint8Array(w * h);
  const antre = new Int32Array(w * h);
  let kepala = 0, ekor = 0;
  const tambah = (i) => { if (!latar[i] && putih(i)) { latar[i] = 1; antre[ekor++] = i; } };
  for (let x = 0; x < w; x++) { tambah(x); tambah((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { tambah(y * w); tambah(y * w + w - 1); }
  while (kepala < ekor) {
    const i = antre[kepala++], x = i % w, y = (i / w) | 0;
    if (x > 0) tambah(i - 1);
    if (x < w - 1) tambah(i + 1);
    if (y > 0) tambah(i - w);
    if (y < h - 1) tambah(i + w);
  }
  // Opsi "rongga": celah putih tertutup (mis. di antara lengan dan badan wayang) juga dianggap latar
  // kalau luasnya lebih dari batas piksel ini, supaya detail kecil seperti mata tetap aman.
  if (rongga) {
    const lihat = new Uint8Array(w * h);
    for (let awal = 0; awal < w * h; awal++) {
      if (latar[awal] || lihat[awal] || !putih(awal)) continue;
      const isi = [awal];
      lihat[awal] = 1;
      for (let k = 0; k < isi.length; k++) {
        const i = isi[k], x = i % w, y = (i / w) | 0;
        for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
          if (j >= 0 && !lihat[j] && !latar[j] && putih(j)) { lihat[j] = 1; isi.push(j); }
        }
      }
      if (isi.length > rongga) for (const i of isi) latar[i] = 1;
    }
  }
  // Alfa: 0 di latar, 255 di objek. Piksel objek yang berbatasan dengan latar diberi alfa sebagian
  // sesuai seberapa putihnya, supaya tepinya tidak bergerigi dan tidak bersisa garis putih.
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    let a = latar[i] ? 0 : 255;
    if (!latar[i]) {
      const x = i % w, y = (i / w) | 0;
      const dekat = (x > 0 && latar[i - 1]) || (x < w - 1 && latar[i + 1]) || (y > 0 && latar[i - w]) || (y < h - 1 && latar[i + w]);
      if (dekat) a = Math.min(255, Math.round(((255 - Math.min(r, g, b)) / (255 - 200)) * 255));
    }
    rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = a;
  }
  // Haluskan tepi alfa sedikit
  const alfa = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).extractChannel(3).blur(0.6).raw().toBuffer();
  for (let i = 0; i < w * h; i++) rgba[i * 4 + 3] = Math.min(rgba[i * 4 + 3], alfa[i]);
  return sharp(rgba, { raw: { width: w, height: h, channels: 4 } });
}

for (const a of DAFTAR[tema]) {
  if (satu && satu !== a.ke) continue;
  const file = `${SRC}/${a.dari}.png`;
  if (!fs.existsSync(file)) { console.log("lewati (belum ada):", file); continue; }
  let img = a.mode === "penuh" ? sharp(file).removeAlpha() : await potongLatar(file, a.putih, a.rongga);
  // Potong ruang kosong di sekeliling objek
  const buf = await img.png().toBuffer();
  img = a.mode === "penuh" ? sharp(buf) : sharp(buf).trim({ threshold: 1 });
  const out = `${OUT}/${a.ke}.webp`;
  const info = await img
    .resize(a.maks[0], a.maks[1], { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(out);
  console.log(`ok ${a.ke}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
}
