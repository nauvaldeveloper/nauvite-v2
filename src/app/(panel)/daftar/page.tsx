import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArchLines } from "@/components/brand/arch";
import { Logo } from "@/components/brand/logo";
import { getCatalog } from "@/lib/demos";
import { parseSampleInput } from "@/lib/invitation/sample";
import { TrialForm, type TrialTheme } from "./form";

export const metadata: Metadata = {
  title: "Coba gratis 1 hari | Nauvite",
  description: "Isi undangan digital kalian sendiri dan lihat hasilnya selama 1 hari, tanpa bayar.",
};

const STEPS = [
  ["Isi dari HP", "Nama, acara, foto, lagu, dan rekening, sambil lihat hasilnya."],
  ["Bagikan ke pasangan", "Link contohnya bisa dibuka 24 jam, ada tanda belum terbit."],
  ["Cocok? Terbitkan", "Chat admin dan bayar sekali. Isinya tetap, tidak perlu diulang."],
];

export default function TrialPage({ searchParams }: PageProps<"/daftar">) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-ink text-[#f3eee5] lg:block">
        <ArchLines draw className="absolute bottom-0 left-1/2 h-[82%] -translate-x-1/2 opacity-25" />
        <div className="relative flex h-full flex-col gap-16 p-12">
          <Link href="/">
            <Logo size={40} textClassName="text-[28px] text-[#f3eee5]" />
          </Link>
          <div className="mx-auto my-auto max-w-md">
            <p className="font-display text-5xl font-medium leading-[1.08]">Coba dulu undangannya, bayar kalau cocok.</p>
            <dl className="mt-10 grid gap-6">
              {STEPS.map(([t, x]) => (
                <div key={t}>
                  <dt className="text-[17px] font-semibold">{t}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#c9d2cc]">{x}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 block lg:hidden">
            <Logo tone="gelap" size={36} textClassName="text-[26px]" />
          </Link>
          <h1 className="font-display text-4xl font-medium tracking-tight">Coba gratis 1 hari</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Isi undangan kalian dan lihat hasilnya selama 24 jam. Menerbitkannya baru bayar.
          </p>
          <Suspense fallback={<div className="mt-8 h-96" />}>
            <Form searchParams={searchParams} />
          </Suspense>
          <p className="mt-6 text-center text-[14px] text-muted">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-semibold text-brass hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

async function Form({ searchParams }: Pick<PageProps<"/daftar">, "searchParams">) {
  const sp = await searchParams;
  const input = parseSampleInput(sp);
  const themes: TrialTheme[] = getCatalog().flatMap((t) =>
    t.demos.map((d) => ({ slug: d.slug, label: d.label ? `${t.name}, ${d.label.toLowerCase()}` : t.name, photo: t.withPhoto })),
  );
  const demo = themes.find((t) => t.slug === sp.tema)?.slug ?? themes.find((t) => !t.photo)!.slug;
  return <TrialForm themes={themes} initial={{ demo, groom: input.groom, bride: input.bride, date: input.date ?? "" }} />;
}
