import type { Metadata } from "next";
import Link from "next/link";
import { Badge, ButtonLink, Card, CardTitle, PageHeader } from "@/components/ui";
import { listPrintDesignsForAdmin, getPrintSettingsForAdmin } from "@/lib/print/admin";
import { PRINT_FOILS, PRINT_FORMATS, PRINT_TIERS, printImageUrl, type PrintTier } from "@/lib/print/shared";
import { rupiah } from "@/lib/site";
import { PrintSettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Cetak | Admin Nauvite" };
// Selalu butuh data login, jadi tidak disiapkan lebih dulu (lihat layout admin).
export const instant = false;

export default async function PrintAdminPage() {
  const [designs, settings] = await Promise.all([listPrintDesignsForAdmin(), getPrintSettingsForAdmin()]);
  const shown = designs.filter((d) => d.active).length;

  return (
    <>
      <PageHeader
        eyebrow={`${shown} dari ${designs.length} desain tampil di halaman /cetak`}
        title="Undangan cetak"
        description="Katalog blangko yang bisa dipesan klien. Kode vendor dan harga modal hanya terlihat di sini."
        actions={
          <>
            <ButtonLink href="/cetak" variant="secondary" target="_blank">
              Lihat halaman
            </ButtonLink>
            <ButtonLink href="/admin/cetak/baru">Tambah desain</ButtonLink>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="grid content-start gap-8">
          {(Object.keys(PRINT_TIERS) as PrintTier[]).map((tier) => {
            const list = designs.filter((d) => d.tier === tier);
            if (!list.length) return null;
            return (
              <section key={tier}>
                <h2 className="mb-3 font-display text-2xl font-medium">
                  {PRINT_TIERS[tier].label} <span className="text-base text-muted">({list.length})</span>
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {list.map((d) => {
                    const margin = d.cost != null ? d.price - d.cost : null;
                    return (
                      <Link
                        key={d.id}
                        href={`/admin/cetak/${d.id}`}
                        className={`group overflow-hidden rounded-2xl border border-line bg-card transition-colors hover:border-ink/30 ${
                          d.active ? "" : "opacity-55"
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-[#ebe4d6]">
                          {d.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={printImageUrl(d.images[0])} alt="" loading="lazy" className="absolute inset-0 m-auto max-h-[86%] max-w-[86%] object-contain shadow-sm" />
                          ) : null}
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-bold tracking-wide text-brass">{d.code}</span>
                            {!d.active ? <Badge>Disembunyikan</Badge> : d.featured ? <Badge tone="amber">Favorit</Badge> : null}
                          </div>
                          <p className="mt-0.5 truncate font-semibold">{d.name}</p>
                          <p className="text-[12px] text-muted">
                            {PRINT_FORMATS[d.format]}
                            {d.foil !== "none" ? `, ${PRINT_FOILS[d.foil].toLowerCase()}` : ""}
                          </p>
                          <p className="mt-2 text-[14px] font-semibold">{rupiah(d.price)}/pcs</p>
                          <p className="text-[12px] text-muted">
                            {d.vendorCode ? `Vendor ${d.vendorCode}` : "Tanpa kode vendor"}
                            {d.cost != null ? `, modal ${rupiah(d.cost)}` : ""}
                            {margin != null ? `, untung ${rupiah(margin)}` : ""}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <Card className="self-start xl:sticky xl:top-6">
          <CardTitle hint="Tampil di halaman /cetak.">Ketentuan pesanan</CardTitle>
          <PrintSettingsForm initial={settings} />
        </Card>
      </div>
    </>
  );
}
