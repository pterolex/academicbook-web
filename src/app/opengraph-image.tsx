import { ImageResponse } from "next/og";

// Default social-share card, inherited by every route that doesn't set its own.
// 1200×630 is the size Facebook/Twitter/Telegram expect.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = 'Книжковий магазин «Академкнига» № 7, Київ';

// Regenerate at most daily — the card content is static.
export const revalidate = 86400;

// ImageResponse's built-in font has no Cyrillic glyphs, so pull a Cyrillic
// serif from Google Fonts. The old-browser UA forces a TTF (satori can't read
// woff2). Failure falls back to the default font rather than breaking the build.
async function cyrillicFont(): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=PT+Serif:wght@700&subset=cyrillic",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)",
        },
      },
    );
    const css = await cssRes.text();
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('truetype'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const font = await cyrillicFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#8e8367",
          color: "#efe8cd",
          fontFamily: font ? "PT Serif" : "serif",
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
          Академкнига № 7
        </div>
        <div style={{ fontSize: 44, marginTop: 24 }}>
          Книжковий магазин, Київ
        </div>
        <div style={{ fontSize: 30, marginTop: 40, opacity: 0.85 }}>
          ~8000 видань · фізико-математична література
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "PT Serif", data: font, weight: 700, style: "normal" }]
        : undefined,
    },
  );
}
