import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { getSettings } from "@/lib/admin/data";
import { SettingsForm } from "./form";

export const metadata: Metadata = { title: "Pengaturan | Admin Nauvite" };
// Selalu butuh data login, jadi tidak disiapkan lebih dulu (lihat layout admin).
export const instant = false;

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader title="Pengaturan" description="Data usaha yang tampil di landing page dan tombol WhatsApp." />
      <Card className="max-w-xl">
        <SettingsForm initial={settings} />
      </Card>
    </>
  );
}
