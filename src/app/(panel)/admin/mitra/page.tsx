import type { Metadata } from "next";
import { Card, CardTitle, PageHeader } from "@/components/ui";
import { shortDate } from "@/components/panel/format";
import { countByPartner, getAccounts, listPartners } from "@/lib/admin/data";
import { PartnerForm, PartnerResetPassword } from "./form";

export const metadata: Metadata = { title: "Mitra | Admin Nauvite" };
// Selalu butuh data login, jadi tidak disiapkan lebih dulu (lihat layout admin).
export const instant = false;

export default async function PartnersPage() {
  const partners = await listPartners();
  const [accounts, counts] = await Promise.all([getAccounts(partners.map((p) => p.id)), countByPartner()]);

  return (
    <>
      <PageHeader
        title="Mitra"
        description="WO, MUA, fotografer, dan vendor yang menambahkan undangan Nauvite ke paket mereka."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          {partners.length === 0 ? (
            <p className="px-6 py-12 text-center text-[#5b655f]">Belum ada mitra.</p>
          ) : (
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-black/10 text-[13px] text-[#5b655f]">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama usaha</th>
                  <th className="px-4 py-3 font-medium">Login</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">Undangan</th>
                  <th className="px-4 py-3 font-medium">Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {partners.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <span className="font-medium">{p.business_name}</span>
                      {p.business_url ? (
                        <a
                          href={p.business_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-[13px] text-[#5b655f] hover:underline"
                        >
                          {p.business_url.replace(/^https?:\/\//, "")}
                        </a>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <PartnerResetPassword
                        partnerId={p.id}
                        login={accounts.get(p.id)?.login ?? null}
                        whatsapp={p.whatsapp}
                        businessName={p.business_name}
                      />
                    </td>
                    <td className="px-4 py-3">{p.whatsapp ?? "-"}</td>
                    <td className="px-4 py-3">{counts.get(p.id) ?? 0}</td>
                    <td className="px-4 py-3">{shortDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Card className="self-start">
          <CardTitle>Tambah mitra</CardTitle>
          <PartnerForm />
        </Card>
      </div>
    </>
  );
}
