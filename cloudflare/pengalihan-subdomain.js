/**
 * Cloudflare Worker pengganti Worker v1.
 *
 * Link undangan v1 berbentuk  https://<slug>.nauvite.my.id/?to=Nama
 * Di v2 bentuknya          https://nauvite.my.id/<slug>?to=Nama
 *
 * Worker ini mengalihkan link lama ke bentuk baru, supaya link yang sudah
 * tersebar ke tamu tetap bisa dibuka. Domain utama, www, dan app (panel v1
 * cadangan) dibiarkan lewat apa adanya.
 *
 * Cara pasang: lihat docs/DEPLOY.md bagian "Pindah domain".
 */

const BASE = "nauvite.my.id";
const LEWAT = new Set(["www", "app"]);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    if (host === BASE || !host.endsWith(`.${BASE}`)) return fetch(request);

    const slug = host.slice(0, -(BASE.length + 1));
    if (LEWAT.has(slug) || slug.includes(".")) return fetch(request);

    // 302 (sementara) supaya kalau perlu kembali ke v1, browser tamu tidak menyimpan pengalihannya.
    return Response.redirect(`https://${BASE}/${slug}${url.search}`, 302);
  },
};
