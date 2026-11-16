"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";

const LINKS = [
  { href: "/#tema", label: "Tema" },
  { href: "/#fitur", label: "Fitur" },
  { href: "/#harga", label: "Harga" },
  { href: "/mitra", label: "Mitra" },
  { href: "/#tanya", label: "Tanya jawab" },
];

/** Menu atas. Latar muncul setelah halaman di-scroll; di HP jadi menu lipat. */
export function LandingNav({ waHref, businessName }: { waHref: string; businessName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-[#f3eee5]/92 backdrop-blur" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
        <Link href="/" aria-label={businessName}>
          <Logo tone="gelap" size={32} textClassName="text-[25px]" />
        </Link>
        <nav className="ml-6 hidden gap-1 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-[14px] font-semibold text-ink/75 hover:bg-ink/5 hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/masuk" className="hidden rounded-full px-4 py-2 text-[14px] font-semibold hover:bg-ink/5 sm:block">
            Masuk
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-[#f6f1e7] hover:bg-ink-2 sm:block"
          >
            Pesan undangan
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className="grid size-10 place-items-center rounded-full hover:bg-ink/5 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-line px-5 pb-5 pt-3 lg:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-[16px] font-semibold hover:bg-ink/5">
              {l.label}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link href="/masuk" className="rounded-full border border-line py-3 text-center text-[15px] font-semibold">
              Masuk
            </Link>
            <a href={waHref} target="_blank" rel="noreferrer" className="rounded-full bg-ink py-3 text-center text-[15px] font-semibold text-[#f6f1e7]">
              Pesan
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
