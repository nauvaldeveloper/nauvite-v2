import { getManifest } from "@/templates/registry";

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function shortDate(iso: string | null | undefined) {
  return iso ? dateFmt.format(new Date(iso)) : "-";
}

export function templateName(id: string) {
  return getManifest(id)?.name ?? id;
}

export function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

/** Status yang dilihat tamu: aktif, kedaluwarsa, draf, nonaktif. */
export function effectiveStatus(status: string, activeUntil: string | null) {
  const now = Date.now();
  if (status === "active" && activeUntil && new Date(activeUntil).getTime() < now) {
    return { label: "Kedaluwarsa", tone: "amber" as const };
  }
  if (status === "active") return { label: "Aktif", tone: "green" as const };
  if (status === "inactive") return { label: "Nonaktif", tone: "red" as const };
  return { label: "Draf", tone: "gray" as const };
}
