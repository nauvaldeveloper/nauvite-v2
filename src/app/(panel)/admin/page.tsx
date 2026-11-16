import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Card, CardTitle, PageHeader } from "@/components/ui";
import { IconPlus } from "@/components/invitation/icons";
import { InvitationCard, dayCountdown, daysLeft } from "@/components/panel/invitation-card";
import { shortDate } from "@/components/panel/format";
import { setInvitationStatus } from "@/lib/admin/actions";
import { getOverview, type AdminInvitationRow } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Beranda | Admin Nauvite" };
// Selalu butuh data login, jadi tidak disiapkan lebih dulu (lihat layout admin).
export const instant = false;

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }).format(new Date()),
  );
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

function todayText() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

export default async function AdminHome() {
  const user = await requireAdmin();
  const o = await getOverview();
  const firstName = (user.fullName || "Admin").split(" ")[0];

  const todo: { inv: AdminInvitationRow; reason: string; action: { kind: string; days?: number; label: string } }[] = [
    ...o.expired.map((inv) => ({
      inv,
      reason: `Masa aktif habis ${shortDate(inv.activeUntil)}`,
      action: { kind: "extend", days: 90, label: "+90 hari" },
    })),
    ...o.expiringSoon.map((inv) => ({
      inv,
      reason: `Berakhir ${daysLeft(inv.activeUntil) === 0 ? "hari ini" : `${daysLeft(inv.activeUntil)} hari lagi`}`,
      action: { kind: "extend", days: 90, label: "+90 hari" },
    })),
    ...o.drafts.map((inv) => ({
      inv,
      reason: "Draf, menunggu pembayaran",
      action: { kind: "extend", days: 90, label: "Aktifkan 90 hari" },
    })),
  ];

  const stats = [
    { label: "Undangan aktif", value: o.active, note: "bisa dibuka tamu" },
    { label: "Menunggu bayar", value: o.drafts.length, note: "masih draf" },
    { label: "Segera berakhir", value: o.expiringSoon.length + o.expired.length, note: "dalam 14 hari atau lewat" },
    { label: "Ucapan baru", value: o.wishesThisWeek, note: "7 hari terakhir" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={todayText()}
        title={
          <>
            {greeting()}, {firstName}
          </>
        }
        actions={
          <ButtonLink href="/admin/buat">
            <IconPlus /> Buat undangan
          </ButtonLink>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`rounded-2xl p-5 ${i === 0 ? "bg-ink text-[#f3eee5]" : "border border-line bg-card"}`}
          >
            <p className={`text-[13px] font-semibold ${i === 0 ? "text-[#c9d2cc]" : "text-muted"}`}>{s.label}</p>
            <p className="mt-2 font-display text-5xl font-medium tabular-nums">{s.value}</p>
            <p className={`mt-1 text-[12px] ${i === 0 ? "text-[#9aa79f]" : "text-muted"}`}>{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardTitle hint="Undangan yang butuh tindakan, paling mendesak di atas.">Perlu ditindak</CardTitle>
          {todo.length === 0 ? (
            <p className="rounded-xl bg-[#ecf5ee] px-4 py-6 text-center text-[15px] text-[#1d4a30]">
              Semua beres. Tidak ada undangan yang menunggu.
            </p>
          ) : (
            <ul className="-mx-2 divide-y divide-line">
              {todo.slice(0, 8).map(({ inv, reason, action }) => (
                <li key={inv.id} className="flex flex-wrap items-center gap-3 px-2 py-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/undangan/${inv.id}`} className="font-display text-lg hover:underline">
                      {inv.coupleName}
                    </Link>
                    <p className="text-[13px] text-muted">{reason}</p>
                  </div>
                  <form action={setInvitationStatus.bind(null, inv.id)}>
                    <input type="hidden" name="kind" value={action.kind} />
                    {action.days ? <input type="hidden" name="days" value={action.days} /> : null}
                    <button className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold hover:border-brass hover:text-brass">
                      {action.label}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle hint="Acara klien yang paling dekat.">Acara terdekat</CardTitle>
          {o.upcoming.length === 0 ? (
            <p className="text-[15px] text-muted">Belum ada acara terjadwal.</p>
          ) : (
            <ol className="grid gap-3">
              {o.upcoming.map((inv) => {
                const cd = dayCountdown(inv.eventAt);
                return (
                  <li key={inv.id}>
                    <Link
                      href={`/admin/undangan/${inv.id}`}
                      className="flex items-center gap-4 rounded-xl p-2 -m-2 hover:bg-ink/[0.03]"
                    >
                      <span
                        className={`grid w-16 shrink-0 place-items-center rounded-xl py-2 font-display text-lg font-semibold tabular-nums ${
                          cd?.soon ? "bg-brass text-white" : "bg-[#efe7d8] text-ink"
                        }`}
                      >
                        {cd?.label}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg">{inv.coupleName}</span>
                        <span className="text-[13px] text-muted">{shortDate(inv.eventAt)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>

      <div className="mb-5 mt-10 flex items-end justify-between">
        <h2 className="font-display text-2xl font-medium">Terbaru dibuat</h2>
        <Link href="/admin/undangan" className="text-sm font-semibold text-brass hover:underline">
          Lihat semua
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {o.rows.slice(0, 3).map((r) => (
          <InvitationCard key={r.id} inv={r} href={`/admin/undangan/${r.id}`} />
        ))}
      </div>
    </>
  );
}
