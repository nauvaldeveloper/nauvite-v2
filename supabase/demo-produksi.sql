-- Undangan demo untuk landing page di database PRODUKSI.
-- Jalankan sekali di Supabase cloud: Dashboard > SQL Editor > tempel isi file ini > Run.
-- Aman dijalankan ulang: demo yang sudah ada diperbarui, bukan digandakan.
-- Dibuat dari data lokal (supabase/seed.sql). Foto demo ada di public/demo, jadi ikut ter-deploy.

insert into public.invitations (slug, template_id, status, active_until, content, template_options)
values ('contoh-dusty-rose', 'dusty-rose', 'active', null, '{
    "gifts": [
        {
            "bank": "BCA",
            "accountName": "Dimas Prasetyo",
            "accountNumber": "1234567890"
        },
        {
            "bank": "Mandiri",
            "accountName": "Larasati Putri",
            "accountNumber": "0987654321"
        }
    ],
    "couple": {
        "bride": {
            "name": "Nadia",
            "image": "/demo/mempelai-wanita.webp",
            "father": "Bapak Agus Wibowo",
            "mother": "Ibu Dewi Lestari",
            "fullname": "Nadia Kirana Putri",
            "instagram": "@larasatiputri",
            "daughterOf": "Putri pertama dari"
        },
        "groom": {
            "name": "Raka",
            "image": "/demo/mempelai-pria.webp",
            "sonOf": "Putra kedua dari",
            "father": "Bapak Hendra Prasetyo",
            "mother": "Ibu Ratna Sari",
            "fullname": "Raka Aditya Nugraha",
            "instagram": "@dimasprasetyo"
        }
    },
    "events": [
        {
            "date": "2027-03-20",
            "title": "Akad Nikah",
            "address": "Jl. Melati No. 12, Bandung",
            "endTime": "10:00",
            "mapsUrl": "https://maps.google.com/?q=Masjid+Al-Ikhlas+Bandung",
            "location": "Masjid Al-Ikhlas",
            "startTime": "08:00"
        },
        {
            "date": "2027-03-20",
            "title": "Resepsi",
            "address": "Jl. Taman Sari No. 45, Bandung",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Taman+Sari+Bandung",
            "location": "Gedung Serbaguna Taman Sari",
            "startTime": "11:00"
        }
    ],
    "quotes": "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    "gallery": [
        "/demo/galeri-1.webp",
        "/demo/galeri-2.webp",
        "/demo/galeri-3.webp",
        "/demo/galeri-4.webp",
        "/demo/galeri-5.webp",
        "/demo/galeri-6.webp"
    ],
    "ogImage": "/demo/og.jpg",
    "stories": [
        {
            "date": "Agustus 2021",
            "image": "/demo/cerita-1.webp",
            "title": "Pertama bertemu",
            "description": "Kami bertemu di sebuah acara kampus. Obrolan singkat tentang buku berlanjut sampai larut sore."
        },
        {
            "date": "Desember 2026",
            "image": "/demo/cerita-2.webp",
            "title": "Lamaran",
            "description": "Di hadapan kedua keluarga, kami memutuskan untuk melangkah bersama."
        }
    ],
    "coverImage": "/demo/galeri-1.webp",
    "quotesSource": "QS. Ar-Rum: 21"
}'::jsonb, '{"dusty-rose": {"greeting": "umum"}}'::jsonb)
on conflict (slug) do update set template_id = excluded.template_id, status = 'active', active_until = null, content = excluded.content, template_options = excluded.template_options;

insert into public.invitations (slug, template_id, status, active_until, content, template_options)
values ('contoh-floral-light', 'floral-light', 'active', null, E'{
    "gifts": [
        {
            "bank": "BCA",
            "accountName": "Ozy Zulkarnain",
            "accountNumber": "123456"
        },
        {
            "bank": "Mandiri",
            "accountName": "Zelda Wulandari",
            "accountNumber": "567890"
        }
    ],
    "couple": {
        "bride": {
            "name": "Zelda",
            "image": "/demo/signature/mempelai-wanita.webp",
            "fullname": "Zelda Wulandari",
            "instagram": "@zeldawulandaricontoh",
            "daughterOf": "Putri dari Bpk. Daniswara Permadi & Ibu Yuliana Lestari",
            "socialIcon": "fab fa-tiktok"
        },
        "groom": {
            "name": "Ozy",
            "image": "/demo/signature/mempelai-pria.webp",
            "sonOf": "Putra dari Bpk. Hendra Wibowo & Ibu Wirda Wahyuni",
            "fullname": "Ozy Zulkarnain",
            "instagram": "@ozyzulkarnaincontoh",
            "socialIcon": "fab fa-tiktok"
        }
    },
    "events": [
        {
            "date": "2027-06-12",
            "title": "Akad Nikah",
            "address": "Jl. Bunga Wangi No.88, Kec. Harum, Kab. Indah",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=KUA%20Bunga%20Wangi",
            "location": "KUA Bunga Wangi",
            "startTime": "08:00",
            "entertainment": ""
        },
        {
            "date": "2027-06-13",
            "title": "Resepsi",
            "address": "Jl. Sangat Harum No.666, Kec. Segar, Kab. Sangat Segar",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Rumah%20Zelda%20Wulandari",
            "location": "Rumah Zelda Wulandari",
            "startTime": "08:00",
            "entertainment": "Wayang Kulit Satu Malam Suntuk \\"Ki Dalang Kardi Suryono\\""
        },
        {
            "date": "2027-06-15",
            "title": "Ngunduh Mantu",
            "address": "Jl. Kemenangan No.1, Kec. Sukses, Kab. Jaya",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Gedung%20Serbaguna%20Hendra%20Wibowo",
            "location": "Gedung Serbaguna Hendra Wibowo",
            "startTime": "09:00",
            "entertainment": "Live Music Accoustic & Orkes Melayu"
        }
    ],
    "quotes": "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.” (QS. Ar-Rum: 21)",
    "gallery": [
        "/demo/signature/gallery1.webp",
        "/demo/signature/gallery2.webp",
        "/demo/signature/gallery3.webp",
        "/demo/signature/gallery4.webp",
        "/demo/signature/gallery5.webp",
        "/demo/signature/gallery6.webp"
    ],
    "ogImage": "/demo/signature/og.jpg",
    "stories": [
        {
            "date": "Rabu, 12 Februari 2025",
            "image": "/demo/signature/story1.webp",
            "title": "Pertemuan Pertama",
            "description": "Takdir mempertemukan kami untuk pertama kalinya. Dari sebuah pertemuan sederhana, tumbuh rasa nyaman yang tak terduga. Sejak hari itu, kami mulai saling mengenal dan berbagi cerita."
        },
        {
            "date": "Selasa, 25 Maret 2025",
            "image": "/demo/signature/story3.webp",
            "title": "Menjalin Hubungan",
            "description": "Hari demi hari kami lewati bersama. Tawa, doa, dan dukungan menjadi bagian dari perjalanan kami. Di tanggal ini, kami resmi berkomitmen untuk berjalan beriringan."
        },
        {
            "date": "Selasa, 10 Juni 2025",
            "image": "/demo/signature/story2.webp",
            "title": "Menguatkan Cinta",
            "description": "Berbagai tantangan kami hadapi bersama. Dari setiap perbedaan, kami belajar saling memahami. Cinta kami semakin kuat dan penuh makna."
        },
        {
            "date": "Sabtu, 20 September 2025",
            "image": "/demo/signature/story4.webp",
            "title": "Lamaran 💍",
            "description": "Dengan penuh keyakinan dan cinta, kami melangkah ke tahap yang lebih serius. Disaksikan keluarga tercinta, momen lamaran ini menjadi awal perjalanan menuju hidup bersama."
        }
    ],
    "coverImage": "/demo/signature/gallery2.webp",
    "weddingDate": "2027-06-13",
    "countdownDate": "2027-06-13 08:00:00"
}'::jsonb, '{}'::jsonb)
on conflict (slug) do update set template_id = excluded.template_id, status = 'active', active_until = null, content = excluded.content, template_options = excluded.template_options;

insert into public.invitations (slug, template_id, status, active_until, content, template_options)
values ('contoh-lavender-mist', 'lavender-mist', 'active', null, '{
    "gifts": [
        {
            "bank": "BCA",
            "accountName": "Dimas Prasetyo",
            "accountNumber": "1234567890"
        },
        {
            "bank": "Mandiri",
            "accountName": "Larasati Putri",
            "accountNumber": "0987654321"
        }
    ],
    "couple": {
        "bride": {
            "name": "Alya",
            "image": "/demo/mempelai-wanita.webp",
            "father": "Bapak Agus Wibowo",
            "mother": "Ibu Dewi Lestari",
            "fullname": "Alya Salsabila",
            "instagram": "@larasatiputri",
            "daughterOf": "Putri pertama dari"
        },
        "groom": {
            "name": "Fajar",
            "image": "/demo/mempelai-pria.webp",
            "sonOf": "Putra kedua dari",
            "father": "Bapak Hendra Prasetyo",
            "mother": "Ibu Ratna Sari",
            "fullname": "Fajar Ramadhan",
            "instagram": "@dimasprasetyo"
        }
    },
    "events": [
        {
            "date": "2027-03-20",
            "title": "Akad Nikah",
            "address": "Jl. Melati No. 12, Bandung",
            "endTime": "10:00",
            "mapsUrl": "https://maps.google.com/?q=Masjid+Al-Ikhlas+Bandung",
            "location": "Masjid Al-Ikhlas",
            "startTime": "08:00"
        },
        {
            "date": "2027-03-20",
            "title": "Resepsi",
            "address": "Jl. Taman Sari No. 45, Bandung",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Taman+Sari+Bandung",
            "location": "Gedung Serbaguna Taman Sari",
            "startTime": "11:00"
        }
    ],
    "quotes": "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    "gallery": [
        "/demo/galeri-1.webp",
        "/demo/galeri-2.webp",
        "/demo/galeri-3.webp",
        "/demo/galeri-4.webp",
        "/demo/galeri-5.webp",
        "/demo/galeri-6.webp"
    ],
    "ogImage": "/demo/og.jpg",
    "stories": [
        {
            "date": "Agustus 2021",
            "image": "/demo/cerita-1.webp",
            "title": "Pertama bertemu",
            "description": "Kami bertemu di sebuah acara kampus. Obrolan singkat tentang buku berlanjut sampai larut sore."
        },
        {
            "date": "Desember 2026",
            "image": "/demo/cerita-2.webp",
            "title": "Lamaran",
            "description": "Di hadapan kedua keluarga, kami memutuskan untuk melangkah bersama."
        }
    ],
    "coverImage": "/demo/galeri-5.webp",
    "quotesSource": "QS. Ar-Rum: 21"
}'::jsonb, '{"lavender-mist": {"greeting": "islami"}}'::jsonb)
on conflict (slug) do update set template_id = excluded.template_id, status = 'active', active_until = null, content = excluded.content, template_options = excluded.template_options;

insert into public.invitations (slug, template_id, status, active_until, content, template_options)
values ('contoh-midnight-dark', 'midnight-dark', 'active', null, E'{
    "gifts": [
        {
            "bank": "BCA",
            "accountName": "Ozy Zulkarnain",
            "accountNumber": "123456"
        },
        {
            "bank": "Mandiri",
            "accountName": "Zelda Wulandari",
            "accountNumber": "567890"
        }
    ],
    "couple": {
        "bride": {
            "name": "Zelda",
            "image": "/demo/signature/mempelai-wanita.webp",
            "fullname": "Zelda Wulandari",
            "instagram": "@zeldawulandaricontoh",
            "daughterOf": "Putri dari Bpk. Daniswara Permadi & Ibu Yuliana Lestari",
            "socialIcon": "fab fa-tiktok"
        },
        "groom": {
            "name": "Ozy",
            "image": "/demo/signature/mempelai-pria.webp",
            "sonOf": "Putra dari Bpk. Hendra Wibowo & Ibu Wirda Wahyuni",
            "fullname": "Ozy Zulkarnain",
            "instagram": "@ozyzulkarnaincontoh",
            "socialIcon": "fab fa-tiktok"
        }
    },
    "events": [
        {
            "date": "2027-06-12",
            "title": "Akad Nikah",
            "address": "Jl. Bunga Wangi No.88, Kec. Harum, Kab. Indah",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=KUA%20Bunga%20Wangi",
            "location": "KUA Bunga Wangi",
            "startTime": "08:00",
            "entertainment": ""
        },
        {
            "date": "2027-06-13",
            "title": "Resepsi",
            "address": "Jl. Sangat Harum No.666, Kec. Segar, Kab. Sangat Segar",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Rumah%20Zelda%20Wulandari",
            "location": "Rumah Zelda Wulandari",
            "startTime": "08:00",
            "entertainment": "Wayang Kulit Satu Malam Suntuk \\"Ki Dalang Kardi Suryono\\""
        },
        {
            "date": "2027-06-15",
            "title": "Ngunduh Mantu",
            "address": "Jl. Kemenangan No.1, Kec. Sukses, Kab. Jaya",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Gedung%20Serbaguna%20Hendra%20Wibowo",
            "location": "Gedung Serbaguna Hendra Wibowo",
            "startTime": "09:00",
            "entertainment": "Live Music Accoustic & Orkes Melayu"
        }
    ],
    "quotes": "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.” (QS. Ar-Rum: 21)",
    "gallery": [
        "/demo/signature/gallery1.webp",
        "/demo/signature/gallery2.webp",
        "/demo/signature/gallery3.webp",
        "/demo/signature/gallery4.webp",
        "/demo/signature/gallery5.webp",
        "/demo/signature/gallery6.webp"
    ],
    "ogImage": "/demo/signature/og.jpg",
    "stories": [
        {
            "date": "Rabu, 12 Februari 2025",
            "image": "/demo/signature/story1.webp",
            "title": "Pertemuan Pertama",
            "description": "Takdir mempertemukan kami untuk pertama kalinya. Dari sebuah pertemuan sederhana, tumbuh rasa nyaman yang tak terduga. Sejak hari itu, kami mulai saling mengenal dan berbagi cerita."
        },
        {
            "date": "Selasa, 25 Maret 2025",
            "image": "/demo/signature/story3.webp",
            "title": "Menjalin Hubungan",
            "description": "Hari demi hari kami lewati bersama. Tawa, doa, dan dukungan menjadi bagian dari perjalanan kami. Di tanggal ini, kami resmi berkomitmen untuk berjalan beriringan."
        },
        {
            "date": "Selasa, 10 Juni 2025",
            "image": "/demo/signature/story2.webp",
            "title": "Menguatkan Cinta",
            "description": "Berbagai tantangan kami hadapi bersama. Dari setiap perbedaan, kami belajar saling memahami. Cinta kami semakin kuat dan penuh makna."
        },
        {
            "date": "Sabtu, 20 September 2025",
            "image": "/demo/signature/story4.webp",
            "title": "Lamaran 💍",
            "description": "Dengan penuh keyakinan dan cinta, kami melangkah ke tahap yang lebih serius. Disaksikan keluarga tercinta, momen lamaran ini menjadi awal perjalanan menuju hidup bersama."
        }
    ],
    "coverImage": "/demo/signature/gallery2.webp",
    "weddingDate": "2027-06-13",
    "countdownDate": "2027-06-13 08:00:00"
}'::jsonb, '{}'::jsonb)
on conflict (slug) do update set template_id = excluded.template_id, status = 'active', active_until = null, content = excluded.content, template_options = excluded.template_options;

insert into public.invitations (slug, template_id, status, active_until, content, template_options)
values ('contoh-royal-gold', 'royal-gold', 'active', null, E'{
    "gifts": [
        {
            "bank": "BCA",
            "accountName": "Ozy Zulkarnain",
            "accountNumber": "123456"
        },
        {
            "bank": "Mandiri",
            "accountName": "Zelda Wulandari",
            "accountNumber": "567890"
        }
    ],
    "couple": {
        "bride": {
            "name": "Zelda",
            "image": "/demo/signature/mempelai-wanita.webp",
            "fullname": "Zelda Wulandari",
            "instagram": "@zeldawulandaricontoh",
            "daughterOf": "Putri dari Bpk. Daniswara Permadi & Ibu Yuliana Lestari",
            "socialIcon": "fab fa-tiktok"
        },
        "groom": {
            "name": "Ozy",
            "image": "/demo/signature/mempelai-pria.webp",
            "sonOf": "Putra dari Bpk. Hendra Wibowo & Ibu Wirda Wahyuni",
            "fullname": "Ozy Zulkarnain",
            "instagram": "@ozyzulkarnaincontoh",
            "socialIcon": "fab fa-tiktok"
        }
    },
    "events": [
        {
            "date": "2027-06-12",
            "title": "Akad Nikah",
            "address": "Jl. Bunga Wangi No.88, Kec. Harum, Kab. Indah",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=KUA%20Bunga%20Wangi",
            "location": "KUA Bunga Wangi",
            "startTime": "08:00",
            "entertainment": ""
        },
        {
            "date": "2027-06-13",
            "title": "Resepsi",
            "address": "Jl. Sangat Harum No.666, Kec. Segar, Kab. Sangat Segar",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Rumah%20Zelda%20Wulandari",
            "location": "Rumah Zelda Wulandari",
            "startTime": "08:00",
            "entertainment": "Wayang Kulit Satu Malam Suntuk \\"Ki Dalang Kardi Suryono\\""
        },
        {
            "date": "2027-06-15",
            "title": "Ngunduh Mantu",
            "address": "Jl. Kemenangan No.1, Kec. Sukses, Kab. Jaya",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Gedung%20Serbaguna%20Hendra%20Wibowo",
            "location": "Gedung Serbaguna Hendra Wibowo",
            "startTime": "09:00",
            "entertainment": "Live Music Accoustic & Orkes Melayu"
        }
    ],
    "quotes": "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.” (QS. Ar-Rum: 21)",
    "gallery": [
        "/demo/signature/gallery1.webp",
        "/demo/signature/gallery2.webp",
        "/demo/signature/gallery3.webp",
        "/demo/signature/gallery4.webp",
        "/demo/signature/gallery5.webp",
        "/demo/signature/gallery6.webp"
    ],
    "ogImage": "/demo/signature/og.jpg",
    "stories": [
        {
            "date": "Rabu, 12 Februari 2025",
            "image": "/demo/signature/story1.webp",
            "title": "Pertemuan Pertama",
            "description": "Takdir mempertemukan kami untuk pertama kalinya. Dari sebuah pertemuan sederhana, tumbuh rasa nyaman yang tak terduga. Sejak hari itu, kami mulai saling mengenal dan berbagi cerita."
        },
        {
            "date": "Selasa, 25 Maret 2025",
            "image": "/demo/signature/story3.webp",
            "title": "Menjalin Hubungan",
            "description": "Hari demi hari kami lewati bersama. Tawa, doa, dan dukungan menjadi bagian dari perjalanan kami. Di tanggal ini, kami resmi berkomitmen untuk berjalan beriringan."
        },
        {
            "date": "Selasa, 10 Juni 2025",
            "image": "/demo/signature/story2.webp",
            "title": "Menguatkan Cinta",
            "description": "Berbagai tantangan kami hadapi bersama. Dari setiap perbedaan, kami belajar saling memahami. Cinta kami semakin kuat dan penuh makna."
        },
        {
            "date": "Sabtu, 20 September 2025",
            "image": "/demo/signature/story4.webp",
            "title": "Lamaran 💍",
            "description": "Dengan penuh keyakinan dan cinta, kami melangkah ke tahap yang lebih serius. Disaksikan keluarga tercinta, momen lamaran ini menjadi awal perjalanan menuju hidup bersama."
        }
    ],
    "coverImage": "/demo/signature/gallery2.webp",
    "weddingDate": "2027-06-13",
    "countdownDate": "2027-06-13 08:00:00"
}'::jsonb, '{}'::jsonb)
on conflict (slug) do update set template_id = excluded.template_id, status = 'active', active_until = null, content = excluded.content, template_options = excluded.template_options;

insert into public.invitations (slug, template_id, status, active_until, content, template_options)
values ('contoh-sage-garden', 'sage-garden', 'active', null, '{
    "gifts": [
        {
            "bank": "BCA",
            "accountName": "Dimas Prasetyo",
            "accountNumber": "1234567890"
        },
        {
            "bank": "Mandiri",
            "accountName": "Larasati Putri",
            "accountNumber": "0987654321"
        }
    ],
    "couple": {
        "bride": {
            "name": "Laras",
            "image": "/demo/mempelai-wanita.webp",
            "father": "Bapak Agus Wibowo",
            "mother": "Ibu Dewi Lestari",
            "fullname": "Larasati Putri",
            "instagram": "@larasatiputri",
            "daughterOf": "Putri pertama dari"
        },
        "groom": {
            "name": "Dimas",
            "image": "/demo/mempelai-pria.webp",
            "sonOf": "Putra kedua dari",
            "father": "Bapak Hendra Prasetyo",
            "mother": "Ibu Ratna Sari",
            "fullname": "Dimas Prasetyo",
            "instagram": "@dimasprasetyo"
        }
    },
    "events": [
        {
            "date": "2027-03-20",
            "title": "Akad Nikah",
            "address": "Jl. Melati No. 12, Bandung",
            "endTime": "10:00",
            "mapsUrl": "https://maps.google.com/?q=Masjid+Al-Ikhlas+Bandung",
            "location": "Masjid Al-Ikhlas",
            "startTime": "08:00"
        },
        {
            "date": "2027-03-20",
            "title": "Resepsi",
            "address": "Jl. Taman Sari No. 45, Bandung",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Taman+Sari+Bandung",
            "location": "Gedung Serbaguna Taman Sari",
            "startTime": "11:00"
        }
    ],
    "quotes": "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    "gallery": [
        "/demo/galeri-1.webp",
        "/demo/galeri-2.webp",
        "/demo/galeri-3.webp",
        "/demo/galeri-4.webp",
        "/demo/galeri-5.webp",
        "/demo/galeri-6.webp"
    ],
    "ogImage": "/demo/og.jpg",
    "stories": [
        {
            "date": "Agustus 2021",
            "image": "/demo/cerita-1.webp",
            "title": "Pertama bertemu",
            "description": "Kami bertemu di sebuah acara kampus. Obrolan singkat tentang buku berlanjut sampai larut sore."
        },
        {
            "date": "Desember 2026",
            "image": "/demo/cerita-2.webp",
            "title": "Lamaran",
            "description": "Di hadapan kedua keluarga, kami memutuskan untuk melangkah bersama."
        }
    ],
    "coverImage": "/demo/galeri-3.webp",
    "quotesSource": "QS. Ar-Rum: 21"
}'::jsonb, '{"sage-garden": {"greeting": "islami"}}'::jsonb)
on conflict (slug) do update set template_id = excluded.template_id, status = 'active', active_until = null, content = excluded.content, template_options = excluded.template_options;

insert into public.invitations (slug, template_id, status, active_until, content, template_options)
values ('dimas-laras', 'solid-editorial', 'active', null, '{
    "gifts": [
        {
            "bank": "BCA",
            "accountName": "Dimas Prasetyo",
            "accountNumber": "1234567890"
        },
        {
            "bank": "Mandiri",
            "accountName": "Larasati Putri",
            "accountNumber": "0987654321"
        }
    ],
    "couple": {
        "bride": {
            "name": "Laras",
            "image": "/demo/mempelai-wanita.webp",
            "father": "Bapak Agus Wibowo",
            "mother": "Ibu Dewi Lestari",
            "fullname": "Larasati Putri",
            "instagram": "@larasatiputri",
            "daughterOf": "Putri pertama dari"
        },
        "groom": {
            "name": "Dimas",
            "image": "/demo/mempelai-pria.webp",
            "sonOf": "Putra kedua dari",
            "father": "Bapak Hendra Prasetyo",
            "mother": "Ibu Ratna Sari",
            "fullname": "Dimas Prasetyo",
            "instagram": "@dimasprasetyo"
        }
    },
    "events": [
        {
            "date": "2027-03-20",
            "title": "Akad Nikah",
            "address": "Jl. Melati No. 12, Bandung",
            "endTime": "10:00",
            "mapsUrl": "https://maps.google.com/?q=Masjid+Al-Ikhlas+Bandung",
            "location": "Masjid Al-Ikhlas",
            "startTime": "08:00"
        },
        {
            "date": "2027-03-20",
            "title": "Resepsi",
            "address": "Jl. Taman Sari No. 45, Bandung",
            "endTime": "Selesai",
            "mapsUrl": "https://maps.google.com/?q=Taman+Sari+Bandung",
            "location": "Gedung Serbaguna Taman Sari",
            "startTime": "11:00"
        }
    ],
    "quotes": "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    "gallery": [
        "/demo/galeri-1.webp",
        "/demo/galeri-2.webp",
        "/demo/galeri-3.webp",
        "/demo/galeri-4.webp",
        "/demo/galeri-5.webp",
        "/demo/galeri-6.webp"
    ],
    "ogImage": "/demo/og.jpg",
    "stories": [
        {
            "date": "Agustus 2021",
            "image": "/demo/cerita-1.webp",
            "title": "Pertama bertemu",
            "description": "Kami bertemu di sebuah acara kampus. Obrolan singkat tentang buku berlanjut sampai larut sore."
        },
        {
            "date": "Desember 2026",
            "image": "/demo/cerita-2.webp",
            "title": "Lamaran",
            "description": "Di hadapan kedua keluarga, kami memutuskan untuk melangkah bersama."
        }
    ],
    "coverImage": "/demo/sampul.webp",
    "quotesSource": "QS. Ar-Rum: 21"
}'::jsonb, '{}'::jsonb)
on conflict (slug) do update set template_id = excluded.template_id, status = 'active', active_until = null, content = excluded.content, template_options = excluded.template_options;

