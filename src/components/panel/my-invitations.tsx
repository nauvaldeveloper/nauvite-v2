import Link from "next/link";
import { Badge, ButtonLink, Card, CardTitle } from "@/components/ui";
import { IconExternal } from "@/components/invitation/icons";
import { GuestLinkTool } from "@/components/panel/guest-link";
import { InvitationCard, InvitationVisual, dayCountdown, daysLeft, hoursLeft } from "@/components/panel/invitation-card";
import { PhonePreview } from "@/components/panel/phone-preview";
import { effectiveStatus, shortDate, templateName } from "@/components/panel/format";
import { ReviewForm } from "@/components/reviews/review-form";
import { parseContent } from "@/lib/invitation/content";
import { submitReview } from "@/lib/reviews/actions";
import { formatLongDate, mainEventDate } from "@/lib/invitation/format";
import { getSiteSettings, rupiah, waLink, type SiteSettings } from "@/lib/site";
import { getManifest } from "@/templates/registry";
import { createClient } from "@/lib/supabase/server";

/**
 * Undangan milik user yang login (klien: miliknya, mitra: klien-kliennya).
 * Penyaringan dilakukan aturan RLS di database, bukan di kode ini.
 */
async function loadMine() {
  const supabase = await createClient();
  const [{ data }, { data: wishes }, { data: reviews }] = await Promise.all([
    supabase
      .from("invitations")
      .select("id, slug, template_id, status, active_until, trial_until, content")
      .order("created_at", { ascending: false }),
    supabase.from("wishes").select("invitation_id, attendance, guest_count"),
    // RLS: penulis hanya melihat ulasannya sendiri (plus ulasan publik yang sudah tampil)
    supabase.from("reviews").select("invitation_id, status, author_id"),
  ]);
  // Dihitung di database karena daftar tamu bisa ribuan baris.
  const guestCounts = new Map(
    await Promise.all(
      (data ?? []).map(async (r) => {
        const base = () => supabase.from("guests").select("id", { count: "exact", head: true }).eq("invitation_id", r.id);
        const [all, sent] = await Promise.all([base(), base().not("sent_at", "is", null)]);
        return [r.id, { guests: all.count ?? 0, sent: sent.count ?? 0 }] as const;
      }),
    ),
  );

  return (data ?? []).map((r) => {
    const content = parseContent(r.content);
    const event = mainEventDate(content);
    const g = content.couple.groom.name;
    const b = content.couple.bride.name;
    const mine = (wishes ?? []).filter((w) => w.invitation_id === r.id);
    const hadir = mine.filter((w) => w.attendance === "hadir");
    return {
      id: r.id,
      slug: r.slug,
      templateId: r.template_id,
      status: r.status,
      activeUntil: r.active_until,
      trialUntil: r.trial_until,
      coupleName: g || b ? `${g || "?"} & ${b || "?"}` : r.slug,
      coverImage: content.coverImage ?? content.gallery[0] ?? null,
      eventAt: event ? event.toISOString() : null,
      event,
      ...(guestCounts.get(r.id) ?? { guests: 0, sent: 0 }),
      review: (reviews ?? []).find((rv) => rv.invitation_id === r.id && rv.author_id) ?? null,
      stats: {
        total: mine.length,
        hadir: hadir.length,
        orang: hadir.reduce((n, w) => n + w.guest_count, 0),
        tidak: mine.filter((w) => w.attendance === "tidak_hadir").length,
      },
    };
  });
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/20 px-6 py-16 text-center">
      <p className="font-display text-2xl italic">Belum ada undangan</p>
      <p className="mx-auto mt-2 max-w-md text-muted">{text}</p>
    </div>
  );
}

/** Undangan uji coba: sisa waktu, link contoh, dan tombol menerbitkan. */
function TrialNotice({
  slug,
  templateId,
  coupleName,
  until,
  site,
}: {
  slug: string;
  templateId: string;
  coupleName: string;
  until: string;
  site: SiteSettings;
}) {
  const hours = hoursLeft(until);
  const tier = getManifest(templateId)?.tier ?? "basic";
  const price = { hemat: site.priceHemat, basic: site.priceBasic, premium: site.pricePremium }[tier];
  const message = `Halo, saya mau menerbitkan undangan ${coupleName} (${slug}), tema ${templateName(templateId)}.`;
  return (
    <div className="grid gap-4 rounded-2xl border border-[#ead9b4] bg-[#fbf3e1] px-5 py-5 text-[15px] text-[#5e4410]">
      <div>
        <p className="font-display text-2xl font-medium">{hours > 0 ? `Uji coba, sisa ${hours} jam` : "Uji coba sudah selesai"}</p>
        <p className="mt-1">
          {hours > 0
            ? "Link undangan sudah bisa dibuka dengan tanda contoh. Terbitkan supaya bisa disebar ke tamu."
            : "Link undangan sudah tidak bisa dibuka, tapi isinya masih tersimpan dan masih bisa diubah."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <a
          href={waLink(site.whatsapp, message)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-ink px-5 py-3 font-semibold text-[#f6f1e7] hover:bg-ink-2"
        >
          Terbitkan, {rupiah(price)}
        </a>
        {hours > 0 ? (
          <a href={`/${slug}`} target="_blank" rel="noreferrer" className="rounded-full border border-[#5e4410]/30 px-5 py-3 font-semibold hover:border-[#5e4410]/60">
            Lihat contohnya
          </a>
        ) : null}
      </div>
    </div>
  );
}

/** Dasbor klien: undangan tampil besar, hitung mundur, link tamu, RSVP, pratinjau HP. */
export async function ClientInvitations() {
  const rows = await loadMine();
  const site = await getSiteSettings();
  if (rows.length === 0) return <Empty text="Akun ini belum punya undangan. Hubungi admin Nauvite lewat WhatsApp." />;

  return (
    <div className="grid gap-12">
      {rows.map((r) => {
        const st = effectiveStatus(r.status, r.activeUntil, r.trialUntil);
        const cd = dayCountdown(r.eventAt);
        const left = r.status === "active" ? daysLeft(r.activeUntil) : null;
        return (
          <section key={r.id} className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="grid content-start gap-5">
              <div className="relative overflow-hidden rounded-3xl">
                <InvitationVisual
                  templateId={r.templateId}
                  coverImage={r.coverImage}
                  coupleName={r.coupleName}
                  size="lg"
                  className="min-h-[280px]"
                />
                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-1 py-0.5 backdrop-blur">
                  <Badge tone={st.tone}>{st.label}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-card px-5 py-4">
                <p className="min-w-0 flex-1 text-[15px]">
                  <span className="font-semibold">Lengkapi undangan kamu.</span>{" "}
                  <span className="text-muted">Nama, acara, foto, lagu, dan rekening bisa diubah kapan saja.</span>
                </p>
                <ButtonLink href={`/editor/${r.id}`} variant="brass">
                  Ubah isi undangan
                </ButtonLink>
              </div>

              {r.status === "draft" && r.trialUntil ? (
                <TrialNotice slug={r.slug} templateId={r.templateId} coupleName={r.coupleName} until={r.trialUntil} site={site} />
              ) : r.status === "draft" ? (
                <div className="rounded-2xl border border-[#ead9b4] bg-[#fbf3e1] px-5 py-4 text-[15px] text-[#5e4410]">
                  Undangan masih draf dan belum bisa dibuka tamu. Setelah pembayaran dikonfirmasi lewat WhatsApp, admin
                  akan mengaktifkannya.
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-ink p-5 text-[#f3eee5]">
                  <p className="text-[13px] font-semibold text-[#c9d2cc]">Menuju hari H</p>
                  <p className="mt-2 font-display text-5xl font-medium tabular-nums">{cd?.label ?? "-"}</p>
                  <p className="mt-1 text-[12px] text-[#9aa79f]">{r.event ? formatLongDate(r.event) : "Tanggal belum diisi"}</p>
                </div>
                <Link
                  href={`/rsvp/${r.id}`}
                  className="group rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brass"
                >
                  <p className="text-[13px] font-semibold text-muted">Konfirmasi hadir</p>
                  <p className="mt-2 font-display text-5xl font-medium tabular-nums">{r.stats.orang}</p>
                  <p className="mt-1 text-[12px] text-muted">
                    orang dari {r.stats.hadir} ucapan.{" "}
                    <span className="font-semibold text-brass group-hover:underline">Lihat semua</span>
                  </p>
                </Link>
                <div className="rounded-2xl border border-line bg-card p-5">
                  <p className="text-[13px] font-semibold text-muted">Masa aktif</p>
                  <p className="mt-2 font-display text-5xl font-medium tabular-nums">
                    {r.status === "active" ? (left === null ? "∞" : Math.max(left, 0)) : "-"}
                  </p>
                  <p className="mt-1 text-[12px] text-muted">
                    {r.status === "active"
                      ? left === null
                        ? "tanpa batas"
                        : `hari lagi, sampai ${shortDate(r.activeUntil)}`
                      : "belum aktif"}
                  </p>
                </div>
              </div>

              <Card>
                <CardTitle
                  hint="Simpan daftar tamu supaya ketahuan siapa yang sudah dikirimi, atau buat satu link cepat di bawah."
                  aside={
                    <a
                      href={`/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brass hover:underline"
                    >
                      <IconExternal /> Buka
                    </a>
                  }
                >
                  Sebar undangan
                </CardTitle>
                <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-[#f3eee5]">
                  <p className="min-w-0 flex-1 basis-52 text-[15px]">
                    <span className="font-semibold">{r.guests ? `${r.sent} dari ${r.guests} undangan terkirim` : "Daftar tamu masih kosong"}</span>
                  </p>
                  <ButtonLink href={`/tamu/${r.id}`} variant="brass">
                    Buka daftar tamu
                  </ButtonLink>
                </div>
                <GuestLinkTool slug={r.slug} />
              </Card>

              {r.status === "draft" ? null : (
              <Card>
                <CardTitle hint="Ulasan kalian membantu pasangan lain memilih undangan.">Ulasan untuk Nauvite</CardTitle>
                {r.review ? (
                  <p className="rounded-xl bg-[#ecf5ee] px-4 py-3 text-[15px] text-[#1d4a30]">
                    {r.review.status === "approved"
                      ? "Terima kasih! Ulasan kalian sudah tampil di website Nauvite."
                      : "Terima kasih! Ulasan kalian sudah terkirim dan sedang ditinjau admin."}
                  </p>
                ) : (
                  <ReviewForm
                    action={submitReview.bind(null, r.id)}
                    defaultCoupleName={r.coupleName}
                    consentLabel="Boleh ditampilkan di website Nauvite."
                  />
                )}
              </Card>
              )}

              <p className="text-[13px] text-muted">Tema {templateName(r.templateId)}.</p>
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-8">
                <PhonePreview invitationId={r.id} />
              </div>
            </aside>
          </section>
        );
      })}
    </div>
  );
}

/** Dasbor mitra: semua undangan klien dalam bentuk kartu + ringkasan. */
export async function PartnerInvitations() {
  const rows = await loadMine();
  if (rows.length === 0) {
    return <Empty text="Belum ada undangan klien. Hubungi admin Nauvite untuk membuat undangan pertama." />;
  }
  const active = rows.filter((r) => effectiveStatus(r.status, r.activeUntil).label === "Aktif").length;
  const guests = rows.reduce((n, r) => n + r.stats.orang, 0);

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl bg-ink p-5 text-[#f3eee5]">
          <p className="text-[13px] font-semibold text-[#c9d2cc]">Undangan klien</p>
          <p className="mt-2 font-display text-5xl font-medium tabular-nums">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="text-[13px] font-semibold text-muted">Sedang aktif</p>
          <p className="mt-2 font-display text-5xl font-medium tabular-nums">{active}</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-line bg-card p-5 lg:col-span-1">
          <p className="text-[13px] font-semibold text-muted">Total tamu konfirmasi hadir</p>
          <p className="mt-2 font-display text-5xl font-medium tabular-nums">{guests}</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <div key={r.id} className="grid gap-2">
            <InvitationCard inv={r} href={`/editor/${r.id}`} meta={`${r.stats.orang} orang hadir dari ${r.stats.total} ucapan`} />
            <div className="flex gap-2 px-1 text-[13px] font-semibold">
              <Link href={`/editor/${r.id}`} className="rounded-full px-3 py-1.5 text-ink hover:bg-ink/5">
                Ubah isi
              </Link>
              <Link href={`/rsvp/${r.id}`} className="rounded-full px-3 py-1.5 text-brass hover:bg-ink/5">
                Ucapan dan RSVP
              </Link>
              <Link href={`/tamu/${r.id}`} className="rounded-full px-3 py-1.5 text-brass hover:bg-ink/5">
                Daftar tamu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
