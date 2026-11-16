import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PanelLoading } from "@/components/panel/loading";
import { PanelShell } from "@/components/panel/shell";
import { ClientInvitations } from "@/components/panel/my-invitations";
import { PageHeader } from "@/components/ui";
import { homeFor, requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Dasbor | Nauvite" };
export const instant = false;

export default function ClientDashboard() {
  return (
    <Suspense fallback={<PanelLoading />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const user = await requireUser("/dasbor");
  if (user.role !== "client") redirect(homeFor(user.role));

  return (
    <PanelShell title="Dasbor" userLabel={user.fullName || user.email || ""} nav={[{ href: "/dasbor", label: "Undangan saya", icon: "home" }]}>
      <PageHeader eyebrow="Dasbor klien" title={`Halo, ${(user.fullName || "").trim() || "selamat datang"}`} />
      <ClientInvitations />
    </PanelShell>
  );
}
