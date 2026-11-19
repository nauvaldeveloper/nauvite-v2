import { defineManifest } from "../manifest";
import { adatFields } from "../adat/theme";

export default defineManifest({
  id: "betawi-heritage",
  name: "Betawi Heritage",
  category: "adat",
  tier: "premium",
  region: "Betawi",
  description:
    "Pagi ceria khas Betawi: Monas di kejauhan, danau Setu Babakan dengan rumah kebaya, dan sepasang ondel-ondel, dibuka dengan Buka Palang Pintu. Ornamen kembang kelapa dan roti buaya.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#f6e7cf", accent: "#8a2a22", text: "#3d1f1a" },
  version: 2,
  fields: adatFields("#8a2a22", "Buka Palang Pintu"),
});
