@AGENTS.md

# Nauvite v2 — konteks project

Baca file ini dulu. Isinya merangkum keputusan dan konteks dari sesi sebelumnya, supaya pemilik project tidak perlu menjelaskan ulang.

## Pemilik & cara kerja
- Pemilik: Nauval (Nauval Dev). Pemula di sisi teknis; dulu membangun v1 dengan mengikuti tutorial YouTube dan merasa proses deploy rumit.
- Bahasa: **Bahasa Indonesia santai**. Jelaskan langkah teknis (terminal, dashboard, deploy) step by step dengan bahasa sederhana.
- Selera desain: **natural, tidak terasa "AI"**. Hindari ciri AI slop: titik dekoratif, pemisah "·", simbol ✦, tanda pisah panjang (—), label bernomor "01 ——", kata miring berwarna di setiap judul, kalimat slogan generik. Tulis judul lugas dan konkret. Animasi lembut, tanpa efek memantul atau kilau berlebihan.
- Pemilik tidak suka UI generik ala template admin (tabel polos, kartu abu-abu). Selalu buat tampilan berkarakter sejak awal. **Identitas Nauvite** (lihat `docs/IDENTITAS.md`): logo lama v1 (N dalam lengkung emas), hijau tinta `#17261f` + emas logo `#c99c34` (teks emas di latar terang pakai `#96711f`), kertas krem `#f3eee5`, judul Fraunces + teks Plus Jakarta Sans (hindari huruf yang kurang nyaman dibaca, mis. Bodoni), motif lengkung (tanpa bunga; bunga milik tema). Gaya panel: undangan tampil sebagai kartu visual (sampul/warna tema dari `swatch` manifest), pratinjau HP, menu tab bawah di HP. Token warna ada di `src/app/globals.css`, komponen dasar di `src/components/ui`.
- Selalu verifikasi tampilan dengan screenshot sebelum bilang selesai (HP 412px dan desktop 1366px). Chrome ada di `C:/Program Files/Google/Chrome/Application/chrome.exe`; puppeteer-core bisa dipasang di scratchpad.
- Jangan pernah menempelkan token/secret ke chat atau ke file yang ikut ter-commit.

## Nauvite v1 (masih live, JANGAN diubah)
- Lokasi: `C:\Nauval Dev\nauvite` (Vite + HTML/JS vanilla, Supabase, Vercel, Cloudflare Worker untuk subdomain `slug.domain`).
- Klien aktif memakai tema **Royal Gold, Floral Light, Midnight Dark**. v1 tetap jalan sampai v2 siap dan data klien dipindahkan.
- Database v1 (Supabase cloud, project ref `vdwqdeppxppwjjitsblv`, org "nauvite"): tabel `invitations` (slug, password polos, config JSONB, expiry_days, created_at), `wishes` (slug, name, message, attendance), `admin_settings` (key/value: business_name, owner_whatsapp, theme_pricing_json). Bucket storage publik `invitation-images`.
- **Masalah keamanan v1 (alasan rombak):** RLS mengizinkan anon membaca password klien yang tersimpan polos, meng-UPDATE semua undangan, menghapus semua ucapan, serta menghapus/menimpa foto storage. Login klien membandingkan password di browser. v2 harus menyelesaikan semua ini.
- Bentuk `config` undangan v1 (dipakai renderer tema): `theme`, `couple.groom/bride` {name, fullname, sonOf/daughterOf, father, mother, instagram, socialIcon, image}, `events[]` {title, date, startTime, endTime, location, address, mapsUrl, entertainment}, `stories[]` {title, date, description, image}, `gallery[]` (url), `gifts[]` {bank, accountNumber, accountName, logo}, `music`, `youtubeUrl`, `coverImage`, `ogImage`, `quotes`, `countdownDate`, `weddingDate`. Nama tamu dari query `?to=`.
- Aset & desain v1 yang bisa dirujuk/dipindahkan: tema di `themes/` (shared/style.css, minimalist-clean, sundanese-elegance + `scene/` & `ornaments/` SVG, adat/base.css untuk Betawi/Jawa/Batak), landing di `index.html` + `landing/`.

## Keputusan v2
- **Teknologi:** Next.js 16 (App Router) + TypeScript + Tailwind 4. Next.js versi ini punya perubahan besar: baca `node_modules/next/dist/docs/` sebelum menulis kode.
- **Database dev:** Supabase lokal via Docker (`npx supabase start`, studio di http://localhost:54323). Saat rilis: project Supabase cloud baru khusus v2.
- **Pembayaran tetap manual lewat WhatsApp:** admin mengonfirmasi lalu mengaktifkan undangan. Tidak ada payment gateway dulu.
- **Uji coba gratis 1 hari (tahap 2):** calon klien daftar sendiri, mengisi undangan sebagai draf bertanda "Contoh" yang aktif 24 jam; menerbitkan butuh pembayaran via WA. Admin tetap bisa membuatkan akun secara manual.
- **Program mitra wedding organizer (tahap 3):** WO/MUA/fotografer/vendor menambahkan undangan Nauvite ke paket mereka. Pembeda dari program reseller Kekondangan. Fitur lengkap: akun mitra dengan kuota & harga khusus, nama mitra di undangan ("Dipersembahkan oleh ..."), dasbor mitra, halaman "Jadi Mitra" di landing. Pemilik sempat ingin menundanya (takut server berat), lalu memutuskan tetap jalan sesuai rencana awal. Role `partner` dan kolom `partner_id` disiapkan di skema sejak tahap 1, fiturnya dibangun di tahap 3.
- **Sistem template berbasis manifest (inti v2):** setiap template mendeklarasikan isian khususnya sendiri (mis. latar foto/video untuk Clean) dengan nilai bawaan dan sifat opsional; editor membangun form otomatis dari manifest. Menambah template tidak boleh perlu mengubah editor. Rincian di `docs/ROADMAP.md`.
- **Auth:** klien login lewat Supabase Auth (bukan kolom password). RLS: publik hanya membaca undangan aktif tanpa data sensitif + mengirim ucapan; klien hanya mengubah undangan miliknya; admin akses penuh. Storage: hanya pemilik yang boleh unggah/ganti/hapus.
- **Halaman undangan:** `/<slug>` dengan tag OG dari server, menggantikan Worker dan `api/render.js`.
- Aset dari luar (foto/video/musik stok) wajib dicatat sumber dan lisensinya di `docs/ASET.md`. Pakai sumber berlisensi bebas komersial (mis. Pexels), kompres dulu sebelum masuk `public/`.
- Peta kerja: `docs/ROADMAP.md`. Panduan rilis: `docs/DEPLOY.md` (lengkapi setiap kali satu bagian selesai; target: pemilik bisa deploy sendiri dengan mengikuti langkahnya).

## Tema (8)
Royal Gold, Floral Light, Midnight Dark (signature), Minimalist & Clean (`solid-editorial`, gaya editorial), Sundanese Elegance (`sundanese-elegance`), Betawi Heritage (`betawi-heritage`), Javanese Keraton (`javanese-keraton`), Batak Ulos (`batak-ulos`). Tema adat memakai label bahasa daerah, ornamen khas, dan animasi pembuka ritual (Buka Panto, Palang Pintu, gunungan, ulos tersingkap).

## Arah desain & referensi
- Referensi dari pemilik dicatat lengkap di `docs/REFERENSI.md`: kekondangan.com, undanganadat.com, janiva.id, intvite.com. Jadikan inspirasi, **jangan jiplak** desain/aset/teks mereka. Kalau pemilik mengirim link referensi baru, tambahkan ke file itu beserta apa yang disukai.
- Animasi tema adat: pemandangan berlapis yang masuk bergiliran lalu bergerak lembut terus (pendekatan CSS, ringan, hormati prefers-reduced-motion).
- **Ilustrasi detail** (gapura, wayang golek, kebun teh, langit fajar/senja) akan dibuat pemilik dengan **Canva AI**, per lapisan PNG transparan. Claude yang mengompres (WebP), menyusun berlapis, dan menganimasikan. Jangan minta teks/aksara di gambar AI; aksara dipasang lewat kode.
- **Musik:** jangan mengambil koleksi lagu dari situs pesaing. Opsi yang disepakati arahnya: klien memasang lagu sendiri (upload MP3) dan/atau pustaka lagu bawaan yang diisi admin.
