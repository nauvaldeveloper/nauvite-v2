import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SampleBar } from "@/components/invitation/sample-bar";
import { getCatalog } from "@/lib/demos";
import { cleanGuestName } from "@/lib/invitation/format";
import { getPublicInvitation } from "@/lib/invitation/public";
import { parseSampleInput, personalizeDemo } from "@/lib/invitation/sample";
import { RenderTemplate } from "@/templates/renderers";

/**
 * Contoh undangan dengan nama calon klien: /coba/<slug demo>?pria=..&wanita=..&tgl=..
 * Isinya demo tema, tidak ada yang disimpan.
 */
export async function generateMetadata({ searchParams }: PageProps<"/coba/[demo]">): Promise<Metadata> {
  const { groom, bride } = parseSampleInput(await searchParams);
  const title = groom && bride ? `Contoh undangan ${groom} & ${bride}` : "Contoh undangan";
  const description = "Contoh undangan digital dari Nauvite. Ketik nama kalian dan lihat hasilnya.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, images: [{ url: "/brand/og.jpg", width: 1200, height: 630 }] },
  };
}

export default function SamplePage(props: PageProps<"/coba/[demo]">) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#17261f" }} />}>
      <Sample {...props} />
    </Suspense>
  );
}

async function Sample({ params, searchParams }: PageProps<"/coba/[demo]">) {
  const { demo: slug } = await params;
  const sp = await searchParams;
  if (!getCatalog().some((t) => t.demos.some((d) => d.slug === slug))) notFound();
  const demo = await getPublicInvitation(slug);
  if (!demo) notFound();

  const input = parseSampleInput(sp);
  const query = new URLSearchParams({ tema: slug });
  if (input.groom) query.set("pria", input.groom);
  if (input.bride) query.set("wanita", input.bride);
  if (input.date) query.set("tgl", input.date);

  return (
    <>
      {sp.bingkai ? null : <SampleBar text="Ini contoh, belum terbit" href={`/daftar?${query}`} action="Isi undangan ini" />}
      <RenderTemplate invitation={personalizeDemo(demo, input)} guestName={cleanGuestName(sp.to) ?? "Tamu Undangan"} />
    </>
  );
}
