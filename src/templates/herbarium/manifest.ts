import { defineManifest } from "../manifest";

export default defineManifest({
  id: "herbarium",
  name: "Herbarium",
  category: "floral",
  tier: "hemat",
  description:
    "Undangan tanpa foto berbentuk buku bunga kering. Rangkaian bunganya disusun dari huruf nama kalian, dan setiap tamu mendapat setangkai bunga dari namanya sendiri.",
  badges: ["baru"],
  withPhoto: false,
  swatch: { background: "#3d5240", accent: "#c9a66b", text: "#f1f0e4" },
  paletteSwatches: {
    lumut: { background: "#3d5240", accent: "#c9a66b", text: "#f1f0e4" },
    bata: { background: "#8c4a38", accent: "#d9b48a", text: "#f7ece2" },
    nila: { background: "#454a74", accent: "#b9a9d0", text: "#efeef5" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna buku",
      options: [
        { value: "lumut", label: "Hijau lumut" },
        { value: "bata", label: "Merah bata" },
        { value: "nila", label: "Biru nila" },
      ],
      default: "lumut",
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
        "Ada hal yang ingin kami simpan lama, seperti bunga di antara halaman buku. Salah satunya hari ketika kami menikah.\n\nKami berharap Anda hadir dan ikut mengisi halaman itu.",
    },
    {
      key: "guestFlower",
      type: "toggle",
      label: "Bunga untuk tamu",
      help: "Setiap tamu melihat setangkai bunga yang disusun dari namanya.",
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
