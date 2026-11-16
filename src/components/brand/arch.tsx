import s from "./arch.module.css";

/**
 * Motif lengkung Nauvite (diambil dari lengkung di logo): dua garis gerbang
 * bertingkat. Bisa tergambar sendiri saat muncul (draw).
 */
export function ArchLines({
  className = "",
  color = "var(--color-gold)",
  draw = false,
}: {
  className?: string;
  color?: string;
  draw?: boolean;
}) {
  return (
    <svg viewBox="0 0 300 380" fill="none" className={`${draw ? s.draw : ""} ${className}`} aria-hidden="true">
      <path pathLength={1} d="M20 380V150a130 130 0 0 1 260 0v230" stroke={color} strokeWidth="1.6" />
      <path pathLength={1} d="M52 380V158a98 98 0 0 1 196 0v222" stroke={color} strokeOpacity=".4" strokeWidth="1" className={s.second} />
    </svg>
  );
}

/** Lengkung terbuka di bawah seperti di logo, untuk pembatas atau hiasan kecil. */
export function OpenArc({ className = "", color = "var(--color-gold)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 70" fill="none" className={className} aria-hidden="true">
      <path d="M12 66A50 50 0 1 1 108 66" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
