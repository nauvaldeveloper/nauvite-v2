import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { IconWhatsapp } from "@/components/invitation/icons";

/** Footer dan tombol WhatsApp melayang, dipakai semua halaman publik. */
export function SiteFooter({ businessName, waHref }: { businessName: string; waHref: string }) {
  return (
    <>
      <footer className="bg-ink px-5 py-12 text-[#c9d2cc]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6">
          <div>
            <Logo size={40} textClassName="text-[30px] text-[#f3eee5]" />
            <p className="mt-2 text-[14px]">Undangan pernikahan digital dan cetak.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            <Link href="/#tema" className="hover:text-white">Tema</Link>
            <Link href="/#harga" className="hover:text-white">Harga</Link>
            <Link href="/cetak" className="hover:text-white">Undangan cetak</Link>
            <Link href="/mitra" className="hover:text-white">Program mitra</Link>
            <Link href="/masuk" className="hover:text-white">Masuk</Link>
            <a href={waHref} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp</a>
          </nav>
        </div>
        <p className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-[13px]">
          &copy; {businessName}. Undangan dibuat dan diaktifkan oleh tim {businessName}.
        </p>
      </footer>

      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat admin lewat WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#1f7a4d] text-[26px] text-white shadow-[0_14px_30px_-10px_rgb(0_0_0/0.5)] transition-transform hover:scale-105"
      >
        <IconWhatsapp />
      </a>
    </>
  );
}
