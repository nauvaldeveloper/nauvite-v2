# Referensi Nauvite v2

Situs pesaing yang pernah dikirim pemilik sebagai referensi, beserta apa yang dicatat dari masing-masing. Semua dijadikan **inspirasi**, bukan dijiplak: jangan menyalin desain, teks, ilustrasi, atau file lagu mereka.

Tambahkan referensi baru di bawah dengan format yang sama, dan tulis apa yang disukai dari situs itu.

---

## kekondangan.com
Platform undangan swalayan (daftar, pilih tema, isi, bayar sendiri). Next.js.

**Landing page** (https://kekondangan.com/)
- Hero: judul jelas, harga langsung terlihat ("Mulai Rp99.000, bayar sekali · Coba gratis · Tamu tanpa batas"), mockup HP berisi tema asli, notifikasi melayang ("Hadir, 2 orang", "Ucapan baru dari Rina").
- Angka bukti: jumlah tema, tema adat, lagu, undangan terbit.
- Katalog dengan tab kategori (Interaktif, Motion, MiniMotion, Deluxe, MiniDeluxe), label Populer/Baru, tombol Lihat demo & Pilih tema.
- Fitur dikelompokkan jadi Buat, Kelola, Rayakan.
- Harga: 5 paket Rp99rb sampai Rp399rb dengan harga coret, plus daftar "semua paket sudah termasuk".
- FAQ, tombol WhatsApp support, footer lengkap.

**Ide produk yang dicatat**
- Versi **tanpa foto** sebagai paket hemat (MiniMotion, MiniDeluxe).
- Uji coba gratis 1 hari untuk paket tanpa foto.
- Fitur: tamu bernama, RSVP, impor tamu dari Excel, kirim WA, kunci undangan, amplop digital, live streaming, dresscode, turut mengundang, batas waktu RSVP, template pesan WA.
- Add-on berbayar: buku tamu QR (Rp59rb), domain sendiri, arsip permanen.
- Wedding planner gratis (checklist per adat, anggaran, porsi katering dari RSVP).
- Program reseller white-label (https://kekondangan.com/reseller): paket kredit tahunan, logo usaha reseller di undangan, etalase sendiri, simulasi untung.
- Jumlah template sangat banyak, tema adat daerahnya saja sudah 16. Ini acuan skala Nauvite: sistem manifest dan katalog harus siap menampung puluhan template.
- Pembeda Nauvite: bukan reseller umum, tapi **program mitra untuk wedding organizer** (WO, MUA, fotografer, vendor dekorasi) yang memasukkan undangan ke paket layanan mereka.
- Blog 150 artikel tentang adat dan tips (untuk trafik Google).
- Tema Interaktif: undangan berbentuk game piksel (https://kekondangan.com/interaktif-01).

**Demo tema Motion** (contoh https://kekondangan.com/motion-01, https://kekondangan.com/motion-07)
- Animasi pembuka berupa video MP4 sekitar 20 detik, isi undangan ditumpuk di atasnya.
- Isi rapi: monogram, foto berbingkai lengkung, live streaming, kisah cinta, galeri, tombol QR tamu.
- Catatan: pendekatan Nauvite dengan animasi CSS berlapis lebih ringan dan teksnya tetap teks asli.

---

## undanganadat.com
Demo: https://undanganadat.com/demo/sunda

- Cover dan hero tersusun dari belasan lapisan ilustrasi cat air (langit, gunung, pohon, gedung, merak, bunga), sekitar 117 gambar, dimuat sekitar 9 detik.
- Setiap lapisan masuk dari arahnya masing-masing secara bergiliran, lalu bergoyang halus tanpa henti dengan durasi berbeda (10–14 detik).
- Saat dibuka: cover memudar, lanskap menyusun ulang menjadi hero dengan monogram besar, ada kawanan burung terbang.
- Animasi setiap section diputar ulang saat masuk layar (scroll ke bawah maupun ke atas).
- Semua murni CSS + JS, tanpa library animasi.
- Pelajaran: kekayaan visualnya datang dari aset gambar, bukan hanya dari kode.

---

## janiva.id
Demo: https://janiva.id/undangan/sunda-modern/demo

- Cover: langit fajar keemasan, gapura kayu Sunda berukir di tengah, kebun teh dan pegunungan, wayang golek kiri dan kanan, mawar dan melati di bawah. Siger kecil, aksara Sunda, nama pengantin di atas.
- Saat dibuka: isi cover memudar, gapura tetap, lalu seolah kamera masuk menembus gapura.
- Animasi CSS yang terus jalan: burung terbang dengan sayap mengepak, kabut mengalir, bambu bergoyang, ronce melati berayun, daun bergetar, kelopak mawar jatuh sambil berputar, cahaya matahari berdenyut.
- Semua judul berbahasa Sunda: Sampurasun, Nu Bade Nikah, Ngitung Poé, Carita Urang, Tanda Kanyaah, Hatur Nuhun.
- Hiasan khusus di setiap section: siluet gunung di bawah, ronce melati dengan bunga merah di atas, mawar di sudut kartu.
- Timeline kisah cinta memakai batang bambu sebagai garisnya.
- Kartu acara mencantumkan dresscode.
- RSVP dengan tombol pilihan "Insya Allah hadir / Belum bisa hadir".
- Penutup: senja jingga dengan sepasang wayang golek dan gapura.
- Pelajaran: celah terbesar Nauvite ada di ilustrasi detail. Rencananya ilustrasi dibuat pemilik dengan Canva AI per lapisan PNG transparan.

---

## intvite.com
Template: https://intvite.com/template/template-1

- Latar layar penuh berupa **video** (`video_bg_1.mp4`), ditimpa lapisan warna hijau gelap semi-transparan.
- Teks gaya editorial (judul serif miring, paragraf cerita, kutipan), kelopak melayang, tombol "Masuk ke undangan".
- Ada toggle tampilan "Solid".
- Ide yang diambil: tema Clean di v2 punya **latar bawaan, tapi klien boleh menggantinya** dengan foto atau video sendiri (isian opsional di editor).

---

## punakawandigital.id
Landing: https://punakawandigital.id/ (biasa saja). Yang disukai pemilik: demo undangan **https://inv.punakawandigital.id/spesial-01/**. Pemilik menilai gaya ini paling kuat untuk dijual dan dipamerkan di media sosial. Dijadikan acuan **kelas Premium** Nauvite.

**Yang membuat terasa premium**
- Ilustrasi bunga cat air (biru tua dan biru muda) yang konsisten: buket di sudut atas, rangkaian daun di tepi, buket kecil yang menempel dan "keluar" dari bingkai foto.
- Latar tekstur kertas krem dengan noda cat air merah muda samar, jadi terasa seperti undangan cetak.
- Satu palet ketat: biru tua, krem, sedikit merah muda.
- Sampul: foto pasangan memudar ke krem di bagian bawah, nama dengan huruf serif tipis, tombol "Buka Undangan" biru tua.
- Setelah dibuka: bingkai foto lonjong (oval memanjang) berbingkai putih, nama dengan huruf sambung tebal, hitung mundur dalam kotak biru tua membulat, tombol "Save The Date".
- Kaligrafi Bismillah dan salam pembuka dengan huruf sambung.
- Bagian krem dan biru tua bergantian, dipisah bentuk gelombang. Bagian biru tua memakai motif daun samar.
- Galeri grid foto, kartu-kartu dengan bayangan lembut, footer biru tua.
- Teknis: WordPress + Elementor + puluhan skrip jQuery (berat). Nauvite bisa mencapai tampilan serupa dengan jauh lebih ringan.

**Pelajaran**
- Sama seperti undanganadat.com: kemewahan datang dari **aset ilustrasi yang serasi**, bukan dari kode. Setiap tema premium butuh satu set ilustrasi lengkap (buket sudut, rangkaian tepi, buket kecil untuk bingkai foto, pembatas gelombang, tekstur kertas).
- Jangan jiplak ilustrasi, warna persis, atau tata letaknya. Ambil prinsipnya: palet ketat, ilustrasi berulang, bingkai foto yang "ditembus" ilustrasi, ritme bagian terang/gelap.

---

## satuundangan.id
https://satuundangan.id/ (dilihat 12 Nov 2026). Platform undangan swalayan + wedding planner gratis.

**Yang disukai pemilik**
- Bagian **"Perbandingan: Kenapa Pakai Undangan Digital?"**: dua kolom undangan cetak vs digital. Cetak: biaya Rp5.000-15.000 per lembar + ongkir, proses 1-3 minggu, salah ketik harus cetak ulang, distribusi diantar satu per satu. Digital: bayar sekali, bebas revisi kapan saja, link personal per tamu lewat WhatsApp, ditutup "estimasi penghematan".
- **Paket bertingkat** (Basic, Premium, Eksklusif): semua desain bebas dipilih, yang beda fiturnya (jumlah foto galeri 8/20/35, upload MP3 sendiri, tanpa watermark, subdomain), masa aktif sama 1 tahun. Memakai harga coret dan label "HEMAT 62%".
- **Ulasan pengantin**: tiga kutipan dengan nama pasangan dan kota.

**Hal lain yang dicatat**
- Coba gratis, bayar saat mau disebar (mirip rencana uji coba gratis Nauvite tahap 2).
- Klaim "Dipercaya 5.000+ calon pengantin, 4.9/5" di hero.
- Wedding planner dan kalkulator budget gratis, kalkulator weton, blog.
- Tombol "Custom Design" untuk yang tidak menemukan tema.

**Catatan untuk Nauvite**
- Perbandingan cetak vs digital: ambil idenya, tapi pakai hitungan yang jujur dan bisa dicek, bukan persen penghematan tanpa dasar.
- Harga coret hanya kalau memang pernah jadi harga normal.
- Ulasan hanya dari klien sungguhan dengan izin mereka. Jangan tampilkan angka "dipercaya ribuan" sebelum benar-benar ada.
