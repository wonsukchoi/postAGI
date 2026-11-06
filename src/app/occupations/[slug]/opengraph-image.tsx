import { ImageResponse } from "next/og";
import { getOccupation, getOccupations } from "@/lib/occupations";
import { OG_SIZE, OgBadge, OgFrame, OgSpectrum } from "@/lib/og";
import { CONFIDENCE_LABEL } from "@/lib/schema";

export const alt = "Occupation status on postAGI";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams() {
  return getOccupations().map((o) => ({ slug: o.slug }));
}

/** Cut at a word boundary. Summaries are capped at 200 characters, so this rarely triggers. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trimEnd()}…`;
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const occ = getOccupation(slug);
  if (!occ) throw new Error(`No occupation for slug "${slug}"`);

  return new ImageResponse(
    (
      <OgFrame domain="postagi.fyi/occupations">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <OgBadge status={occ.status} />
            <div style={{ display: "flex", fontSize: 26, color: "#525252" }}>
              {`Confidence: ${CONFIDENCE_LABEL[occ.confidence]}  ·  ${occ.sources.length} sources`}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: occ.title.length > 20 ? 76 : 88, fontWeight: 700, lineHeight: 1.05 }}>
            {occ.title}
          </div>
          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.3, color: "#404040" }}>
            {clip(occ.summary, 200)}
          </div>
        </div>
        <OgSpectrum status={occ.status} />
      </OgFrame>
    ),
    { ...size },
  );
}
