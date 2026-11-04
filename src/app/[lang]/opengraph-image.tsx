import { ImageResponse } from "next/og";
import { dictionaryFor } from "@/i18n/dictionaries";

// Image affichée quand le lien du site est partagé (LinkedIn, Slack, messageries…)
export const alt = "Alexandre Mandra · Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { hero } = await dictionaryFor((await params).lang);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f5f5f4",
          backgroundImage:
            // Chaque couleur se fond vers sa propre version transparente : vers `transparent`, le rendu passe par du gris
            "radial-gradient(circle at 85% 10%, rgba(124,156,255,0.9) 0%, rgba(124,156,255,0) 40%), radial-gradient(circle at 65% 60%, rgba(196,167,255,0.8) 0%, rgba(196,167,255,0) 35%), radial-gradient(circle at 100% 90%, rgba(127,227,214,0.8) 0%, rgba(127,227,214,0) 35%)",
          color: "#18181b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 16, background: "#18181b", color: "#f5f5f4", fontSize: 26, fontWeight: 700 }}>
            AM
          </div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>Alexandre Mandra</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            {`${hero.title} ${hero.highlight}`}
          </div>
          <div style={{ fontSize: 28, color: "#52525b" }}>{hero.badge}</div>
        </div>
      </div>
    ),
    size,
  );
}
