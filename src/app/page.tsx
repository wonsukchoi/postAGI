import type { Metadata } from "next";
import Link from "next/link";
import { getOccupations } from "@/lib/occupations";
import { STATUSES, STATUS_LABEL } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { StatusBadge } from "@/components/StatusBadge";
import { datasetJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/",
  ogTitle: `${SITE_NAME}: ${SITE_TAGLINE}`,
});

export default function Home() {
  const list = getOccupations();
  const tools = new Set(list.flatMap((o) => o.aiTools.map((t) => t.name)));
  const sources = list.reduce((n, o) => n + o.sources.length, 0);

  const stats = [
    { value: list.length, label: "occupations tracked" },
    { value: tools.size, label: "AI tools linked" },
    { value: sources, label: "sources cited" },
  ];

  return (
    <main className="mx-auto flex w-full max-w-[700px] flex-col gap-8 px-6 pt-16 pb-16 sm:pt-24">
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={datasetJsonLd(list)} />
      <div className="flex flex-col gap-4">
        <h1 className="text-[26px] leading-snug font-semibold">
          postAGI tracks which occupations AI has already replaced.
        </h1>
        <p className="text-[22px] leading-normal text-neutral-800">
          Every claim links to a source. Open data, open source, free to browse
          and to correct.
        </p>
      </div>

      <div>
        <Link
          href="/occupations"
          className="inline-block rounded-full bg-neutral-900 px-8 py-4 text-lg text-white hover:bg-neutral-700"
        >
          Browse occupations
        </Link>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="text-[40px] leading-tight">{s.value}</dd>
            <dt className="text-[15px] text-neutral-600">{s.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-4">
        <div className="text-[15px] text-neutral-600">
          Status levels used on every page
        </div>
        <div className="flex flex-wrap gap-2.5">
          {STATUSES.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
        <p className="text-[15px] leading-normal text-neutral-600">
          What each level means is on the{" "}
          <Link href="/methodology" className="underline">
            methodology
          </Link>{" "}
          page. {STATUS_LABEL.replaced} needs the strongest evidence.
        </p>
      </div>
    </main>
  );
}
