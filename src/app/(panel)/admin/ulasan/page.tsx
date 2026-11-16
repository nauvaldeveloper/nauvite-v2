import type { Metadata } from "next";
import { Badge, Button, Card, CardTitle, PageHeader } from "@/components/ui";
import { ReviewForm, Stars } from "@/components/reviews/review-form";
import { shortDate } from "@/components/panel/format";
import { requireAdmin } from "@/lib/auth/dal";
import { createReviewByAdmin, deleteReview, setReviewStatus } from "@/lib/reviews/actions";
import { MIN_REVIEWS_SHOWN } from "@/lib/reviews/public";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ulasan | Admin Nauvite" };
// Selalu butuh data login, jadi tidak disiapkan lebih dulu (lihat layout admin).
export const instant = false;

const STATUS = {
  pending: { label: "Menunggu", tone: "amber" as const },
  approved: { label: "Tampil", tone: "green" as const },
  hidden: { label: "Disembunyikan", tone: "gray" as const },
};

export default async function ReviewsAdminPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, couple_name, city, rating, message, consent, status, source, created_at")
    .order("created_at", { ascending: false });
  const rows = data ?? [];
  const shown = rows.filter((r) => r.status === "approved" && r.consent).length;

  return (
    <>
      <PageHeader
        eyebrow={`${shown} ulasan tampil di landing page`}
        title="Ulasan"
        description={`Ulasan dari klien muncul di sini untuk disetujui. Bagian ulasan di landing page baru tampil kalau sudah ada minimal ${MIN_REVIEWS_SHOWN} ulasan yang disetujui.`}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid content-start gap-4">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/20 px-6 py-14 text-center">
              <p className="font-display text-2xl italic">Belum ada ulasan</p>
              <p className="mt-2 text-muted">Klien bisa menulis ulasan dari dasbor mereka, atau tambahkan ulasan klien lama di samping.</p>
            </div>
          ) : (
            rows.map((r) => {
              const st = STATUS[r.status as keyof typeof STATUS];
              const set = setReviewStatus.bind(null, r.id);
              return (
                <Card key={r.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Stars value={r.rating} />
                      <p className="mt-1 font-display text-xl">{r.couple_name}</p>
                      <p className="text-[13px] text-muted">
                        {[r.city, shortDate(r.created_at), r.source === "admin" ? "ditambahkan admin" : "dari dasbor klien"]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={st.tone}>{st.label}</Badge>
                      {!r.consent ? <Badge tone="red">Tidak diizinkan tampil</Badge> : null}
                    </div>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed">&ldquo;{r.message}&rdquo;</p>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                    {r.status !== "approved" ? (
                      <form action={set}>
                        <input type="hidden" name="status" value="approved" />
                        <Button variant="brass" disabled={!r.consent} title={r.consent ? undefined : "Klien tidak mengizinkan ulasan ini tampil"}>
                          Tampilkan
                        </Button>
                      </form>
                    ) : null}
                    {r.status !== "hidden" ? (
                      <form action={set}>
                        <input type="hidden" name="status" value="hidden" />
                        <Button variant="secondary">Sembunyikan</Button>
                      </form>
                    ) : null}
                    <form action={deleteReview.bind(null, r.id)}>
                      <Button variant="ghost" className="text-red-700">
                        Hapus
                      </Button>
                    </form>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <Card className="self-start">
          <CardTitle hint="Untuk ulasan klien v1 atau dari chat WhatsApp. Langsung tampil.">Tambah ulasan klien</CardTitle>
          <ReviewForm
            action={createReviewByAdmin}
            consentLabel="Klien sudah mengizinkan ulasannya ditampilkan di website."
            submitLabel="Tambah ulasan"
          />
        </Card>
      </div>
    </>
  );
}
