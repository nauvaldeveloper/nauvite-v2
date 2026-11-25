# Nauvite v2 — Panduan Rilis

Dokumen ini dilengkapi sedikit demi sedikit selama pengembangan. Ikuti langkahnya berurutan.

## Gambaran besar
1. Buat project Supabase cloud baru khusus v2.
2. Kirim skema database dari laptop ke project cloud itu (satu perintah).
3. Hubungkan folder ini ke Vercel sebagai project baru, lalu coba lewat link preview.
4. Pindahkan data klien lama dari database v1.
5. Alihkan domain dari v1 ke v2. Kalau ada masalah, domain bisa dikembalikan ke v1.

Langkah 1-3 sudah bisa dikerjakan sekarang (lihat **Rilis percobaan** di bawah). Langkah 4-5 ditulis saat data v1 siap dipindahkan.

## Rilis percobaan (link `.vercel.app`, v1 tidak tersentuh)

### A. Buat project Supabase cloud
1. Buka https://supabase.com/dashboard, masuk dengan akun yang sama seperti v1.
2. Pilih organisasi, klik **New project**.
   - Name: `nauvite-v2`
   - Database Password: klik **Generate**, lalu **simpan di tempat aman** (mis. catatan HP). Jangan dikirim ke chat.
   - Region: **Southeast Asia (Singapore)**, paling dekat dengan Indonesia.
3. Tunggu sampai project selesai dibuat (1-2 menit).
4. Catat **Project ref**: deretan huruf di alamat dashboard, `supabase.com/dashboard/project/<ref>`. Ref bukan rahasia.
5. Matikan pendaftaran bebas: **Authentication > Sign In / Providers > Allow new users to sign up** dimatikan. Akun klien dibuat admin dari panel, jadi pendaftaran umum belum dibutuhkan.

### B. Kirim struktur database ke cloud
Jalankan di terminal VS Code (folder `nauvite-v2`), satu per satu:
```
npx supabase login
npx supabase link --project-ref <ref>
npx supabase db push
```
- `login` membuka browser untuk izin, klik **Authorize**.
- `link` akan menanyakan Database Password dari langkah A. Saat diketik, password memang tidak terlihat.
- `db push` menanyakan konfirmasi, ketik `Y`. Semua tabel, aturan keamanan (RLS), dan tempat penyimpanan foto ikut terbuat.
- **Jangan** menjalankan `supabase db reset --linked` atau `seed.sql` ke cloud.

### C. Isi undangan demo
Dashboard Supabase > **SQL Editor** > **New query** > tempel seluruh isi `supabase/demo-produksi.sql` > **Run**. Hasilnya 8 undangan demo untuk tombol "Lihat demo" di landing. File ini aman dijalankan ulang.

### D. Buat akun admin
1. **Authentication > Users > Add user > Create new user**. Isi email kamu dan password yang kuat, centang **Auto Confirm User**.
2. **SQL Editor**, jalankan (ganti emailnya):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'email-kamu@contoh.com');
   ```
   Hasil yang benar: `UPDATE 1`.

### E. Simpan kode ke GitHub
Vercel mengambil kode dari GitHub. Repo dibuat **Private**.
1. https://github.com/new, nama `nauvite-v2`, pilih **Private**, jangan centang README. Klik **Create repository**.
2. Kode di-commit lalu di-push ke repo itu (dibantu Claude). File `.env.local` dan folder `aset-mentah` tidak ikut terkirim.

### F. Deploy di Vercel
1. https://vercel.com/new, pilih repo `nauvite-v2`, klik **Import**. Framework terdeteksi otomatis (Next.js).
2. Buka **Environment Variables**, isi 4 nilai (lihat tabel di bawah). Nilai Supabase ada di dashboard Supabase **Project Settings > API Keys** dan **Data API**:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL, mis. `https://<ref>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = kunci **anon / publishable**
   - `SUPABASE_SERVICE_ROLE_KEY` = kunci **service_role / secret** (rahasia, tempel langsung di Vercel saja)
   - `NEXT_PUBLIC_SITE_URL` = sementara isi `https://nauvite-v2.vercel.app` (diganti setelah link asli diketahui)
3. Klik **Deploy**, tunggu 2-3 menit.
4. Kalau link yang diberikan Vercel berbeda dari isian `NEXT_PUBLIC_SITE_URL`, ganti nilainya di **Settings > Environment Variables**, lalu **Deployments > ... > Redeploy**.

### G. Cek hasil
- Buka link Vercel: landing, katalog, dan tombol "Lihat demo" setiap tema.
- `/masuk` dengan akun admin dari langkah D, lalu isi **Pengaturan** (nama usaha, nomor WhatsApp, harga).
- Buat satu undangan percobaan dari panel admin, buka dari HP, kirim satu ucapan.
- Kirim link undangan ke WhatsApp sendiri untuk cek gambar preview.

Setelah ini, setiap kali kode di-push ke GitHub, Vercel otomatis memperbarui website.

## Pindah data dari v1
Skrip `scripts/pindah-v1.mjs` menyalin satu undangan v1 (isi, foto, lagu, ucapan) ke v2. v1 hanya dibaca, tidak diubah.

1. Pastikan `.env.local` berisi `V1_SUPABASE_URL` dan `V1_SUPABASE_ANON_KEY` (kunci publik v1).
2. Isi `.env.cloud` dengan `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` project v2 cloud. File ini tidak ikut ter-commit.
3. Uji ke lokal dulu: `node scripts/pindah-v1.mjs <slug>`, buka `http://localhost:3000/<slug>`.
4. Ke cloud: `node scripts/pindah-v1.mjs <slug> --cloud`. Tambah `--ganti` untuk menimpa yang sudah ada.
5. Kalau undangan dibawa mitra, buat akun mitranya di **Mitra**, lalu pilih mitranya di halaman undangan tersebut.

## Pindah domain (nauvite.my.id dari v1 ke v2)
Domain diurus di Cloudflare. v1 memakai Worker untuk link `<slug>.nauvite.my.id`. Setelah pindah, Worker itu diganti dengan Worker pengalihan, jadi link lama tetap bisa dibuka dan diarahkan ke `nauvite.my.id/<slug>`.

Sebelum mulai: pastikan semua undangan v1 yang masih dipakai klien sudah dipindah (bagian di atas).

### 1. Pindahkan domain di Vercel
1. Buka project **v1** di Vercel, **Settings > Domains**. Catat domain yang terpasang, lalu hapus `nauvite.my.id` dan `www.nauvite.my.id`. Biarkan alamat `.vercel.app`-nya sebagai cadangan.
2. Buka project **nauvite-v2**, **Settings > Domains > Add**, masukkan `nauvite.my.id`. Pilih opsi agar `www.nauvite.my.id` dialihkan ke `nauvite.my.id`.
3. Kalau Vercel meminta mengubah DNS, ikuti nilai yang ditampilkan di Cloudflare (**DNS > Records**). Biasanya tidak perlu karena domain sudah mengarah ke Vercel. Untuk record domain utama dan www, set **Proxy status: DNS only** (awan abu-abu).
4. Tunggu sampai Vercel menulis **Valid Configuration**.

### 2. Ganti alamat website v2
1. Vercel project **nauvite-v2 > Settings > Environment Variables**: ubah `NEXT_PUBLIC_SITE_URL` menjadi `https://nauvite.my.id`.
2. **Deployments > ... > Redeploy**.
3. Supabase project v2 > **Authentication > URL Configuration**: isi **Site URL** `https://nauvite.my.id`, dan tambahkan `https://nauvite.my.id/**` di **Redirect URLs**.

### 3. Ganti Worker di Cloudflare
1. Cloudflare > **Workers & Pages**, buka Worker v1 yang dipakai untuk subdomain.
2. Klik **Edit code**, hapus semua isinya, tempel isi file `cloudflare/pengalihan-subdomain.js`, lalu **Deploy**.
3. Cek **Settings > Domains & Routes**: route `*.nauvite.my.id/*` tetap ada. Kalau ada route untuk `nauvite.my.id/*` (domain utama), hapus supaya domain utama langsung ke Vercel.
4. Di **DNS > Records**, record `*` (wildcard) tetap **Proxied** (awan oranye). Kalau tidak, Worker tidak berjalan.

### 4. Cek
- `https://nauvite.my.id` membuka landing v2.
- `https://<slug>.nauvite.my.id/?to=Budi` berpindah ke `https://nauvite.my.id/<slug>?to=Budi`.
- Login admin di `https://nauvite.my.id/masuk`.
- Kirim link undangan ke WhatsApp sendiri, pastikan gambar preview muncul.

### Kalau ada masalah (kembali ke v1)
Di Vercel, pindahkan lagi domain ke project v1. Di Cloudflare, buka Worker, **Deployments**, lalu kembalikan ke versi sebelumnya. Data v1 tidak pernah diubah, jadi v1 langsung jalan seperti semula.

## Variabel lingkungan (.env)
Website butuh 4 nilai ini. Di laptop disimpan di file `.env.local` (tidak ikut ter-commit). Di Vercel diisi lewat **Settings > Environment Variables**.

| Nama | Isi | Rahasia? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Alamat project Supabase | Tidak |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kunci publik (anon / publishable) | Tidak, boleh terlihat di browser. Yang menjaga data adalah aturan RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Kunci service role | **Ya.** Jangan dikirim ke siapa pun, jangan ditempel di chat atau di kode. |
| `NEXT_PUBLIC_SITE_URL` | Alamat website, mis. `https://nauvite.id` (lokal: `http://localhost:3000`) | Tidak. Dipakai untuk gambar preview link WhatsApp. |

Untuk lokal, nilainya didapat dari perintah `npx supabase status -o env` (pakai `API_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY`). Untuk cloud, dari dashboard Supabase: **Project Settings > API**.

## Database
Struktur database ada di `supabase/migrations/`. File `supabase/seed.sql` berisi data contoh dan **hanya untuk lokal**, jangan dijalankan di cloud.
### Menambah migration baru setelah rilis
Kalau ada file baru di `supabase/migrations/`, kirim ke cloud dengan urutan ini:
1. Push kode dulu dan tunggu Vercel selesai deploy. Kode baru biasanya sudah siap untuk skema lama dan skema baru, tapi kode lama belum tentu cocok dengan skema baru.
2. Baru jalankan `npx supabase db push` (lihat langkah di atas), ketik `Y`.
3. Cek situs live.

Migration `20261119000000_pengamanan.sql` (hasil uji keamanan 19 Nov 2026): tema hanya bisa diganti admin, batas laju dan anti-ganda untuk ucapan tamu, batas ukuran isi undangan, dan catatan admin tidak terbaca klien. **Catatan:** hak baca tabel `invitations` untuk user login sekarang diatur per kolom. Kalau nanti tabel itu mendapat kolom baru yang perlu dibaca klien, tambahkan kolomnya ke `grant select (...)` di migration baru.

Migration `20261122000000_katalog_cetak.sql` dan `20261122000100_katalog_cetak_isi.sql` (22 Nov 2026): tabel katalog undangan cetak `print_designs`, bucket storage `print-media` (hanya admin yang unggah), pengaturan `print` (minimal pesanan, lama produksi, harga plastik dan label), dan isi awal 51 desain. Gambar isi awal ada di `public/cetak/` jadi ikut ter-deploy bersama kode. Kode vendor dan harga modal tidak terbaca publik maupun klien (izin per kolom); panel admin membacanya lewat service role.

**Status:** migration pengamanan dan undangan cetak di atas sudah masuk database produksi (dikonfirmasi pemilik 25 Nov 2026).

## Undangan demo untuk landing page
Tombol "Lihat demo" di katalog membuka undangan demo. Saat rilis, undangan berikut harus dibuat di database produksi (status aktif, masa aktif tanpa batas) dengan menjalankan `supabase/demo-produksi.sql` (langkah C di atas). Kalau ada tema baru, file itu dibuat ulang dari data lokal.

| Tema | Slug demo |
|---|---|
| Sage Garden | `contoh-sage-garden` |
| Dusty Rose | `contoh-dusty-rose` |
| Lavender Mist | `contoh-lavender-mist` |
| Sundanese Elegance | `contoh-sundanese-elegance` |
| Javanese Keraton | `contoh-javanese-keraton` |
| Betawi Heritage | `contoh-betawi-heritage` |
| Piringan Hitam (tiga warna) | `contoh-piringan-hitam`, `contoh-piringan-hitam-laguna`, `contoh-piringan-hitam-anggrek` |
| Koran Pagi (tiga warna) | `contoh-koran-pagi`, `contoh-koran-pagi-salem`, `contoh-koran-pagi-melati` |
| Surat Cinta (merah anggur, biru laut, hijau zaitun) | `contoh-surat-cinta`, `contoh-surat-cinta-laut`, `contoh-surat-cinta-zaitun` |
| Minimalist & Clean | `dimas-laras` |
| Royal Gold | `contoh-royal-gold` |
| Floral Light | `contoh-floral-light` |
| Midnight Dark | `contoh-midnight-dark` |

Menambah demo tema baru tanpa menjalankan ulang seluruh file: buat demonya di database lokal, lalu jalankan `node scripts/demo-ke-cloud.mjs <slug>`. Skrip ini menyalin undangan dari lokal ke produksi memakai `.env.cloud` (alamat dan kunci service_role Supabase cloud, tidak ikut di-commit).

Daftar slug ini diatur di `src/lib/demos.ts`. Isi juga **Pengaturan** di panel admin (nama usaha, nomor WhatsApp, harga Reguler/Premium/mitra), karena landing page mengambil data dari sana.
