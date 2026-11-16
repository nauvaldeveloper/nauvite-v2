import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Notice, PageHeader, cx } from "@/components/ui";
import { IconPlus, IconSearch } from "@/components/invitation/icons";
import { InvitationCard } from "@/components/panel/invitation-card";
import { getAccounts, listInvitations, listPartners } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Undangan | Admin Nauvite" };
// Selalu butuh data login, jadi tidak disiapkan lebih dulu (lihat layout admin).
export const instant = false;

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "draft", label: "Draf" },
  { value: "inactive", label: "Nonaktif" },
];

export default async function InvitationsPage({ searchParams }: PageProps<"/admin/undangan">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const status = typeof sp.status === "string" ? sp.status : "";

  const [rows, partners] = await Promise.all([listInvitations({ q, status }), listPartners()]);
  const accounts = await getAccounts(rows.map((r) => r.ownerId));
  const partnerName = new Map(partners.map((p) => [p.id, p.business_name ?? "Mitra"]));

  const href = (s: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (s) p.set("status", s);
    const qs = p.toString();
    return `/admin/undangan${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader
        eyebrow={`${rows.length} undangan`}
        title="Semua undangan"
        actions={
          <ButtonLink href="/admin/buat">
            <IconPlus /> Buat undangan
          </ButtonLink>
        }
      />

      {sp.dihapus ? (
        <div className="mb-5">
          <Notice tone="success">Undangan sudah dihapus.</Notice>
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <form role="search" className="relative w-full sm:w-80">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari nama pasangan atau slug"
            className="w-full rounded-full border border-line bg-card py-2.5 pl-10 pr-4 text-[15px] focus:border-brass focus:outline-none focus:ring-4 focus:ring-brass/15"
          />
        </form>
        <div className="flex gap-1 rounded-full border border-line bg-card p-1">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={href(f.value)}
              className={cx(
                "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                status === f.value ? "bg-ink text-[#f6f1e7]" : "text-muted hover:text-ink",
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 px-6 py-16 text-center">
          <p className="font-display text-2xl italic">Belum ada undangan{q || status ? " yang cocok" : ""}</p>
          <p className="mt-2 text-muted">Coba kata kunci lain, atau buat undangan baru.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const login = r.ownerId ? accounts.get(r.ownerId)?.login : null;
            const partner = r.partnerId ? partnerName.get(r.partnerId) : null;
            const meta = [login ? `Login: ${login}` : "Belum ada akun klien", partner ? `Mitra: ${partner}` : null]
              .filter(Boolean)
              .join(", ");
            return <InvitationCard key={r.id} inv={r} href={`/admin/undangan/${r.id}`} meta={meta} />;
          })}
        </div>
      )}
    </>
  );
}
