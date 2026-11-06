import { ImageResponse } from "next/og";
import { OG_SIZE, OgFrame, OgSpectrum } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME}: which occupations AI has already replaced`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return new ImageResponse(
    (
      <OgFrame domain="postagi.fyi">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
            Which occupations has AI already replaced?
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#404040" }}>
            An open list, with a source for every claim.
          </div>
        </div>
        <OgSpectrum />
      </OgFrame>
    ),
    { ...size },
  );
}
