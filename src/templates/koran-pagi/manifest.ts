import { defineManifest } from "../manifest";

export default defineManifest({
  id: "koran-pagi",
  name: "Koran Pagi",
  category: "signature",
  tier: "hemat",
  description:
    "Undangan tanpa foto berbentuk koran: pernikahan kalian jadi berita utama, lengkap dengan agenda, iklan baris, surat pembaca, dan teka-teki silang dari nama kalian.",
  badges: ["baru"],
  withPhoto: false,
  swatch: { background: "#7d2a22", accent: "#26231f", text: "#f1ece0" },
  paletteSwatches: {
    klasik: { background: "#7d2a22", accent: "#26231f", text: "#f1ece0" },
    salem: { background: "#0f4f55", accent: "#2b2320", text: "#f8dfcf" },
    melati: { background: "#23513a", accent: "#b9822b", text: "#eaf0e2" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna koran",
      options: [
        { value: "klasik", label: "Hitam dan merah" },
        { value: "salem", label: "Salem dan hijau laut" },
        { value: "melati", label: "Hijau melati" },
      ],
      default: "klasik",
    },
    { key: "masthead", type: "text", label: "Nama koran", help: "Boleh diganti sesuai selera.", maxLength: 24, default: "Kabar Bahagia" },
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
      key: "lead",
      type: "textarea",
      label: "Isi berita utama",
      help: "Pisahkan paragraf dengan baris kosong.",
      maxLength: 900,
      default:
        "Kabar yang ditunggu keluarga dan sahabat akhirnya tiba. Setelah melewati perjalanan bersama, keduanya memutuskan untuk menikah.\n\nKedua keluarga mengundang Anda hadir dan menyaksikan hari itu. Datanglah dengan doa terbaik, karena itulah hadiah yang paling mereka tunggu.",
    },
    {
      key: "crossword",
      type: "toggle",
      label: "Teka-teki silang",
      help: "Dibuat otomatis dari nama kalian, hari, dan bulan pernikahan.",
      default: true,
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
