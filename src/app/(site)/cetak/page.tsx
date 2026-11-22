import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArchLines } from "@/components/brand/arch";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/invitation/reveal";
import { IconWhatsapp } from "@/components/invitation/icons";
import { SiteFooter } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/nav";
import { Phone } from "@/components/landing/phone";
import { PrintCatalog } from "@/components/landing/print-catalog";
import { QrMark } from "@/components/landing/qr-mark";
import s from "@/components/landing/landing.module.css";
import { getPrintDesigns, getPrintSettings } from "@/lib/print/public";
import { PRINT_TIERS, printImageUrl, type PrintTier } from "@/lib/print/shared";
import { getSiteSettings, rupiah, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Undangan Cetak | Nauvite",
  description:
    "Undangan pernikahan cetak dengan pilihan foil emas dan silver, set amplop, sampai hard cover. Bisa dipadukan dengan undangan digital lewat QR code.",
  openGraph: {
    title: "Undangan Cetak Nauvite",
    description: "Pilih desain blangko, kami cetakkan nama dan detail acara kalian. Minimal pesanan sedikit.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630 }],
  },
};

// Posisi tiga kartu di hero (r = kemiringan)
const HERO_POS: CSSProperties[] = [
  { left: "2%", top: "6%", "--r": "-7deg" } as CSSProperties,
  { right: "0%", top: "14%", "--r": "6deg" } as CSSProperties,
  { left: "18%", bottom: "4%", "--r": "-1.5deg" } as CSSProperties,
];

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function PrintPage() {
  const [site, designs, print] = await Promise.all([getSiteSettings(), getPrintDesigns(), getPrintSettings()]);
  const waOrder = waLink(site.whatsapp, `Halo ${site.businessName}, saya mau tanya soal undangan cetak.`);
  const waBundle = waLink(
    site.whatsapp,
    `Halo ${site.businessName}, saya tertarik paket undangan digital + cetak dengan QR code. Boleh minta info?`,
  );
  const cheapest = designs.length ? Math.min(...designs.map((x) => x.price)) : null;
  const hero = [...designs.filter((x) => x.featured && x.orientation === "landscape"), ...designs].slice(0, 3);
  const tiers = (Object.keys(PRINT_TIERS) as PrintTier[])
    .map((t) => ({ t, list: designs.filter((x) => x.tier === t) }))
    .filter((x) => x.list.length);
  const cardShot = hero[0];

  return (
    <>
      <LandingNav waHref={waOrder} businessName={site.businessName} />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className={`${s.paper} relative overflow-hidden px-5 pb-16 pt-28 sm:pt-32 lg:pb-24`}>
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div className="text-center lg:text-left">
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Undangan cetak</p>
              <h1 className="mt-4 font-display text-[40px] font-medium leading-[1.06] tracking-tight sm:text-6xl">
                Undangan kertas yang enak dipegang tamu.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink/75 lg:mx-0">
                Pilih dari {designs.length} desain, mulai yang hemat sampai set amplop dengan foil emas. Nama kalian, detail acara,
                sampai nama tamu kami cetakkan, tinggal dibagikan.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href="#katalog"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-[#f6f1e7] hover:bg-ink-2"
                >
                  Lihat katalog
                </a>
                <a
                  href={waOrder}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-card px-6 py-3.5 text-[15px] font-semibold hover:border-ink/40"
                >
                  <IconWhatsapp className="text-lg" /> Tanya admin
                </a>
              </div>
              <p className="mt-6 text-[14px] text-muted">
                {cheapest != null ? `Mulai ${rupiah(cheapest)}/pcs (belum termasuk plastik), ` : ""}minimal {print.minOrder} pcs,
                selesai {print.leadDays} hari kerja.
              </p>
            </div>

            <div className="relative mx-auto h-[340px] w-full max-w-[560px] sm:h-[440px]">
              <ArchLines draw className="absolute left-1/2 top-[-8%] h-[116%] -translate-x-1/2 opacity-70" />
              {hero.map((x, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={x.id}
                  src={printImageUrl(x.images[0])}
                  alt={i === 0 ? `Contoh undangan cetak ${x.name}` : ""}
                  className={`${s.printHero} absolute w-[64%] shadow-[0_24px_40px_-22px_rgb(23_38_31/0.6)]`}
                  style={{ ...HERO_POS[i], ...d(i * 160) }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Kelas ---------------- */}
        <section className="px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-12 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Tiga kelas</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Sesuaikan dengan anggaran</h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {tiers.map(({ t, list }, i) => {
                const dark = t === "eksklusif";
                return (
                  <Reveal
                    key={t}
                    className={`${s.rv} flex flex-col rounded-3xl p-7 ${dark ? "bg-ink text-[#f3eee5]" : "border border-line bg-card"}`}
                    style={d(i * 100)}
                  >
                    <p className={`text-[14px] font-semibold ${dark ? "text-gold" : "text-brass"}`}>{PRINT_TIERS[t].label}</p>
                    <p className="mt-3 font-display text-4xl font-medium tracking-tight">
                      <span className={`mr-1.5 font-sans text-[15px] font-normal ${dark ? "text-[#c9d2cc]" : "text-muted"}`}>mulai</span>
                      {rupiah(Math.min(...list.map((x) => x.price)))}
                    </p>
                    <p className={`mt-1 text-[14px] ${dark ? "text-[#c9d2cc]" : "text-muted"}`}>
                      per pcs belum termasuk plastik, {list.length} desain
                    </p>
                    <p className={`mt-5 border-t pt-5 text-[15px] leading-relaxed ${dark ? "border-white/10 text-[#e4e9e5]" : "border-line"}`}>
                      {PRINT_TIERS[t].hint}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- Katalog ---------------- */}
        <section id="katalog" className={`${s.paper} scroll-mt-20 px-5 py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl">
            <Reveal className={`${s.rv} mx-auto mb-10 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Katalog</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Pilih desain undangan cetak</h2>
              <p className="mt-4 text-[16px] text-muted">Ketuk desain untuk melihat lebih besar. Sebutkan kodenya saat memesan.</p>
            </Reveal>
            {designs.length ? (
              <PrintCatalog
                designs={designs}
                whatsapp={site.whatsapp}
                businessName={site.businessName}
                minOrder={print.minOrder}
                plastic={print.plastic}
                label={print.label}
              />
            ) : (
              <p className="text-center text-muted">Katalog sedang diperbarui. Tanyakan desain yang tersedia lewat WhatsApp.</p>
            )}
          </div>
        </section>

        {/* ---------------- Digital + cetak ---------------- */}
        <section className="relative overflow-hidden bg-ink px-5 py-20 text-[#f3eee5] sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
            <Reveal className={`${s.rv} relative mx-auto grid h-[420px] w-full max-w-md place-items-center`}>
              {cardShot ? (
                <div className="absolute bottom-[6%] left-0 w-[80%] -rotate-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={printImageUrl(cardShot.images[0])} alt="" className="w-full shadow-[0_24px_40px_-18px_rgb(0_0_0/0.7)]" />
                  <span className="absolute bottom-[7%] left-[5%] grid w-[22%] place-items-center rounded-md bg-white p-1.5 shadow-md">
                    <QrMark className="w-full text-ink" />
                  </span>
                </div>
              ) : null}
              <Phone className="absolute right-0 top-0 w-[38%] rotate-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/landing/sundanese-elegance-isi.webp" alt="Undangan digital yang terbuka setelah QR dipindai" />
              </Phone>
            </Reveal>
            <Reveal className={s.rv} style={d(120)}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-gold">Digital + cetak</p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                Satu QR code, tamu langsung ke undangan digital kalian
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#c9d2cc]">
                Pesan undangan digital dan cetak sekaligus. Di kartu cetak kami tambahkan QR code yang membuka undangan
                digital kalian, jadi kartunya tetap rapi tanpa denah yang berdesakan.
              </p>
              <ul className="mt-7 grid gap-3 text-[15px]">
                {[
                  "Lokasi acara langsung terbuka di Google Maps",
                  "Tamu bisa konfirmasi kehadiran dan kirim ucapan",
                  "Info amplop digital, galeri foto, dan musik",
                  "Perubahan jadwal cukup diubah di versi digital",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="m4.5 10.5 3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={waBundle}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[15px] font-semibold text-ink hover:brightness-105"
                >
                  <IconWhatsapp className="text-lg" /> Tanya paket digital + cetak
                </a>
                <Link href="/#tema" className="rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold hover:border-white/50">
                  Lihat tema digital
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Cara pesan ---------------- */}
        <section className="px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className={`${s.rv} mx-auto mb-12 max-w-2xl text-center`}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Cara pesan</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Semua diurus lewat WhatsApp</h2>
            </Reveal>
            <ol className="grid gap-4 md:grid-cols-2">
              {[
                ["Pilih desain dan jumlah", `Sebutkan kode desain dan jumlah undangan, minimal ${print.minOrder} pcs.`],
                ["Kirim data acara", "Nama kedua mempelai, orang tua, waktu dan tempat acara, serta tambahan lain seperti turut mengundang."],
                ["Cek contoh desain", "Kami kirim tampilan isi undangan sebelum dicetak. Silakan minta perbaikan kalau ada yang kurang pas."],
                ["Bayar, lalu dicetak", `Setelah desain disetujui dan pembayaran dikonfirmasi, undangan selesai dalam ${print.leadDays} hari kerja.`],
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

        {/* ---------------- Tanya jawab ---------------- */}
        <section className={`${s.paper} px-5 py-20 sm:py-28`}>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.6fr]">
            <Reveal className={s.rv}>
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Tanya jawab</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Seputar undangan cetak</h2>
            </Reveal>
            <div className="grid gap-3">
              {[
                ["Berapa minimal pesanan?", `Minimal ${print.minOrder} pcs per desain. Jumlah di atas itu bebas, tidak harus kelipatan.`],
                [
                  "Harga sudah termasuk apa saja?",
                  "Harga per pcs sudah termasuk blangko dan cetak teks: nama mempelai, detail acara, dan nama tamu. Belum termasuk ongkir.",
                ],
                [
                  "Apakah sudah termasuk plastik?",
                  `Belum. Plastik undangan tambah ${rupiah(print.plastic)}/pcs, dan label stiker nama tamu tambah ${rupiah(print.label)}/pcs. Keduanya opsional.`,
                ],
                ["Apa bedanya kertas foil?", "Bagian ornamen pada kertas foil berkilau emas atau silver saat terkena cahaya, jadi terasa lebih mewah saat dipegang."],
                ["Berapa lama pengerjaannya?", `Sekitar ${print.leadDays} hari kerja setelah desain disetujui dan pembayaran dikonfirmasi.`],
                ["Bisa lihat contoh aslinya?", "Bisa. Minta foto atau video contoh fisik desain yang kalian incar ke admin lewat WhatsApp."],
                ["Bisa sekalian pesan undangan digital?", "Bisa, dan kartu cetaknya bisa diberi QR code yang langsung membuka undangan digital kalian."],
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
              Sudah ada desain yang cocok?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] text-[#c9d2cc]">
              Kirim kode desain dan perkiraan jumlah tamu, admin bantu hitungkan totalnya.
            </p>
            <a
              href={waOrder}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-[16px] font-semibold text-ink hover:brightness-105"
            >
              <IconWhatsapp className="text-lg" /> Pesan undangan cetak
            </a>
          </Reveal>
        </section>
      </main>

      <SiteFooter businessName={site.businessName} waHref={waOrder} />
    </>
  );
}
