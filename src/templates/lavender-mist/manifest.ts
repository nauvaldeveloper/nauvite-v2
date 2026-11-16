import { defineManifest } from "../manifest";
import { illustratedFields } from "../illustrated/theme";

export default defineManifest({
  id: "lavender-mist",
  name: "Lavender Mist",
  category: "floral",
  tier: "premium",
  description:
    "Mawar dan ranunculus putih bersemburat lilac dengan daun eukaliptus ungu di atas kertas lembut, bagian gelap ungu tua.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#efe9f1", accent: "#5a4a6e", text: "#463a52" },
  version: 1,
  fields: illustratedFields("#5a4a6e"),
});
