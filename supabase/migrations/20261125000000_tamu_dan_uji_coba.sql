-- Daftar tamu per undangan, pesan WA pilihan klien, dan uji coba gratis 1 hari.

-- =====================================================================
-- 1. Kolom baru undangan
-- =====================================================================
alter table public.invitations
  -- Pesan WA untuk tamu, pilihan klien. Kosong: pakai pesan formal bawaan.
  add column guest_message text check (char_length(guest_message) <= 1500),
  -- Akhir uji coba gratis. Selama status masih draft dan waktunya belum lewat,
  -- undangan bisa dibuka sebagai contoh. Kosong: bukan undangan uji coba.
  add column trial_until timestamptz;

-- Alamat halaman yang ditambahkan belakangan juga tidak boleh jadi slug.
alter table public.invitations add constraint invitations_slug_reserved check (slug not in (
  'coba', 'tamu', 'rsvp', 'pratinjau', 'og', 'cetak'
));

-- admin_note tetap tidak ikut (lihat migration pengamanan).
grant select (guest_message, trial_until) on public.invitations to authenticated;

-- trial_until hanya boleh diubah admin atau server.
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
      or new.trial_until is distinct from old.trial_until
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

-- Undangan uji coba ikut bisa dibuka lewat link, ditandai `trial`. Ucapan tamu
-- tetap hanya untuk undangan aktif (private.is_invitation_public tidak diubah).
create or replace function public.get_public_invitation(p_slug text)
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
    'trial', i.status = 'draft',
    'partner', case when p.id is null then null else jsonb_build_object(
      'name', p.business_name,
      'url', p.business_url
    ) end
  )
  from public.invitations i
  left join public.profiles p on p.id = i.partner_id and p.role = 'partner'
  where i.slug = lower(p_slug)
    and (
      (i.status = 'active' and (i.active_until is null or i.active_until > now()))
      or (i.status = 'draft' and i.trial_until > now())
    );
$$;

-- =====================================================================
-- 2. Daftar tamu
-- =====================================================================
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  -- Nomor WA format 62..., boleh kosong (klien memilih kontak sendiri di WA)
  phone text check (phone ~ '^[0-9]{8,15}$'),
  sent_at timestamptz,
  -- clock_timestamp: urutan sama dengan urutan nama yang ditempel
  created_at timestamptz not null default clock_timestamp()
);

create index guests_invitation_idx on public.guests (invitation_id, created_at);
-- Nama yang sama tidak masuk dua kali di undangan yang sama.
create unique index guests_unique_name on public.guests (invitation_id, lower(btrim(name)));

alter table public.guests enable row level security;
revoke all on public.guests from anon, authenticated;
grant select, delete on public.guests to authenticated;
grant insert (invitation_id, name, phone) on public.guests to authenticated;
grant update (name, phone, sent_at) on public.guests to authenticated;

create policy "tamu: dikelola pengelola undangan"
  on public.guests for all to authenticated
  using ((select private.can_manage_invitation(invitation_id)))
  with check ((select private.can_manage_invitation(invitation_id)));

-- Batas 3000 nama per undangan.
create function private.guard_guest_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.guests where invitation_id = new.invitation_id) >= 3000 then
    raise exception 'Daftar tamu sudah penuh (3000 nama).' using errcode = 'P0001', hint = 'guest_limit';
  end if;
  return new;
end;
$$;

create trigger guests_guard_insert
  before insert on public.guests
  for each row execute function private.guard_guest_insert();

-- =====================================================================
-- 3. Catatan pendaftaran uji coba (pembatas penyalahgunaan)
-- =====================================================================
-- Hanya dibaca dan ditulis server dengan kunci service_role.
create table public.trial_signups (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  whatsapp text not null,
  created_at timestamptz not null default now()
);

create index trial_signups_recent_idx on public.trial_signups (created_at);

alter table public.trial_signups enable row level security;
revoke all on public.trial_signups from anon, authenticated;
grant select, insert, delete on public.trial_signups to service_role;
grant select, insert, update, delete on public.guests to service_role;
