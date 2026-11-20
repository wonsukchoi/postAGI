import type { Metadata } from "next";
import Link from "next/link";
import { getOccupations, groupByStatus } from "@/lib/occupations";
import { STATUSES, STATUS_DEFINITION, STATUS_LABEL } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { StatusBadge } from "@/components/StatusBadge";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "What jobs has AI already replaced?",
  description:
    "postAGI rates each tracked occupation from Replaced to Not yet, with evidence and sources. The count per level and every occupation on it.",
  path: "/what-jobs-has-ai-replaced",
  image: "/opengraph-image",
});

export default function WhatJobsHasAiReplacedPage() {
  const all = getOccupations().filter((o) => !o.draft);
  const groups = groupByStatus(all);
  const total = all.length;
  const replaced = groups.replaced.length;

  return (
    <main className="mx-auto flex w-full max-w-[700px] flex-col gap-8 px-6 pt-8 pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "What jobs has AI already replaced?", path: "/what-jobs-has-ai-replaced" },
        ])}
      />
      <div className="flex flex-col gap-3">
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
          ← postAGI
        </Link>
        <h1 className="text-[28px] font-semibold">What jobs has AI already replaced?</h1>
        <p className="text-[17px] leading-normal text-neutral-800">
          postAGI rates {total} occupations.{" "}
          {replaced === 0
            ? `None is rated ${STATUS_LABEL.replaced}.`
            : `${replaced} ${replaced === 1 ? "is" : "are"} rated ${STATUS_LABEL.replaced}.`}{" "}
          By level: {groups.partial.length} {STATUS_LABEL.partial}, {groups.augmented.length} {STATUS_LABEL.augmented} and{" "}
          {groups["not-yet"].length} {STATUS_LABEL["not-yet"]}. This is a list of the occupations postAGI tracks, not of every
          job, and each rating links to its evidence and sources.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">How many jobs has AI replaced?</h2>
        <p className="text-[15px] leading-relaxed text-neutral-800">
          {replaced === 0
            ? `No tracked occupation meets the bar for ${STATUS_LABEL.replaced}. `
            : `${replaced} tracked ${replaced === 1 ? "occupation meets" : "occupations meet"} the bar for ${STATUS_LABEL.replaced}. `}
          {STATUS_LABEL.replaced} means: {STATUS_DEFINITION.replaced} It needs the strongest evidence of the four levels, and
          postAGI counts occupations, not individual workers: this page gives no number of lost jobs.
        </p>
        <Link href="/methodology" className="text-[13px] text-neutral-600 hover:text-neutral-900">
          How we rate →
        </Link>
      </section>

      {STATUSES.map((status) => (
        <section key={status} id={status} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold">
              {STATUS_LABEL[status]} ({groups[status].length})
            </h2>
            <StatusBadge status={status} />
          </div>
          <p className="text-[15px] leading-relaxed text-neutral-600">{STATUS_DEFINITION[status]}</p>
          {groups[status].length === 0 ? (
            <p className="text-[15px] text-neutral-800">No tracked occupation has this rating yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {groups[status].map((o) => (
                <li key={o.slug} className="flex flex-col gap-0.5">
                  <Link href={`/occupations/${o.slug}`} className="text-[15px] underline">
                    {o.title}
                  </Link>
                  <span className="text-sm leading-normal text-neutral-700">{o.summary}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <Link href="/occupations" className="text-sm text-neutral-600 hover:text-neutral-900">
        All occupations →
      </Link>
    </main>
  );
}
