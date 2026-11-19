-- Pengamanan hasil uji keamanan 19 Nov 2026.
-- Celah di bawah hanya bisa dipakai klien yang memanggil API Supabase langsung
-- (bukan lewat editor), tetapi tetap ditutup di database supaya tidak bergantung
-- pada kode aplikasi.
--
-- 1. Tema (template_id) hanya boleh diganti admin. Sebelumnya klien bisa pindah
--    dari tema Basic ke Premium tanpa membayar.
-- 2. Ucapan tamu: waktu kirim selalu diisi server, kolom yang boleh diisi tamu
--    dibatasi, dan ada batas laju per undangan supaya undangan tidak dibanjiri spam.
-- 3. Ukuran isi undangan dibatasi.
-- 4. Catatan admin (admin_note) tidak bisa dibaca klien maupun mitra. Panel admin
--    membacanya lewat server dengan kunci service_role.

-- =====================================================================
-- 1. Kolom yang hanya boleh diubah admin, ditambah template_id
-- =====================================================================
create or replace function private.guard_invitation_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not private.is_backend() and not private.is_admin() then
    if new.slug is distinct from old.slug
      or new.owner_id is distinct from old.owner_id
      or new.partner_id is distinct from old.partner_id
      or new.template_id is distinct from old.template_id
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

-- =====================================================================
-- 2. Ucapan tamu
-- =====================================================================

-- Tamu hanya boleh mengisi kolom ini. id dan created_at selalu dari server.
revoke insert on public.wishes from anon, authenticated;
grant insert (invitation_id, name, message, attendance, guest_count)
  on public.wishes to anon, authenticated;

-- Menghitung ucapan terbaru sebuah undangan. security definer karena tamu tidak
-- boleh membaca tabel wishes.
create function private.recent_wish_count(inv_id uuid, since interval)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.wishes
  where invitation_id = inv_id and created_at > now() - since;
$$;

create function private.has_recent_duplicate_wish(inv_id uuid, p_name text, p_message text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.wishes
    where invitation_id = inv_id
      and lower(btrim(name)) = lower(btrim(p_name))
      and coalesce(message, '') = coalesce(p_message, '')
      and created_at > now() - interval '10 minutes'
  );
$$;

-- Fungsi trigger ini sengaja BUKAN security definer, supaya private.is_backend()
-- membaca peran pemanggil yang asli (anon/authenticated). Skrip server dengan
-- kunci service_role (mis. pindah data v1) tidak kena batas.
create function private.guard_wish_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not private.is_backend() then
    new.created_at := now();

    -- Batas laju per undangan. Cukup longgar untuk tamu sungguhan yang mengisi
    -- bersamaan setelah undangan disebar, tetapi menghentikan banjir spam.
    if private.recent_wish_count(new.invitation_id, interval '1 minute') >= 30
      or private.recent_wish_count(new.invitation_id, interval '1 hour') >= 300
    then
      raise exception 'Terlalu banyak ucapan dalam waktu singkat. Coba lagi sebentar lagi.'
        using errcode = 'P0001', hint = 'rate_limit';
    end if;

    -- Ucapan kembar (nama dan isi sama) dalam 10 menit dianggap kiriman ganda.
    if private.has_recent_duplicate_wish(new.invitation_id, new.name, new.message) then
      raise exception 'Ucapan ini sudah terkirim.'
        using errcode = 'P0001', hint = 'duplicate';
    end if;
  end if;
  return new;
end;
$$;

create trigger wishes_guard_insert
  before insert on public.wishes
  for each row execute function private.guard_wish_insert();

grant execute on function private.recent_wish_count(uuid, interval) to anon, authenticated;
grant execute on function private.has_recent_duplicate_wish(uuid, text, text) to anon, authenticated;
grant execute on function private.guard_wish_insert() to anon, authenticated;

-- =====================================================================
-- 3. Batas ukuran isi undangan (dihitung dari teks JSON, bukan ukuran
--    terkompresi, supaya teks berulang yang besar tetap tertangkap)
-- =====================================================================
alter table public.invitations
  add constraint invitations_content_size check (octet_length(content::text) <= 300000),
  add constraint invitations_template_options_size check (octet_length(template_options::text) <= 100000);

-- =====================================================================
-- 4. Catatan admin tidak terbaca klien/mitra
-- =====================================================================
-- Hak baca per kolom: semua kolom kecuali admin_note.
-- PENTING: kalau nanti tabel invitations mendapat kolom baru yang perlu dibaca
-- klien, kolom itu harus ditambahkan ke daftar grant ini.
revoke select on public.invitations from authenticated;
grant select (
  id, slug, owner_id, partner_id, template_id, status, active_until,
  content, template_options, created_at, updated_at, updated_by
) on public.invitations to authenticated;
