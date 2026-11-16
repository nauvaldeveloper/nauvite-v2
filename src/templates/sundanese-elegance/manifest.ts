import { defineManifest } from "../manifest";

export default defineManifest({
  id: "sundanese-elegance",
  name: "Sundanese Elegance",
  category: "adat",
  tier: "basic",
  region: "Sunda",
  description: "Pemandangan Pasundan berlapis dengan label berbahasa Sunda.",
  withPhoto: true,
  swatch: { background: "#f3e6cf", accent: "#7a4a24", text: "#3a2414" },
  version: 1,
  fields: [
    {
      key: "greeting",
      type: "text",
      label: "Salam pembuka",
      help: "Tampil di sampul sebelum undangan dibuka.",
      default: "Sampurasun",
      maxLength: 60,
    },
    {
      key: "openingAnimation",
      type: "toggle",
      label: "Animasi pembuka (Buka Panto)",
      default: true,
    },
  ],
});
