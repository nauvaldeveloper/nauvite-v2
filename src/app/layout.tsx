import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Dipakai untuk membuat alamat lengkap gambar preview (OG). Isi di .env / Vercel.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Nauvite",
  description: "Undangan pernikahan digital.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
