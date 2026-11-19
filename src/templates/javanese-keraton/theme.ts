import { defineAdatTheme } from "../adat/theme";

/**
 * Javanese Keraton: tema adat Premium kedua.
 * Kertas gading, teks cokelat sogan, aksen emas. Pemandangan senja Jawa Tengah
 * (Merapi dan Merbabu, sawah terasering, wayang kulit Rama dan Shinta), pintu gebyok
 * ukir Jepara, bunga melati, kantil, dan mawar merah. Ornamen: gunungan, joglo,
 * keris, janur, batik kawung (dari tema Jawa Nauvite v1).
 * Aset: public/templates/javanese-keraton/ (diolah dengan scripts/olah-aset.mjs).
 *
 * Label bahasa Jawa (krama) perlu dicek penutur asli sebelum rilis.
 */
export default defineAdatTheme({
  id: "javanese-keraton",
  palette: {
    paper: "#f7efe1",
    ink: "#3a2418",
    muted: "#7a6250",
    accent: "#9c7a3c",
    gold: "#a8823a",
    cream: "#fbf3e4",
    photoBg: "#ead9c0",
  },
  labels: {
    open: "Buka Lawang",
    heroKicker: "Ngetang Dinten",
    couple: "Temanten",
    events: "Wekdal lan Papan",
    story: "Lelampahan Tresna",
    gifts: "Tandha Katresnan",
    wishes: "Donga lan Pangestu",
    closingKicker: "Matur Nuwun",
  },
  vars: {
    // Gunungan bentuknya tinggi, jadi mahkota dibuat sedikit lebih tinggi dari siger
    "--crown-h": "70px",
    // Di desktop kaki gunung diturunkan supaya tertutup sawah
    "--mountain-shift-side": "-6%",
  },
  scene: {
    greeting: "Sugeng Rawuh",
    kicker: "Pawiwahan",
  },
});
