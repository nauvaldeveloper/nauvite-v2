import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { listPartners } from "@/lib/admin/data";
import { CATEGORY_LABELS } from "@/templates/manifest";
import { TEMPLATES } from "@/templates/registry";
import { CreateInvitationForm } from "./form";

export const metadata: Metadata = { title: "Buat undangan | Admin Nauvite" };
// Selalu butuh data login, jadi tidak disiapkan lebih dulu (lihat layout admin).
export const instant = false;

export default async function NewInvitationPage() {
  const partners = await listPartners();
  return (
    <>
      <PageHeader
        title="Buat undangan"
        description="Buat undangan dan akun login klien sekaligus. Isi undangan selanjutnya bisa dilengkapi klien sendiri."
      />
      <CreateInvitationForm
        templates={TEMPLATES.map((t) => ({ id: t.id, name: t.name, category: `${CATEGORY_LABELS[t.category]}${t.tier === "premium" ? ", Premium" : ""}` }))}
        partners={partners.map((p) => ({ id: p.id, name: p.business_name ?? "Mitra" }))}
      />
    </>
  );
}
