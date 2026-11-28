import { defineManifest } from "../manifest";

export default defineManifest({
  id: "galeri-seni",
  name: "Galeri Seni",
  category: "signature",
  tier: "basic",
  description:
    "Undangan bergaya pameran seni. Foto kalian dipajang sebagai lukisan berbingkai emas di dinding galeri, lengkap dengan lampu sorot dan plakat museum.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#ebe5db", accent: "#8c6a2f", text: "#2a2622" },
  paletteSwatches: {
    putih: { background: "#ebe5db", accent: "#8c6a2f", text: "#2a2622" },
    zamrud: { background: "#23392f", accent: "#d4b46a", text: "#f1ece0" },
    anggur: { background: "#4a1c25", accent: "#dcb672", text: "#f6ece3" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna dinding",
      options: [
        { value: "putih", label: "Putih" },
        { value: "zamrud", label: "Zamrud" },
        { value: "anggur", label: "Anggur" },
      ],
      default: "putih",
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
      key: "artNote",
      type: "text",
      label: "Keterangan di plakat lukisan",
      help: "Baris kecil di plakat samping foto utama, mis. Cinta dan doa di atas kanvas.",
      maxLength: 50,
      default: "Cinta dan doa di atas kanvas",
    },
    {
      key: "opening",
      type: "textarea",
      label: "Kalimat pembuka",
      help: "Pisahkan paragraf dengan baris kosong.",
      maxLength: 800,
      default:
        "Setiap karya punya kisah di baliknya. Kisah kami akan memasuki babak paling indah, dan kami ingin Anda hadir menyaksikannya.\n\nKehadiran dan doa restu Anda akan menjadi bagian terindah dari pameran ini.",
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
