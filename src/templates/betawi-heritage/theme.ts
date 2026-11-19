import { defineAdatTheme } from "../adat/theme";

/**
 * Betawi Heritage: tema adat Premium ketiga.
 * Kertas krem, teks merah tua, aksen hijau dan kuning mustard khas Betawi.
 * Pemandangan pagi Jakarta (Monas di kejauhan, danau Setu Babakan dengan rumah kebaya,
 * sepasang ondel-ondel), pintu kayu hijau-kuning untuk Buka Palang Pintu, bunga mawar
 * merah, melati, dan cempaka. Ornamen: kembang kelapa, rumah kebaya, roti buaya,
 * motif gigi balang (dari tema Betawi Nauvite v1).
 * Aset: public/templates/betawi-heritage/ (diolah dengan scripts/olah-aset.mjs).
 *
 * Label berdialek Betawi perlu dicek sebelum rilis.
 */
export default defineAdatTheme({
  id: "betawi-heritage",
  palette: {
    paper: "#f9f1e2",
    ink: "#3d1f1a",
    muted: "#7b5d52",
    accent: "#4f8a5b",
    gold: "#b58a2a",
    cream: "#fdf6e8",
    photoBg: "#efdcc0",
  },
  labels: {
    open: "Buka Palang Pintu",
    heroKicker: "Ngitung Ari",
    couple: "Penganten",
    events: "Waktu ame Tempat",
    story: "Cerite Kite",
    gifts: "Tande Kasih",
    wishes: "Doa ame Ucapan",
    closingKicker: "Makasih Banyak",
  },
  vars: {
    // Kembang kelapa melebar seperti siger
    "--crown-h": "56px",
    // Monas tinggi di sisi kiri: lapisan dibuat lebih tinggi dan tidak dipaksa selebar layar.
    // Barisan pohonnya tertutup lapisan Setu Babakan, jadi yang terlihat hanya tugunya.
    "--mountain-scale": "2",
    "--mountain-scale-side": "1.6",
    "--mountain-size": "auto 100%",
    "--mountain-pos": "18% bottom",
  },
  scene: {
    greeting: "Selamet Dateng",
    kicker: "Undangan Kawinan",
  },
});
