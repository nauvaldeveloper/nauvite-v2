import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { IconArrowLeft } from "@/components/invitation/icons";
import { listPrintDesignsForAdmin } from "@/lib/print/admin";
import { PrintDesignForm } from "../design-form";

export const metadata: Metadata = { title: "Tambah desain cetak | Admin Nauvite" };
export const instant = false;

export default async function NewPrintDesignPage() {
  const designs = await listPrintDesignsForAdmin();
  // Usulan kode berikutnya: NC-xx setelah nomor terbesar
  const last = Math.max(0, ...designs.map((d) => Number(/^NC-(\d+)$/.exec(d.code)?.[1] ?? 0)));
  const nextCode = `NC-${String(last + 1).padStart(2, "0")}`;
  return (
    <>
      <Link href="/admin/cetak" className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink">
        <IconArrowLeft /> Katalog cetak
      </Link>
      <PageHeader title="Tambah desain" description="Desain baru langsung tampil di halaman /cetak kalau dicentang tampil." />
      <Card className="max-w-3xl">
        <PrintDesignForm nextCode={nextCode} />
      </Card>
    </>
  );
}
