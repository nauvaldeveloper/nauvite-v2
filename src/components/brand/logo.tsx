/**
 * Logo Nauvite: huruf N di dalam lengkung (logo asli v1), plus nama merek.
 * Warna logo: "emas" untuk latar gelap, "gelap" untuk latar terang.
 */
export function Logo({
  tone = "emas",
  size = 34,
  wordmark = true,
  className = "",
  textClassName = "",
}: {
  tone?: "emas" | "gelap" | "terang";
  size?: number;
  wordmark?: boolean;
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/brand/logo-${tone}.webp`} alt={wordmark ? "" : "Nauvite"} width={size} height={size} style={{ width: size, height: "auto" }} />
      {wordmark ? (
        <span className={`font-display text-[24px] font-medium leading-none tracking-tight ${textClassName}`}>Nauvite</span>
      ) : null}
    </span>
  );
}
