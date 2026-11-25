import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArchLines } from "@/components/brand/arch";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/invitation/reveal";
import { IconCalendar, IconChat, IconGift, IconHeart, IconUsers, IconWhatsapp } from "@/components/invitation/icons";
import { SiteFooter } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/nav";
import { Phone } from "@/components/landing/phone";
import s from "@/components/landing/landing.module.css";
import { getSiteSettings, rupiah, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Program Mitra | Nauvite",
  description:
    "Untuk wedding organizer, MUA, fotografer, dan vendor dekorasi: tambahkan undangan digital ke paket pernikahan klien dengan harga khusus mitra.",
  openGraph: {
    title: "Program Mitra Nauvite",
    description: "Undangan digital sebagai nilai tambah paket pernikahan kalian, dengan harga khusus mitra.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630 }],
  },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function PartnerPage() {
  const site = await getSiteSettings();
  const waJoin = waLink(site.whatsapp, `Halo ${site.businessName}, saya tertarik jadi mitra. Usaha saya bergerak di bidang ...`);

  const values: [ReactNode, string, string][] = [
    [<IconGift key="g" />, "Paket pernikahan lebih lengkap", "Undangan digital jadi nilai tambah yang langsung terasa oleh klien, tanpa kalian perlu membangun layanannya sendiri."],
    [<IconHeart key="h" />, "Tanpa repot bikin sendiri", "Tidak perlu desainer atau programmer. Kalian fokus mengurus acara, undangannya kami siapkan."],
    [<IconUsers key="u" />, "Nama usaha dilihat semua tamu", "Setiap undangan menampilkan \"Dipersembahkan oleh\" dengan link ke Instagram atau WhatsApp kalian."],
    [<IconCalendar key="c" />, "Pantau RSVP semua klien", "Dari dasbor mitra, lihat siapa saja yang hadir di tiap acara. Berguna untuk hitungan katering dan kursi."],
    [<IconChat key="t" />, "Dibantu admin", "Ada kendala atau klien butuh bantuan mengisi? Admin Nauvite siap membantu lewat WhatsApp."],
  ];

  return (
    <>
      <LandingNav waHref={waJoin} businessName={site.businessName} />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:pt-32 lg:pb-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="text-center lg:text-left">
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Program mitra Nauvite</p>
              <h1 className="mt-4 font-display text-[40px] font-medium leading-[1.06] tracking-tight sm:text-6xl">
                Undangan digital untuk paket pernikahan klien kalian.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink/75 lg:mx-0">
                Untuk wedding organizer, MUA, fotografer, dan vendor dekorasi yang belum punya layanan undangan digital
                sendiri. Bermitra dengan Nauvite, dapat harga khusus, dan jadikan undangan digital nilai tambah di paket
                kalian.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href={waJoin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-[#f6f1e7] hover:bg-ink-2"
                >
                  <IconWhatsapp className="text-lg" /> Daftar jadi mitra
                </a>
                <Link href="/#tema" className="rounded-full border border-ink/20 bg-card px-6 py-3.5 text-[15px] font-semibold hover:border-ink/40">
                  Lihat tema
                </Link>
              </div>
              <p className="mt-6 text-[14px] text-muted">Tanpa biaya pendaftaran dan tanpa minimal pesanan.</p>
            </div>

            <div className="relative mx-auto grid h-[520px] w-full max-w-md place-items-center">
              <ArchLines draw className="absolute left-1/2 top-[-6%] h-[112%] -translate-x-1/2" />
              <Phone className="relative w-[230px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/landing/sage-garden-isi.webp" alt="Contoh undangan klien mitra" />
              </Phone>
              <div className="absolute bottom-[12%] left-1/2 w-[86%] max-w-[330px] -translate-x-1/2 rounded-2xl border border-line bg-card/95 px-5 py-4 text-center shadow-[0_20px_40px_-20px_rgb(23_38_31/0.5)] backdrop-blur">
                <p className="text-[12px] text-muted">Di bagian akhir setiap undangan</p>
                <p className="mt-1 text-[15px]">
                  Dipersembahkan oleh <strong className="font-semibold text-brass">Nama Usaha Kalian</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Kenapa jadi mitra ---------------- */}
        <section className={`${s.paper} px-5 py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-12 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Kenapa jadi mitra</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Klien senang, paket kalian terasa lebih istimewa
              </h2>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {values.map(([icon, t, x], i) => (
                <Reveal key={t} className={`${s.rv} rounded-3xl border border-line bg-card p-6`} style={d(i * 80)}>
                  <span className="grid size-11 place-items-center rounded-full bg-ink text-[20px] text-gold">{icon}</span>
                  <h3 className="mt-5 font-display text-2xl font-medium leading-snug">{t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{x}</p>
                </Reveal>
              ))}
              <Reveal className={`${s.rv} flex flex-col justify-between rounded-3xl bg-ink p-6 text-[#f3eee5]`} style={d(400)}>
                <p className="font-display text-2xl font-medium leading-snug">Contoh di paket kalian</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#c9d2cc]">
                  &ldquo;Paket Gold sudah termasuk dekorasi, MUA, dokumentasi, dan <span className="text-gold">undangan digital</span>
                  .&rdquo;
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- Harga mitra ---------------- */}
        <section className="px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-12 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Harga mitra</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Lebih murah dari harga biasa</h2>
              <p className="mt-4 text-[16px] text-muted">
                Bayar per undangan, tanpa deposit. Silakan masukkan ke harga paket kalian.
              </p>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["Hemat", "Tema tanpa foto", site.priceHemat, site.partnerHemat, false],
                ["Basic", "Tema Signature, Clean, dan lainnya", site.priceBasic, site.partnerBasic, false],
                ["Premium", "Tema ilustrasi dengan animasi berlapis", site.pricePremium, site.partnerPremium, true],
              ].map(([name, note, normal, partner, dark], i) => (
                <Reveal
                  key={name as string}
                  className={`${s.rv} rounded-3xl p-7 sm:p-9 ${dark ? "bg-ink text-[#f3eee5]" : "border border-line bg-card"}`}
                  style={d(i * 120)}
                >
                  <p className={`text-[14px] font-semibold ${dark ? "text-gold" : "text-brass"}`}>Paket {name as string}</p>
                  <p className="mt-3 font-display text-5xl font-medium tracking-tight">{rupiah(partner as number)}</p>
                  <p className={`mt-2 text-[14px] ${dark ? "text-[#c9d2cc]" : "text-muted"}`}>
                    Harga biasa {rupiah(normal as number)}, kalian hemat {rupiah((normal as number) - (partner as number))} per
                    undangan.
                  </p>
                  <p className={`mt-6 border-t pt-5 text-[14px] ${dark ? "border-white/10 text-[#c9d2cc]" : "border-line text-muted"}`}>
                    {note as string}. RSVP, ucapan, amplop digital, dan musik sudah termasuk.
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Cara kerja sama ---------------- */}
        <section className={`${s.paper} px-5 py-20 sm:py-28`}>
          <div className="mx-auto max-w-5xl">
            <Reveal className={`${s.rv} mx-auto mb-12 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Cara kerja sama</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Sederhana, semua lewat WhatsApp</h2>
            </Reveal>
            <ol className="grid gap-4">
              {[
                ["Daftar lewat WhatsApp", "Ceritakan sedikit tentang usaha kalian. Admin membuatkan akun mitra dan dasbornya."],
                ["Ada klien baru, kabari admin", "Sebutkan nama pasangan dan tema yang dipilih. Undangan dibuatkan dan ditandai sebagai klien kalian."],
                ["Isi datanya", "Kalian isi sendiri dari dasbor mitra, atau kirim link login ke pasangan supaya mereka mengisi sendiri. Bisa juga dikerjakan bersama."],
                ["Bayar, lalu undangan aktif", "Transfer harga mitra per undangan. Setelah dikonfirmasi, undangan aktif dan siap disebar."],
              ].map(([t, x], i) => (
                <Reveal as="li" key={t} className={`${s.rv} flex gap-5 rounded-3xl border border-line bg-card p-6`} style={d(i * 80)}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-lg text-gold">{i + 1}</span>
                  <span>
                    <span className="block font-display text-2xl font-medium">{t}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-muted">{x}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Tanya jawab mitra ---------------- */}
        <section className="px-5 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.6fr]">
            <Reveal className={s.rv}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Tanya jawab</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Yang sering ditanyakan mitra</h2>
            </Reveal>
            <div className="grid gap-3">
              {[
                ["Apakah ada biaya pendaftaran atau minimal pesanan?", "Tidak ada. Kalian cukup membayar harga mitra setiap kali ada undangan yang dibuat."],
                ["Bagaimana pembayarannya?", "Per undangan, transfer lewat WhatsApp sebelum undangan diaktifkan. Tidak perlu deposit di depan."],
                ["Siapa yang mengisi data undangan?", "Bebas: kalian dari dasbor mitra, pasangan dari akun mereka sendiri, atau keduanya."],
                ["Apakah nama usaha saya muncul di undangan?", "Ya. Di bagian akhir undangan ada tulisan \"Dipersembahkan oleh\" dengan nama usaha dan link ke Instagram atau WhatsApp kalian."],
                ["Boleh dijual dengan harga berapa ke klien?", "Silakan atur sendiri, misalnya dimasukkan ke harga paket. Kami sarankan tidak di bawah harga biasa kalau dijual terpisah."],
                ["Bisa melihat daftar tamu yang hadir?", "Bisa. Dasbor mitra menampilkan konfirmasi kehadiran dan ucapan untuk semua undangan klien kalian."],
              ].map(([q, a]) => (
                <details key={q} className="group rounded-2xl border border-line bg-card/90 px-5 py-4 open:pb-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink/5 text-lg transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Ajakan ---------------- */}
        <section className="relative overflow-hidden bg-ink px-5 py-24 text-center text-[#f3eee5] sm:py-28">
          <ArchLines className="absolute bottom-0 left-1/2 h-[120%] -translate-x-1/2 opacity-30" />
          <Reveal className={`${s.rv} relative`}>
            <Logo size={56} wordmark={false} className="mb-6" />
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              Siap menambah undangan digital ke paket kalian?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] text-[#c9d2cc]">Chat admin, kenalkan usaha kalian, dan akun mitra bisa dibuat hari ini.</p>
            <a
              href={waJoin}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-[16px] font-semibold text-ink hover:brightness-105"
            >
              <IconWhatsapp className="text-lg" /> Daftar jadi mitra
            </a>
          </Reveal>
        </section>
      </main>

      <SiteFooter businessName={site.businessName} waHref={waJoin} />
    </>
  );
}
