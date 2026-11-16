-- Ulasan dari klien, ditampilkan di landing page setelah disetujui admin.
-- Hanya ulasan sungguhan: klien menulis dari dasbor, atau admin memasukkan
-- ulasan klien lama (mis. dari chat WhatsApp) dengan izin mereka.

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references public.invitations (id) on delete set null,
  author_id uuid references public.profiles (id) on delete set null,
  couple_name text not null check (char_length(btrim(couple_name)) between 1 and 80),
  city text check (char_length(city) <= 60),
  rating smallint not null check (rating between 1 and 5),
  message text not null check (char_length(btrim(message)) between 10 and 600),
  -- Izin dari klien untuk ditampilkan di landing page
  consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  source text not null default 'client' check (source in ('client', 'admin')),
  created_at timestamptz not null default now()
);

create index reviews_status_idx on public.reviews (status, created_at desc);

-- Satu ulasan per undangan dari klien yang sama
create unique index reviews_one_per_invitation
  on public.reviews (author_id, invitation_id)
  where source = 'client';

revoke all on public.reviews from anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;

alter table public.reviews enable row level security;

create policy "ulasan: publik baca yang disetujui dan diizinkan"
  on public.reviews for select to anon, authenticated
  using (status = 'approved' and consent);

create policy "ulasan: penulis baca miliknya, admin baca semua"
  on public.reviews for select to authenticated
  using (author_id = (select auth.uid()) or (select private.is_admin()));

-- Klien hanya bisa mengirim ulasan berstatus menunggu, untuk undangannya sendiri
create policy "ulasan: klien kirim untuk undangannya"
  on public.reviews for insert to authenticated
  with check (
    (select private.is_admin())
    or (
      author_id = (select auth.uid())
      and status = 'pending'
      and source = 'client'
      and invitation_id is not null
      and (select private.can_manage_invitation(invitation_id))
    )
  );

create policy "ulasan: hanya admin yang mengubah"
  on public.reviews for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "ulasan: hanya admin yang menghapus"
  on public.reviews for delete to authenticated
  using ((select private.is_admin()));
