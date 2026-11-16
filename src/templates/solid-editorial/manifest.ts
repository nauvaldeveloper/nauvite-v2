import { defineManifest } from "../manifest";

export default defineManifest({
  id: "solid-editorial",
  name: "Minimalist & Clean",
  category: "clean",
  tier: "basic",
  description: "Gaya editorial dengan huruf serif. Latar bisa diganti foto atau video sendiri.",
  withPhoto: true,
  swatch: { background: "#1f3a2e", accent: "#f4efe6", text: "#f4efe6" },
  version: 1,
  fields: [
    {
      key: "background",
      type: "media",
      label: "Latar sampul",
      help: "Foto atau video untuk sampul. Kalau kosong, memakai video bunga bawaan.",
      accept: ["image", "video"],
      // Sumber dan lisensi: docs/ASET.md
      default: {
        kind: "video",
        src: "/templates/solid-editorial/latar-bunga-putih.mp4",
        poster: "/templates/solid-editorial/latar-bunga-putih.webp",
      },
    },
    {
      key: "overlayColor",
      type: "color",
      label: "Warna lapisan",
      help: "Warna yang menutupi latar supaya tulisan tetap terbaca.",
      default: "#1f3a2e",
    },
    {
      key: "overlayStrength",
      type: "select",
      label: "Kepekatan lapisan",
      options: [
        { value: "tipis", label: "Tipis" },
        { value: "sedang", label: "Sedang" },
        { value: "pekat", label: "Pekat" },
      ],
      default: "sedang",
    },
    {
      key: "headingFont",
      type: "select",
      label: "Jenis huruf judul",
      options: [
        { value: "serif", label: "Serif klasik" },
        { value: "sans", label: "Sans modern" },
      ],
      default: "serif",
    },
  ],
});
