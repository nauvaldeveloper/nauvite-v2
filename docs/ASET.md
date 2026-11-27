# Sumber Aset Nauvite v2

Catat setiap foto, video, ilustrasi, atau musik dari luar di sini: dari mana asalnya dan lisensinya. Tujuannya supaya jelas semua aset boleh dipakai secara komersial.

## Lisensi Pexels (ringkas)
Gratis untuk keperluan komersial, tidak wajib mencantumkan nama pembuat, boleh diedit. **Tidak boleh** dijual ulang apa adanya (tanpa diubah) atau diunggah ulang ke situs stok lain.
Detail: https://www.pexels.com/license/

## Template Minimalist & Clean (`solid-editorial`)
Folder: `public/templates/solid-editorial/`

| File | Sumber | Lisensi | Catatan |
|---|---|---|---|
| `latar-bunga-putih.mp4` + `.webp` | https://www.pexels.com/video/delicate-white-flowers-swaying-in-breeze-38493676/ | Pexels | **Latar bawaan.** Dikompres ke 720x1280, diputar maju-mundur supaya loop mulus (19 detik, 0,6 MB). |
| `latar-ranting-bunga.mp4` + `.webp` | https://www.pexels.com/video/spring-blossom-branches-in-gentle-breeze-31251227/ | Pexels | Alternatif. 720x1280, loop maju-mundur, 2,1 MB. |

## Template Signature (Royal Gold, Floral Light, Midnight Dark)
Folder: `public/demo/signature/`

| File | Sumber | Catatan |
|---|---|---|
| `mempelai-*.webp`, `story*.webp`, `gallery*.webp`, `og.jpg` | Foto demo Nauvite v1 (`config.js`, dulu di-host di i.ibb.co) | Milik Nauvite. Dikompres ke WebP, lebar maks 900px. |

## Foto undangan demo Clean (`dimas-laras`)
Folder: `public/demo/`. Semua dari Pexels (lisensi Pexels), dikompres ke WebP.

| File | Sumber |
|---|---|
| `mempelai-pria.webp`, `mempelai-wanita.webp` (dipotong dari satu foto) | https://www.pexels.com/photo/a-couple-wearing-wedding-attire-13111870/ |
| `sampul.webp`, `og.jpg` | https://www.pexels.com/photo/newlyweds-standing-together-on-a-bridge-15984448/ |
| `galeri-1.webp` | https://www.pexels.com/photo/romantic-wedding-couple-embracing-outdoors-33463733/ |
| `galeri-2.webp` | https://www.pexels.com/photo/smiling-newlywed-couple-hugging-27092650/ |
| `galeri-3.webp` | https://www.pexels.com/photo/romantic-outdoor-wedding-couple-embracing-34952491/ |
| `galeri-4.webp` | https://www.pexels.com/photo/sitting-newlywed-couple-15891240/ |
| `galeri-5.webp` | https://www.pexels.com/photo/photoshoot-of-a-groom-and-bride-13377371/ |
| `galeri-6.webp` | https://www.pexels.com/photo/man-hugging-his-bride-14348498/ |
| `cerita-1.webp` | https://www.pexels.com/photo/newlyweds-sitting-by-table-19270834/ |
| `cerita-2.webp` | https://www.pexels.com/photo/elegant-wedding-couple-exchanging-rings-ceremony-32459278/ |

## Logo bank dan dompet digital
Folder: `public/banks/`. File SVG dari Wikimedia Commons (sama dengan sumber yang dipakai v1, sekarang disimpan di project sendiri supaya tidak gagal dimuat). Logo adalah merek dagang milik bank masing-masing; dipakai hanya untuk menunjukkan rekening tujuan transfer.

| File | Sumber |
|---|---|
| `bca.svg` | https://commons.wikimedia.org/wiki/File:Bank_Central_Asia.svg |
| `mandiri.svg` | https://commons.wikimedia.org/wiki/File:Bank_Mandiri_logo_2016.svg |
| `bni.svg` | https://commons.wikimedia.org/wiki/File:Bank_Negara_Indonesia_logo_(2004).svg |
| `bri.svg` | https://commons.wikimedia.org/wiki/File:BRI_2025.svg |
| `bsi.svg` | https://commons.wikimedia.org/wiki/File:Bank_Syariah_Indonesia.svg |
| `dana.svg` | https://commons.wikimedia.org/wiki/File:Logo_dana_blue.svg |
| `ovo.svg` | https://commons.wikimedia.org/wiki/File:Logo_ovo_purple.svg |
| `gopay.svg` | https://commons.wikimedia.org/wiki/File:Logo_Gopay.svg |

Nama bank dikenali otomatis lewat `bankLogo()` di `src/lib/invitation/format.ts`. Menambah bank: simpan SVG-nya di folder ini lalu tambahkan satu baris di daftar `BANK_LOGOS`.

## Template Premium Sage Garden (`sage-garden`)
Folder: `public/templates/sage-garden/`. Ilustrasi dibuat pemilik dengan **Canva AI** (12 Nov 2026), prompt di `docs/PROMPT-CANVA-PREMIUM.md`. File mentah di `aset-mentah/premium-sage/` (tidak ikut Git).
Diproses: ruang kosong transparan dipotong, diperkecil, diubah ke WebP. Total 376 KB (dari 14,9 MB).

| File | Sumber mentah | Dipakai untuk |
|---|---|---|
| `kertas.webp` | `01-kertas.png` | Tekstur latar semua bagian terang dan kartu |
| `buket-kiri.webp`, `buket-kanan.webp` | `02-buket-kiri-atas.png`, `03-buket-kanan-atas.png` | Buket sudut sampul dan pembuka (bergoyang), motif samar bagian gelap |
| `buket-bingkai-a.webp`, `buket-bingkai-b.webp` | `04-...`, `05-...` | Buket di bingkai foto lonjong, pojok kartu acara, penutup |
| `pembatas.webp` | `06-pembatas-daun.png` | Pembatas antarbagian |
| `noda.webp` | `07-noda.png` | Noda cat air samar yang bergeser pelan |
| `kelopak-1..3.webp` | `08-..10-kelopak-*.png` | Animasi kelopak jatuh, penanda timeline cerita |

Foto demo `contoh-sage-garden` memakai foto Pexels yang sama dengan `dimas-laras`.

## Template Premium Dusty Rose (`dusty-rose`)
Folder: `public/templates/dusty-rose/`. Ilustrasi dibuat pemilik dengan **Canva AI** (13 Nov 2026), prompt di `docs/PROMPT-CANVA-TEMA.md`. File mentah di `aset-mentah/dusty-rose/` (tidak ikut Git).
Nama file dan kegunaan sama dengan Sage Garden. Latar putih `02` dan `07` dihapus lewat skrip; warna `04` diredupkan supaya serasi. Total 509 KB.
Demo `contoh-dusty-rose` memakai foto Pexels yang sama dengan `dimas-laras`.

## Template Premium Lavender Mist (`lavender-mist`)
Folder: `public/templates/lavender-mist/`. Ilustrasi dibuat pemilik dengan **Canva AI** lewat prompt singkat "versi ungu soft dari Sage" (13 Nov 2026). File mentah di `aset-mentah/lavender-mist/` (tidak ikut Git), sudah diberi nama standar; tiga gambar tambahan disimpan dengan awalan `cadangan-`.
Semua latar putih dihapus lewat skrip. `buket-kanan` = cermin dari `03` (aslinya buket sudut kiri). Belum ada gambar kertas dan kelopak ke-3 dari Canva: `kertas.webp` dibuat dari kertas Sage Garden yang warnanya digeser ke lilac, `kelopak-3.webp` dari kelopak 1 yang dicerminkan dan diberi warna lebih merah muda. Total 438 KB.
Demo `contoh-lavender-mist` memakai foto Pexels `galeri-5` dari set yang sama.

## Tema Tiket Kereta (`tiket-kereta`)
Tanpa file gambar: ilustrasi SVG buatan sendiri di `src/templates/tiket-kereta/art.tsx`. Font Besley, Barlow, Barlow Condensed dari Google Fonts (OFL).

## Tema Bioskop (`bioskop`)
Tanpa file gambar baru: tirai, papan lampu, roll film, dan butiran film dibuat dengan CSS di `src/templates/bioskop/template.module.css`. Demo `contoh-bioskop` memakai foto demo Signature (`public/demo/signature/`). Font DM Serif Display, Oswald, Figtree dari Google Fonts (OFL).

## Tema Album Polaroid (`album-polaroid`)
Tanpa file gambar baru: sampul album, polaroid, selotip, dan kertas bergaris dibuat dengan CSS di `src/templates/album-polaroid/template.module.css`. Demo `contoh-album-polaroid` memakai foto demo Signature (`public/demo/signature/`). Font Kalam, Karla, Courier Prime dari Google Fonts (OFL).

## Tema Herbarium (`herbarium`)
Tanpa file gambar: ilustrasi SVG buatan sendiri di `src/templates/herbarium/art.tsx`. Font IM Fell English, Alegreya, Delicious Handrawn dari Google Fonts (OFL).

## Tema Piringan Hitam (`piringan-hitam`)
Tanpa file gambar: ilustrasi SVG buatan sendiri di `src/templates/piringan-hitam/art.tsx`. Font Shrikhand dan Figtree dari Google Fonts (OFL).

## Tema Koran Pagi (`koran-pagi`)
Tanpa file gambar: ilustrasi SVG buatan sendiri di `src/templates/koran-pagi/art.tsx`. Font Grenze Gotisch, Frank Ruhl Libre, Source Serif 4, Archivo Narrow dari Google Fonts (OFL).

## Tema Surat Cinta (`surat-cinta`)
Tanpa file gambar: semua ilustrasi SVG buatan sendiri di `src/templates/surat-cinta/art.tsx`. Semua font dari Google Fonts (lisensi OFL). `assets/fonts/PetitFormalScript-Regular.ttf` (OFL, lisensinya di folder yang sama) dipakai untuk gambar preview WhatsApp.

## Landing page (`public/landing/`)
Dibuat dari undangan demo milik Nauvite sendiri (bukan aset luar), dengan skrip puppeteer di luar repo.

| File | Isi |
|---|---|
| `<id tema>-sampul.webp`, `<id tema>-isi.webp` | Screenshot sampul dan isi setiap tema yang punya demo (540px, WebP) |
| `sage-garden-demo.mp4` | Rekaman layar 14 detik undangan Sage Garden: sampul, dibuka, lalu di-scroll (390px, H.264, 0,9 MB) |

Kalau tampilan tema berubah atau ada tema baru, buat ulang screenshot-nya supaya katalog tetap sesuai.
Hiasan bunga di landing memakai aset tema Sage Garden (`public/templates/sage-garden/`).

## Logo dan identitas (`public/brand/`)
Logo asli Nauvite dari v1 (`nauvite/assets/images/logo-nauvite.png`, milik Nauvite), dipisahkan dari latar hitam menjadi versi emas/gelap/terang transparan, plus ikon dan gambar preview link. Rincian di `docs/IDENTITAS.md`.

## Lagu demo
`demo/lagu-demo-1.mp3` di storage Supabase (bucket `invitation-media`), dipakai 22 demo non-adat sejak 25 Nov 2026. Judul belum diketahui; file diunduh pemilik dari `our-wedding.link`. **Lisensi belum dipastikan**, dipakai atas keputusan pemilik. Cara mengganti: `node scripts/lagu-demo.mjs <file.mp3> <nama-baru.mp3> <slug ...>`.

Lagu adat di storage yang sama: `demo/lagu-sunda-1.mp3`, `demo/lagu-jawa-1.mp3`, `demo/lagu-betawi-1.mp3`, masing-masing di demo adatnya. Diunduh pemilik dari `undanganadat.com` (musik bawaan tema mereka). **Lisensi belum dipastikan** dan sumbernya situs pesaing, jadi sebaiknya diganti rekaman yang izinnya jelas.
