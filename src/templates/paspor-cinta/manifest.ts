import { defineManifest } from "../manifest";

export default defineManifest({
  id: "paspor-cinta",
  name: "Paspor Cinta",
  category: "signature",
  tier: "basic",
  description:
    "Undangan bertema perjalanan. Paspor kulit yang terbuka, halaman data dengan foto kalian, stempel imigrasi, dan boarding pass untuk setiap acara.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#efe8da", accent: "#1f2f4f", text: "#22262e" },
  paletteSwatches: {
    biru: { background: "#efe8da", accent: "#1f2f4f", text: "#22262e" },
    merah: { background: "#f1e7df", accent: "#6b1d2a", text: "#2b2224" },
    hijau: { background: "#ebeadb", accent: "#1f4a3d", text: "#1f2a25" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna paspor",
      options: [
        { value: "biru", label: "Biru" },
        { value: "merah", label: "Merah" },
        { value: "hijau", label: "Hijau" },
      ],
      default: "biru",
    },
    {
      key: "greeting",
      type: "select",
      label: "Salam pembuka",
      options: [
        { value: "umum", label: "Umum" },
        { value: "islami", label: "Islami" },
      ],
      default: "umum",
    },
    {
      key: "destination",
      type: "text",
      label: "Tujuan di halaman paspor",
      help: "Isi kolom Tujuan di halaman data paspor, mis. Selamanya bersama.",
      maxLength: 30,
      default: "Selamanya bersama",
    },
    {
      key: "opening",
      type: "textarea",
      label: "Kalimat pembuka",
      help: "Pisahkan paragraf dengan baris kosong.",
      maxLength: 800,
      default:
        "Setelah perjalanan panjang mengenal satu sama lain, kami siap berangkat ke tujuan berikutnya: hidup bersama sebagai suami dan istri.\n\nKami ingin Anda ikut dalam penerbangan bahagia ini. Kehadiran dan doa restu Anda adalah bekal terbaik bagi kami.",
    },
    {
      key: "autoScroll",
      type: "toggle",
      label: "Gulir otomatis",
      help: "Undangan berjalan pelan sendiri setelah dibuka. Tamu bisa menghentikannya kapan saja.",
      default: true,
    },
  ],
});
