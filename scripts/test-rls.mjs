// Uji keamanan database (RLS + storage) di Supabase LOKAL.
// Jalankan: npm run test:rls   (database di-reset dulu ke data contoh seed.sql)
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { createClient } = require('@supabase/supabase-js');

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split(/\r?\n/).filter((l) => l && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, '')]; })
);
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL, ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUDI = '11111111-1111-1111-1111-111111111111';
const RINA = '22222222-2222-2222-2222-222222222222';
const SARI = '33333333-3333-3333-3333-333333333333';

let pass = 0, fail = 0;
function check(name, ok, info = '') {
  if (ok) pass++; else fail++;
  console.log(`${ok ? 'LULUS' : 'GAGAL'}  ${name}${ok ? '' : '  -> ' + info}`);
}
const client = () => createClient(URL_, ANON, { auth: { persistSession: false } });
async function login(email) {
  const c = client();
  const { error } = await c.auth.signInWithPassword({ email, password: 'password123' });
  if (error) throw new Error(email + ': ' + error.message);
  return c;
}
const png = new Blob([Buffer.from('89504e470d0a1a0a', 'hex')], { type: 'image/png' });

// ---------------- TAMU (anon) ----------------
console.log('\n== Tamu (tidak login) ==');
const anon = client();
{
  const { data, error } = await anon.from('invitations').select('*');
  check('tamu tidak bisa membaca tabel undangan', error || data.length === 0, JSON.stringify(data));
  const r = await anon.from('invitations').update({ status: 'inactive' }).eq('id', BUDI).select();
  check('tamu tidak bisa mengubah undangan', r.error || r.data.length === 0, JSON.stringify(r));
  const pub = await anon.rpc('get_public_invitation', { p_slug: 'budi-ani' });
  check('tamu bisa membuka undangan aktif lewat fungsi publik', pub.data?.slug === 'budi-ani', JSON.stringify(pub));
  check('data publik tidak memuat owner_id / admin_note / status',
    pub.data && !('owner_id' in pub.data) && !('admin_note' in pub.data) && !('status' in pub.data), JSON.stringify(pub.data));
  const draft = await anon.rpc('get_public_invitation', { p_slug: 'rina-dodi' });
  check('undangan draf tidak bisa dibuka tamu', draft.data === null, JSON.stringify(draft));
  const mitraInv = await anon.rpc('get_public_invitation', { p_slug: 'sari-yoga' });
  check('undangan mitra menampilkan nama mitra', mitraInv.data?.partner?.name === 'Sahabat Wedding', JSON.stringify(mitraInv.data));
  const w1 = await anon.from('wishes').insert({ invitation_id: BUDI, name: 'Tamu Uji', message: 'Halo', attendance: 'hadir' });
  check('tamu bisa kirim ucapan ke undangan aktif', !w1.error, JSON.stringify(w1.error));
  const w2 = await anon.from('wishes').insert({ invitation_id: RINA, name: 'Tamu Uji', message: 'Halo' });
  check('tamu tidak bisa kirim ucapan ke undangan draf', !!w2.error, 'insert berhasil');
  const w3 = await anon.from('wishes').insert({ invitation_id: BUDI, name: 'x', message: 'a'.repeat(600) });
  check('ucapan lebih dari 500 huruf ditolak', !!w3.error, 'insert berhasil');
  const ws = await anon.from('wishes').select('*');
  check('tamu tidak bisa membaca tabel ucapan (RSVP)', ws.error || ws.data.length === 0, JSON.stringify(ws.data));
  const wd = await anon.from('wishes').delete().eq('invitation_id', BUDI).select();
  check('tamu tidak bisa menghapus ucapan', wd.error || wd.data.length === 0, JSON.stringify(wd));
  const pw = await anon.rpc('get_public_wishes', { p_slug: 'budi-ani' });
  check('daftar ucapan publik hanya nama + ucapan',
    pw.data?.length >= 2 && !('attendance' in pw.data[0]) && !('guest_count' in pw.data[0]), JSON.stringify(pw));
  const up = await anon.storage.from('invitation-media').upload(`${BUDI}/hack.png`, png);
  check('tamu tidak bisa mengunggah file', !!up.error, 'upload berhasil');
  const pr = await anon.from('profiles').select('*');
  check('tamu tidak bisa membaca profil', pr.error || pr.data.length === 0, JSON.stringify(pr.data));
  const st = await anon.from('app_settings').select('key');
  check('tamu hanya melihat pengaturan publik',
    !st.error && !st.data.some((s) => s.key === 'payment_note') && st.data.length === 3, JSON.stringify(st));
}

// ---------------- KLIEN ----------------
console.log('\n== Klien (klien@nauvite.test, pemilik budi-ani) ==');
const klien = await login('klien@nauvite.test');
{
  const { data } = await klien.from('invitations').select('slug');
  check('klien hanya melihat undangannya sendiri', data?.length === 1 && data[0].slug === 'budi-ani', JSON.stringify(data));
  const u1 = await klien.from('invitations')
    .update({ content: { couple: { groom: { name: 'Budi' }, bride: { name: 'Ani' } }, quotes: 'uji' } })
    .eq('id', BUDI).select('updated_by');
  check('klien bisa mengubah isi undangannya', u1.data?.length === 1, JSON.stringify(u1));
  check('updated_by tercatat', u1.data?.[0]?.updated_by === '00000000-0000-0000-0000-00000000000c', JSON.stringify(u1.data));
  const u2 = await klien.from('invitations').update({ content: {} }).eq('id', RINA).select();
  check('klien tidak bisa mengubah undangan orang lain', u2.error || u2.data.length === 0, JSON.stringify(u2));
  const u3 = await klien.from('invitations').update({ status: 'active', active_until: '2099-01-01' }).eq('id', BUDI).select();
  check('klien tidak bisa mengubah status / masa aktif', !!u3.error, JSON.stringify(u3));
  const u4 = await klien.from('invitations').update({ slug: 'ganti-slug' }).eq('id', BUDI).select();
  check('klien tidak bisa mengganti slug', !!u4.error, JSON.stringify(u4));
  const ins = await klien.from('invitations').insert({ slug: 'baru-sendiri', template_id: 'royal-gold' });
  check('klien tidak bisa membuat undangan baru', !!ins.error, 'insert berhasil');
  const del = await klien.from('invitations').delete().eq('id', BUDI).select();
  check('klien tidak bisa menghapus undangan', del.error || del.data.length === 0, JSON.stringify(del));
  const role = await klien.from('profiles').update({ role: 'admin' }).eq('id', '00000000-0000-0000-0000-00000000000c').select();
  check('klien tidak bisa menjadikan dirinya admin', !!role.error, JSON.stringify(role));
  const nm = await klien.from('profiles').update({ whatsapp: '62811' }).eq('id', '00000000-0000-0000-0000-00000000000c').select();
  check('klien bisa mengubah nomor WA di profilnya', nm.data?.length === 1, JSON.stringify(nm));
  const ws = await klien.from('wishes').select('invitation_id, attendance, guest_count');
  check('klien melihat RSVP lengkap hanya untuk undangannya',
    ws.data?.length >= 2 && ws.data.every((w) => w.invitation_id === BUDI) && 'attendance' in ws.data[0], JSON.stringify(ws));
  const up1 = await klien.storage.from('invitation-media').upload(`${BUDI}/foto.png`, png, { upsert: true });
  check('klien bisa unggah ke folder undangannya', !up1.error, JSON.stringify(up1.error));
  const up2 = await klien.storage.from('invitation-media').upload(`${RINA}/foto.png`, png);
  check('klien tidak bisa unggah ke folder undangan orang lain', !!up2.error, 'upload berhasil');
  const up3 = await klien.storage.from('invitation-media').upload(`bebas/foto.png`, png);
  check('klien tidak bisa unggah di luar folder undangan', !!up3.error, 'upload berhasil');
  const up4 = await klien.storage.from('invitation-media').upload(`${BUDI}/virus.exe`,
    new Blob(['MZ'], { type: 'application/x-msdownload' }));
  check('jenis file selain gambar/video/audio ditolak', !!up4.error, 'upload berhasil');
}

// ---------------- KLIEN LAIN ----------------
console.log('\n== Klien lain (klien2@nauvite.test) ==');
const klien2 = await login('klien2@nauvite.test');
{
  const rm = await klien2.storage.from('invitation-media').remove([`${BUDI}/foto.png`]);
  check('klien lain tidak bisa menghapus foto undangan orang lain', !rm.error && rm.data.length === 0, JSON.stringify(rm));
  const ls = await klien2.storage.from('invitation-media').list(BUDI);
  check('klien lain tidak bisa melihat daftar file undangan orang lain', !ls.error && ls.data.length === 0, JSON.stringify(ls.data));
  const ov = await klien2.storage.from('invitation-media').upload(`${BUDI}/foto.png`, png, { upsert: true });
  check('klien lain tidak bisa menimpa foto undangan orang lain', !!ov.error, 'upload berhasil');
  const ws = await klien2.from('wishes').select('*').eq('invitation_id', BUDI);
  check('klien lain tidak bisa membaca RSVP undangan orang lain', ws.data?.length === 0, JSON.stringify(ws));
}

// ---------------- MITRA ----------------
console.log('\n== Mitra (mitra@nauvite.test) ==');
const mitra = await login('mitra@nauvite.test');
{
  const { data } = await mitra.from('invitations').select('slug');
  check('mitra hanya melihat undangan kliennya', data?.length === 1 && data[0].slug === 'sari-yoga', JSON.stringify(data));
  const u = await mitra.from('invitations').update({ content: { couple: { groom: { name: 'Yoga' }, bride: { name: 'Sari' } } } })
    .eq('id', SARI).select();
  check('mitra bisa mengedit undangan kliennya', u.data?.length === 1, JSON.stringify(u));
  const u2 = await mitra.from('invitations').update({ content: {} }).eq('id', BUDI).select();
  check('mitra tidak bisa mengedit undangan klien lain', u2.error || u2.data.length === 0, JSON.stringify(u2));
  const ws = await mitra.from('wishes').select('invitation_id, guest_count');
  check('mitra melihat RSVP undangan kliennya', ws.data?.length === 1 && ws.data[0].invitation_id === SARI, JSON.stringify(ws));
  const up = await mitra.storage.from('invitation-media').upload(`${SARI}/foto.png`, png, { upsert: true });
  check('mitra bisa unggah foto undangan kliennya', !up.error, JSON.stringify(up.error));
  const st = await mitra.from('invitations').update({ partner_id: null }).eq('id', SARI).select();
  check('mitra tidak bisa melepas tanda mitra / status', !!st.error, JSON.stringify(st));
}

// ---------------- ADMIN ----------------
console.log('\n== Admin (admin@nauvite.test) ==');
const admin = await login('admin@nauvite.test');
{
  const { data } = await admin.from('invitations').select('slug');
  check('admin melihat semua undangan', data?.length === 8, JSON.stringify(data));
  const a = await admin.from('invitations').update({ status: 'active', active_until: new Date(Date.now() - 1000).toISOString() })
    .eq('id', RINA).select();
  check('admin bisa mengaktifkan dan mengatur masa aktif', a.data?.length === 1, JSON.stringify(a));
  const exp = await anon.rpc('get_public_invitation', { p_slug: 'rina-dodi' });
  check('undangan lewat masa aktif tidak bisa dibuka tamu', exp.data === null, JSON.stringify(exp));
  const ins = await admin.from('invitations').insert({ slug: 'uji-admin', template_id: 'royal-gold' }).select();
  check('admin bisa membuat undangan', ins.data?.length === 1, JSON.stringify(ins));
  const bad = await admin.from('invitations').insert({ slug: 'admin', template_id: 'royal-gold' });
  check('slug terlarang (mis. "admin") ditolak', !!bad.error, 'insert berhasil');
  const bad2 = await admin.from('invitations').insert({ slug: 'Ada Spasi!', template_id: 'royal-gold' });
  check('slug dengan huruf besar/spasi ditolak', !!bad2.error, 'insert berhasil');
  const st = await admin.from('app_settings').select('key');
  check('admin melihat semua pengaturan', st.data?.length === 4, JSON.stringify(st));
  const pr = await admin.from('profiles').select('id');
  check('admin melihat semua profil', pr.data?.length === 4, JSON.stringify(pr));
}

// ---------------- DAFTAR SENDIRI ----------------
console.log('\n== Orang daftar sendiri ==');
{
  const c = client();
  const s = await c.auth.signUp({ email: `iseng${Date.now()}@nauvite.test`, password: 'password123',
    options: { data: { full_name: 'Iseng', role: 'admin' } } });
  check('daftar berhasil', !s.error, JSON.stringify(s.error));
  const p = await c.from('profiles').select('role').single();
  check('pendaftar baru tetap jadi client walau minta role admin', p.data?.role === 'client', JSON.stringify(p));
  const i = await c.from('invitations').select('slug');
  check('pendaftar baru tidak melihat undangan siapa pun', i.data?.length === 0, JSON.stringify(i));
}

// ---------------- ULASAN ----------------
console.log('\n== Ulasan ==');
{
  const tamu = client();
  const t1 = await tamu.from('reviews').insert({ couple_name: 'Iseng', rating: 5, message: 'Ulasan palsu dari tamu', consent: true });
  check('tamu tidak bisa mengirim ulasan', !!t1.error, 'insert berhasil');

  const k = await login('klien@nauvite.test');
  const kid = '00000000-0000-0000-0000-00000000000c';
  const k1 = await k.from('reviews').insert({ invitation_id: BUDI, author_id: kid, couple_name: 'Budi & Ani', rating: 5, message: 'Undangannya bagus dan mudah diisi.', consent: true, status: 'approved' });
  check('klien tidak bisa langsung menyetujui ulasannya', !!k1.error, 'insert approved berhasil');
  const k2 = await k.from('reviews').insert({ invitation_id: RINA, author_id: kid, couple_name: 'Bukan saya', rating: 5, message: 'Ulasan untuk undangan orang lain.', consent: true });
  check('klien tidak bisa menulis ulasan untuk undangan orang lain', !!k2.error, 'insert berhasil');
  const k3 = await k.from('reviews').insert({ invitation_id: BUDI, author_id: kid, couple_name: 'Budi & Ani', rating: 5, message: 'Undangannya bagus dan mudah diisi.', consent: true }).select('id').single();
  check('klien bisa mengirim ulasan (menunggu persetujuan)', !k3.error, JSON.stringify(k3.error));
  const pub1 = await tamu.from('reviews').select('id');
  check('ulasan yang belum disetujui tidak terlihat publik', !pub1.error && pub1.data.length === 0, JSON.stringify(pub1));
  const k4 = await k.from('reviews').update({ status: 'approved' }).eq('id', k3.data?.id).select();
  check('klien tidak bisa menyetujui ulasannya lewat update', k4.error || k4.data.length === 0, JSON.stringify(k4));

  const a = await login('admin@nauvite.test');
  const a1 = await a.from('reviews').update({ status: 'approved' }).eq('id', k3.data?.id).select();
  check('admin bisa menyetujui ulasan', a1.data?.length === 1, JSON.stringify(a1));
  const pub2 = await tamu.from('reviews').select('id, couple_name');
  check('ulasan yang disetujui terlihat publik', pub2.data?.length === 1, JSON.stringify(pub2));
  const a2 = await a.from('reviews').insert({ couple_name: 'Tanpa izin', rating: 4, message: 'Ulasan tanpa izin tampil.', consent: false, status: 'approved', source: 'admin' });
  const pub3 = await tamu.from('reviews').select('couple_name');
  check('ulasan tanpa izin tidak tampil walau disetujui', !a2.error && !pub3.data?.some((r) => r.couple_name === 'Tanpa izin'), JSON.stringify(pub3));
}

// ---------------- KUNCI SERVER (service role) ----------------
console.log('\n== Kunci server (dipakai panel admin) ==');
{
  const svc = createClient(URL_, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const r = await svc.from('profiles').update({ whatsapp: '62899' }).eq('id', '00000000-0000-0000-0000-00000000000c').select('whatsapp');
  check('kunci server bisa memperbarui profil (lewat trigger penjaga)', !r.error && r.data?.[0]?.whatsapp === '62899', JSON.stringify(r.error));
  const r2 = await svc.from('invitations').update({ status: 'active' }).eq('id', RINA).select('status');
  check('kunci server bisa mengubah status undangan', !r2.error && r2.data?.[0]?.status === 'active', JSON.stringify(r2.error));
}

console.log(`\nHasil: ${pass} lulus, ${fail} gagal`);
process.exit(fail ? 1 : 0);
