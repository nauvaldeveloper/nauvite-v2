import { display, jakarta } from "../fonts";

/** Tata letak halaman publik Nauvite (landing page). */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div
      className={`${jakarta.variable} ${display.variable} min-h-screen bg-[#f3eee5] text-[#17261f] antialiased`}
      style={{ fontFamily: "var(--font-panel), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
