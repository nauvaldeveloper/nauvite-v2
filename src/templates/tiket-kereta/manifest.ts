import { defineManifest } from "../manifest";

export default defineManifest({
  id: "tiket-kereta",
  name: "Tiket Kereta",
  category: "signature",
  tier: "hemat",
  description:
    "Undangan tanpa foto berbentuk karcis kereta. Karcisnya dilubangi saat dibuka, nama kalian muncul di papan keberangkatan, dan setiap tamu mendapat nomor kursinya sendiri.",
  badges: ["baru"],
  withPhoto: false,
  swatch: { background: "#e9b35a", accent: "#a8362a", text: "#2b241c" },
  paletteSwatches: {
    jingga: { background: "#e9b35a", accent: "#a8362a", text: "#2b241c" },
    biru: { background: "#a9cbd6", accent: "#1f5a78", text: "#173341" },
    jambu: { background: "#ecb3a8", accent: "#97304a", text: "#3d1a24" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna karcis",
      options: [
        { value: "jingga", label: "Jingga" },
        { value: "biru", label: "Biru" },
        { value: "jambu", label: "Merah jambu" },
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
        "Kami berangkat dari dua cerita yang berbeda, lalu bertemu di satu peron. Sekarang kami siap melanjutkan perjalanan berdua.\n\nKami akan senang sekali kalau Anda ikut mengantar keberangkatan kami.",
    },
    {
      key: "guestSeat",
      type: "toggle",
      label: "Kursi untuk tamu",
      help: "Setiap tamu mendapat nomor gerbong dan kursi dari namanya. Hanya hiasan, bukan nomor kursi di acara.",
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
