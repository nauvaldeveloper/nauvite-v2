import { defineManifest } from "../manifest";
import { illustratedFields } from "../illustrated/theme";

export default defineManifest({
  id: "sage-garden",
  name: "Sage Garden",
  category: "floral",
  tier: "premium",
  description:
    "Ilustrasi bunga cat air putih dan daun eukaliptus di atas kertas krem, dengan animasi bunga bergoyang dan kelopak berjatuhan.",
  badges: ["baru"],
  withPhoto: true,
  swatch: { background: "#f3ece0", accent: "#4e6151", text: "#3b4a3e" },
  version: 1,
  fields: illustratedFields("#4e6151"),
});
