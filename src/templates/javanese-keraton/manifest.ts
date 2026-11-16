import { defineManifest } from "../manifest";

export default defineManifest({
  id: "javanese-keraton",
  name: "Javanese Keraton",
  category: "adat",
  tier: "basic",
  region: "Jawa",
  description: "Nuansa keraton Jawa dengan gunungan dan label berbahasa Jawa.",
  withPhoto: true,
  swatch: { background: "#2b1d14", accent: "#c8a15a", text: "#f3e7d3" },
  version: 1,
  fields: [
    {
      key: "greeting",
      type: "text",
      label: "Salam pembuka",
      help: "Tampil di sampul sebelum undangan dibuka.",
      default: "Sugeng Rawuh",
      maxLength: 60,
    },
    {
      key: "openingAnimation",
      type: "toggle",
      label: "Animasi pembuka (gunungan)",
      default: true,
    },
  ],
});
