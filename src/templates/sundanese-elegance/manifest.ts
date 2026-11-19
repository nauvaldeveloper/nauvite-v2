import { defineManifest } from "../manifest";
import { adatFields } from "../adat/theme";

export default defineManifest({
  id: "sundanese-elegance",
  name: "Sundanese Elegance",
  category: "adat",
  tier: "premium",
  region: "Sunda",
  description:
    "Pemandangan Pasundan berlapis: langit fajar, Tangkuban Parahu, kebun teh, dan wayang golek, dibuka dengan pintu kayu berukir. Ornamen siger dan kujang, judul beraksara Sunda.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#f3e6cf", accent: "#5a3d26", text: "#3b2a1c" },
  version: 2,
  fields: adatFields("#5a3d26", "Buka Panto"),
});
