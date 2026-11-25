import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { IconArrowLeft } from "@/components/invitation/icons";
import { GuestBoard } from "@/components/panel/guest-board";
import { PanelLoading } from "@/components/panel/loading";
import { navFor } from "@/components/panel/nav-config";
import { PanelShell } from "@/components/panel/shell";
import { PageHeader } from "@/components/ui";
import { homeFor, requireUser } from "@/lib/auth/dal";
import { parseContent } from "@/lib/invitation/content";
import { formatLongDate, mainEventDate } from "@/lib/invitation/format";
import type { GuestRow } from "@/lib/invitation/guests";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Daftar tamu | Nauvite" };
export const instant = false;

export default function GuestsPage(props: PageProps<"/tamu/[id]">) {
  return (
    <Suspense fallback={<PanelLoading />}>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({ params }: PageProps<"/tamu/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/tamu/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  // RLS: hanya pemilik, mitra undangan ini, atau admin yang bisa membaca.
  const supabase = await createClient();
  const { data: inv } = await supabase
    .from("invitations")
    .select("id, slug, status, content, guest_message")
    .eq("id", id)
    .maybeSingle();
  if (!inv) notFound();

  // Database mengirim paling banyak 1000 baris sekali ambil.
  const guests: GuestRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("guests")
      .select("id, name, phone, sent_at")
      .eq("invitation_id", id)
      .order("created_at")
      .order("id")
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    guests.push(...data.map((g) => ({ id: g.id, name: g.name, phone: g.phone, sentAt: g.sent_at })));
    if (data.length < 1000) break;
  }

  const c = parseContent(inv.content);
  const couple = [c.couple.groom.name, c.couple.bride.name].filter(Boolean).join(" & ") || "kami berdua";
  const date = mainEventDate(c);
  const nav = navFor(user.role);
  const back = user.role === "admin" ? `/admin/undangan/${inv.id}` : homeFor(user.role);

  return (
    <PanelShell title={nav.title} nav={nav.items} userLabel={user.businessName || user.fullName || user.email || ""}>
      <Link href={back} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <IconArrowLeft /> Kembali
      </Link>
      <PageHeader
        eyebrow={couple}
        title="Daftar tamu"
        description="Simpan nama tamu, lalu kirim undangannya satu per satu lewat WhatsApp. Yang sudah dikirim ditandai otomatis."
      />
      <GuestBoard
        invitationId={inv.id}
        slug={inv.slug}
        active={inv.status === "active"}
        couple={couple}
        date={date ? formatLongDate(date) : null}
        initialGuests={guests}
        initialMessage={inv.guest_message}
      />
    </PanelShell>
  );
}
