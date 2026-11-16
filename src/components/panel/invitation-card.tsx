import Link from "next/link";
import { Badge } from "@/components/ui";
import { effectiveStatus, shortDate, templateName } from "@/components/panel/format";
import { mediaUrl } from "@/lib/invitation/format";
import { getManifest } from "@/templates/registry";

const FALLBACK_SWATCH = { background: "#22372d", accent: "#e9dcc3", text: "#f3eee5" };

/** "H-12", "Hari ini", "Sudah lewat" untuk hari acara. */
export function dayCountdown(eventAt: string | null): { label: string; soon: boolean } | null {
  if (!eventAt) return null;
  const startOfDay = (d: Date) => {
    const wib = new Date(d.getTime() + 7 * 3600_000);
    return Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate());
  };
  const days = Math.round((startOfDay(new Date(eventAt)) - startOfDay(new Date())) / 86400_000);
  if (days === 0) return { label: "Hari ini", soon: true };
  if (days < 0) return { label: "Sudah lewat", soon: false };
  return { label: `H-${days}`, soon: days <= 14 };
}

/** Sisa masa aktif dalam hari (bisa negatif). null kalau tanpa batas. */
export function daysLeft(activeUntil: string | null): number | null {
  if (!activeUntil) return null;
  return Math.ceil((new Date(activeUntil).getTime() - Date.now()) / 86400_000);
}

/**
 * Potongan visual undangan: foto sampul kalau ada, kalau tidak warna khas tema.
 * Nama pasangan ditulis di atasnya dengan huruf serif.
 */
export function InvitationVisual({
  templateId,
  coverImage,
  coupleName,
  className = "",
  size = "md",
}: {
  templateId: string;
  coverImage: string | null;
  coupleName: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const swatch = getManifest(templateId)?.swatch ?? FALLBACK_SWATCH;
  const img = mediaUrl(coverImage);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: swatch.background, color: swatch.text }}
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
      ) : (
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(120% 80% at 100% 0%, ${swatch.accent}55, transparent 60%), radial-gradient(90% 70% at 0% 100%, ${swatch.accent}30, transparent 60%)`,
          }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, transparent 30%, ${img ? "rgb(10 14 12 / 0.72)" : "transparent"} 100%)` }}
      />
      <div className={`absolute inset-x-0 bottom-0 ${size === "lg" ? "p-6" : "p-4"}`}>
        <span
          className="mb-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: `${swatch.accent}`, color: swatch.background }}
        >
          {templateName(templateId)}
        </span>
        <p
          className={`font-display font-medium italic leading-tight ${size === "lg" ? "text-4xl sm:text-5xl" : "text-[26px]"}`}
          style={{ color: img ? "#fbf7ef" : swatch.text }}
        >
          {coupleName}
        </p>
      </div>
    </div>
  );
}

export type CardInvitation = {
  id: string;
  slug: string;
  templateId: string;
  status: string;
  activeUntil: string | null;
  coupleName: string;
  coverImage: string | null;
  eventAt: string | null;
};

/** Kartu undangan untuk daftar di panel. */
export function InvitationCard({
  inv,
  href,
  meta,
}: {
  inv: CardInvitation;
  href: string;
  meta?: string | null;
}) {
  const st = effectiveStatus(inv.status, inv.activeUntil);
  const countdown = dayCountdown(inv.eventAt);
  const left = inv.status === "active" ? daysLeft(inv.activeUntil) : null;

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-line bg-card shadow-[0_1px_2px_rgb(23_38_31/0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgb(23_38_31/0.25)]"
    >
      <InvitationVisual
        templateId={inv.templateId}
        coverImage={inv.coverImage}
        coupleName={inv.coupleName}
        className="aspect-[16/10]"
      />
      <div className="grid gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={st.tone}>{st.label}</Badge>
          {countdown ? (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${
                countdown.soon ? "bg-brass text-white" : "bg-ink/[0.06] text-ink/70"
              }`}
            >
              {countdown.label}
            </span>
          ) : null}
        </div>
        <div className="flex items-end justify-between gap-2 text-[13px] text-muted">
          <span className="truncate">/{inv.slug}</span>
          <span className={`shrink-0 ${left !== null && left <= 14 && left >= 0 ? "font-semibold text-[#7a5414]" : ""}`}>
            {inv.status === "active"
              ? left === null
                ? "Tanpa batas"
                : left < 0
                  ? `Berakhir ${shortDate(inv.activeUntil)}`
                  : `Sisa ${left} hari`
              : inv.status === "draft"
                ? "Menunggu bayar"
                : "Nonaktif"}
          </span>
        </div>
        {meta ? <p className="truncate border-t border-line pt-3 text-[13px] text-muted">{meta}</p> : null}
      </div>
    </Link>
  );
}
