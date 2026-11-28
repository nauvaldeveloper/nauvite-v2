import { defineManifest } from "../manifest";

export default defineManifest({
  id: "lengkung-boho",
  name: "Lengkung Boho",
  category: "signature",
  tier: "basic",
  description:
    "Undangan bergaya boho modern dengan warna tanah. Foto kalian tampil dalam bingkai lengkung, ditemani matahari terbit dan pelangi boho yang bergerak pelan.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#f3e9dc", accent: "#b5603b", text: "#3d2b22" },
  paletteSwatches: {
    terakota: { background: "#f3e9dc", accent: "#b5603b", text: "#3d2b22" },
    zaitun: { background: "#eef0e4", accent: "#636b3f", text: "#2d3121" },
    mawar: { background: "#f6ebe6", accent: "#a8625b", text: "#3e2826" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna",
      options: [
        { value: "terakota", label: "Terakota" },
        { value: "zaitun", label: "Zaitun" },
        { value: "mawar", label: "Mawar" },
      ],
      default: "terakota",
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
        "Dengan penuh syukur, kami ingin berbagi kabar bahagia. Kami akan memulai perjalanan baru sebagai suami dan istri.\n\nKehadiran dan doa restu Anda akan menjadi hadiah yang sangat berarti bagi kami.",
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
