import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InvitationEditor } from "@/components/editor/invitation-editor";
import { IconArrowLeft } from "@/components/invitation/icons";
import { PanelLoading } from "@/components/panel/loading";
import { navFor } from "@/components/panel/nav-config";
import { PanelShell } from "@/components/panel/shell";
import { PageHeader } from "@/components/ui";
import { homeFor, requireUser } from "@/lib/auth/dal";
import { parseContent } from "@/lib/invitation/content";
import type { EditorPayload } from "@/lib/invitation/editor-schema";
import { createClient } from "@/lib/supabase/server";
import { getManifest } from "@/templates/registry";

export const metadata: Metadata = { title: "Ubah undangan | Nauvite" };
export const instant = false;

export default function EditorPage(props: PageProps<"/editor/[id]">) {
  return (
    <Suspense fallback={<PanelLoading />}>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({ params }: PageProps<"/editor/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/editor/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  // RLS: hanya pemilik, mitra undangan ini, atau admin yang bisa membaca.
  const supabase = await createClient();
  const { data: inv } = await supabase
    .from("invitations")
    .select("id, slug, template_id, content, template_options")
    .eq("id", id)
    .maybeSingle();
  if (!inv) notFound();

  const manifest = getManifest(inv.template_id);
  if (!manifest) notFound();

  const c = parseContent(inv.content);
  const person = (p: typeof c.couple.groom) => ({
    name: p.name,
    fullname: p.fullname,
    parentPrefix: p.parentPrefix,
    father: p.father,
    mother: p.mother,
    socialKind: p.social?.kind ?? "instagram",
    socialHandle: p.social?.handle,
    image: p.image,
  });
  const allOptions = (inv.template_options ?? {}) as Record<string, unknown>;

  const initial: EditorPayload = {
    couple: { groom: person(c.couple.groom), bride: person(c.couple.bride) },
    events: c.events.map((e) => ({
      title: e.title,
      date: /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : "",
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      address: e.address,
      mapsUrl: e.mapsUrl,
      entertainment: e.entertainment,
    })),
    stories: c.stories,
    gallery: c.gallery,
    gifts: c.gifts.map((g) => ({ bank: g.bank, accountNumber: g.accountNumber, accountName: g.accountName })),
    quotes: c.quotes,
    quotesSource: c.quotesSource,
    coverImage: c.coverImage,
    music: c.music,
    youtubeUrl: c.youtubeUrl,
    templateOptions: (allOptions[manifest.id] as Record<string, unknown>) ?? {},
  };

  const nav = navFor(user.role);
  const back = user.role === "admin" ? `/admin/undangan/${inv.id}` : homeFor(user.role);
  const names = [c.couple.groom.name, c.couple.bride.name].filter(Boolean).join(" & ") || inv.slug;

  return (
    <PanelShell title={nav.title} nav={nav.items} userLabel={user.businessName || user.fullName || user.email || ""}>
      <Link href={back} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <IconArrowLeft /> Kembali
      </Link>
      <PageHeader eyebrow={`Tema ${manifest.name}`} title={`Ubah undangan ${names}`} />
      <div className="pb-24">
        <InvitationEditor invitationId={inv.id} slug={inv.slug} manifest={manifest} initial={initial} />
      </div>
    </PanelShell>
  );
}
