import { defineManifest } from "../manifest";

export default defineManifest({
  id: "album-polaroid",
  name: "Album Polaroid",
  category: "signature",
  tier: "basic",
  description:
    "Undangan seperti album foto kenangan. Sampul album terbuka, foto kalian tertempel sebagai polaroid yang muncul perlahan, lengkap dengan catatan tulisan tangan.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#f4efe6", accent: "#b4583f", text: "#3a332b" },
  paletteSwatches: {
    krem: { background: "#f4efe6", accent: "#b4583f", text: "#3a332b" },
    kraft: { background: "#d9c29f", accent: "#7a3b22", text: "#3b2c1d" },
    hitam: { background: "#1f1e1c", accent: "#f0c987", text: "#f1ede4" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna album",
      options: [
        { value: "krem", label: "Krem" },
        { value: "kraft", label: "Kertas kraft" },
        { value: "hitam", label: "Album hitam" },
      ],
      default: "krem",
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
        "Album ini berisi potongan cerita kami sampai hari ini. Halaman berikutnya ingin kami isi bersama orang-orang tersayang.\n\nKami akan sangat senang kalau Anda hadir dan ikut mengisi kenangan di hari bahagia kami.",
    },
    {
      key: "develop",
      type: "toggle",
      label: "Foto muncul perlahan",
      help: "Foto tampil pelan-pelan seperti polaroid yang baru dicetak.",
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
