# Nauvite v2 — Peta Kerja

Nauvite v1 (`C:\Nauval Dev\nauvite`) tetap jalan untuk klien sampai v2 siap. Folder ini dikerjakan terpisah.
Referensi situs pesaing ada di `docs/REFERENSI.md`.

## Keputusan
- **Teknologi:** Next.js (App Router) + TypeScript + Tailwind.
- **Database:** Supabase lokal lewat Docker selama pengembangan; project Supabase cloud baru saat rilis.
- **Pembayaran tetap manual lewat WhatsApp.** Admin mengonfirmasi pembayaran lalu mengaktifkan undangan. Belum ada payment gateway.
- **Uji coba gratis 1 hari (masuk rencana):** calon klien bisa daftar sendiri dan langsung mengisi undangan sebagai **draf**. Draf bisa dilihat dan dibagikan selama 1 hari dengan tanda "Contoh", tapi belum bisa dipakai menyebar ke tamu. Untuk menerbitkan, klien bayar lewat WA dan admin mengaktifkan.

## Sistem template (inti v2, rancang sejak awal)
Template akan sangat banyak, jadi setiap template punya **manifest** yang berisi:
- id, nama, kategori (Adat, Signature, Clean/Editorial, dst.), asal daerah, label (Baru/Populer), versi dengan atau tanpa foto;
- **daftar isian khusus template**, masing-masing dengan **nilai bawaan** dan sifat opsional. Contoh:
  - Clean: latar (foto atau video, ada bawaan), warna lapisan, jenis huruf;
  - Sunda: teks sapaan Sunda, pilihan lagu bawaan.

Panel editor **menampilkan isian secara otomatis** berdasarkan manifest template yang dipilih. Kalau isian kosong, template memakai nilai bawaan. Menambah template baru tidak boleh membutuhkan perubahan di editor.

## Kelas tema (rencana)
- **Reguler**: tema yang sudah ada (Signature, Clean, Adat). Harga dasar.
- **Premium**: tema berbasis ilustrasi (cat air, bunga, ornamen) dengan aset berlapis, bingkai foto berhias, pembatas gelombang, animasi lembut. Acuan: punakawandigital spesial-01 (lihat REFERENSI.md). Harga lebih tinggi, cocok jadi bahan promosi di media sosial.
- Manifest akan punya field `tier` (reguler/premium) terpisah dari `category` (gaya: signature/clean/adat), supaya katalog bisa difilter dan harga bisa beda per kelas.
- Aset ilustrasi dibuat pemilik dengan Canva AI (PNG transparan per bagian) atau dibeli dengan lisensi yang mengizinkan produk digital. Claude mengompres, menyusun, dan menganimasikan.

## Tahap
1. **Fondasi (v2 siap menggantikan v1)**
   - Skema database baru: password klien tidak lagi disimpan di tabel; klien login lewat Supabase Auth.
   - RLS: publik hanya membaca undangan yang aktif (tanpa data sensitif) dan mengirim ucapan; klien hanya mengubah undangannya sendiri; admin akses penuh.
   - Storage: hanya pemilik undangan yang boleh mengunggah, mengganti, dan menghapus file.
   - Sistem template + manifest + editor yang membaca manifest.
   - Halaman undangan `/<slug>` dengan tag OG dari server (menggantikan Cloudflare Worker dan `api/render.js`), nama tamu `?to=`, RSVP, ucapan, amplop digital, musik.
   - Tema dipindahkan: Royal Gold, Floral Light, Midnight Dark (dipakai klien aktif, prioritas), lalu Minimalist, Sunda, Jawa, Betawi, Batak.
   - Panel klien dan panel admin (buat akun klien, atur tema dan masa aktif, konfirmasi pembayaran, atur harga, pengaturan bisnis).
   - Landing page dipindahkan dari v1.
   - Rilis dan pemindahan data klien lama (lihat `docs/DEPLOY.md`).
2. **Uji coba gratis 1 hari**: daftar mandiri, mode draf dengan tanda "Contoh", kedaluwarsa 24 jam, tombol "Terbitkan" yang mengarah ke pembayaran via WA.
3. **Program mitra wedding organizer**: menyasar WO, MUA, fotografer, dan vendor dekorasi yang ingin menambahkan undangan digital ke paket mereka.
   - Role `partner` dan kolom `partner_id` di undangan sudah disiapkan di skema sejak tahap 1.
   - **Alur yang disepakati (dibuat sesimpel mungkin untuk mitra):**
     1. Daftar mitra lewat WA dari halaman "Jadi Mitra"; admin membuatkan akun mitra.
     2. Undangan klien mitra dibuat admin (atau mitra sendiri dari dasbor) dan ditandai milik mitra itu.
     3. Data undangan bisa diisi **mitra dari dasbornya, pengantin dari akunnya sendiri, atau keduanya**. Akun pengantin opsional.
     4. Bayar 50rb per undangan via WA (harga normal 75rb), admin mengaktifkan. Tanpa deposit, tanpa minimal beli.
     5. Undangan menampilkan "Dipersembahkan oleh [Nama mitra]".
   - Mitra bisa melihat RSVP dan ucapan semua undangan kliennya (berguna untuk hitungan tamu/katering).
   - Deposit kuota atau harga bertingkat ditambahkan nanti kalau ada mitra yang rutin order banyak.
   - Diputuskan (19 Nov 2026): tema adat dengan ilustrasi detail masuk paket Premium (Rp99rb), dimulai dari Sunda.
   - Akun mitra dengan kuota undangan dan harga khusus mitra.
   - Nama mitra tampil di undangan, misalnya "Dipersembahkan oleh [Nama WO]".
   - Dasbor mitra untuk mengelola undangan semua klien mereka.
   - Halaman "Jadi Mitra Nauvite" di landing.
4. **Template tambahan secara rutin**, termasuk adat lain (Minang, Bali, Bugis, Palembang) dan versi tanpa foto sebagai paket hemat.

## Ide fitur yang dicatat (belum dijadwalkan)
Live streaming, dresscode per acara, turut mengundang, batas waktu RSVP, ekspor RSVP ke Excel, impor daftar tamu, template pesan WA, kunci undangan untuk tamu terdaftar, buku tamu QR (add-on), pustaka lagu bawaan yang diisi admin + upload lagu sendiri oleh klien.

## Perintah sehari-hari
| Perintah | Fungsi |
|---|---|
| `npx supabase start` | Menyalakan database lokal (Docker Desktop harus sudah jalan) |
| `npm run dev` | Menjalankan website di http://localhost:3000 |
| `npx supabase stop` | Mematikan database lokal |
| `npx supabase db reset` | Mengulang database lokal dari awal sesuai file migrasi + data contoh `supabase/seed.sql` |
| `npm run test:rls` | Reset database lokal lalu menjalankan uji keamanan (tamu, klien, mitra, admin) |

Akun percobaan lokal (password `password123`): `admin@nauvite.test`, `klien@nauvite.test`, `klien2@nauvite.test`, `mitra@nauvite.test`.

Dashboard database lokal: http://localhost:54323

## Progres tahap 1
- [x] Supabase lokal, skema database, RLS, storage, uji keamanan (`npm run test:rls`)
- [x] Sistem template + manifest, validasi isian
- [x] Halaman undangan `/<slug>`: OG dari server, `?to=`, RSVP, ucapan, amplop digital (logo bank), musik, YouTube
- [x] Tema Clean (latar video bawaan), Royal Gold, Floral Light, Midnight Dark. Data format v1 terbaca.
- [x] Login (username atau email), panel admin (undangan, status/masa aktif, akun klien, reset password, link tamu, mitra, pengaturan)
- [x] Dasbor klien dan mitra (lihat undangan, link tamu, ringkasan RSVP)
- [x] Editor undangan untuk klien/mitra/admin (form isian tema otomatis dari manifest, unggah foto/video/lagu dengan kompresi WebP, pratinjau HP)
- [x] Tema Premium pertama: Sage Garden (ilustrasi Canva AI, animasi berlapis). Manifest punya field tier.
- [x] Tema Premium kedua dan ketiga: Dusty Rose, Lavender Mist (kerangka ilustrasi).
- [x] Kerangka tema ilustrasi (`src/templates/illustrated/`): tema Premium baru cukup folder aset standar + `theme.ts` (palet, label) + `manifest.ts`. Panduan aset: `docs/PROMPT-CANVA-TEMA.md`.
- [x] Identitas Nauvite (logo lama, hijau tua + emas, motif lengkung): docs/IDENTITAS.md
- [x] Paket = level tema: Basic Rp75.000 / Premium Rp99.000, mitra Rp50.000 / Rp75.000 (diatur di Pengaturan)
- [x] Landing: perbandingan cetak vs digital + kalkulator biaya; halaman /mitra; ulasan (klien kirim dari dasbor, admin setujui, tampil di landing kalau sudah minimal 3)
- [x] Tema Sunda (Premium): template adat sendiri `src/templates/adat/` (pintu Buka Panto, pemandangan berlapis, foto berbingkai rumah adat, ornamen siger/kujang/julang ngapak/bilik). Prompt Canva di `docs/PROMPT-CANVA-SUNDA.md`, olah aset dengan `scripts/olah-aset.mjs` dan `scripts/olah-kertas.mjs`.
- [x] Tema Jawa (Javanese Keraton) dan Betawi (Betawi Heritage), Premium, pakai template adat yang sama. Nama file aset adat dibuat umum (gunung, bukit, tokoh, mahkota, atap, dll.); bentuk lapisan gunung bisa disetel per tema lewat `--mountain-scale`, `--mountain-shift`, `--mountain-size`, `--mountain-pos` (versi desktop: akhiran `-side`).
- [x] Tema Surat Cinta (25 Nov 2026, Basic, **tanpa foto**): undangan berbentuk surat pos, semua gambar SVG lewat kode (`src/templates/surat-cinta/`), 3 warna. Gulir otomatis dan bilah bawah: `components/invitation/guide-dock.tsx`, berhenti saat layar disentuh dan di bagian RSVP. Manifest `withPhoto: false` otomatis menyembunyikan isian foto di editor, masuk filter "Tanpa foto" di katalog, dan gambar preview WhatsApp dibuat otomatis (`/og/<slug>`).
- [x] Paket **Hemat** untuk tema tanpa foto (25 Nov 2026): normal Rp50.000, promo Rp39.000 sampai tanggal yang diatur admin (otomatis kembali normal), mitra Rp25.000. Semua diatur di Pengaturan. Jasa isi data: Hemat +Rp10.000 (opsional, `HEMAT_FILL_FEE` di `src/lib/site.ts`), Basic dan Premium gratis.
- [x] Tema Koran Pagi (Hemat, tanpa foto): berita utama, agenda kupon, teka-teki silang otomatis dari nama dan tanggal, iklan baris, surat pembaca. Ilustrasi SVG gaya cukil, 3 warna.
- [x] Tema Piringan Hitam (Hemat, tanpa foto): sampul album 70-an, piringan bisa diputar dengan jari, Sisi A dan B, daftar lagu, kaset rekening, titip salam. 3 warna.
- [x] Tema Herbarium (Hemat, tanpa foto): buku bunga kering; buket disusun dari huruf nama pasangan, tiap tamu dapat rangkaian dari namanya sendiri. 3 warna.
- [x] Tema Tiket Kereta (Hemat, tanpa foto): karcis dilubangi, papan keberangkatan berputar, rute cerita mengikuti gulungan, nomor kursi dari nama tamu. 3 warna.
- [x] Pilihan lagu di editor: lagu bawaan tema, lagu sendiri, atau tanpa lagu. Undangan baru memakai lagu bawaan; daftar lagunya di `src/lib/invitation/music.ts`.
- [x] Coba dengan nama sendiri (`/coba/<slug demo>`, bagian di landing): demo tampil dengan nama dan tanggal calon klien, tidak ada yang disimpan.
- [x] Daftar tamu (`/tamu/<id>`): tempel banyak nama, kirim lewat WA satu per satu, tanda terkirim, pesan Formal/Islami/Santai yang bisa diubah.
- [x] Uji coba gratis 1 hari (`/daftar`): akun dibuat sendiri, undangan draf bisa dibuka 24 jam dengan bilah contoh, terbit setelah admin mengaktifkan. Pembatas di `src/lib/trial/actions.ts`.
- [ ] Tema Batak (pakai template adat yang sama)
- [x] Undangan cetak (22 Nov 2026): halaman `/cetak` (katalog 3 kelas Hemat/Foil/Eksklusif, tampilan besar per desain, pesan lewat WA dengan kode desain), bagian di landing, menu admin **Cetak** (tambah/ubah desain, unggah foto, harga jual, modal dan kode vendor khusus admin, minimal pesanan, lama produksi). Blangko dibeli dari vendor lalu dicetak nama dan isinya; kode vendor tidak ditampilkan ke klien (pakai kode NC-xx). Harga jual dari daftar harga pemilik 22 Nov 2026 (margin 30%, mulai Rp700/pcs), belum termasuk plastik (+Rp500) dan label stiker nama (+Rp200) yang bisa diatur di admin. Gambar awal dari katalog vendor, nanti diganti foto sampel asli.
- [ ] Desain cetak khusus Nauvite yang senada dengan tema digital: dicetak di percetakan digital (art carton A3+), jangan printer sendiri (boros tinta). Jadikan paket premium, kerjakan kalau sudah ada permintaan.
- [x] Daftar RSVP lengkap: filter, cari, hapus ucapan spam, ekspor Excel (.xlsx)
- [x] Landing page: hero dengan video tema asli, katalog berfilter + demo, fitur, Premium, cara pesan, harga (dari Pengaturan), mitra, FAQ, tombol WhatsApp
- [ ] Rilis dan pemindahan data v1
