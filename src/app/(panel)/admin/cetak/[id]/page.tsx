import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { Button, Card, PageHeader } from "@/components/ui";
import { IconArrowLeft } from "@/components/invitation/icons";
import { deletePrintDesign } from "@/lib/print/actions";
import { getPrintDesignForAdmin } from "@/lib/print/admin";
import { PrintDesignForm } from "../design-form";
import { ConfirmDelete } from "./confirm-delete";

export const metadata: Metadata = { title: "Ubah desain cetak | Admin Nauvite" };
export const instant = false;

export default async function EditPrintDesignPage({ params }: PageProps<"/admin/cetak/[id]">) {
  const { id } = await params;
  if (!z.guid().safeParse(id).success) notFound();
  const design = await getPrintDesignForAdmin(id);
  if (!design) notFound();

  return (
    <>
      <Link href="/admin/cetak" className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink">
        <IconArrowLeft /> Katalog cetak
      </Link>
      <PageHeader eyebrow={design.code} title={design.name} />
      <div className="grid max-w-3xl gap-6">
        <Card>
          <PrintDesignForm design={design} />
        </Card>
        <Card>
          <p className="font-semibold">Hapus desain</p>
          <p className="mt-1 text-[14px] text-muted">
            Kalau stok blangko hanya sedang habis, cukup hilangkan centang &ldquo;Tampil di katalog&rdquo;.
          </p>
          <ConfirmDelete action={deletePrintDesign.bind(null, design.id)} label={`${design.code} ${design.name}`}>
            <Button variant="danger" className="mt-4">
              Hapus desain
            </Button>
          </ConfirmDelete>
        </Card>
      </div>
    </>
  );
}
