# Aset Canva untuk Tema Premium Baru

Semua tema Premium memakai satu kerangka tampilan (`src/templates/illustrated/`).
Jadi setiap tema baru butuh **10 gambar yang sama jenisnya** seperti Sage Garden. Yang berubah hanya jenis bunga dan warnanya.

## Cara kerja
1. Buat folder `aset-mentah/<nama-tema>/` (mis. `aset-mentah/dusty-rose/`).
2. Salin prompt satu per satu ke Canva AI, generate, pilih hasil terbaik, download PNG.
3. Simpan dengan nama file persis seperti judul (mis. `02-buket-kiri-atas.png`).
4. Kabari Claude. Sisanya (potong, kompres, susun, animasi, demo, screenshot katalog) dikerjakan Claude.

Tips dari Sage Garden:
- Nomor 01 (kertas) dikerjakan di **percakapan Canva terpisah**, supaya Canva tidak ikut melukis bunga di atas kertas.
- Kalau bunga menyatu dengan latar, tambahkan `clean defined edges` dan pastikan ada `isolated on a plain pure white background`.
- Tidak perlu BG Remover. Latar putih dihilangkan lewat kode.
- Buket 02 dan 03 sebaiknya dibuat di percakapan yang sama, supaya gaya bunganya mirip.
- Jangan minta tulisan atau huruf apa pun di gambar.

## Daftar 10 gambar
| No | Nama file | Dipakai untuk |
|---|---|---|
| 01 | `01-kertas.png` | Tekstur latar seluruh undangan |
| 02 | `02-buket-kiri-atas.png` | Buket besar pojok kiri atas sampul |
| 03 | `03-buket-kanan-atas.png` | Buket besar pojok kanan atas |
| 04 | `04-buket-bingkai-a.png` | Rangkaian kecil di atas bingkai foto dan pojok kartu acara |
| 05 | `05-buket-bingkai-b.png` | Rangkaian kecil melebar di bawah bingkai foto dan di penutup |
| 06 | `06-pembatas.png` | Pembatas panjang mendatar antarbagian |
| 07 | `07-noda.png` | Noda cat air samar di latar |
| 08-10 | `08-kelopak-1.png` s.d. `10-kelopak-3.png` | Kelopak dan daun yang jatuh pelan |

## Resep (untuk tema apa saja)
Ganti dua bagian dalam kurung siku:
- **[BUNGA]**: jenis dan warna bunga, mis. `dusty pink and mauve garden roses, blush peonies`
- **[DAUN]**: jenis dan warna daun, mis. `muted green eucalyptus and dried pampas grass`

Lalu pakai pola prompt Dusty Rose di bawah, dengan bagian bunga dan daunnya diganti.

---

## Contoh siap pakai: Dusty Rose
Nuansa merah muda pudar dan mauve, bagian gelap warna anggur tua. Simpan di `aset-mentah/dusty-rose/`.

### 01-kertas (percakapan sendiri)
```
Seamless texture of handmade warm ivory watercolor paper, very subtle grain, a few extremely faint dusty pink and mauve watercolor stains, flat, top-down view, no objects, no text
```

### 02-buket-kiri-atas
```
Watercolor clipart of a flower bouquet for the top left corner of a page, dusty pink and mauve garden roses, blush peonies, small burgundy buds, muted green eucalyptus leaves and soft dried pampas grass trailing down, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 03-buket-kanan-atas
```
Watercolor clipart of a flower bouquet for the top right corner of a page, dusty pink and mauve garden roses, blush peonies, small burgundy buds, muted green eucalyptus leaves and soft dried pampas grass trailing down, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 04-buket-bingkai-a
```
Watercolor clipart of a small compact flower cluster, two dusty pink garden roses, one small burgundy bud, a few muted green eucalyptus leaves, arranged diagonally, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 05-buket-bingkai-b
```
Watercolor clipart of a small wide flower cluster spreading sideways, one mauve garden rose, tiny blush flowers, small burgundy buds, muted green eucalyptus leaves and a little dried pampas grass, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 06-pembatas
```
Watercolor clipart of a long thin horizontal garland, muted green eucalyptus leaves with one small dusty pink rose in the middle, like a border decoration, clean defined edges, isolated on a plain pure white background, no paper texture, no stains, no text, png clipart style
```

### 07-noda
```
Soft abstract watercolor wash, very pale dusty pink and pale mauve blending, irregular organic shape in the center, lots of white space around it, on a plain pure white background, no objects, no text
```

### 08-kelopak-1
```
Watercolor clipart of one single dusty pink rose petal, slightly curled, isolated on a plain pure white background, no text, png clipart style
```

### 09-kelopak-2
```
Watercolor clipart of one single small muted green eucalyptus leaf, isolated on a plain pure white background, no text, png clipart style
```

### 10-kelopak-3
```
Watercolor clipart of one single mauve rose petal, isolated on a plain pure white background, no text, png clipart style
```

---

## Ide tema berikutnya (tinggal ganti [BUNGA] dan [DAUN])
| Tema | [BUNGA] | [DAUN] | Bagian gelap |
|---|---|---|---|
| Navy Hydrangea | `soft blue hydrangeas, white roses` | `silver-green eucalyptus leaves` | biru navy |
| Terracotta Boho | `terracotta and burnt orange roses, peach ranunculus` | `dried palm leaves and pampas grass` | cokelat bata |
| Lavender Field | `lavender sprigs, lilac sweet peas, white roses` | `soft grey-green olive leaves` | ungu tua |
| Melati Putih | `white jasmine flowers, white tuberose, small white roses` | `deep green jasmine leaves` | hijau botol |

Untuk tema adat (Sunda, Jawa, Betawi, Batak), daftar gambarnya akan sedikit berbeda (ada gapura, gunungan, atau motif kain). Prompt-nya dibuat terpisah saat temanya mulai dikerjakan.
