import { defineManifest } from "../manifest";

export default defineManifest({
  id: "senja-pantai",
  name: "Senja Pantai",
  category: "signature",
  tier: "basic",
  description:
    "Undangan bernuansa pantai saat matahari terbenam. Langit senja, ombak yang bergerak pelan, dan foto kalian yang terbit seperti matahari.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#f8f1e7", accent: "#c8613f", text: "#2a2f3a" },
  paletteSwatches: {
    jingga: { background: "#f8f1e7", accent: "#c8613f", text: "#2a2f3a" },
    lembayung: { background: "#f6f1f2", accent: "#85578a", text: "#2e2a3a" },
    toska: { background: "#f6f3ea", accent: "#2b7479", text: "#1f3435" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna",
      options: [
        { value: "jingga", label: "Jingga" },
        { value: "lembayung", label: "Lembayung" },
        { value: "toska", label: "Toska" },
      ],
      default: "jingga",
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
      key: "opening",
      type: "textarea",
      label: "Kalimat pembuka",
      help: "Pisahkan paragraf dengan baris kosong.",
      maxLength: 800,
      default:
        "Seperti senja yang selalu kembali setiap hari, kami ingin melangkah bersama untuk seterusnya. Dengan penuh syukur, kami mengundang Anda ke hari pernikahan kami.\n\nKehadiran dan doa restu Anda akan membuat hari itu semakin hangat.",
    },
    {
      key: "waves",
      type: "toggle",
      label: "Ombak bergerak",
      help: "Ombak di sampul, halaman pertama, dan penutup bergerak pelan.",
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
