-- Katalog undangan cetak (blangko dari vendor, dicetakkan nama dan isi).
-- Publik hanya melihat desain yang aktif, tanpa kode vendor dan harga modal.
-- Hanya admin yang menambah, mengubah, dan menghapus.

-- Halaman katalog ada di /cetak, jadi slug undangan tidak boleh memakai kata ini
alter table public.invitations
  add constraint invitations_slug_reserved_cetak check (slug not in ('cetak', 'undangan-cetak'));

create table public.print_designs (
  id uuid primary key default gen_random_uuid(),
  -- Kode yang dilihat klien, mis. NC-07
  code text not null unique check (code ~ '^[A-Z0-9-]{2,20}$'),
  name text not null check (char_length(btrim(name)) between 1 and 60),
  tier text not null check (tier in ('hemat', 'foil', 'eksklusif')),
  format text not null check (format in ('satu', 'lipat', 'amplop', 'hardcover')),
  orientation text not null default 'landscape' check (orientation in ('landscape', 'portrait')),
  foil text not null default 'none' check (foil in ('none', 'emas', 'silver')),
  -- Harga jual per pcs (sudah termasuk cetak nama dan isi)
  price integer not null check (price between 0 and 1000000),
  note text check (char_length(note) <= 300),
  -- Path gambar: '/cetak/...' (bawaan) atau path di bucket print-media
  images text[] not null default '{}' check (cardinality(images) <= 8),
  featured boolean not null default false,
  active boolean not null default true,
  sort integer not null default 0,
  -- Khusus admin
  vendor_code text check (char_length(vendor_code) <= 40),
  cost integer check (cost between 0 and 1000000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index print_designs_list_idx on public.print_designs (active, tier, sort);

create trigger print_designs_touch before update on public.print_designs
  for each row execute function private.touch_updated_at();

-- Kolom vendor_code dan cost tidak ikut terbaca publik
revoke all on public.print_designs from anon, authenticated;
grant select (id, code, name, tier, format, orientation, foil, price, note, images, featured, active, sort, created_at, updated_at)
  on public.print_designs to anon, authenticated;
-- Admin membaca vendor_code dan cost lewat service role di server, setelah requireAdmin()
grant insert, update, delete on public.print_designs to authenticated;

alter table public.print_designs enable row level security;

create policy "cetak: publik baca yang aktif"
  on public.print_designs for select to anon, authenticated
  using (active);

create policy "cetak: admin baca semua"
  on public.print_designs for select to authenticated
  using ((select private.is_admin()));

create policy "cetak: admin tambah"
  on public.print_designs for insert to authenticated
  with check ((select private.is_admin()));

create policy "cetak: admin ubah"
  on public.print_designs for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "cetak: admin hapus"
  on public.print_designs for delete to authenticated
  using ((select private.is_admin()));

-- =====================================================================
-- Storage foto katalog cetak: publik bisa melihat, hanya admin yang mengunggah
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('print-media', 'print-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']);

create policy "cetak media: admin unggah"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'print-media' and (select private.is_admin()));

create policy "cetak media: admin ganti"
  on storage.objects for update to authenticated
  using (bucket_id = 'print-media' and (select private.is_admin()))
  with check (bucket_id = 'print-media' and (select private.is_admin()));

create policy "cetak media: admin hapus"
  on storage.objects for delete to authenticated
  using (bucket_id = 'print-media' and (select private.is_admin()));

create policy "cetak media: admin lihat daftar"
  on storage.objects for select to authenticated
  using (bucket_id = 'print-media' and (select private.is_admin()));

-- Pengaturan umum cetak (minimal pesanan, lama produksi, harga tambahan
-- plastik dan label stiker nama per pcs) masuk app_settings
insert into public.app_settings (key, value, is_public)
values ('print', '{"minOrder": 50, "leadDays": "3-7", "plastic": 500, "label": 200}', true)
on conflict (key) do nothing;
