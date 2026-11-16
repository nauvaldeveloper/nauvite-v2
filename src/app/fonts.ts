import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Huruf identitas Nauvite: Fraunces untuk judul (serif yang hangat dan nyaman dibaca),
 * Plus Jakarta Sans untuk teks. Dipakai landing page dan semua panel.
 */
export const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-panel" });
export const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
});
