import { defineManifest } from "../manifest";

export default defineManifest({
  id: "piringan-hitam",
  name: "Piringan Hitam",
  category: "signature",
  tier: "hemat",
  description:
    "Undangan tanpa foto bergaya album 70-an: piringan keluar dari sampulnya lalu berputar, akad jadi Sisi A, resepsi jadi Sisi B, cerita jadi daftar lagu, dan ucapan jadi titip salam.",
  badges: ["baru"],
  withPhoto: false,
  swatch: { background: "#d2502c", accent: "#f0b23e", text: "#fdeed2" },
  paletteSwatches: {
    senja: { background: "#d2502c", accent: "#f0b23e", text: "#fdeed2" },
    laguna: { background: "#0f6466", accent: "#ef8354", text: "#f4f1de" },
    anggrek: { background: "#6a2c70", accent: "#f08a5d", text: "#fdeaf0" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna album",
      options: [
        { value: "senja", label: "Jingga senja" },
        { value: "laguna", label: "Hijau laguna" },
        { value: "anggrek", label: "Ungu anggrek" },
      ],
      default: "senja",
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
      key: "notes",
      type: "textarea",
      label: "Catatan album",
      help: "Kalimat pembuka. Pisahkan paragraf dengan baris kosong.",
      maxLength: 800,
      default:
        "Setiap pasangan punya lagunya sendiri. Lagu kami dimulai dari pertemuan sederhana, dan sekarang sampai di bagian yang paling kami tunggu.\n\nKami akan menikah, dan ingin Anda ada di sana saat lagunya diputar.",
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
