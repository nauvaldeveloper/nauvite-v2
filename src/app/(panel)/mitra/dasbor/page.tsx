import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PanelLoading } from "@/components/panel/loading";
import { PanelShell } from "@/components/panel/shell";
import { PartnerInvitations } from "@/components/panel/my-invitations";
import { PageHeader } from "@/components/ui";
import { homeFor, requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Dasbor mitra | Nauvite" };
export const instant = false;

export default function PartnerDashboard() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const user = await requireUser("/mitra/dasbor");
  if (user.role !== "partner") redirect(homeFor(user.role));

  return (
    <PanelShell
      title="Mitra"
      userLabel={user.businessName || user.email || ""}
      nav={[{ href: "/mitra/dasbor", label: "Undangan klien", icon: "list" }]}
    >
      <PageHeader
        eyebrow={user.businessName ?? "Mitra Nauvite"}
        title="Undangan klien"
        description="Semua undangan klien yang kamu bawa ke Nauvite. Untuk menambah undangan baru, hubungi admin lewat WhatsApp."
      />
      <PartnerInvitations />
    </PanelShell>
  );
}
