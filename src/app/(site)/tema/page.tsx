import type { Metadata } from "next";
import { FullCatalog } from "@/components/landing/full-catalog";
import { SiteFooter } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/nav";
import { getCatalog } from "@/lib/demos";
import { getSiteSettings, rupiah, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Katalog tema | Nauvite",
  description:
    "Semua tema undangan pernikahan digital Nauvite: Premium dengan ilustrasi adat, Basic dengan foto, dan Hemat tanpa foto. Lihat demo dan coba gratis 24 jam.",
  openGraph: {
    title: "Katalog tema Nauvite",
    description: "Lihat semua tema undangan digital, buka demonya, dan pilih yang paling cocok.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630 }],
  },
};

/** Katalog lengkap semua tema, dikelompokkan per paket. */
export default async function ThemesPage() {
  const site = await getSiteSettings();
  const catalog = getCatalog();
  const ready = catalog.filter((t) => t.demos.length > 0);
  const colors = ready.reduce((n, t) => n + t.demos.length, 0);
  const waHello = waLink(site.whatsapp, `Halo ${site.businessName}, saya mau tanya soal tema undangan.`);
  const waHelp = waLink(site.whatsapp, `Halo ${site.businessName}, saya bingung pilih tema. Acara saya ...`);

  return (
    <>
      <LandingNav waHref={waHello} businessName={site.businessName} />

      <main className="px-5 pb-24">
        <section className="mx-auto max-w-6xl pb-10 pt-28 text-center sm:pt-36">
          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brass">Katalog lengkap</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-[40px] font-medium leading-[1.06] tracking-tight sm:text-6xl">
            Semua tema undangan Nauvite
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-ink/75">
            {ready.length} tema dengan {colors} pilihan tampilan. Ketuk gambar untuk membuka demonya, ganti warnanya, lalu
            pesan atau coba gratis 24 jam dengan data kalian sendiri.
          </p>
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2 text-[13.5px] font-semibold text-ink/80">
            {["Nama tamu di sampul", "RSVP dan ucapan", "Amplop digital", "Musik", "Tamu tanpa batas"].map((f) => (
              <li key={f} className="rounded-full border border-line bg-card px-3.5 py-1.5">
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-muted">Semua fitur di atas ada di setiap paket.</p>
        </section>

        <div className="mx-auto max-w-6xl">
          <FullCatalog
            items={catalog}
            prices={{
              hemat: rupiah(site.priceHemat),
              basic: rupiah(site.priceBasic),
              premium: rupiah(site.pricePremium),
            }}
            hematNormal={site.hematNormal ? rupiah(site.hematNormal) : null}
            whatsapp={site.whatsapp}
          />
        </div>

        <section className="mx-auto mt-24 max-w-3xl rounded-[28px] bg-ink px-6 py-12 text-center text-[#f3eee5] sm:px-12">
          <h2 className="font-display text-[30px] font-medium leading-tight sm:text-[38px]">Masih bingung pilih tema?</h2>
          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[#c9d2cc]">
            Ceritakan konsep acara kalian, misalnya adat, warna seragam, atau suasana yang diinginkan. Admin akan
            menyarankan tema yang paling pas.
          </p>
          <a
            href={waHelp}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-block rounded-full bg-brass px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-[#946f35]"
          >
            Tanya admin lewat WhatsApp
          </a>
        </section>
      </main>

      <SiteFooter businessName={site.businessName} waHref={waHello} />
    </>
  );
}
