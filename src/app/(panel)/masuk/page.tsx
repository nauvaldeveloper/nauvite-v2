import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArchLines } from "@/components/brand/arch";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Masuk | Nauvite", robots: { index: false } };

export default function LoginPage({ searchParams }: PageProps<"/masuk">) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-ink text-[#f3eee5] lg:block">
        <ArchLines draw className="absolute bottom-0 left-1/2 h-[82%] -translate-x-1/2" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/">
            <Logo size={40} textClassName="text-[28px] text-[#f3eee5]" />
          </Link>
          <div className="mx-auto max-w-md text-center">
            <p className="font-display text-5xl font-medium leading-[1.08]">Kelola undangan pernikahan dari satu tempat.</p>
            <p className="mt-5 text-[15px] leading-relaxed text-[#c9d2cc]">
              Lihat siapa saja yang akan hadir, baca ucapan dari tamu, dan sebar link undangan dengan nama masing-masing.
            </p>
          </div>
          <span />
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 block lg:hidden">
            <Logo tone="gelap" size={36} textClassName="text-[26px]" />
          </Link>
          <h1 className="font-display text-4xl font-medium tracking-tight">Masuk</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Pakai username dan password yang dikirim admin Nauvite lewat WhatsApp.
          </p>
          <Suspense fallback={<div className="mt-8 h-72" />}>
            <FormWithNext searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function FormWithNext({ searchParams }: Pick<PageProps<"/masuk">, "searchParams">) {
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : ""} />;
}
