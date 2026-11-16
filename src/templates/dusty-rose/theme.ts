import { defineIllustratedTheme } from "../illustrated/theme";

/** Palet Dusty Rose: kertas gading, teks plum tua, aksen pink pudar dan rose gold. */
export default defineIllustratedTheme({
  id: "dusty-rose",
  palette: {
    paper: "#f6eee6",
    ink: "#4a3036",
    muted: "#86696f",
    accent: "#c99aa0",
    gold: "#a8705c",
    cream: "#f8eee9",
    photoBg: "#ecdcd6",
  },
  // Buket kanan dari Canva lebih tinggi, jadi diperkecil; buket bingkai A berbentuk
  // deretan mendatar, cukup dimiringkan mengikuti lengkung bingkai.
  vars: {
    "--corner-right-scale": "0.74",
    "--cluster-top-rotate": "-14deg",
  },
});
