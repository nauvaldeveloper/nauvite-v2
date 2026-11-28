import { defineManifest } from "../manifest";

export default defineManifest({
  id: "sampul-majalah",
  name: "Sampul Majalah",
  category: "signature",
  tier: "basic",
  description:
    "Undangan bergaya majalah mode. Foto kalian menjadi sampul edisi spesial, lengkap dengan nama majalah, judul artikel, dan halaman dalam ala majalah.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#faf8f5", accent: "#d8302a", text: "#141414" },
  paletteSwatches: {
    merah: { background: "#faf8f5", accent: "#d8302a", text: "#141414" },
    monokrom: { background: "#f4f3f1", accent: "#141414", text: "#141414" },
    "merah-muda": { background: "#fbf6f6", accent: "#d9708a", text: "#2a1a1f" },
  },
  version: 1,
  fields: [
    {
      key: "palette",
      type: "select",
      label: "Warna",
      options: [
        { value: "merah", label: "Merah klasik" },
        { value: "monokrom", label: "Monokrom" },
        { value: "merah-muda", label: "Merah muda" },
      ],
      default: "merah",
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
      key: "magazine",
      type: "text",
      label: "Nama majalah",
      help: "Tulisan besar di atas sampul. Paling bagus satu kata pendek, mis. Bahagia.",
      maxLength: 10,
      default: "Bahagia",
    },
    {
      key: "coverLine",
      type: "text",
      label: "Judul artikel di sampul",
      help: "Kalimat di bawah nama kalian pada sampul.",
      maxLength: 60,
      default: "Kisah cinta yang akhirnya sampai di pelaminan",
    },
    {
      key: "opening",
      type: "textarea",
      label: "Surat dari kami",
      help: "Pisahkan paragraf dengan baris kosong.",
      maxLength: 800,
      default:
        "Edisi ini kami siapkan khusus untuk Anda. Di dalamnya ada cerita tentang perjalanan kami, dan kabar bahagia yang sudah lama ingin kami bagikan.\n\nKami akan menikah, dan kehadiran serta doa restu Anda akan menjadi halaman terindah di edisi ini.",
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
