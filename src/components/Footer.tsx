import Link from "next/link";
import { DATA_URL, REPO_URL, SITE_NAME } from "@/lib/site";

const linkClass = "text-neutral-600 hover:text-neutral-900";

export function Footer() {
  return (
    <footer className="flex flex-wrap justify-between gap-4 px-6 py-6 text-sm text-neutral-600 sm:px-10">
      <span>
        © 2026 {SITE_NAME}
      </span>
      <span className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/methodology" className={linkClass}>
          Methodology
        </Link>
        <a href={REPO_URL} className={linkClass}>
          GitHub
        </a>
        <a href={DATA_URL} className={linkClass}>
          Data (JSON)
        </a>
        <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} className={linkClass}>
          Contribute
        </a>
        <a href={`${REPO_URL}/blob/main/LICENSE`} className={linkClass}>
          License
        </a>
      </span>
    </footer>
  );
}
