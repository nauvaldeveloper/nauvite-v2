import { defineManifest } from "../manifest";

export default defineManifest({
  id: "surat-cinta",
  name: "Surat Cinta",
  category: "signature",
  tier: "basic",
  description:
    "Undangan tanpa foto berbentuk surat pos: amplop bernama tamu yang terbuka sendiri, perangko bunga, cap pos bertanggal, dan kartu pos acara dengan bunga yang tumbuh.",
  badges: ["baru"],
  withPhoto: false,
  swatch: { background: "#5c1f2c", accent: "#e3b7a6", text: "#fbf3ec" },
  paletteSwatches: {
    anggur: { background: "#5c1f2c", accent: "#4f7191", text: "#fcf6f0" },
    laut: { background: "#1d3c57", accent: "#c4604a", text: "#f7fafb" },
    zaitun: { background: "#454c2d", accent: "#b5603f", text: "#fbfaf3" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna surat",
      options: [
        { value: "anggur", label: "Merah anggur" },
        { value: "laut", label: "Biru laut" },
        { value: "zaitun", label: "Hijau zaitun" },
      ],
      default: "anggur",
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
      key: "letter",
      type: "textarea",
      label: "Isi surat",
      help: "Pisahkan paragraf dengan baris kosong. Boleh ditulis dengan gaya kalian sendiri.",
      maxLength: 900,
      default:
        "Ada kabar yang ingin kami sampaikan langsung kepada Anda. Setelah perjalanan yang panjang, kami akan menikah.\n\nHari itu akan terasa lebih lengkap kalau Anda ada di sana. Datanglah, duduk bersama kami, dan titipkan doa untuk rumah tangga yang baru kami mulai.",
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
