import { defineManifest } from "../manifest";

export default defineManifest({
  id: "batak-ulos",
  name: "Batak Ulos",
  category: "adat",
  tier: "basic",
  region: "Batak",
  description: "Motif ulos dan gorga dengan label berbahasa Batak.",
  withPhoto: true,
  swatch: { background: "#3b0f12", accent: "#d9a441", text: "#f6e9dc" },
  version: 1,
  fields: [
    {
      key: "greeting",
      type: "text",
      label: "Salam pembuka",
      help: "Tampil di sampul sebelum undangan dibuka.",
      default: "Horas",
      maxLength: 60,
    },
    {
      key: "openingAnimation",
      type: "toggle",
      label: "Animasi pembuka (ulos tersingkap)",
      default: true,
    },
  ],
});
