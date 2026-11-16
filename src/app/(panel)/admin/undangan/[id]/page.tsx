import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Card, CardTitle, Input, Notice } from "@/components/ui";
import { IconArrowLeft, IconExternal } from "@/components/invitation/icons";
import { GuestLinkTool } from "@/components/panel/guest-link";
import { InvitationVisual, dayCountdown, daysLeft } from "@/components/panel/invitation-card";
import { PhonePreview } from "@/components/panel/phone-preview";
import { effectiveStatus, shortDate, templateName } from "@/components/panel/format";
import { deleteInvitation, setInvitationStatus } from "@/lib/admin/actions";
import { getAccounts, getInvitation, getWishStats, listPartners } from "@/lib/admin/data";
import { parseContent } from "@/lib/invitation/content";
import { mainEventDate } from "@/lib/invitation/format";
import { CATEGORY_LABELS } from "@/templates/manifest";
import { TEMPLATES } from "@/templates/registry";
import { AccountPanel, MetaForm } from "./forms";

export const metadata: Metadata = { title: "Detail undangan | Admin Nauvite" };
// Selalu butuh data login, jadi tidak disiapkan lebih dulu (lihat layout admin).
export const instant = false;

export default async function InvitationDetail({ params, searchParams }: PageProps<"/admin/undangan/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const inv = await getInvitation(id);
  if (!inv) notFound();

  const [accounts, partners, stats] = await Promise.all([
    getAccounts([inv.owner_id]),
    listPartners(),
    getWishStats(inv.id),
  ]);
  const owner = inv.owner_id ? (accounts.get(inv.owner_id) ?? null) : null;
  const st = effectiveStatus(inv.status, inv.active_until);
  const content = parseContent(inv.content);
  const event = mainEventDate(content);
  const countdown = dayCountdown(event?.toISOString() ?? null);
  const left = inv.status === "active" ? daysLeft(inv.active_until) : null;
  const setStatus = setInvitationStatus.bind(null, inv.id);
  const remove = deleteInvitation.bind(null, inv.id);

  return (
    <>
      <Link href="/admin/undangan" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <IconArrowLeft /> Semua undangan
      </Link>

      <div className="relative mb-8 overflow-hidden rounded-3xl">
        <InvitationVisual
          templateId={inv.template_id}
          coverImage={content.coverImage ?? content.gallery[0] ?? null}
          coupleName={inv.coupleName}
          size="lg"
          className="min-h-[260px] sm:min-h-[300px]"
        />
        <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2">
          <span className="rounded-full bg-white/90 px-1 py-0.5 backdrop-blur">
            <Badge tone={st.tone}>{st.label}</Badge>
          </span>
          {countdown ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
              Acara {countdown.label}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-[12px] font-semibold text-muted">Alamat</dt>
            <dd className="font-semibold">/{inv.slug}</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold text-muted">Tema</dt>
            <dd className="font-semibold">{templateName(inv.template_id)}</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold text-muted">Masa aktif</dt>
            <dd className="font-semibold">
              {inv.status === "active"
                ? left === null
                  ? "Tanpa batas"
                  : left < 0
                    ? `Habis ${shortDate(inv.active_until)}`
                    : `Sampai ${shortDate(inv.active_until)} (${left} hari)`
                : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold text-muted">Dibuat</dt>
            <dd className="font-semibold">{shortDate(inv.created_at)}</dd>
          </div>
        </dl>
        <div className="ml-auto flex flex-wrap gap-2">
          <a
            href={`/${inv.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold hover:border-ink/25"
          >
            <IconExternal /> Buka link tamu
          </a>
          <Link
            href={`/editor/${inv.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-[#f6f1e7] hover:bg-ink-2"
          >
            Ubah isi undangan
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="grid content-start gap-5">
          <Card>
            <CardTitle hint="Aktifkan setelah klien membayar lewat WhatsApp.">Status dan masa aktif</CardTitle>
            <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="mb-2 text-[13px] font-semibold text-muted">
                  {inv.status === "active" ? "Perpanjang" : "Aktifkan"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    [30, "30 hari"],
                    [90, "90 hari"],
                    [180, "6 bulan"],
                    [365, "1 tahun"],
                  ].map(([days, label]) => (
                    <form key={days} action={setStatus}>
                      <input type="hidden" name="kind" value="extend" />
                      <input type="hidden" name="days" value={days} />
                      <Button variant={days === 90 ? "brass" : "secondary"}>+ {label}</Button>
                    </form>
                  ))}
                </div>
                <form action={setStatus} className="mt-4 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="kind" value="until" />
                  <label htmlFor="until" className="text-sm text-muted">
                    atau sampai tanggal
                  </label>
                  <div className="w-44">
                    <Input id="until" name="date" type="date" required />
                  </div>
                  <Button variant="secondary">Simpan</Button>
                </form>
              </div>
              <div className="flex flex-wrap content-start gap-2 border-t border-line pt-4 sm:flex-col sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                {inv.status !== "inactive" ? (
                  <form action={setStatus}>
                    <input type="hidden" name="kind" value="deactivate" />
                    <Button variant="danger" className="w-full">
                      Nonaktifkan
                    </Button>
                  </form>
                ) : null}
                {inv.status !== "draft" ? (
                  <form action={setStatus}>
                    <input type="hidden" name="kind" value="draft" />
                    <Button variant="ghost" className="w-full">
                      Jadikan draf
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardTitle>Akun klien</CardTitle>
              <AccountPanel
                invitationId={inv.id}
                slug={inv.slug}
                owner={
                  owner
                    ? { id: owner.id, login: owner.login, whatsapp: owner.whatsapp, lastSignIn: owner.lastSignIn }
                    : null
                }
              />
            </Card>

            <Card>
              <CardTitle
                hint="Rekap dari form ucapan di undangan."
                aside={
                  <Link href={`/rsvp/${inv.id}`} className="shrink-0 text-sm font-semibold text-brass hover:underline">
                    Lihat semua
                  </Link>
                }
              >
                Ucapan dan RSVP
              </CardTitle>
              <dl className="grid grid-cols-2 gap-3">
                {[
                  ["Ucapan", stats.total],
                  ["Hadir", stats.hadir],
                  ["Orang hadir", stats.tamuHadir],
                  ["Tidak hadir", stats.tidakHadir],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-[#f3eee5] p-3.5">
                    <dt className="text-[12px] font-semibold text-muted">{label}</dt>
                    <dd className="mt-1 font-display text-3xl font-medium tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
              {stats.belumPasti ? (
                <p className="mt-3 text-[13px] text-muted">{stats.belumPasti} tamu belum pasti.</p>
              ) : null}
            </Card>
          </div>

          <Card>
            <CardTitle hint="Ketik nama tamu, link jadi otomatis.">Link untuk tamu</CardTitle>
            <GuestLinkTool slug={inv.slug} />
          </Card>

          <Card>
            <CardTitle>Data undangan</CardTitle>
            <MetaForm
              invitationId={inv.id}
              initial={{
                slug: inv.slug,
                templateId: inv.template_id,
                partnerId: inv.partner_id ?? "",
                adminNote: inv.admin_note ?? "",
              }}
              templates={TEMPLATES.map((t) => ({ id: t.id, name: t.name, category: `${CATEGORY_LABELS[t.category]}${t.tier === "premium" ? ", Premium" : ""}` }))}
              partners={partners.map((p) => ({ id: p.id, name: p.business_name ?? "Mitra" }))}
            />
          </Card>

          <Card className="border-[#efcfca]">
            <CardTitle hint="Undangan, ucapan, dan foto terhapus permanen. Akun klien tidak ikut terhapus.">
              Hapus undangan
            </CardTitle>
            {sp.hapus === "salah" ? (
              <div className="mb-3">
                <Notice tone="error">Konfirmasi tidak cocok, undangan tidak dihapus.</Notice>
              </div>
            ) : null}
            <form action={remove} className="flex flex-wrap items-center gap-2">
              <label htmlFor="confirm" className="w-full text-sm text-muted">
                Ketik <strong className="text-ink">{inv.slug}</strong> untuk konfirmasi.
              </label>
              <div className="w-full sm:w-64">
                <Input id="confirm" name="confirm" placeholder={inv.slug} autoComplete="off" required />
              </div>
              <Button variant="danger">Hapus permanen</Button>
            </form>
          </Card>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-8">
            <PhonePreview invitationId={inv.id} />
          </div>
        </aside>
      </div>
    </>
  );
}
