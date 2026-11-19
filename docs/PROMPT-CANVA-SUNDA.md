# Aset Canva untuk Tema Sundanese Elegance

Tema adat Premium pertama. Kerangkanya sama dengan tema Premium lain (`src/templates/illustrated/`), ditambah:
- **Pemandangan sampul berlapis**: langit fajar, gunung, kebun teh, gapura, wayang golek. Lapisan masuk bergiliran lalu bergerak pelan.
- **Animasi Buka Panto**: dua daun pintu kayu berukir yang terbuka saat tamu menekan tombol buka.
- Label berbahasa Sunda dipasang lewat kode, **bukan** di gambar. Aksara Sunda diputuskan tidak dipakai (19 Nov 2026).

Simpan semua hasil di `aset-mentah/sundanese-elegance/` dengan nama file persis seperti judul.

## Cara kerja
1. Salin prompt satu per satu ke Canva AI, generate, pilih hasil terbaik, download PNG.
2. Gambar **01 (kertas)** dan **11 (langit)** dikerjakan di percakapan Canva sendiri-sendiri, karena keduanya gambar penuh tanpa latar putih.
3. Gambar dalam satu kelompok (mis. 02 dan 03, 13 sampai 16, 17 dan 18) sebaiknya dibuat di **percakapan yang sama**, supaya gaya dan warnanya serasi.
4. Kabari Claude. Sisanya (potong, kompres, susun berlapis, animasi, demo, screenshot katalog) dikerjakan Claude.

Tips:
- Jangan minta tulisan, huruf, atau aksara apa pun di gambar.
- Latar putih dihilangkan lewat kode, tidak perlu BG Remover.
- Kalau objek menyatu dengan latar, tambahkan `clean defined edges`.
- Wayang golek dan gapura adalah bagian paling sulit untuk AI. Kalau hasilnya aneh (wajah rusak, tangan berlebih), generate ulang beberapa kali. Kalau tetap kurang bagus, lewati dulu, tema tetap bisa jalan tanpa wayang.

## Palet
Langit fajar keemasan dan peach, hijau kebun teh, kayu jati cokelat hangat, aksen emas pudar, bunga melati putih dan mawar merah muda pudar.

## Daftar gambar
| No | Nama file | Dipakai untuk |
|---|---|---|
| 01 | `01-kertas.png` | Tekstur latar seluruh undangan |
| 02 | `02-buket-kiri-atas.png` | Rangkaian melati besar pojok kiri atas |
| 03 | `03-buket-kanan-atas.png` | Rangkaian melati besar pojok kanan atas |
| 04 | `04-buket-bingkai-a.png` | Rangkaian kecil di atas bingkai foto |
| 05 | `05-buket-bingkai-b.png` | Rangkaian kecil melebar di bawah bingkai foto |
| 06 | `06-pembatas.png` | Pembatas antarbagian (ronce melati) |
| 07 | `07-noda.png` | Noda cat air samar di latar |
| 08-10 | `08-kelopak-1.png` s.d. `10-kelopak-3.png` | Kelopak melati dan daun teh yang jatuh pelan |
| 11 | `11-langit.png` | Langit fajar, lapisan paling belakang sampul |
| 12 | `12-awan.png` | Awan tipis yang bergerak pelan |
| 13 | `13-gunung.png` | Pegunungan di kejauhan |
| 14 | `14-kebun-teh.png` | Bukit kebun teh, lapisan tengah |
| 15 | `15-gapura.png` | Gapura kayu Sunda di tengah sampul |
| 16 | `16-depan.png` | Semak melati dan daun di bagian paling depan bawah |
| 17 | `17-wayang-kiri.png` | Wayang golek di sisi kiri |
| 18 | `18-wayang-kanan.png` | Wayang golek di sisi kanan |
| 19 | `19-pintu-kiri.png` | Daun pintu kiri untuk Buka Panto |
| 20 | `20-pintu-kanan.png` | Daun pintu kanan untuk Buka Panto |

---

## Prompt

### 01-kertas (percakapan sendiri)
```
Seamless texture of handmade warm cream watercolor paper, very subtle grain, a few extremely faint golden peach watercolor stains, flat, top-down view, no objects, no text
```

### 02-buket-kiri-atas
```
Watercolor clipart of a flower arrangement for the top left corner of a page, white jasmine flowers and jasmine buds, a few soft dusty pink roses, deep green jasmine leaves and young tea leaves trailing down, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 03-buket-kanan-atas
```
Watercolor clipart of a flower arrangement for the top right corner of a page, white jasmine flowers and jasmine buds, a few soft dusty pink roses, deep green jasmine leaves and young tea leaves trailing down, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 04-buket-bingkai-a
```
Watercolor clipart of a small compact flower cluster, white jasmine flowers, one small dusty pink rose, a few deep green leaves, arranged diagonally, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 05-buket-bingkai-b
```
Watercolor clipart of a small wide flower cluster spreading sideways, white jasmine flowers and buds, one dusty pink rose, deep green jasmine leaves and young tea leaves, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 06-pembatas
```
Watercolor clipart of a long thin horizontal garland of strung white jasmine flowers, like a traditional jasmine flower string, with small green leaves at both ends, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 07-noda
```
Soft abstract watercolor wash, very pale golden peach and pale sage green blending, irregular organic shape in the center, lots of white space around it, on a plain pure white background, no objects, no text
```

### 08-kelopak-1
```
Watercolor clipart of one single small white jasmine flower, isolated on a plain pure white background, no text, png clipart style
```

### 09-kelopak-2
```
Watercolor clipart of one single small young green tea leaf, isolated on a plain pure white background, no text, png clipart style
```

### 10-kelopak-3
```
Watercolor clipart of one single dusty pink rose petal, slightly curled, isolated on a plain pure white background, no text, png clipart style
```

### 11-langit (percakapan sendiri)
```
Soft watercolor painting of a dawn sky, warm golden yellow near the bottom fading to peach and pale blue at the top, a soft glowing sun low on the horizon, gentle and calm, vertical portrait composition, no land, no mountains, no objects, no text
```

### 12-awan
```
Watercolor clipart of a few soft wispy horizontal clouds, pale cream and light peach, airy and thin, spread wide, isolated on a plain pure white background, no sky color, no text, png clipart style
```

### 13-gunung (percakapan yang sama dengan 14 sampai 16)
```
Watercolor clipart of a wide range of misty volcanic mountains in West Java, soft blue grey and muted sage green, layered peaks fading into mist at the bottom, wide horizontal composition, clean defined top edges, isolated on a plain pure white background, no sky, no sun, no text, png clipart style
```

### 14-kebun-teh
```
Watercolor clipart of rolling hills covered with neat rows of tea plantation, fresh green and soft yellow green, wide horizontal composition, gentle curves, clean defined top edges, isolated on a plain pure white background, no sky, no mountains, no people, no text, png clipart style
```

### 15-gapura
```
Watercolor clipart of a traditional Sundanese carved wooden gate, symmetrical, warm teak brown wood with subtle gold accents, a curved roof with layered wooden shingles, carved floral ornaments on the pillars, front view, standing on the ground, clean defined edges, isolated on a plain pure white background, no people, no text, png clipart style
```

### 16-depan
```
Watercolor clipart of a low wide border of lush foliage for the bottom of a page, white jasmine bushes, deep green leaves, small dusty pink roses, spread across the full width, dense at the bottom and lighter at the top, clean defined edges, isolated on a plain pure white background, no text, png clipart style
```

### 17-wayang-kiri (percakapan yang sama dengan 18)
```
Watercolor clipart of a traditional Sundanese wooden wayang golek puppet, a graceful noble female character in an elegant red and gold costume with a golden crown, facing right, full body, standing upright, refined and calm expression, clean defined edges, isolated on a plain pure white background, no hands holding it, no text, png clipart style
```

### 18-wayang-kanan
```
Watercolor clipart of a traditional Sundanese wooden wayang golek puppet, a graceful noble male character in an elegant red and gold costume with a golden crown, facing left, full body, standing upright, refined and calm expression, clean defined edges, isolated on a plain pure white background, no hands holding it, no text, png clipart style
```

### 19-pintu-kiri (percakapan yang sama dengan 20)
```
Watercolor illustration of one tall narrow traditional Sundanese carved wooden door panel, warm teak brown wood, carved floral and vine ornaments, subtle gold details, front view, flat, fills the whole image from top to bottom, the hinge side on the left, no frame, no wall, no text
```

### 20-pintu-kanan
```
Watercolor illustration of one tall narrow traditional Sundanese carved wooden door panel, warm teak brown wood, carved floral and vine ornaments, subtle gold details, front view, flat, fills the whole image from top to bottom, the hinge side on the right, matching the previous door, no frame, no wall, no text
```

---

## Label berbahasa Sunda (dipasang lewat kode)
Mohon dicek oleh orang yang paham bahasa Sunda sebelum tema dirilis.

| Bagian | Label Sunda | Arti |
|---|---|---|
| Salam pembuka sampul | Sampurasun | Salam pembuka |
| Mempelai | Nu Badé Nikah | Yang akan menikah |
| Hitung mundur | Ngitung Poé | Menghitung hari |
| Acara | Waktos sareng Tempat | Waktu dan tempat |
| Cerita cinta | Carita Urang | Cerita kami |
| Galeri | Galeri | Galeri |
| Amplop digital | Tanda Kanyaah | Tanda kasih sayang |
| RSVP dan ucapan | Du'a sareng Pangdu'a | Doa dan restu |
| Penutup | Hatur Nuhun | Terima kasih |
