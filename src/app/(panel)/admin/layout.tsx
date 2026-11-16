import { Suspense, type ReactNode } from "react";
import { PanelShell } from "@/components/panel/shell";
import { PanelLoading } from "@/components/panel/loading";
import { navFor } from "@/components/panel/nav-config";
import { requireAdmin } from "@/lib/auth/dal";

// Panel admin selalu dirender saat diminta (butuh data login).
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Data login hanya ada saat request, jadi dibaca di dalam <Suspense>.
  return (
    <Suspense fallback={<PanelLoading />}>
      <AdminFrame>{children}</AdminFrame>
    </Suspense>
  );
}

async function AdminFrame({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  return (
    <PanelShell
      title={navFor("admin").title}
      userLabel={user.fullName || user.email || "Admin"}
      nav={navFor("admin").items}
    >
      {children}
    </PanelShell>
  );
}
