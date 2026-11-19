import { defineManifest } from "../manifest";
import { adatFields } from "../adat/theme";

export default defineManifest({
  id: "javanese-keraton",
  name: "Javanese Keraton",
  category: "adat",
  tier: "premium",
  region: "Jawa",
  description:
    "Senja Jawa Tengah berlapis: Merapi dan Merbabu, sawah terasering, dan wayang kulit Rama Shinta, dibuka dengan pintu gebyok ukir. Ornamen gunungan dan keris, label berbahasa Jawa.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#efe2cc", accent: "#4a2c1d", text: "#3a2418" },
  version: 2,
  fields: adatFields("#4a2c1d", "Buka Lawang"),
});
