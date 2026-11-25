import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { coupleTitle, formatLongDate, mainEventDate } from "@/lib/invitation/format";
import { getPublicInvitation } from "@/lib/invitation/public";
import { resolveOptions } from "@/templates/options";
import { getManifest } from "@/templates/registry";

/**
 * Gambar preview WhatsApp untuk undangan tanpa foto: nama dan tanggal di atas amplop
 * dengan warna tema. Dipakai kalau klien tidak mengunggah gambar sendiri.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invitation = await getPublicInvitation(slug);
  if (!invitation) return new Response("Tidak ditemukan", { status: 404 });

  const font = await readFile(join(process.cwd(), "assets/fonts/PetitFormalScript-Regular.ttf"));
  const title = coupleTitle(invitation.content);
  const date = mainEventDate(invitation.content);
  const manifest = getManifest(invitation.templateId);
  const palette = manifest ? resolveOptions(manifest, invitation.templateOptions, invitation.id).palette : undefined;
  const { background, accent, text } = manifest?.paletteSwatches?.[String(palette)] ?? manifest?.swatch ?? {
    background: "#17261f",
    accent: "#c99c34",
    text: "#f3eee5",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 44,
          background,
          fontFamily: "Petit",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: 22,
            backgroundColor: text,
            backgroundImage: `repeating-linear-gradient(135deg, ${background} 0px, ${background} 30px, ${text} 30px, ${text} 52px, ${accent} 52px, ${accent} 82px, ${text} 82px, ${text} 104px)`,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
              background: text,
              color: background,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 34 }}>Undangan pernikahan</div>
            <div style={{ fontSize: title.length > 22 ? 66 : 92, margin: "24px 0 28px" }}>{title}</div>
            {date ? <div style={{ fontSize: 36 }}>{formatLongDate(date)}</div> : null}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Petit", data: font, weight: 400, style: "normal" }],
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
    },
  );
}
