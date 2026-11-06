import type { Metadata } from "next";
import { CONFIDENCE, CONFIDENCE_DEFINITION, STATUSES, STATUS_DEFINITION } from "@/lib/schema";
import { ConfidenceDots } from "@/components/ConfidenceDots";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { StatusBadge } from "@/components/StatusBadge";

export const metadata: Metadata = pageMetadata({
  title: "Methodology",
  description:
    "How postAGI rates occupations: four status levels, three confidence levels, and the evidence each one needs.",
  path: "/methodology",
  image: "/opengraph-image",
});

export default function MethodologyPage() {
  return (
    <main className="mx-auto flex w-full max-w-[700px] flex-col gap-8 px-6 pt-8 pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Methodology", path: "/methodology" },
        ])}
      />
      <h1 className="text-[28px] font-semibold">Methodology</h1>
      <p className="text-[17px] leading-normal text-neutral-800">
        Each occupation gets one of four status levels. A level needs at least
        one cited source. A page without verified sources is marked Draft.
      </p>
      <dl className="flex flex-col gap-6">
        {STATUSES.map((s) => (
          <div key={s} className="flex flex-col gap-2">
            <dt>
              <StatusBadge status={s} />
            </dt>
            <dd className="text-[15px] leading-relaxed text-neutral-800">
              {STATUS_DEFINITION[s]}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-4 text-[22px] font-semibold">Confidence</h2>
      <p className="text-[17px] leading-normal text-neutral-800">
        Confidence says how well the cited sources support the status. It is
        separate from the status itself.
      </p>
      <dl className="flex flex-col gap-6">
        {CONFIDENCE.map((c) => (
          <div key={c} className="flex flex-col gap-2">
            <dt>
              <ConfidenceDots level={c} />
            </dt>
            <dd className="text-[15px] leading-relaxed text-neutral-800">
              {CONFIDENCE_DEFINITION[c]}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
