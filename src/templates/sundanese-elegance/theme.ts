import { defineAdatTheme } from "../adat/theme";

/**
 * Sundanese Elegance: tema adat Premium pertama.
 * Kertas krem hangat, teks cokelat kayu, aksen hijau teh dan emas. Pemandangan
 * Pasundan berlapis (langit fajar, Tangkuban Parahu, kebun teh, wayang golek),
 * pintu kayu berukir untuk Buka Panto, siger, atap julang ngapak, kujang, dan bilik.
 * Aset: public/templates/sundanese-elegance/ (diolah dengan scripts/olah-aset.mjs),
 * ornamen vektor di ornamen/ (dari tema Sunda Nauvite v1).
 *
 * Label bahasa Sunda perlu dicek penutur asli sebelum rilis. Aksara sengaja tidak dipakai.
 */
export default defineAdatTheme({
  id: "sundanese-elegance",
  palette: {
    paper: "#f8f0de",
    ink: "#3b2a1c",
    muted: "#7a6852",
    accent: "#8aa36b",
    gold: "#a87b3a",
    cream: "#fbf4e6",
    photoBg: "#eadcc4",
  },
  labels: {
    open: "Buka Panto",
    heroKicker: "Ngitung Poé",
    couple: "Nu Badé Nikah",
    events: "Waktos sareng Tempat",
    story: "Carita Urang",
    gifts: "Tanda Kanyaah",
    wishes: "Du'a sareng Pangdu'a",
    closingKicker: "Hatur Nuhun",
  },
  scene: {
    greeting: "Sampurasun",
    kicker: "Uleman Nikah",
  },
});
