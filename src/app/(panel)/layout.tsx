import { display, jakarta } from "../fonts";

/**
 * Tata letak dasar halaman masuk dan semua panel (admin, klien, mitra).
 * Warna: hijau tinta, kertas krem, aksen kuningan. Judul pakai serif Fraunces.
 */
export default function PanelLayout({ children }: LayoutProps<"/">) {
  return (
    <div
      className={`${jakarta.variable} ${display.variable} min-h-screen bg-[#f3eee5] text-[#17261f] antialiased`}
      style={{ fontFamily: "var(--font-panel), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
