import { defineManifest } from "../manifest";
import { illustratedFields } from "../illustrated/theme";

export default defineManifest({
  id: "dusty-rose",
  name: "Dusty Rose",
  category: "floral",
  tier: "premium",
  description:
    "Mawar pink pudar dan mauve dengan rumput pampas kering di atas kertas gading, bagian gelap berwarna anggur tua.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#f4e9e2", accent: "#6b2f3d", text: "#4a3036" },
  version: 1,
  fields: illustratedFields("#6b2f3d"),
});
