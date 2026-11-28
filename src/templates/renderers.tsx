import type { CSSProperties } from "react";
import type { TemplateProps } from "./types";
import SolidEditorial from "./solid-editorial/Template";
import Signature from "./signature/Template";
import Illustrated from "./illustrated/Template";
import Adat from "./adat/Template";
import KoranPagi from "./koran-pagi/Template";
import PiringanHitam from "./piringan-hitam/Template";
import Herbarium from "./herbarium/Template";
import TiketKereta from "./tiket-kereta/Template";
import SuratCinta from "./surat-cinta/Template";
import Bioskop from "./bioskop/Template";
import AlbumPolaroid from "./album-polaroid/Template";
import LengkungBoho from "./lengkung-boho/Template";
import sageGarden from "./sage-garden/manifest";
import sageGardenTheme from "./sage-garden/theme";
import dustyRose from "./dusty-rose/manifest";
import dustyRoseTheme from "./dusty-rose/theme";
import lavenderMist from "./lavender-mist/manifest";
import lavenderMistTheme from "./lavender-mist/theme";
import sundaneseElegance from "./sundanese-elegance/manifest";
import sundaneseEleganceTheme from "./sundanese-elegance/theme";
import javaneseKeraton from "./javanese-keraton/manifest";
import javaneseKeratonTheme from "./javanese-keraton/theme";
import betawiHeritage from "./betawi-heritage/manifest";
import betawiHeritageTheme from "./betawi-heritage/theme";

/**
 * Panjang nama terpanjang (utuh dan per kata), dipakai CSS tema untuk mengecilkan
 * nama panjang supaya tidak keluar layar atau terpotong di tengah kata.
 */
function nameLengths({ invitation }: TemplateProps) {
  const { groom, bride } = invitation.content.couple;
  const names = [groom.name || "Mempelai Pria", bride.name || "Mempelai Wanita"];
  const longest = (list: string[]) => Math.max(1, ...list.map((s) => s.length));
  return {
    display: "contents",
    "--name-len": longest(names),
    "--word-len": longest(names.flatMap((n) => n.split(/\s+/))),
  } as CSSProperties;
}

export function RenderTemplate(props: TemplateProps) {
  return (
    <div style={nameLengths(props)}>
      <Template {...props} />
    </div>
  );
}

/**
 * Memilih komponen tampilan sesuai template undangan. Dipisah dari registry.ts
 * supaya katalog dan editor cukup memuat manifest tanpa ikut memuat tampilan.
 *
 * Menambah template: tambahkan satu `case` di sini.
 */
function Template(props: TemplateProps) {
  switch (props.invitation.templateId) {
    case "solid-editorial":
      return <SolidEditorial {...props} />;
    case "sage-garden":
      return <Illustrated {...props} theme={sageGardenTheme} manifest={sageGarden} />;
    case "dusty-rose":
      return <Illustrated {...props} theme={dustyRoseTheme} manifest={dustyRose} />;
    case "lavender-mist":
      return <Illustrated {...props} theme={lavenderMistTheme} manifest={lavenderMist} />;
    case "sundanese-elegance":
      return <Adat {...props} theme={sundaneseEleganceTheme} manifest={sundaneseElegance} />;
    case "javanese-keraton":
      return <Adat {...props} theme={javaneseKeratonTheme} manifest={javaneseKeraton} />;
    case "betawi-heritage":
      return <Adat {...props} theme={betawiHeritageTheme} manifest={betawiHeritage} />;
    case "koran-pagi":
      return <KoranPagi {...props} />;
    case "piringan-hitam":
      return <PiringanHitam {...props} />;
    case "herbarium":
      return <Herbarium {...props} />;
    case "tiket-kereta":
      return <TiketKereta {...props} />;
    case "surat-cinta":
      return <SuratCinta {...props} />;
    case "bioskop":
      return <Bioskop {...props} />;
    case "album-polaroid":
      return <AlbumPolaroid {...props} />;
    case "lengkung-boho":
      return <LengkungBoho {...props} />;
    case "royal-gold":
    case "floral-light":
    case "midnight-dark":
      return <Signature {...props} variant={props.invitation.templateId} />;
    default:
      // Template yang belum dipindahkan dari v1 sementara memakai tampilan Clean
      // supaya undangannya tetap bisa dibuka.
      return <SolidEditorial {...props} />;
  }
}
