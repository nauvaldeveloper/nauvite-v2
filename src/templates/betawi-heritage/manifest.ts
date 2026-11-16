import { defineManifest } from "../manifest";

export default defineManifest({
  id: "betawi-heritage",
  name: "Betawi Heritage",
  category: "adat",
  tier: "basic",
  region: "Betawi",
  description: "Ornamen gigi balang dan nuansa Betawi dengan label berbahasa Betawi.",
  withPhoto: true,
  swatch: { background: "#7a1f1f", accent: "#e8b64c", text: "#fbeee0" },
  version: 1,
  fields: [
    {
      key: "greeting",
      type: "text",
      label: "Salam pembuka",
      help: "Tampil di sampul sebelum undangan dibuka.",
      default: "Assalamualaikum",
      maxLength: 60,
    },
    {
      key: "openingAnimation",
      type: "toggle",
      label: "Animasi pembuka (Palang Pintu)",
      default: true,
    },
  ],
});
