import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cleanGuestName, coupleTitle, formatLongDate, mainEventDate, mediaUrl } from "@/lib/invitation/format";
import { getPublicInvitation } from "@/lib/invitation/public";
import { RenderTemplate } from "@/templates/renderers";

/**
 * Halaman undangan: /<slug>?to=Nama+Tamu
 * Tag OG (judul, deskripsi, gambar untuk preview WhatsApp) dibuat di server.
 */
export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getPublicInvitation(slug);
  if (!invitation) return { title: "Undangan tidak ditemukan" };

  const { content } = invitation;
  const title = `Undangan Pernikahan ${coupleTitle(content)}`;
  const date = mainEventDate(content);
  const description = date
    ? `${formatLongDate(date)}. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.`
    : "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.";
  const image = mediaUrl(content.ogImage || content.coverImage);

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
  };
}

export default function InvitationPage(props: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#1f2a24" }} />}>
      <Invitation {...props} />
    </Suspense>
  );
}

async function Invitation({ params, searchParams }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const invitation = await getPublicInvitation(slug);
  if (!invitation) notFound();

  const { to } = await searchParams;
  return <RenderTemplate invitation={invitation} guestName={cleanGuestName(to)} />;
}
