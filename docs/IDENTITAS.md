# Identitas Nauvite

Panduan singkat supaya semua tampilan Nauvite (landing page, panel, media sosial, pesan WhatsApp) terasa satu merek. Ditetapkan pemilik 12 Nov 2026.

## Filosofi: lengkung yang selalu terbuka
Logo Nauvite adalah huruf N di dalam lengkung yang terbuka di bagian bawah.
- **Janur dan gerbang.** Di pernikahan Indonesia, janur melengkung dan gapura pelaminan menandai pintu masuk menuju hari bahagia. Nauvite adalah lengkung itu, yang sampai ke HP setiap tamu.
- **Terbuka di bawah.** Pintu yang selalu terbuka menyambut tamu.
- **Emas di tengah gelap.** Seperti cahaya lampu di malam resepsi. Emas dipakai sedikit, untuk hal penting saja.

## Logo
Logo asli dari v1 (`C:\Nauval Dev\nauvite\assets\images\logo-nauvite.png`), dipisahkan dari latar hitamnya. File di `public/brand/`:

| File | Dipakai di |
|---|---|
| `logo-emas.png/.webp` | Di atas latar gelap (hijau tua) |
| `logo-gelap.png/.webp` | Di atas latar terang (krem) |
| `logo-terang.png/.webp` | Cadangan untuk latar gelap selain hijau |
| `ikon-*.png`, `apple-touch-icon.png` | Favicon dan ikon HP (`src/app/icon.png`, `src/app/apple-icon.png`) |
| `og.jpg` | Gambar preview link landing page di WhatsApp |

Komponen: `src/components/brand/logo.tsx` (`<Logo tone="emas" | "gelap" />`).

## Warna (hijau tua dan emas)
| Nama | Hex | Token | Dipakai untuk |
|---|---|---|---|
| Hijau Tinta | `#17261F` | `ink` | Latar gelap, sidebar, tombol utama, teks utama |
| Emas Lengkung | `#C99C34` | `gold` | Logo, garis lengkung, isian dan aksen di atas latar gelap |
| Emas Tua | `#96711F` | `brass` | Teks emas dan tombol emas di atas latar terang (kontras cukup) |
| Kertas | `#F3EEE5` | `paper` | Latar utama |
| Kartu | `#FFFCF6` | `card` | Kartu dan panel |
| Amplop | `#ECE1C8` | `brass-soft` | Latar lembut, chip |
| Daun Kering | `#66706A` | `muted` | Teks pendukung |

Token ada di `src/app/globals.css` (`@theme`). Warna tema undangan tidak mengikuti ini; setiap tema punya warnanya sendiri.

## Huruf
- **Judul: Fraunces** (`font-display`), serif yang hangat dan nyaman dibaca, juga di HP. Bodoni Moda sempat dicoba (mirip huruf N di logo) tapi garis tipisnya kurang nyaman dibaca, jadi tidak dipakai.
- **Teks: Plus Jakarta Sans**, huruf rancangan Indonesia.
- Didefinisikan di `src/app/fonts.ts`.

## Motif: lengkung
Lengkung dari logo dipakai berulang. **Tidak ada bunga** di identitas Nauvite; bunga milik tema undangan.
- `ArchLines` (`src/components/brand/arch.tsx`): dua garis gerbang bertingkat, bisa tergambar sendiri (`draw`). Dipakai di hero landing (di belakang mockup HP) dan halaman masuk.
- `OpenArc`: lengkung kecil terbuka di bawah seperti di logo, untuk pembatas atau hiasan kecil.
- Ide lanjutan: bingkai foto beratap lengkung, pembatas antarbagian, stiker media sosial.

## Nada bicara
Hangat, sopan, dan jelas. "Kalian" untuk pasangan, "Bapak/Ibu" untuk tamu. Kalimat pendek, tanpa janji berlebihan atau angka yang tidak bisa dibuktikan.
