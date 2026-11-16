import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth/dal";
import { parseContent } from "@/lib/invitation/content";
import { cleanGuestName } from "@/lib/invitation/format";
import { createClient } from "@/lib/supabase/server";
import { RenderTemplate } from "@/templates/renderers";

/**
 * Pratinjau undangan untuk pengelolanya (admin, klien pemilik, mitra), termasuk
 * yang masih draf. Siapa yang boleh melihat diatur oleh RLS database.
 */
export const metadata: Metadata = { title: "Pratinjau | Nauvite", robots: { index: false } };
export const instant = false;

export default function PreviewPage(props: PageProps<"/pratinjau/[id]">) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#17261f" }} />}>
      <Preview {...props} />
    </Suspense>
  );
}

async function Preview({ params, searchParams }: PageProps<"/pratinjau/[id]">) {
  const { id } = await params;
  await requireUser(`/pratinjau/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("id, slug, template_id, content, template_options, partner_id")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  let partner: { name: string | null; url: string | null } | null = null;
  if (data.partner_id) {
    const { data: p } = await supabase
      .from("profiles")
      .select("business_name, business_url")
      .eq("id", data.partner_id)
      .maybeSingle();
    partner = p ? { name: p.business_name, url: p.business_url } : { name: "Mitra", url: null };
  }

  const { to } = await searchParams;
  return (
    <RenderTemplate
      invitation={{
        id: data.id,
        slug: data.slug,
        templateId: data.template_id,
        content: parseContent(data.content),
        templateOptions: (data.template_options as Record<string, unknown>) ?? {},
        partner,
      }}
      guestName={cleanGuestName(to)}
    />
  );
}
