import type { TemplateProps } from "./types";
import SolidEditorial from "./solid-editorial/Template";
import Signature from "./signature/Template";
import Illustrated from "./illustrated/Template";
import Adat from "./adat/Template";
import KoranPagi from "./koran-pagi/Template";
import PiringanHitam from "./piringan-hitam/Template";
import SuratCinta from "./surat-cinta/Template";
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
 * Memilih komponen tampilan sesuai template undangan. Dipisah dari registry.ts
 * supaya katalog dan editor cukup memuat manifest tanpa ikut memuat tampilan.
 *
 * Menambah template: tambahkan satu `case` di sini.
 */
export function RenderTemplate(props: TemplateProps) {
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
    case "surat-cinta":
      return <SuratCinta {...props} />;
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
