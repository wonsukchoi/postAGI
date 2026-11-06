import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[700px] flex-col gap-4 px-6 pt-16 pb-16 sm:pt-24">
      <h1 className="text-[28px] font-semibold">Page not found</h1>
      <p className="text-[17px] leading-normal text-neutral-800">
        That page doesn&apos;t exist. It may have moved, or the address may have a typo.
      </p>
      <div className="mt-4">
        <Link
          href="/occupations"
          className="inline-block rounded-full bg-neutral-900 px-8 py-4 text-lg text-white hover:bg-neutral-700"
        >
          Browse occupations
        </Link>
      </div>
    </main>
  );
}
