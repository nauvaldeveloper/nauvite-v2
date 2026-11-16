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
Dashboard Supabase > **SQL Editor** > **New query** > tempel seluruh isi `supabase/demo-produksi.sql` > **Run**. Hasilnya 7 undangan demo untuk tombol "Lihat demo" di landing. File ini aman dijalankan ulang.

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
Langkah mengirim skema ke Supabase cloud ditulis di sini saat tahap rilis.

## Undangan demo untuk landing page
Tombol "Lihat demo" di katalog membuka undangan demo. Saat rilis, undangan berikut harus dibuat di database produksi (status aktif, masa aktif tanpa batas) dengan menjalankan `supabase/demo-produksi.sql` (langkah C di atas). Kalau ada tema baru, file itu dibuat ulang dari data lokal.

| Tema | Slug demo |
|---|---|
| Sage Garden | `contoh-sage-garden` |
| Dusty Rose | `contoh-dusty-rose` |
| Lavender Mist | `contoh-lavender-mist` |
| Minimalist & Clean | `dimas-laras` |
| Royal Gold | `contoh-royal-gold` |
| Floral Light | `contoh-floral-light` |
| Midnight Dark | `contoh-midnight-dark` |

Daftar slug ini diatur di `src/lib/demos.ts`. Isi juga **Pengaturan** di panel admin (nama usaha, nomor WhatsApp, harga Reguler/Premium/mitra), karena landing page mengambil data dari sana.
