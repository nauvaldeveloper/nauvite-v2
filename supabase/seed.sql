-- Data contoh untuk database LOKAL saja (dijalankan oleh `npx supabase db reset`).
-- Jangan dipakai di database produksi.
--
-- Akun percobaan (password semuanya: password123)
--   admin@nauvite.test  -> admin
--   klien@nauvite.test  -> klien, pemilik undangan "budi-ani"
--   klien2@nauvite.test -> klien lain, pemilik undangan "rina-dodi"
--   mitra@nauvite.test  -> mitra WO "Sahabat Wedding", pegang undangan "sari-yoga"

do $$
declare
  u record;
begin
  for u in
    select * from (values
      ('00000000-0000-0000-0000-00000000000a'::uuid, 'admin@nauvite.test', 'Admin Nauvite'),
      ('00000000-0000-0000-0000-00000000000c'::uuid, 'klien@nauvite.test', 'Budi & Ani'),
      ('00000000-0000-0000-0000-00000000000d'::uuid, 'klien2@nauvite.test', 'Rina & Dodi'),
      ('00000000-0000-0000-0000-00000000000b'::uuid, 'mitra@nauvite.test', 'Sahabat Wedding')
    ) as t(id, email, full_name)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated',
      u.email, extensions.crypt('password123', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', u.full_name),
      now(), now(), '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), u.id, u.id::text,
      jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
      'email', now(), now(), now()
    );
  end loop;
end $$;

update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000a';
update public.profiles
set role = 'partner',
    business_name = 'Sahabat Wedding',
    business_url = 'https://instagram.com/contoh'
where id = '00000000-0000-0000-0000-00000000000b';

insert into public.invitations (id, slug, owner_id, partner_id, template_id, status, active_until, content)
values
  (
    '11111111-1111-1111-1111-111111111111', 'budi-ani',
    '00000000-0000-0000-0000-00000000000c', null,
    'royal-gold', 'active', now() + interval '90 days',
    '{
      "couple": {
        "groom": {"name": "Budi", "fullname": "Budi Santoso"},
        "bride": {"name": "Ani", "fullname": "Ani Lestari"}
      },
      "weddingDate": "2027-02-14"
    }'
  ),
  (
    '22222222-2222-2222-2222-222222222222', 'rina-dodi',
    '00000000-0000-0000-0000-00000000000d', null,
    'floral-light', 'draft', null,
    '{"couple": {"groom": {"name": "Dodi"}, "bride": {"name": "Rina"}}}'
  ),
  (
    '33333333-3333-3333-3333-333333333333', 'sari-yoga',
    null, '00000000-0000-0000-0000-00000000000b',
    'sundanese-elegance', 'active', now() + interval '90 days',
    '{"couple": {"groom": {"name": "Yoga"}, "bride": {"name": "Sari"}}}'
  );

insert into public.wishes (invitation_id, name, message, attendance, guest_count)
values
  ('11111111-1111-1111-1111-111111111111', 'Rudi', 'Selamat menempuh hidup baru!', 'hadir', 2),
  ('11111111-1111-1111-1111-111111111111', 'Siti', 'Semoga sakinah mawaddah warahmah.', 'tidak_hadir', 1),
  ('33333333-3333-3333-3333-333333333333', 'Dewi', 'Bahagia selalu ya!', 'hadir', 3);

insert into public.app_settings (key, value, is_public) values
  ('business_name', '"Nauvite"', true),
  ('owner_whatsapp', '"6281234567890"', true),
  ('pricing', '{"default": 75000, "premium": 99000, "partner": 50000, "partnerPremium": 75000}', true),
  ('payment_note', '"Catatan internal admin"', false);

-- Undangan demo tema Clean dengan data lengkap (foto dari Pexels, lihat docs/ASET.md)
insert into public.invitations (id, slug, owner_id, partner_id, template_id, status, active_until, content)
values (
  '44444444-4444-4444-4444-444444444444', 'dimas-laras', null, null,
  'solid-editorial', 'active', now() + interval '365 days',
  $json${
    "couple": {
      "groom": {
        "name": "Dimas", "fullname": "Dimas Prasetyo",
        "sonOf": "Putra kedua dari", "father": "Bapak Hendra Prasetyo", "mother": "Ibu Ratna Sari",
        "instagram": "@dimasprasetyo", "image": "/demo/mempelai-pria.webp"
      },
      "bride": {
        "name": "Laras", "fullname": "Larasati Putri",
        "daughterOf": "Putri pertama dari", "father": "Bapak Agus Wibowo", "mother": "Ibu Dewi Lestari",
        "instagram": "@larasatiputri", "image": "/demo/mempelai-wanita.webp"
      }
    },
    "quotes": "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    "quotesSource": "QS. Ar-Rum: 21",
    "events": [
      {
        "title": "Akad Nikah", "date": "2027-03-20", "startTime": "08:00", "endTime": "10:00",
        "location": "Masjid Al-Ikhlas", "address": "Jl. Melati No. 12, Bandung",
        "mapsUrl": "https://maps.google.com/?q=Masjid+Al-Ikhlas+Bandung"
      },
      {
        "title": "Resepsi", "date": "2027-03-20", "startTime": "11:00", "endTime": "Selesai",
        "location": "Gedung Serbaguna Taman Sari", "address": "Jl. Taman Sari No. 45, Bandung",
        "mapsUrl": "https://maps.google.com/?q=Taman+Sari+Bandung"
      }
    ],
    "stories": [
      {
        "title": "Pertama bertemu", "date": "Agustus 2021",
        "description": "Kami bertemu di sebuah acara kampus. Obrolan singkat tentang buku berlanjut sampai larut sore.",
        "image": "/demo/cerita-1.webp"
      },
      {
        "title": "Lamaran", "date": "Desember 2026",
        "description": "Di hadapan kedua keluarga, kami memutuskan untuk melangkah bersama.",
        "image": "/demo/cerita-2.webp"
      }
    ],
    "gallery": [
      "/demo/galeri-1.webp", "/demo/galeri-2.webp", "/demo/galeri-3.webp",
      "/demo/galeri-4.webp", "/demo/galeri-5.webp", "/demo/galeri-6.webp"
    ],
    "gifts": [
      { "bank": "BCA", "accountNumber": "1234567890", "accountName": "Dimas Prasetyo" },
      { "bank": "Mandiri", "accountNumber": "0987654321", "accountName": "Larasati Putri" }
    ],
    "coverImage": "/demo/sampul.webp",
    "ogImage": "/demo/og.jpg"
  }$json$
);

insert into public.wishes (invitation_id, name, message, attendance, guest_count)
values
  ('44444444-4444-4444-4444-444444444444', 'Rina', 'Selamat ya Dimas dan Laras, semoga langgeng sampai kakek nenek.', 'hadir', 2),
  ('44444444-4444-4444-4444-444444444444', 'Keluarga Pak Joko', 'Turut berbahagia. Semoga menjadi keluarga yang sakinah.', 'hadir', 4);

-- Undangan demo tema Signature, data dalam format v1 (foto dari demo v1)
insert into public.invitations (id, slug, template_id, status, active_until, content) values
  ('55555555-5555-5555-5555-555555555551', 'contoh-royal-gold', 'royal-gold', 'active', now() + interval '365 days', $json${
  "couple": {
    "groom": {
      "name": "Ozy",
      "fullname": "Ozy Zulkarnain",
      "sonOf": "Putra dari Bpk. Hendra Wibowo & Ibu Wirda Wahyuni",
      "instagram": "@ozyzulkarnaincontoh",
      "socialIcon": "fab fa-tiktok",
      "image": "/demo/signature/mempelai-pria.webp"
    },
    "bride": {
      "name": "Zelda",
      "fullname": "Zelda Wulandari",
      "daughterOf": "Putri dari Bpk. Daniswara Permadi & Ibu Yuliana Lestari",
      "instagram": "@zeldawulandaricontoh",
      "socialIcon": "fab fa-tiktok",
      "image": "/demo/signature/mempelai-wanita.webp"
    }
  },
  "events": [
    {
      "title": "Akad Nikah",
      "date": "2027-06-12",
      "startTime": "08:00",
      "endTime": "Selesai",
      "location": "KUA Bunga Wangi",
      "address": "Jl. Bunga Wangi No.88, Kec. Harum, Kab. Indah",
      "mapsUrl": "https://maps.google.com/?q=KUA%20Bunga%20Wangi",
      "entertainment": ""
    },
    {
      "title": "Resepsi",
      "date": "2027-06-13",
      "startTime": "08:00",
      "endTime": "Selesai",
      "location": "Rumah Zelda Wulandari",
      "address": "Jl. Sangat Harum No.666, Kec. Segar, Kab. Sangat Segar",
      "mapsUrl": "https://maps.google.com/?q=Rumah%20Zelda%20Wulandari",
      "entertainment": "Wayang Kulit Satu Malam Suntuk \"Ki Dalang Kardi Suryono\""
    },
    {
      "title": "Ngunduh Mantu",
      "date": "2027-06-15",
      "startTime": "09:00",
      "endTime": "Selesai",
      "location": "Gedung Serbaguna Hendra Wibowo",
      "address": "Jl. Kemenangan No.1, Kec. Sukses, Kab. Jaya",
      "mapsUrl": "https://maps.google.com/?q=Gedung%20Serbaguna%20Hendra%20Wibowo",
      "entertainment": "Live Music Accoustic & Orkes Melayu"
    }
  ],
  "stories": [
    {
      "title": "Pertemuan Pertama",
      "date": "Rabu, 12 Februari 2025",
      "description": "Takdir mempertemukan kami untuk pertama kalinya. Dari sebuah pertemuan sederhana, tumbuh rasa nyaman yang tak terduga. Sejak hari itu, kami mulai saling mengenal dan berbagi cerita.",
      "image": "/demo/signature/story1.webp"
    },
    {
      "title": "Menjalin Hubungan",
      "date": "Selasa, 25 Maret 2025",
      "description": "Hari demi hari kami lewati bersama. Tawa, doa, dan dukungan menjadi bagian dari perjalanan kami. Di tanggal ini, kami resmi berkomitmen untuk berjalan beriringan.",
      "image": "/demo/signature/story3.webp"
    },
    {
      "title": "Menguatkan Cinta",
      "date": "Selasa, 10 Juni 2025",
      "description": "Berbagai tantangan kami hadapi bersama. Dari setiap perbedaan, kami belajar saling memahami. Cinta kami semakin kuat dan penuh makna.",
      "image": "/demo/signature/story2.webp"
    },
    {
      "title": "Lamaran 💍",
      "date": "Sabtu, 20 September 2025",
      "description": "Dengan penuh keyakinan dan cinta, kami melangkah ke tahap yang lebih serius. Disaksikan keluarga tercinta, momen lamaran ini menjadi awal perjalanan menuju hidup bersama.",
      "image": "/demo/signature/story4.webp"
    }
  ],
  "gallery": [
    "/demo/signature/gallery1.webp",
    "/demo/signature/gallery2.webp",
    "/demo/signature/gallery3.webp",
    "/demo/signature/gallery4.webp",
    "/demo/signature/gallery5.webp",
    "/demo/signature/gallery6.webp"
  ],
  "weddingDate": "2027-06-13",
  "countdownDate": "2027-06-13 08:00:00",
  "gifts": [
    {
      "bank": "BCA",
      "accountNumber": "123456",
      "accountName": "Ozy Zulkarnain"
    },
    {
      "bank": "Mandiri",
      "accountNumber": "567890",
      "accountName": "Zelda Wulandari"
    }
  ],
  "coverImage": "/demo/signature/gallery2.webp",
  "quotes": "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.” (QS. Ar-Rum: 21)",
  "ogImage": "/demo/signature/og.jpg"
}$json$),
  ('55555555-5555-5555-5555-555555555552', 'contoh-floral-light', 'floral-light', 'active', now() + interval '365 days', $json${
  "couple": {
    "groom": {
      "name": "Ozy",
      "fullname": "Ozy Zulkarnain",
      "sonOf": "Putra dari Bpk. Hendra Wibowo & Ibu Wirda Wahyuni",
      "instagram": "@ozyzulkarnaincontoh",
      "socialIcon": "fab fa-tiktok",
      "image": "/demo/signature/mempelai-pria.webp"
    },
    "bride": {
      "name": "Zelda",
      "fullname": "Zelda Wulandari",
      "daughterOf": "Putri dari Bpk. Daniswara Permadi & Ibu Yuliana Lestari",
      "instagram": "@zeldawulandaricontoh",
      "socialIcon": "fab fa-tiktok",
      "image": "/demo/signature/mempelai-wanita.webp"
    }
  },
  "events": [
    {
      "title": "Akad Nikah",
      "date": "2027-06-12",
      "startTime": "08:00",
      "endTime": "Selesai",
      "location": "KUA Bunga Wangi",
      "address": "Jl. Bunga Wangi No.88, Kec. Harum, Kab. Indah",
      "mapsUrl": "https://maps.google.com/?q=KUA%20Bunga%20Wangi",
      "entertainment": ""
    },
    {
      "title": "Resepsi",
      "date": "2027-06-13",
      "startTime": "08:00",
      "endTime": "Selesai",
      "location": "Rumah Zelda Wulandari",
      "address": "Jl. Sangat Harum No.666, Kec. Segar, Kab. Sangat Segar",
      "mapsUrl": "https://maps.google.com/?q=Rumah%20Zelda%20Wulandari",
      "entertainment": "Wayang Kulit Satu Malam Suntuk \"Ki Dalang Kardi Suryono\""
    },
    {
      "title": "Ngunduh Mantu",
      "date": "2027-06-15",
      "startTime": "09:00",
      "endTime": "Selesai",
      "location": "Gedung Serbaguna Hendra Wibowo",
      "address": "Jl. Kemenangan No.1, Kec. Sukses, Kab. Jaya",
      "mapsUrl": "https://maps.google.com/?q=Gedung%20Serbaguna%20Hendra%20Wibowo",
      "entertainment": "Live Music Accoustic & Orkes Melayu"
    }
  ],
  "stories": [
    {
      "title": "Pertemuan Pertama",
      "date": "Rabu, 12 Februari 2025",
      "description": "Takdir mempertemukan kami untuk pertama kalinya. Dari sebuah pertemuan sederhana, tumbuh rasa nyaman yang tak terduga. Sejak hari itu, kami mulai saling mengenal dan berbagi cerita.",
      "image": "/demo/signature/story1.webp"
    },
    {
      "title": "Menjalin Hubungan",
      "date": "Selasa, 25 Maret 2025",
      "description": "Hari demi hari kami lewati bersama. Tawa, doa, dan dukungan menjadi bagian dari perjalanan kami. Di tanggal ini, kami resmi berkomitmen untuk berjalan beriringan.",
      "image": "/demo/signature/story3.webp"
    },
    {
      "title": "Menguatkan Cinta",
      "date": "Selasa, 10 Juni 2025",
      "description": "Berbagai tantangan kami hadapi bersama. Dari setiap perbedaan, kami belajar saling memahami. Cinta kami semakin kuat dan penuh makna.",
      "image": "/demo/signature/story2.webp"
    },
    {
      "title": "Lamaran 💍",
      "date": "Sabtu, 20 September 2025",
      "description": "Dengan penuh keyakinan dan cinta, kami melangkah ke tahap yang lebih serius. Disaksikan keluarga tercinta, momen lamaran ini menjadi awal perjalanan menuju hidup bersama.",
      "image": "/demo/signature/story4.webp"
    }
  ],
  "gallery": [
    "/demo/signature/gallery1.webp",
    "/demo/signature/gallery2.webp",
    "/demo/signature/gallery3.webp",
    "/demo/signature/gallery4.webp",
    "/demo/signature/gallery5.webp",
    "/demo/signature/gallery6.webp"
  ],
  "weddingDate": "2027-06-13",
  "countdownDate": "2027-06-13 08:00:00",
  "gifts": [
    {
      "bank": "BCA",
      "accountNumber": "123456",
      "accountName": "Ozy Zulkarnain"
    },
    {
      "bank": "Mandiri",
      "accountNumber": "567890",
      "accountName": "Zelda Wulandari"
    }
  ],
  "coverImage": "/demo/signature/gallery2.webp",
  "quotes": "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.” (QS. Ar-Rum: 21)",
  "ogImage": "/demo/signature/og.jpg"
}$json$),
  ('55555555-5555-5555-5555-555555555553', 'contoh-midnight-dark', 'midnight-dark', 'active', now() + interval '365 days', $json${
  "couple": {
    "groom": {
      "name": "Ozy",
      "fullname": "Ozy Zulkarnain",
      "sonOf": "Putra dari Bpk. Hendra Wibowo & Ibu Wirda Wahyuni",
      "instagram": "@ozyzulkarnaincontoh",
      "socialIcon": "fab fa-tiktok",
      "image": "/demo/signature/mempelai-pria.webp"
    },
    "bride": {
      "name": "Zelda",
      "fullname": "Zelda Wulandari",
      "daughterOf": "Putri dari Bpk. Daniswara Permadi & Ibu Yuliana Lestari",
      "instagram": "@zeldawulandaricontoh",
      "socialIcon": "fab fa-tiktok",
      "image": "/demo/signature/mempelai-wanita.webp"
    }
  },
  "events": [
    {
      "title": "Akad Nikah",
      "date": "2027-06-12",
      "startTime": "08:00",
      "endTime": "Selesai",
      "location": "KUA Bunga Wangi",
      "address": "Jl. Bunga Wangi No.88, Kec. Harum, Kab. Indah",
      "mapsUrl": "https://maps.google.com/?q=KUA%20Bunga%20Wangi",
      "entertainment": ""
    },
    {
      "title": "Resepsi",
      "date": "2027-06-13",
      "startTime": "08:00",
      "endTime": "Selesai",
      "location": "Rumah Zelda Wulandari",
      "address": "Jl. Sangat Harum No.666, Kec. Segar, Kab. Sangat Segar",
      "mapsUrl": "https://maps.google.com/?q=Rumah%20Zelda%20Wulandari",
      "entertainment": "Wayang Kulit Satu Malam Suntuk \"Ki Dalang Kardi Suryono\""
    },
    {
      "title": "Ngunduh Mantu",
      "date": "2027-06-15",
      "startTime": "09:00",
      "endTime": "Selesai",
      "location": "Gedung Serbaguna Hendra Wibowo",
      "address": "Jl. Kemenangan No.1, Kec. Sukses, Kab. Jaya",
      "mapsUrl": "https://maps.google.com/?q=Gedung%20Serbaguna%20Hendra%20Wibowo",
      "entertainment": "Live Music Accoustic & Orkes Melayu"
    }
  ],
  "stories": [
    {
      "title": "Pertemuan Pertama",
      "date": "Rabu, 12 Februari 2025",
      "description": "Takdir mempertemukan kami untuk pertama kalinya. Dari sebuah pertemuan sederhana, tumbuh rasa nyaman yang tak terduga. Sejak hari itu, kami mulai saling mengenal dan berbagi cerita.",
      "image": "/demo/signature/story1.webp"
    },
    {
      "title": "Menjalin Hubungan",
      "date": "Selasa, 25 Maret 2025",
      "description": "Hari demi hari kami lewati bersama. Tawa, doa, dan dukungan menjadi bagian dari perjalanan kami. Di tanggal ini, kami resmi berkomitmen untuk berjalan beriringan.",
      "image": "/demo/signature/story3.webp"
    },
    {
      "title": "Menguatkan Cinta",
      "date": "Selasa, 10 Juni 2025",
      "description": "Berbagai tantangan kami hadapi bersama. Dari setiap perbedaan, kami belajar saling memahami. Cinta kami semakin kuat dan penuh makna.",
      "image": "/demo/signature/story2.webp"
    },
    {
      "title": "Lamaran 💍",
      "date": "Sabtu, 20 September 2025",
      "description": "Dengan penuh keyakinan dan cinta, kami melangkah ke tahap yang lebih serius. Disaksikan keluarga tercinta, momen lamaran ini menjadi awal perjalanan menuju hidup bersama.",
      "image": "/demo/signature/story4.webp"
    }
  ],
  "gallery": [
    "/demo/signature/gallery1.webp",
    "/demo/signature/gallery2.webp",
    "/demo/signature/gallery3.webp",
    "/demo/signature/gallery4.webp",
    "/demo/signature/gallery5.webp",
    "/demo/signature/gallery6.webp"
  ],
  "weddingDate": "2027-06-13",
  "countdownDate": "2027-06-13 08:00:00",
  "gifts": [
    {
      "bank": "BCA",
      "accountNumber": "123456",
      "accountName": "Ozy Zulkarnain"
    },
    {
      "bank": "Mandiri",
      "accountNumber": "567890",
      "accountName": "Zelda Wulandari"
    }
  ],
  "coverImage": "/demo/signature/gallery2.webp",
  "quotes": "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.” (QS. Ar-Rum: 21)",
  "ogImage": "/demo/signature/og.jpg"
}$json$);

insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('55555555-5555-5555-5555-555555555551', 'Bu Ratna', 'Selamat untuk Ozy dan Zelda. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.', 'hadir', 2),
  ('55555555-5555-5555-5555-555555555552', 'Andi', 'Bahagia selalu kalian berdua!', 'hadir', 1),
  ('55555555-5555-5555-5555-555555555553', 'Tim Kantor', 'Selamat menempuh hidup baru.', 'belum_pasti', 5);

-- Undangan demo tema Premium Sage Garden (foto Pexels, lihat docs/ASET.md)
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select '66666666-6666-6666-6666-666666666666', 'contoh-sage-garden', 'sage-garden', 'active', now() + interval '365 days',
  content || '{"coverImage": "/demo/galeri-3.webp"}'::jsonb,
  '{"sage-garden": {"greeting": "islami"}}'::jsonb
from public.invitations where slug = 'dimas-laras';

insert into public.wishes (invitation_id, name, message, attendance, guest_count)
values
  ('66666666-6666-6666-6666-666666666666', 'Nadia', 'Cantik sekali undangannya! Selamat ya Dimas dan Laras.', 'hadir', 2),
  ('66666666-6666-6666-6666-666666666666', 'Om Bambang sekeluarga', 'Barakallahu lakuma wa baraka alaikuma. Semoga sakinah mawaddah warahmah.', 'hadir', 5);

-- Undangan demo tema Premium Dusty Rose (foto Pexels yang sama, nama pasangan berbeda)
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select '77777777-7777-7777-7777-777777777777', 'contoh-dusty-rose', 'dusty-rose', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content,
    '{couple,groom,name}', '"Raka"'), '{couple,groom,fullname}', '"Raka Aditya Nugraha"'),
    '{couple,bride,name}', '"Nadia"'), '{couple,bride,fullname}', '"Nadia Kirana Putri"')
    || '{"coverImage": "/demo/galeri-1.webp"}'::jsonb,
  '{"dusty-rose": {"greeting": "umum"}}'::jsonb
from public.invitations where slug = 'dimas-laras';

insert into public.wishes (invitation_id, name, message, attendance, guest_count)
values
  ('77777777-7777-7777-7777-777777777777', 'Sinta', 'Selamat menempuh hidup baru Raka dan Nadia, semoga bahagia selalu!', 'hadir', 2),
  ('77777777-7777-7777-7777-777777777777', 'Keluarga Pak Hendra', 'Turut berbahagia. Semoga menjadi keluarga yang penuh cinta.', 'hadir', 4);

-- Undangan demo tema Premium Lavender Mist (foto Pexels yang sama, nama pasangan berbeda)
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select '88888888-8888-8888-8888-888888888888', 'contoh-lavender-mist', 'lavender-mist', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content,
    '{couple,groom,name}', '"Fajar"'), '{couple,groom,fullname}', '"Fajar Ramadhan"'),
    '{couple,bride,name}', '"Alya"'), '{couple,bride,fullname}', '"Alya Salsabila"')
    || '{"coverImage": "/demo/galeri-5.webp"}'::jsonb,
  '{"lavender-mist": {"greeting": "islami"}}'::jsonb
from public.invitations where slug = 'dimas-laras';

insert into public.wishes (invitation_id, name, message, attendance, guest_count)
values
  ('88888888-8888-8888-8888-888888888888', 'Rizky', 'Barakallahu lakuma, semoga menjadi keluarga sakinah mawaddah warahmah.', 'hadir', 2),
  ('88888888-8888-8888-8888-888888888888', 'Tante Wulan', 'Selamat Fajar dan Alya, bahagia selalu ya!', 'hadir', 3);

-- Undangan demo tema Surat Cinta (tanpa foto)
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'contoh-surat-cinta', 'surat-cinta', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(
    (content - 'coverImage' - 'ogImage' - 'youtubeUrl')
      #- '{couple,groom,image}' #- '{couple,bride,image}' #- '{couple,groom,instagram}' #- '{couple,bride,instagram}',
    '{couple,groom,name}', '"Bagas"'), '{couple,groom,fullname}', '"Bagas Wicaksono"'),
    '{couple,bride,name}', '"Kinanti"'), '{couple,bride,fullname}', '"Kinanti Ayu Lestari"')
    || '{"gallery": []}'::jsonb,
  '{"surat-cinta": {"palette": "anggur"}}'::jsonb
from public.invitations where slug = 'dimas-laras';

insert into public.wishes (invitation_id, name, message, attendance, guest_count)
values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mbak Retno', 'Suratnya sudah sampai, kami pasti datang. Selamat ya Bagas dan Kinanti!', 'hadir', 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Keluarga Pak Surya', 'Semoga menjadi rumah tangga yang tenang dan penuh kasih.', 'hadir', 4);

-- Undangan demo warna lain tema Surat Cinta
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'contoh-surat-cinta-laut', 'surat-cinta', 'active', now() + interval '365 days',
  content, '{"surat-cinta": {"palette": "laut"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'contoh-surat-cinta-zaitun', 'surat-cinta', 'active', now() + interval '365 days',
  content, '{"surat-cinta": {"palette": "zaitun"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';

-- Undangan demo tema Koran Pagi (tanpa foto), tiga warna
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'ffffffff-ffff-ffff-ffff-fffffffffff1', 'contoh-koran-pagi', 'koran-pagi', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Satria"'), '{couple,groom,fullname}', '"Satria Wibisono"'),
    '{couple,bride,name}', '"Anindya"'), '{couple,bride,fullname}', '"Anindya Prameswari"'), '{"koran-pagi": {"palette": "klasik"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('ffffffff-ffff-ffff-ffff-fffffffffff1', 'Pak Darmo', 'Baru kali ini saya baca koran sambil senyum. Selamat untuk Satria dan Anindya!', 'hadir', 2),
  ('ffffffff-ffff-ffff-ffff-fffffffffff1', 'Tim futsal Satria', 'TTS-nya sudah kami isi. Sampai ketemu di resepsi.', 'hadir', 5);
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'ffffffff-ffff-ffff-ffff-fffffffffff2', 'contoh-koran-pagi-salem', 'koran-pagi', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Satria"'), '{couple,groom,fullname}', '"Satria Wibisono"'),
    '{couple,bride,name}', '"Anindya"'), '{couple,bride,fullname}', '"Anindya Prameswari"'), '{"koran-pagi": {"palette": "salem"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('ffffffff-ffff-ffff-ffff-fffffffffff2', 'Pak Darmo', 'Baru kali ini saya baca koran sambil senyum. Selamat untuk Satria dan Anindya!', 'hadir', 2),
  ('ffffffff-ffff-ffff-ffff-fffffffffff2', 'Tim futsal Satria', 'TTS-nya sudah kami isi. Sampai ketemu di resepsi.', 'hadir', 5);
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'ffffffff-ffff-ffff-ffff-fffffffffff3', 'contoh-koran-pagi-melati', 'koran-pagi', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Satria"'), '{couple,groom,fullname}', '"Satria Wibisono"'),
    '{couple,bride,name}', '"Anindya"'), '{couple,bride,fullname}', '"Anindya Prameswari"'), '{"koran-pagi": {"palette": "melati"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('ffffffff-ffff-ffff-ffff-fffffffffff3', 'Pak Darmo', 'Baru kali ini saya baca koran sambil senyum. Selamat untuk Satria dan Anindya!', 'hadir', 2),
  ('ffffffff-ffff-ffff-ffff-fffffffffff3', 'Tim futsal Satria', 'TTS-nya sudah kami isi. Sampai ketemu di resepsi.', 'hadir', 5);

-- Undangan demo tema Piringan Hitam (tanpa foto), tiga warna
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababa1', 'contoh-piringan-hitam', 'piringan-hitam', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Gilang"'), '{couple,groom,fullname}', '"Gilang Mahardika"'),
    '{couple,bride,name}', '"Melati"'), '{couple,bride,fullname}', '"Melati Kusumawardani"'), '{"piringan-hitam": {"palette": "senja"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababa1', 'Om Yanto', 'Titip salam untuk Gilang dan Melati, semoga lagunya awet sampai tua.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababa1', 'Anak kos lantai dua', 'Kami siap request lagu di resepsi!', 'hadir', 4);
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababa2', 'contoh-piringan-hitam-laguna', 'piringan-hitam', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Gilang"'), '{couple,groom,fullname}', '"Gilang Mahardika"'),
    '{couple,bride,name}', '"Melati"'), '{couple,bride,fullname}', '"Melati Kusumawardani"'), '{"piringan-hitam": {"palette": "laguna"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababa2', 'Om Yanto', 'Titip salam untuk Gilang dan Melati, semoga lagunya awet sampai tua.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababa2', 'Anak kos lantai dua', 'Kami siap request lagu di resepsi!', 'hadir', 4);
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababa3', 'contoh-piringan-hitam-anggrek', 'piringan-hitam', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Gilang"'), '{couple,groom,fullname}', '"Gilang Mahardika"'),
    '{couple,bride,name}', '"Melati"'), '{couple,bride,fullname}', '"Melati Kusumawardani"'), '{"piringan-hitam": {"palette": "anggrek"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababa3', 'Om Yanto', 'Titip salam untuk Gilang dan Melati, semoga lagunya awet sampai tua.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababa3', 'Anak kos lantai dua', 'Kami siap request lagu di resepsi!', 'hadir', 4);

-- Undangan demo tema Herbarium (tanpa foto), tiga warna
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababb1', 'contoh-herbarium', 'herbarium', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Damar"'), '{couple,groom,fullname}', '"Damar Prakoso"'),
    '{couple,bride,name}', '"Laksmi"'), '{couple,bride,fullname}', '"Laksmi Pertiwi"'), '{"herbarium": {"palette": "lumut"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababb1', 'Bu Endah', 'Bunga dari nama saya cantik sekali. Selamat untuk Damar dan Laksmi.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababb1', 'Sahabat Laksmi', 'Semoga mekar terus sampai tua.', 'hadir', 3);
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababb2', 'contoh-herbarium-bata', 'herbarium', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Damar"'), '{couple,groom,fullname}', '"Damar Prakoso"'),
    '{couple,bride,name}', '"Laksmi"'), '{couple,bride,fullname}', '"Laksmi Pertiwi"'), '{"herbarium": {"palette": "bata"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababb2', 'Bu Endah', 'Bunga dari nama saya cantik sekali. Selamat untuk Damar dan Laksmi.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababb2', 'Sahabat Laksmi', 'Semoga mekar terus sampai tua.', 'hadir', 3);
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababb3', 'contoh-herbarium-nila', 'herbarium', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Damar"'), '{couple,groom,fullname}', '"Damar Prakoso"'),
    '{couple,bride,name}', '"Laksmi"'), '{couple,bride,fullname}', '"Laksmi Pertiwi"'), '{"herbarium": {"palette": "nila"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababb3', 'Bu Endah', 'Bunga dari nama saya cantik sekali. Selamat untuk Damar dan Laksmi.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababb3', 'Sahabat Laksmi', 'Semoga mekar terus sampai tua.', 'hadir', 3);

-- Undangan demo tema Tiket Kereta (tanpa foto), tiga warna
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababc1', 'contoh-tiket-kereta', 'tiket-kereta', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Bayu"'), '{couple,groom,fullname}', '"Bayu Wicaksono"'),
    '{couple,bride,name}', '"Kinanti"'), '{couple,bride,fullname}', '"Kinanti Ayu"'), '{"tiket-kereta": {"palette": "jingga"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababc1', 'Pakde Harto', 'Selamat jalan, Bayu dan Kinanti. Semoga perjalanannya lancar dan bahagia.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababc1', 'Teman satu gerbong', 'Kami antar sampai peron, oleh-olehnya jangan lupa.', 'hadir', 4);
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababc2', 'contoh-tiket-kereta-biru', 'tiket-kereta', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Bayu"'), '{couple,groom,fullname}', '"Bayu Wicaksono"'),
    '{couple,bride,name}', '"Kinanti"'), '{couple,bride,fullname}', '"Kinanti Ayu"'), '{"tiket-kereta": {"palette": "biru"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababc2', 'Pakde Harto', 'Selamat jalan, Bayu dan Kinanti. Semoga perjalanannya lancar dan bahagia.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababc2', 'Teman satu gerbong', 'Kami antar sampai peron, oleh-olehnya jangan lupa.', 'hadir', 4);
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababc3', 'contoh-tiket-kereta-jambu', 'tiket-kereta', 'active', now() + interval '365 days',
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(content, '{couple,groom,name}', '"Bayu"'), '{couple,groom,fullname}', '"Bayu Wicaksono"'),
    '{couple,bride,name}', '"Kinanti"'), '{couple,bride,fullname}', '"Kinanti Ayu"'), '{"tiket-kereta": {"palette": "jambu"}}'::jsonb
from public.invitations where slug = 'contoh-surat-cinta';
insert into public.wishes (invitation_id, name, message, attendance, guest_count) values
  ('abababab-abab-abab-abab-abababababc3', 'Pakde Harto', 'Selamat jalan, Bayu dan Kinanti. Semoga perjalanannya lancar dan bahagia.', 'hadir', 2),
  ('abababab-abab-abab-abab-abababababc3', 'Teman satu gerbong', 'Kami antar sampai peron, oleh-olehnya jangan lupa.', 'hadir', 4);

-- Undangan demo tema Bioskop (dengan foto), tiga warna. Isi disalin dari demo Signature.
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababd1', 'contoh-bioskop', 'bioskop', 'active', now() + interval '365 days',
  content, '{"bioskop": {"palette": "beludru"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababd2', 'contoh-bioskop-malam', 'bioskop', 'active', now() + interval '365 days',
  content, '{"bioskop": {"palette": "malam"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababd3', 'contoh-bioskop-sepia', 'bioskop', 'active', now() + interval '365 days',
  content, '{"bioskop": {"palette": "sepia"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.wishes (invitation_id, name, message, attendance, guest_count)
select id, w.name, w.message, 'hadir', w.n
from public.invitations,
  (values ('Tante Rina', 'Sudah pesan kursi paling depan. Selamat untuk Ozy dan Zelda!', 2),
          ('Geng nonton Jumat malam', 'Akhirnya film yang kita tunggu tayang juga. Semoga bahagia sampai sekuelnya.', 5)) as w(name, message, n)
where slug in ('contoh-bioskop', 'contoh-bioskop-malam', 'contoh-bioskop-sepia');

-- Undangan demo tema Album Polaroid (dengan foto), tiga warna. Isi disalin dari demo Signature.
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababe1', 'contoh-album-polaroid', 'album-polaroid', 'active', now() + interval '365 days',
  content, '{"album-polaroid": {"palette": "krem"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababe2', 'contoh-album-polaroid-kraft', 'album-polaroid', 'active', now() + interval '365 days',
  content, '{"album-polaroid": {"palette": "kraft"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababe3', 'contoh-album-polaroid-hitam', 'album-polaroid', 'active', now() + interval '365 days',
  content, '{"album-polaroid": {"palette": "hitam"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.wishes (invitation_id, name, message, attendance, guest_count)
select id, w.name, w.message, 'hadir', w.n
from public.invitations,
  (values ('Bude Sri', 'Fotonya cantik-cantik. Semoga albumnya terus bertambah sampai tua.', 2),
          ('Teman kuliah Zelda', 'Kami datang bawa kamera, siap mengisi halaman berikutnya!', 4)) as w(name, message, n)
where slug in ('contoh-album-polaroid', 'contoh-album-polaroid-kraft', 'contoh-album-polaroid-hitam');

-- Undangan demo tema Lengkung Boho (dengan foto), tiga warna. Isi disalin dari demo Signature.
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababf1', 'contoh-lengkung-boho', 'lengkung-boho', 'active', now() + interval '365 days',
  content, '{"lengkung-boho": {"palette": "terakota"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababf2', 'contoh-lengkung-boho-zaitun', 'lengkung-boho', 'active', now() + interval '365 days',
  content, '{"lengkung-boho": {"palette": "zaitun"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-abababababf3', 'contoh-lengkung-boho-mawar', 'lengkung-boho', 'active', now() + interval '365 days',
  content, '{"lengkung-boho": {"palette": "mawar"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.wishes (invitation_id, name, message, attendance, guest_count)
select id, w.name, w.message, 'hadir', w.n
from public.invitations,
  (values ('Mbak Ayu', 'Cantik sekali undangannya, sehangat kalian berdua. Selamat ya!', 2),
          ('Keluarga Om Rudi', 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.', 4)) as w(name, message, n)
where slug in ('contoh-lengkung-boho', 'contoh-lengkung-boho-zaitun', 'contoh-lengkung-boho-mawar');

-- Undangan demo tema Senja Pantai (dengan foto), tiga warna. Isi disalin dari demo Signature.
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0a1', 'contoh-senja-pantai', 'senja-pantai', 'active', now() + interval '365 days',
  content, '{"senja-pantai": {"palette": "jingga"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0a2', 'contoh-senja-pantai-lembayung', 'senja-pantai', 'active', now() + interval '365 days',
  content, '{"senja-pantai": {"palette": "lembayung"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0a3', 'contoh-senja-pantai-toska', 'senja-pantai', 'active', now() + interval '365 days',
  content, '{"senja-pantai": {"palette": "toska"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.wishes (invitation_id, name, message, attendance, guest_count)
select id, w.name, w.message, 'hadir', w.n
from public.invitations,
  (values ('Kak Dimas', 'Undangannya bikin kangen pantai. Selamat menempuh hidup baru, semoga langgeng!', 2),
          ('Keluarga Tante Wulan', 'Semoga rumah tangganya selalu hangat seperti senja. Kami pasti datang.', 3)) as w(name, message, n)
where slug in ('contoh-senja-pantai', 'contoh-senja-pantai-lembayung', 'contoh-senja-pantai-toska');

-- Undangan demo tema Galeri Seni (dengan foto), tiga warna. Isi disalin dari demo Signature.
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0b1', 'contoh-galeri-seni', 'galeri-seni', 'active', now() + interval '365 days',
  content, '{"galeri-seni": {"palette": "putih"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0b2', 'contoh-galeri-seni-zamrud', 'galeri-seni', 'active', now() + interval '365 days',
  content, '{"galeri-seni": {"palette": "zamrud"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0b3', 'contoh-galeri-seni-anggur', 'galeri-seni', 'active', now() + interval '365 days',
  content, '{"galeri-seni": {"palette": "anggur"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.wishes (invitation_id, name, message, attendance, guest_count)
select id, w.name, w.message, 'hadir', w.n
from public.invitations,
  (values ('Mas Bayu', 'Konsepnya keren banget, berasa diundang ke pameran. Selamat ya kalian!', 2),
          ('Keluarga Pak Harun', 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Kami akan hadir.', 4)) as w(name, message, n)
where slug in ('contoh-galeri-seni', 'contoh-galeri-seni-zamrud', 'contoh-galeri-seni-anggur');

-- Undangan demo tema Paspor Cinta (dengan foto), tiga warna. Isi disalin dari demo Signature.
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0c1', 'contoh-paspor-cinta', 'paspor-cinta', 'active', now() + interval '365 days',
  content, '{"paspor-cinta": {"palette": "biru"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0c2', 'contoh-paspor-cinta-merah', 'paspor-cinta', 'active', now() + interval '365 days',
  content, '{"paspor-cinta": {"palette": "merah"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.invitations (id, slug, template_id, status, active_until, content, template_options)
select 'abababab-abab-abab-abab-ababababa0c3', 'contoh-paspor-cinta-hijau', 'paspor-cinta', 'active', now() + interval '365 days',
  content, '{"paspor-cinta": {"palette": "hijau"}}'::jsonb
from public.invitations where slug = 'contoh-royal-gold';
insert into public.wishes (invitation_id, name, message, attendance, guest_count)
select id, w.name, w.message, 'hadir', w.n
from public.invitations,
  (values ('Kak Sinta', 'Selamat berangkat ke perjalanan paling indah! Semoga selalu bahagia di setiap tujuan.', 2),
          ('Keluarga Om Herman', 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Kami ikut check-in!', 4)) as w(name, message, n)
where slug in ('contoh-paspor-cinta', 'contoh-paspor-cinta-merah', 'contoh-paspor-cinta-hijau');
