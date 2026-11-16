import { defineIllustratedTheme } from "../illustrated/theme";

/** Palet Lavender Mist: kertas putih lilac, teks ungu tua, aksen lavender dan mauve. */
export default defineIllustratedTheme({
  id: "lavender-mist",
  palette: {
    paper: "#f4eff3",
    ink: "#463a52",
    muted: "#7a6f85",
    accent: "#b6a3c9",
    gold: "#94738f",
    cream: "#f7f1f7",
    photoBg: "#e6dfe9",
  },
  // Buket sudut dari Canva lebih rimbun, jadi diperkecil supaya wajah di foto sampul tidak tertutup.
  // Buket bingkai A sudah berbentuk sudut kiri atas, jadi tidak perlu diputar.
  vars: {
    "--corner-left-scale": "0.82",
    "--corner-right-scale": "0.82",
    "--cluster-top-rotate": "0deg",
  },
});
