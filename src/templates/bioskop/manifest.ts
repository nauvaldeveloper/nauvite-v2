import { defineManifest } from "../manifest";

export default defineManifest({
  id: "bioskop",
  name: "Bioskop",
  category: "signature",
  tier: "basic",
  description:
    "Undangan seperti pemutaran perdana film kalian. Tirai panggung terbuka, foto sampul jadi poster, mempelai tampil sebagai pemeran utama, dan acara tersusun seperti jadwal tayang.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#2a0c13", accent: "#e2b457", text: "#f7ead6" },
  paletteSwatches: {
    beludru: { background: "#2a0c13", accent: "#e2b457", text: "#f7ead6" },
    malam: { background: "#0f1626", accent: "#e9c46a", text: "#eef1f6" },
    sepia: { background: "#efe3cc", accent: "#9b3a24", text: "#2b2018" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna",
      options: [
        { value: "beludru", label: "Beludru merah" },
        { value: "malam", label: "Tengah malam" },
        { value: "sepia", label: "Film lama" },
      ],
      default: "beludru",
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
      key: "posterLine",
      type: "text",
      label: "Tulisan di poster",
      help: "Muncul di atas tanggal pada poster, mis. Segera tayang.",
      maxLength: 40,
      default: "Segera tayang",
    },
    {
      key: "opening",
      type: "textarea",
      label: "Sinopsis (kalimat pembuka)",
      help: "Pisahkan paragraf dengan baris kosong.",
      maxLength: 800,
      default:
        "Setelah lama disiapkan di balik layar, kisah kami akhirnya siap tayang. Kami ingin Anda ikut menyaksikan bagian terpenting dari cerita ini.\n\nKehadiran dan doa Anda akan membuat pemutaran perdana kami terasa lengkap.",
    },
    {
      key: "filmGrain",
      type: "toggle",
      label: "Efek film lama",
      help: "Butiran halus seperti film seluloid di atas foto.",
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
