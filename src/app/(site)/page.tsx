import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArchLines } from "@/components/brand/arch";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/invitation/reveal";
import { IconCalendar, IconChat, IconEnvelope, IconImage, IconPin, IconWhatsapp } from "@/components/invitation/icons";
import { Catalog } from "@/components/landing/catalog";
import { CostCalculator } from "@/components/landing/cost-calculator";
import { TryNames } from "@/components/landing/try-names";
import { SiteFooter } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/nav";
import { Phone } from "@/components/landing/phone";
import s from "@/components/landing/landing.module.css";
import { getCatalog } from "@/lib/demos";
import { getPrintDesigns, getPrintSettings } from "@/lib/print/public";
import { printImageUrl } from "@/lib/print/shared";
import { getPublicReviews, MIN_REVIEWS_SHOWN } from "@/lib/reviews/public";
import { getSiteSettings, HEMAT_FILL_FEE, rupiah, waLink } from "@/lib/site";
import { Stars } from "@/components/reviews/review-form";

export const metadata: Metadata = {
  title: "Nauvite | Undangan pernikahan digital",
  description:
    "Undangan pernikahan digital dengan nama tamu di sampul, RSVP, ucapan, amplop digital, dan musik. Tema Premium, Signature, dan Clean. Bayar sekali, tamu tanpa batas.",
  openGraph: {
    title: "Nauvite | Undangan pernikahan digital",
    description: "Pilih tema, isi data dari HP, lalu kirim link dengan nama setiap tamu lewat WhatsApp.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630 }],
  },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function LandingPage() {
  const [site, reviews, prints, print] = await Promise.all([
    getSiteSettings(),
    getPublicReviews(),
    getPrintDesigns(),
    getPrintSettings(),
  ]);
  const printShots = [...prints.filter((p) => p.featured && p.orientation === "landscape"), ...prints].slice(0, 3);
  const catalog = getCatalog();
  const ready = catalog.filter((t) => t.demos.length > 0).length;
  const wa = (msg: string) => waLink(site.whatsapp, msg);
  const siteHost = (process.env.NEXT_PUBLIC_SITE_URL ?? "nauvite.id").replace(/^https?:\/\//, "");
  const waHello = wa(`Halo ${site.businessName}, saya mau tanya soal undangan digital.`);

  const faq: [string, ReactNode][] = [
    [
      "Apakah tamu perlu memasang aplikasi?",
      "Tidak. Undangan dibuka langsung dari link di browser HP, seperti membuka halaman web biasa.",
    ],
    [
      "Bagaimana nama tamu bisa muncul di sampul?",
      "Dari dasbor, kalian ketik nama tamu dan link khusus untuknya jadi otomatis. Begitu dibuka, sampul menyapa tamu dengan namanya. Link bisa langsung dikirim lewat WhatsApp.",
    ],
    [
      "Apa beda paket Hemat, Basic, dan Premium?",
      "RSVP, ucapan, amplop digital, musik, dan nama tamu ada di semua paket. Hemat memakai tema tanpa foto, jadi tidak ada foto mempelai dan galeri. Basic memakai tema dengan foto. Premium memakai foto dan tema ilustrasi dengan animasi berlapis, seperti bunga yang bergoyang dan kelopak berjatuhan.",
    ],
    [
      "Bisa minta diisikan?",
      `Bisa. Kirim datanya lewat WhatsApp, kami yang mengisi. Gratis untuk paket Basic dan Premium. Untuk paket Hemat, tambah ${rupiah(HEMAT_FILL_FEE)}.`,
    ],
    [
      "Bisa dicoba dulu sebelum bayar?",
      <>
        Bisa. <Link href="/daftar" className="font-semibold text-brass underline">Buat akun uji coba</Link>, isi undangannya, dan lihat hasilnya
        selama 24 jam. Kalau cocok, chat admin untuk menerbitkan. Isinya tidak perlu diulang.
      </>,
    ],
    ["Berapa banyak tamu yang bisa diundang?", "Tanpa batas. Bagikan link ke sebanyak mungkin keluarga dan kerabat tanpa biaya tambahan."],
    [
      "Bagaimana cara pesan dan bayar?",
      "Pilih tema, lalu chat admin lewat WhatsApp. Setelah pembayaran dikonfirmasi, admin mengaktifkan undangan dan mengirim username serta password untuk masuk ke dasbor.",
    ],
    [
      "Bisakah isi undangan diubah setelah disebar?",
      "Bisa, kapan saja dari dasbor. Perubahan langsung tampil di link yang sama, jadi tamu tidak perlu dikirimi link baru.",
    ],
    [
      "Saya tidak punya foto prewedding. Masih bisa?",
      "Bisa. Pilih paket Hemat. Tema Surat Cinta, Koran Pagi, Piringan Hitam, Herbarium, dan Tiket Kereta memang dibuat tanpa foto sama sekali, jadi tidak ada tempat yang terasa kosong. Beberapa tema lain juga punya pilihan sampul ilustrasi atau video bawaan.",
    ],
    ["Bisa pakai lagu sendiri?", "Bisa. Unggah file MP3 dari dasbor, lagu diputar saat tamu membuka undangan."],
    [
      "Bagaimana dengan data kehadiran tamu?",
      "Semua konfirmasi kehadiran dan ucapan masuk ke dasbor, lengkap dengan jumlah orang. Bisa diunduh sebagai file Excel untuk hitungan katering dan kursi.",
    ],
  ];

  return (
    <>
      <LandingNav waHref={waHello} businessName={site.businessName} />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className={`${s.paper} relative overflow-hidden pt-28 sm:pt-32`}>

          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
            <div className="text-center lg:text-left">
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Undangan pernikahan digital</p>
              <h1 className="mt-4 font-display text-[42px] font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-[68px]">
                Satu link undangan, nama setiap tamu di sampulnya.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink/75 lg:mx-0">
                Pilih tema, isi data sendiri dari HP, lalu kirim lewat WhatsApp. RSVP, ucapan, amplop digital, dan musik
                sudah termasuk.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a href="#coba" className="rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-[#f6f1e7] hover:bg-ink-2">
                  Coba dengan nama kalian
                </a>
                <a
                  href={waHello}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-card px-6 py-3.5 text-[15px] font-semibold hover:border-ink/40"
                >
                  <IconWhatsapp className="text-lg" /> Chat admin
                </a>
              </div>
              <p className="mt-6 text-[14px] text-muted">
                Mulai <strong className="text-ink">{rupiah(site.priceHemat)}</strong>, bayar sekali. Tamu tanpa batas.
              </p>
            </div>

            {/* Tiga HP tema Premium: kiri-kanan tampilan setelah dibuka, tengah rekaman Sage Garden */}
            <div className={s.fan}>
              <ArchLines draw className="absolute left-1/2 top-[-3%] h-[108%] -translate-x-1/2 sm:top-[-17%] sm:h-[128%]" />
              <Phone className={s.fanLeft}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/landing/dusty-rose-isi.webp" alt="Tema Dusty Rose" />
              </Phone>
              <Phone className={s.fanRight}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/landing/lavender-mist-isi.webp" alt="Tema Lavender Mist" />
              </Phone>
              <Phone className={s.fanCenter}>
                <video
                  src="/landing/sage-garden-demo.mp4"
                  poster="/landing/sage-garden-sampul.webp"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Rekaman undangan tema Sage Garden"
                />
              </Phone>

            </div>
          </div>

          {/* Ringkasan singkat */}
          <div className="relative border-y border-line bg-card/70 backdrop-blur">
            <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-5 py-7 text-center sm:grid-cols-4">
              {[
                [`${ready} tema`, "siap dipakai, terus bertambah"],
                ["Tanpa batas", "jumlah tamu yang diundang"],
                ["1 kali bayar", "tanpa biaya bulanan"],
                ["Dari HP", "isi dan ubah undangan kapan saja"],
              ].map(([big, small]) => (
                <div key={big}>
                  <dt className="font-display text-2xl font-medium sm:text-3xl">{big}</dt>
                  <dd className="mt-1 text-[13px] text-muted">{small}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------- Katalog tema ---------------- */}
        <section id="tema" className="scroll-mt-20 px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-10 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Katalog</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Pilih tema undangan</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                Ketuk tema untuk melihat contoh dan membuka demonya. Ada yang dengan foto, ada yang tanpa foto.
              </p>
            </Reveal>
            <Catalog
              items={catalog}
              prices={{
                hemat: rupiah(site.priceHemat),
                basic: rupiah(site.priceBasic),
                premium: rupiah(site.pricePremium),
              }}
              hematNormal={site.hematNormal ? rupiah(site.hematNormal) : null}
              whatsapp={site.whatsapp}
            />
            <div className="mt-10 text-center">
              <Link
                href="/tema"
                className="inline-block rounded-full border border-ink/25 bg-card px-6 py-3 text-[15px] font-semibold hover:border-ink/50"
              >
                Buka katalog lengkap ({ready} tema)
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- Coba dengan nama sendiri ---------------- */}
        <section id="coba" className="scroll-mt-20 border-t border-line px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <TryNames
              items={[...catalog].filter((t) => t.demos.length > 0).sort((a, b) => Number(a.withPhoto) - Number(b.withPhoto))}
              whatsapp={site.whatsapp}
              siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ""}
            />
          </div>
        </section>

        {/* ---------------- Perbandingan ---------------- */}
        <section id="perbandingan" className={`${s.paper} scroll-mt-20 px-5 py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-12 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Perbandingan</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Kenapa pakai undangan digital?</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                Undangan cetak tetap indah. Tapi untuk ratusan tamu, cara digital jauh lebih ringan di biaya, waktu, dan
                tenaga.
              </p>
            </Reveal>

            <div className="grid gap-5 lg:grid-cols-2">
              <Reveal className={`${s.rv} rounded-3xl border border-line bg-card/70 p-6 sm:p-8`}>
                <p className="font-display text-2xl font-medium text-ink/70">Undangan cetak</p>
                <ul className="mt-6 grid gap-5">
                  {[
                    ["Biaya per lembar", "Rata-rata Rp5.000 sampai Rp15.000 per lembar, belum termasuk ongkir ke rumah tamu."],
                    ["Butuh waktu", "Desain, revisi, cetak, sampai dikirim bisa makan waktu 1 sampai 3 minggu."],
                    ["Salah ketik, cetak ulang", "Nama, gelar, atau alamat lokasi yang keliru harus dicetak lagi."],
                    ["Diantar satu per satu", "Menyita tenaga dan waktu justru saat persiapan hari H paling sibuk."],
                  ].map(([t, x]) => (
                    <li key={t} className="flex gap-3.5">
                      <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-ink/[0.07] text-ink/50" aria-hidden="true">
                        <svg viewBox="0 0 20 20" className="size-3.5"><path d="M5 10h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
                      </span>
                      <span>
                        <span className="block text-[16px] font-semibold">{t}</span>
                        <span className="text-[15px] leading-relaxed text-muted">{x}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className={`${s.rv} rounded-3xl bg-ink p-6 text-[#f3eee5] shadow-[0_30px_60px_-30px_rgb(23_38_31/0.6)] sm:p-8`} style={d(120)}>
                <div className="flex items-center gap-3">
                  <Logo size={34} wordmark={false} />
                  <p className="font-display text-2xl font-medium">Nauvite</p>
                </div>
                <ul className="mt-6 grid gap-5">
                  {[
                    ["Bayar sekali", `Mulai ${rupiah(site.priceHemat)}, kirim ke ratusan tamu tanpa biaya tambahan.`],
                    ["Siap disebar hari ini", "Pilih tema, isi data dari HP, lalu langsung kirim lewat WhatsApp."],
                    ["Salah ketik? Tinggal edit", "Perubahan langsung tampil di link yang sama, tamu tidak perlu dikirimi ulang."],
                    ["Nama tamu dan RSVP otomatis", "Setiap tamu disapa dengan namanya, konfirmasi hadir terkumpul di dasbor."],
                  ].map(([t, x]) => (
                    <li key={t} className="flex gap-3.5">
                      <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-gold text-ink" aria-hidden="true">
                        <svg viewBox="0 0 20 20" className="size-3.5"><path d="m5 10.5 3.2 3L15 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span>
                        <span className="block text-[16px] font-semibold">{t}</span>
                        <span className="text-[15px] leading-relaxed text-[#c9d2cc]">{x}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal className={`${s.rv} mt-5`}>
              <CostCalculator basic={site.priceBasic} premium={site.pricePremium} />
            </Reveal>
            <p className="mx-auto mt-6 max-w-2xl text-center text-[15px] leading-relaxed text-muted">
              Banyak pasangan tetap mencetak sedikit undangan untuk orang tua dan keluarga sepuh, lalu memakai Nauvite untuk
              tamu lainnya. Keduanya bisa jalan bersama.
            </p>
          </div>
        </section>

        {/* ---------------- Premium ---------------- */}
        <section className="relative overflow-hidden bg-ink px-5 py-20 text-[#f3eee5] sm:py-28">
          <ArchLines className="absolute -right-24 bottom-0 h-[90%] opacity-40" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal className={`${s.rv} mx-auto w-[240px] sm:w-[270px] lg:order-2`}>
              <Phone>
                <video
                  src="/landing/sage-garden-demo.mp4"
                  poster="/landing/sage-garden-isi.webp"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label="Rekaman undangan tema Sage Garden"
                />
              </Phone>
            </Reveal>
            <Reveal className={`${s.rv} lg:order-1`}>
              <span className="rounded-full bg-brass px-3 py-1 text-[12px] font-bold text-white">Premium</span>
              <h2 className="mt-5 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                Sage Garden, ilustrasi cat air yang bergerak pelan.
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#c9d2cc]">
                Buket mawar putih bergoyang di sudut layar, kelopak berjatuhan, dan setiap bagian muncul bergantian saat
                di-scroll. Foto kalian tampil dalam bingkai lonjong berhias bunga.
              </p>
              <ul className="mt-6 grid gap-2 text-[15px] text-[#e3e8e4]">
                {["Pilihan salam Islami atau umum", "Warna bagian gelap bisa diganti", "Tetap ringan dibuka di HP"].map((x) => (
                  <li key={x} className="flex items-center gap-2.5">
                    <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-brass" aria-hidden="true">
                      <path d="m5 10.5 3.2 3L15 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/contoh-sage-garden?to=Tamu+Undangan"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#f3eee5] px-6 py-3.5 text-[15px] font-semibold text-ink hover:bg-white"
                >
                  Buka demonya
                </a>
                <a
                  href={wa("Halo, saya mau pesan undangan tema Premium Sage Garden.")}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/25 px-6 py-3.5 text-[15px] font-semibold hover:border-white/50"
                >
                  Pesan {rupiah(site.pricePremium)}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Fitur ---------------- */}
        <section id="fitur" className={`${s.paper} scroll-mt-20 px-5 py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-14 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Fitur</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Yang kalian dapat di setiap undangan
              </h2>
            </Reveal>

            <div className="grid gap-5 lg:grid-cols-3">
              <FeatureCard
                delay={0}
                title="Untuk tamu"
                text="Sampul menyapa tamu dengan namanya. Lokasi, jadwal, dan rekening ada di satu halaman."
              >
                <div className="rounded-2xl bg-[#1f3a2e] p-5 text-center text-[#f4efe6]">
                  <p className="text-[11px] uppercase tracking-[0.25em] opacity-80">Kepada Yth.</p>
                  <p className="mt-1 font-display text-2xl">Bapak Rudi Hartono</p>
                  <div className="mt-4 flex justify-center gap-2 text-[12px] font-semibold">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4efe6] px-3 py-1.5 text-[#1f3a2e]">
                      <IconPin /> Lihat lokasi
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-3 py-1.5">
                      <IconCalendar /> Kalender
                    </span>
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard
                delay={120}
                title="Untuk kalian berdua"
                text="Konfirmasi kehadiran dan ucapan masuk ke dasbor, lengkap dengan jumlah orang. Unduh sebagai Excel."
              >
                <div className="grid gap-2">
                  {[
                    ["Rudi", "Hadir, 2 orang", "bg-[#e3efe6] text-[#1d5a37]"],
                    ["Keluarga Pak Joko", "Hadir, 4 orang", "bg-[#e3efe6] text-[#1d5a37]"],
                    ["Siti", "Tidak hadir", "bg-[#f7dfdb] text-[#8f2a1f]"],
                  ].map(([n, st, c]) => (
                    <div key={n} className="flex items-center justify-between rounded-xl bg-white/80 px-3.5 py-2.5 text-[13px]">
                      <span className="font-semibold">{n}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${c}`}>{st}</span>
                    </div>
                  ))}
                  <div className="mt-1 flex items-center justify-between px-1 text-[12px] text-muted">
                    <span>6 orang akan hadir</span>
                    <span className="rounded-full bg-brass px-2.5 py-1 font-bold text-white">Unduh Excel</span>
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard
                delay={240}
                title="Saat menyebar"
                text="Ketik nama tamu, link khusus jadi otomatis dan siap dikirim lewat WhatsApp. Tidak perlu edit link manual."
              >
                <div className="grid gap-2.5">
                  <div className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px]">Bapak Rudi Hartono</div>
                  <div className="truncate rounded-xl bg-[#f3eee5] px-3.5 py-2.5 font-mono text-[12px] text-ink/80">
                    {siteHost}/dimas-laras?to=Bapak+Rudi+Hartono
                  </div>
                  <div className="flex gap-2 text-[12px] font-semibold">
                    <span className="rounded-full border border-line bg-white px-3 py-1.5">Salin link</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a4d] px-3 py-1.5 text-white">
                      <IconWhatsapp /> Kirim lewat WhatsApp
                    </span>
                  </div>
                </div>
              </FeatureCard>
            </div>

            <Reveal className={`${s.rv} mt-10 rounded-3xl border border-line bg-card/80 p-6 sm:p-8`}>
              <p className="mb-5 text-[14px] font-semibold text-muted">Semua tema sudah termasuk</p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] sm:grid-cols-4">
                {[
                  "Nama tamu di sampul",
                  "RSVP dan ucapan",
                  "Amplop digital",
                  "Musik latar",
                  "Galeri dan video",
                  "Peta dan hitung mundur",
                  "Editor dari HP",
                  "Ekspor daftar tamu",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-brass" aria-hidden="true">
                      <path d="m5 10.5 3.2 3L15 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {x}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Cara pesan ---------------- */}
        <section className="px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-14 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Cara pesan</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Dari pilih tema sampai undangan tersebar
              </h2>
            </Reveal>
            <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <span className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-transparent via-ink/20 to-transparent lg:block" aria-hidden="true" />
              {[
                ["Pilih tema", "Buka demo di katalog dan temukan yang paling cocok."],
                ["Chat admin", "Pesan lewat WhatsApp. Setelah bayar, undangan diaktifkan dan akun dikirim."],
                ["Isi dari HP", "Masuk ke dasbor, isi nama, acara, foto, lagu, dan rekening."],
                ["Sebar ke tamu", "Buat link dengan nama setiap tamu, kirim lewat WhatsApp."],
              ].map(([t, x], i) => (
                <Reveal as="li" key={t} className={`${s.rv} relative text-center`} style={d(i * 120)}>
                  <span className="relative mx-auto grid size-14 place-items-center rounded-full border border-line bg-card font-display text-xl font-medium shadow-sm">
                    {[<IconImage key="g" />, <IconWhatsapp key="w" />, <IconEnvelope key="c" />, <IconChat key="h" />][i]}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-medium">{t}</h3>
                  <p className="mx-auto mt-2 max-w-[16rem] text-[15px] leading-relaxed text-muted">{x}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Harga ---------------- */}
        <section id="harga" className={`${s.paper} scroll-mt-20 px-5 py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-12 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Harga</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Sekali bayar, tanpa biaya bulanan</h2>
              <p className="mt-4 text-[16px] text-muted">Pilih sesuai kebutuhan. Semuanya bayar sekali, tamu tanpa batas.</p>
            </Reveal>
            <div className="grid gap-5 lg:grid-cols-3">
              <PriceCard
                name="Hemat"
                price={rupiah(site.priceHemat)}
                normal={site.hematNormal ? rupiah(site.hematNormal) : null}
                promoUntil={site.hematPromoUntil}
                note="Tema tanpa foto"
                points={["RSVP, ucapan, amplop digital, musik", "Tamu tanpa batas", "Ubah isi kapan saja", "Tidak perlu foto prewedding", `Isi sendiri, atau kami isikan +${rupiah(HEMAT_FILL_FEE)}`]}
                cta={wa("Halo, saya mau pesan undangan paket Hemat.")}
              />
              <PriceCard
                name="Basic"
                price={rupiah(site.priceBasic)}
                note="Tema Signature, Clean, dan lainnya"
                points={["Semua fitur Hemat", "Foto mempelai, sampul, dan galeri", "Gratis diisikan admin", "Tamu tanpa batas", "Ubah isi kapan saja", "Bantuan admin lewat WhatsApp"]}
                cta={wa("Halo, saya mau pesan undangan paket Basic.")}
              />
              <PriceCard
                highlight
                name="Premium"
                price={rupiah(site.pricePremium)}
                note="Tema ilustrasi dengan animasi berlapis"
                points={[
                  "Semua fitur Basic",
                  "Ilustrasi bunga dan ornamen bergerak",
                  "Bingkai foto berhias",
                  "Pengaturan warna dan salam",
                ]}
                cta={wa("Halo, saya mau pesan undangan paket Premium.")}
              />
            </div>
          </div>
        </section>

        {/* ---------------- Undangan cetak ---------------- */}
        {prints.length ? (
          <section id="cetak" className="scroll-mt-20 px-5 py-20 sm:py-28">
            <Reveal className={`${s.rv} mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.1fr]`}>
              <div className="text-center lg:text-left">
                <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Undangan cetak</p>
                <h2 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                  Butuh versi kertasnya juga?
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted lg:mx-0">
                  Untuk keluarga besar dan tamu yang lebih nyaman menerima undangan langsung. Ada {prints.length} desain,
                  dari yang hemat sampai foil emas dengan amplop, mulai {rupiah(Math.min(...prints.map((p) => p.price)))}/pcs (belum
                  termasuk plastik) dan minimal {print.minOrder} pcs. Bisa diberi QR code ke undangan digital kalian.
                </p>
                <Link
                  href="/cetak"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-[#f6f1e7] hover:bg-ink-2"
                >
                  Lihat katalog cetak
                </Link>
              </div>
              <Link href="/cetak" aria-label="Lihat katalog undangan cetak" className="relative mx-auto block h-[300px] w-full max-w-[520px] sm:h-[380px]">
                {printShots.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p.id}
                    src={printImageUrl(p.images[0])}
                    alt=""
                    loading="lazy"
                    className="absolute w-[62%] shadow-[0_24px_40px_-22px_rgb(23_38_31/0.6)] transition-transform duration-500 hover:-translate-y-1"
                    style={
                      [
                        { left: "0%", top: "4%", rotate: "-6deg" },
                        { right: "0%", top: "12%", rotate: "5deg" },
                        { left: "19%", bottom: "2%", rotate: "-1deg" },
                      ][i]
                    }
                  />
                ))}
              </Link>
            </Reveal>
          </section>
        ) : null}

        {/* ---------------- Ulasan (tampil kalau sudah cukup ulasan sungguhan) ---------------- */}
        {reviews.length >= MIN_REVIEWS_SHOWN ? (
          <section id="ulasan" className="scroll-mt-20 px-5 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl">
              <Reveal className={`${s.rv} mx-auto mb-12 max-w-2xl text-center`}>
                <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Ulasan</p>
                <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Kata pasangan yang sudah memakai</h2>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((r, i) => (
                  <Reveal key={r.id} className={`${s.rv} flex flex-col rounded-3xl border border-line bg-card p-6`} style={d((i % 3) * 100)}>
                    <Stars value={r.rating} />
                    <p className="mt-4 flex-1 text-[16px] leading-relaxed">&ldquo;{r.message}&rdquo;</p>
                    <p className="mt-5 border-t border-line pt-4 font-display text-lg">{r.coupleName}</p>
                    {r.city ? <p className="text-[13px] text-muted">{r.city}</p> : null}
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ---------------- Mitra ---------------- */}
        <section id="mitra" className="scroll-mt-20 px-5 py-20 sm:py-28">
          <Reveal className={`${s.rv} mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-[32px] bg-ink p-8 text-[#f3eee5] sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:p-14`}>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#e9dcc3]">Program mitra</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                Punya usaha wedding organizer, MUA, atau dekorasi?
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#c9d2cc]">
                Belum punya layanan undangan digital sendiri? Bermitra dengan Nauvite dan jadikan undangan digital nilai
                tambah di paket pernikahan kalian, dengan harga khusus mitra.
              </p>
              <Link
                href="/mitra"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[15px] font-semibold text-ink hover:brightness-105"
              >
                Pelajari program mitra
              </Link>
            </div>
            <ul className="grid content-center gap-3">
              {[
                [
                  "Harga khusus mitra",
                  `Hemat ${rupiah(site.partnerHemat)}, Basic ${rupiah(site.partnerBasic)}, Premium ${rupiah(site.partnerPremium)} per undangan.`,
                ],
                ["Tanpa repot bikin sendiri", "Kalian fokus mengurus acara, undangan digitalnya kami yang siapkan."],
                ["Nama usaha di undangan", "Tulisan \"Dipersembahkan oleh\" dengan link ke Instagram kalian."],
              ].map(([t, x]) => (
                <li key={t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="font-display text-xl">{t}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#c9d2cc]">{x}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ---------------- Tanya jawab ---------------- */}
        <section id="tanya" className={`${s.paper} scroll-mt-20 px-5 py-20 sm:py-28`}>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.6fr]">
            <Reveal className={s.rv}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Tanya jawab</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Pertanyaan yang sering masuk</h2>
              <p className="mt-4 text-[16px] text-muted">Belum ketemu jawabannya? Admin siap membantu lewat WhatsApp.</p>
              <a
                href={waHello}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-card px-5 py-3 text-[15px] font-semibold hover:border-ink/40"
              >
                <IconWhatsapp className="text-lg" /> Tanya admin
              </a>
            </Reveal>
            <div className="grid gap-3">
              {faq.map(([q, a]) => (
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

        {/* ---------------- Ajakan terakhir ---------------- */}
        <section className="relative overflow-hidden px-5 py-24 text-center sm:py-32">
          <Logo tone="gelap" size={64} wordmark={false} className="mb-8" />
          <Reveal className={s.rv}>
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
              Sudah menemukan tema yang cocok?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] text-muted">
              Chat admin, sebutkan temanya, dan undangan kalian bisa mulai diisi hari ini juga.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={waHello}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[16px] font-semibold text-[#f6f1e7] hover:bg-ink-2"
              >
                <IconWhatsapp className="text-lg" /> Pesan lewat WhatsApp
              </a>
              <a href="#tema" className="rounded-full border border-ink/20 px-7 py-4 text-[16px] font-semibold hover:border-ink/40">
                Lihat tema lagi
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter businessName={site.businessName} waHref={waHello} />
    </>
  );
}

function FeatureCard({ title, text, delay, children }: { title: string; text: string; delay: number; children: ReactNode }) {
  return (
    <Reveal className={`${s.rv} flex flex-col rounded-3xl border border-line bg-card/90 p-6`} style={d(delay)}>
      <div className="mb-6 min-h-[150px]">{children}</div>
      <h3 className="font-display text-2xl font-medium">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
    </Reveal>
  );
}

function PriceCard({
  name,
  price,
  normal,
  promoUntil,
  note,
  points,
  cta,
  highlight,
}: {
  name: string;
  price: string;
  /** Harga normal saat promo, tampil dicoret. */
  normal?: string | null;
  promoUntil?: string | null;
  note: string;
  points: string[];
  cta: string;
  highlight?: boolean;
}) {
  return (
    <Reveal
      className={`${s.rv} relative flex flex-col rounded-3xl p-7 sm:p-9 ${
        highlight ? "bg-ink text-[#f3eee5] shadow-[0_30px_60px_-30px_rgb(23_38_31/0.6)]" : "border border-line bg-card"
      }`}
    >
      {highlight ? (
        <span className="absolute right-6 top-6 rounded-full bg-brass px-3 py-1 text-[12px] font-bold text-white">Baru</span>
      ) : null}
      <p className={`text-[14px] font-semibold ${highlight ? "text-[#e9dcc3]" : "text-brass"}`}>{name}</p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 font-display text-5xl font-medium tracking-tight">
        {price}
        {normal ? <s className="text-2xl text-muted">{normal}</s> : null}
      </p>
      {promoUntil ? (
        <p className="mt-2 text-[14px] font-semibold text-brass">
          Promo sampai{" "}
          {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
            new Date(`${promoUntil}T00:00:00Z`),
          )}
        </p>
      ) : null}
      <p className={`mt-2 text-[14px] ${highlight ? "text-[#c9d2cc]" : "text-muted"}`}>{note}</p>
      <ul className="mt-7 grid gap-3 text-[15px]">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5">
            <svg viewBox="0 0 20 20" className={`mt-0.5 size-5 shrink-0 ${highlight ? "text-[#e9dcc3]" : "text-brass"}`} aria-hidden="true">
              <path d="m5 10.5 3.2 3L15 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {p}
          </li>
        ))}
      </ul>
      <a
        href={cta}
        target="_blank"
        rel="noreferrer"
        className={`mt-9 rounded-full py-3.5 text-center text-[15px] font-semibold ${
          highlight ? "bg-[#f3eee5] text-ink hover:bg-white" : "bg-ink text-[#f6f1e7] hover:bg-ink-2"
        }`}
      >
        Pesan {name}
      </a>
    </Reveal>
  );
}
