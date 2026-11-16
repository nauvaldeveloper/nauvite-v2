-- Nauvite v2: skema awal
-- Isi: profiles, invitations, wishes, app_settings, aturan RLS, bucket storage.
--
-- Prinsip keamanan (memperbaiki masalah v1):
-- * Password tidak disimpan di tabel. Login lewat Supabase Auth.
-- * Tamu (anon) tidak bisa membaca tabel invitations secara langsung.
--   Halaman undangan memakai fungsi get_public_invitation(slug) yang
--   hanya mengembalikan undangan aktif dan tanpa data internal.
-- * Klien dan mitra hanya bisa mengubah isi undangan miliknya.
--   Kolom status, masa aktif, slug, pemilik, dan mitra hanya bisa diubah admin.
-- * Ucapan: tamu hanya bisa mengirim. Daftar RSVP lengkap hanya untuk
--   pemilik, mitra, dan admin. Halaman publik hanya melihat nama + ucapan.
-- * Storage: file disimpan di folder <id undangan>/..., hanya pengelola
--   undangan itu yang boleh mengunggah, mengganti, dan menghapus.

-- =====================================================================
-- Skema private untuk fungsi bantu (tidak diekspos lewat API)
-- =====================================================================
create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

-- =====================================================================
-- profiles: satu baris per akun Auth
-- =====================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'client' check (role in ('admin', 'client', 'partner')),
  full_name text check (char_length(full_name) <= 100),
  whatsapp text check (char_length(whatsapp) <= 20),
  -- Khusus mitra: tampil sebagai "Dipersembahkan oleh ..." di undangan
  business_name text check (char_length(business_name) <= 100),
  business_url text check (char_length(business_url) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Data akun. role hanya bisa diubah admin.';

-- Profil dibuat otomatis saat akun Auth dibuat. Role selalu client;
-- metadata dari pendaftar sengaja diabaikan supaya tidak bisa minta role admin.
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, left(new.raw_user_meta_data ->> 'full_name', 100));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- =====================================================================
-- Fungsi bantu peran
-- =====================================================================
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Apakah request ini datang dari server dengan kunci service_role / postgres
-- (bukan dari browser tamu atau klien).
create function private.is_backend()
returns boolean
language sql
stable
set search_path = ''
as $$
  select current_user not in ('anon', 'authenticated');
$$;

-- =====================================================================
-- invitations
-- =====================================================================
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]([a-z0-9-]{1,48}[a-z0-9])$')
    check (slug not in (
      'admin', 'api', 'login', 'masuk', 'logout', 'keluar', 'daftar', 'dashboard',
      'dasbor', 'editor', 'mitra', 'partner', 'tema', 'template', 'harga', 'demo',
      'auth', 'akun', 'bantuan', 'tentang', 'kontak', 'blog', 'static', 'assets'
    )),
  -- Pemilik (akun pengantin). Boleh kosong untuk undangan mitra yang diisi WO.
  owner_id uuid references public.profiles (id) on delete set null,
  -- Mitra WO yang membawa klien ini. Kosong untuk klien langsung.
  partner_id uuid references public.profiles (id) on delete set null,
  template_id text not null check (char_length(template_id) between 1 and 60),
  -- draft: belum terbit, active: bisa dibuka tamu, inactive: dimatikan admin
  status text not null default 'draft' check (status in ('draft', 'active', 'inactive')),
  active_until timestamptz,
  -- Data yang sama di semua template: pengantin, acara, kisah, galeri, rekening, musik, dst.
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  -- Isian khusus template, dikelompokkan per template id:
  -- { "solid-editorial": { "background": {...} }, "sundanese-elegance": {...} }
  template_options jsonb not null default '{}'::jsonb check (jsonb_typeof(template_options) = 'object'),
  -- Catatan internal admin (pembayaran, dll). Tidak pernah tampil ke tamu.
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index invitations_owner_id_idx on public.invitations (owner_id);
create index invitations_partner_id_idx on public.invitations (partner_id);

comment on column public.invitations.content is 'Data umum undangan (bentuk mirip config v1).';
comment on column public.invitations.template_options is 'Isian khusus template per template id, divalidasi server terhadap manifest.';

-- Apakah user yang login boleh mengelola undangan ini
create function private.can_manage_invitation(inv_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin() or exists (
    select 1 from public.invitations i
    where i.id = inv_id
      and (i.owner_id = (select auth.uid()) or i.partner_id = (select auth.uid()))
  );
$$;

-- Apakah undangan ini sedang bisa dibuka tamu
create function private.is_invitation_public(inv_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.invitations i
    where i.id = inv_id
      and i.status = 'active'
      and (i.active_until is null or i.active_until > now())
  );
$$;

-- Jaga kolom yang hanya boleh diubah admin, dan catat siapa yang terakhir mengubah
create function private.guard_invitation_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not private.is_backend() and not private.is_admin() then
    if new.slug is distinct from old.slug
      or new.owner_id is distinct from old.owner_id
      or new.partner_id is distinct from old.partner_id
      or new.status is distinct from old.status
      or new.active_until is distinct from old.active_until
      or new.admin_note is distinct from old.admin_note
      or new.created_at is distinct from old.created_at
    then
      raise exception 'Kolom ini hanya bisa diubah admin'
        using errcode = '42501';
    end if;
  end if;

  new.updated_at := now();
  new.updated_by := (select auth.uid());
  return new;
end;
$$;

create trigger invitations_guard_update
  before update on public.invitations
  for each row execute function private.guard_invitation_update();

-- =====================================================================
-- wishes: ucapan + RSVP tamu
-- =====================================================================
create table public.wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  message text check (char_length(message) <= 500),
  attendance text check (attendance in ('hadir', 'tidak_hadir', 'belum_pasti')),
  guest_count smallint not null default 1 check (guest_count between 1 and 20),
  created_at timestamptz not null default now()
);

create index wishes_invitation_created_idx on public.wishes (invitation_id, created_at desc);

-- =====================================================================
-- app_settings: pengaturan bisnis (nama usaha, WA admin, harga)
-- =====================================================================
create table public.app_settings (
  key text primary key check (key ~ '^[a-z0-9_]{1,60}$'),
  value jsonb not null,
  -- true: boleh dibaca publik (mis. nomor WA dan harga untuk landing)
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- updated_at otomatis untuk profiles dan app_settings
-- =====================================================================
create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function private.touch_updated_at();
create trigger app_settings_touch before update on public.app_settings
  for each row execute function private.touch_updated_at();

-- Jaga kolom role: hanya admin / server yang boleh mengubah
create function private.guard_profile_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
    and not private.is_backend() and not private.is_admin() then
    raise exception 'Role hanya bisa diubah admin' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_update before update on public.profiles
  for each row execute function private.guard_profile_update();

-- =====================================================================
-- Hak akses tabel (dasar), lalu dipersempit RLS
-- =====================================================================
revoke all on public.profiles, public.invitations, public.wishes, public.app_settings
  from anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.invitations to authenticated;
grant select, delete on public.wishes to authenticated;
grant insert on public.wishes to anon, authenticated;
grant select on public.app_settings to anon, authenticated;
grant insert, update, delete on public.app_settings to authenticated;

grant execute on all functions in schema private to anon, authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.wishes enable row level security;
alter table public.app_settings enable row level security;

-- profiles
create policy "profil: baca milik sendiri atau admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "profil: ubah milik sendiri atau admin"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()))
  with check (id = (select auth.uid()) or (select private.is_admin()));

-- invitations (anon sama sekali tidak punya akses langsung)
create policy "undangan: baca oleh pengelola"
  on public.invitations for select to authenticated
  using (
    owner_id = (select auth.uid())
    or partner_id = (select auth.uid())
    or (select private.is_admin())
  );

create policy "undangan: ubah oleh pengelola"
  on public.invitations for update to authenticated
  using (
    owner_id = (select auth.uid())
    or partner_id = (select auth.uid())
    or (select private.is_admin())
  )
  with check (
    owner_id = (select auth.uid())
    or partner_id = (select auth.uid())
    or (select private.is_admin())
  );

-- Membuat dan menghapus undangan: admin saja untuk tahap 1.
-- (Uji coba gratis tahap 2 dan dasbor mitra tahap 3 menambah aturan di sini.)
create policy "undangan: buat oleh admin"
  on public.invitations for insert to authenticated
  with check ((select private.is_admin()));

create policy "undangan: hapus oleh admin"
  on public.invitations for delete to authenticated
  using ((select private.is_admin()));

-- wishes
create policy "ucapan: tamu kirim ke undangan aktif"
  on public.wishes for insert to anon, authenticated
  with check ((select private.is_invitation_public(invitation_id)));

create policy "ucapan: baca oleh pengelola undangan"
  on public.wishes for select to authenticated
  using ((select private.can_manage_invitation(invitation_id)));

create policy "ucapan: hapus oleh pengelola undangan"
  on public.wishes for delete to authenticated
  using ((select private.can_manage_invitation(invitation_id)));

-- app_settings
create policy "pengaturan: baca yang publik, admin baca semua"
  on public.app_settings for select to anon, authenticated
  using (is_public or (select private.is_admin()));

create policy "pengaturan: tulis oleh admin"
  on public.app_settings for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- =====================================================================
-- Fungsi publik untuk halaman undangan
-- =====================================================================

-- Data undangan untuk halaman /<slug>. Hanya undangan aktif, tanpa data internal.
create function public.get_public_invitation(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', i.id,
    'slug', i.slug,
    'template_id', i.template_id,
    'content', i.content,
    'template_options', i.template_options,
    'partner', case when p.id is null then null else jsonb_build_object(
      'name', p.business_name,
      'url', p.business_url
    ) end
  )
  from public.invitations i
  left join public.profiles p on p.id = i.partner_id and p.role = 'partner'
  where i.slug = lower(p_slug)
    and i.status = 'active'
    and (i.active_until is null or i.active_until > now());
$$;

-- Daftar ucapan untuk ditampilkan di undangan: nama, ucapan, waktu saja.
-- Data kehadiran dan jumlah tamu tidak ikut (hanya untuk pengelola).
create function public.get_public_wishes(p_slug text, p_limit int default 20, p_offset int default 0)
returns table (id uuid, name text, message text, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select w.id, w.name, w.message, w.created_at
  from public.wishes w
  join public.invitations i on i.id = w.invitation_id
  where i.slug = lower(p_slug)
    and i.status = 'active'
    and (i.active_until is null or i.active_until > now())
    and w.message is not null and btrim(w.message) <> ''
  order by w.created_at desc
  limit least(greatest(p_limit, 1), 50)
  offset greatest(p_offset, 0);
$$;

revoke execute on function public.get_public_invitation(text) from public;
revoke execute on function public.get_public_wishes(text, int, int) from public;
grant execute on function public.get_public_invitation(text) to anon, authenticated;
grant execute on function public.get_public_wishes(text, int, int) to anon, authenticated;

-- =====================================================================
-- Storage: foto, video latar, dan lagu undangan
-- Path file: <id undangan>/<nama file>
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitation-media',
  'invitation-media',
  true,
  26214400, -- 25 MB
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg'
  ]
);

-- Ambil id undangan dari folder pertama path. Mengembalikan null kalau bukan uuid.
create function private.invitation_id_from_path(object_name text)
returns uuid
language sql
immutable
set search_path = ''
as $$
  select case
    when split_part(object_name, '/', 1) ~ '^[0-9a-fA-F-]{36}$'
      and position('/' in object_name) > 0
    then split_part(object_name, '/', 1)::uuid
    else null
  end;
$$;

grant execute on function private.invitation_id_from_path(text) to anon, authenticated;

create policy "media: unggah oleh pengelola undangan"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'invitation-media'
    and (select private.can_manage_invitation(private.invitation_id_from_path(name)))
  );

create policy "media: ganti oleh pengelola undangan"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'invitation-media'
    and (select private.can_manage_invitation(private.invitation_id_from_path(name)))
  )
  with check (
    bucket_id = 'invitation-media'
    and (select private.can_manage_invitation(private.invitation_id_from_path(name)))
  );

create policy "media: hapus oleh pengelola undangan"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'invitation-media'
    and (select private.can_manage_invitation(private.invitation_id_from_path(name)))
  );

-- Daftar file (list) hanya untuk pengelola. File tetap bisa dibuka lewat URL
-- publik karena bucket public, tapi tamu tidak bisa melihat daftar isi folder.
create policy "media: lihat daftar oleh pengelola undangan"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'invitation-media'
    and (select private.can_manage_invitation(private.invitation_id_from_path(name)))
  );
