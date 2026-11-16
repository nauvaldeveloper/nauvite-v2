import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { IconArrowLeft } from "@/components/invitation/icons";
import { PanelLoading } from "@/components/panel/loading";
import { navFor } from "@/components/panel/nav-config";
import { RsvpBoard, type RsvpRow } from "@/components/panel/rsvp-board";
import { PanelShell } from "@/components/panel/shell";
import { PageHeader } from "@/components/ui";
import { homeFor, requireUser } from "@/lib/auth/dal";
import { parseContent } from "@/lib/invitation/content";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ucapan dan RSVP | Nauvite" };
export const instant = false;

export default function RsvpPage(props: PageProps<"/rsvp/[id]">) {
  return (
    <Suspense fallback={<PanelLoading />}>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({ params }: PageProps<"/rsvp/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/rsvp/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  // RLS: hanya pemilik, mitra undangan ini, atau admin yang bisa membaca.
  const supabase = await createClient();
  const { data: inv } = await supabase.from("invitations").select("id, slug, content").eq("id", id).maybeSingle();
  if (!inv) notFound();

  const { data: wishes } = await supabase
    .from("wishes")
    .select("id, name, message, attendance, guest_count, created_at")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false })
    .limit(3000);

  const rows: RsvpRow[] = (wishes ?? []).map((w) => ({
    id: w.id,
    name: w.name,
    message: w.message,
    attendance: w.attendance as RsvpRow["attendance"],
    guestCount: w.guest_count,
    createdAt: w.created_at,
  }));

  const c = parseContent(inv.content);
  const title = [c.couple.groom.name, c.couple.bride.name].filter(Boolean).join(" & ") || inv.slug;
  const nav = navFor(user.role);
  const back = user.role === "admin" ? `/admin/undangan/${inv.id}` : homeFor(user.role);

  return (
    <PanelShell title={nav.title} nav={nav.items} userLabel={user.businessName || user.fullName || user.email || ""}>
      <Link href={back} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <IconArrowLeft /> Kembali
      </Link>
      <PageHeader
        eyebrow={title}
        title="Ucapan dan RSVP"
        description="Semua ucapan dan konfirmasi kehadiran dari tamu. Hapus ucapan yang tidak pantas, atau unduh sebagai file Excel untuk hitungan katering dan kursi."
      />
      <RsvpBoard rows={rows} title={title} slug={inv.slug} />
    </PanelShell>
  );
}
