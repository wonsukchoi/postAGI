import Link from "next/link";
import { REPO_URL, SITE_NAME } from "@/lib/site";
import { Logo } from "./Logo";

const linkClass = "text-[17px] text-neutral-900 hover:text-neutral-500";

export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
      <Link
        href="/"
        aria-label={`${SITE_NAME} home`}
        className="flex items-center gap-2.5 text-xl font-bold"
      >
        <Logo className="size-10 text-neutral-900" />
        {SITE_NAME}
      </Link>
      <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
        <a href={REPO_URL} className={linkClass}>
          GitHub
        </a>
        <Link href="/occupations" className={linkClass}>
          Occupations
        </Link>
        <Link href="/methodology" className={linkClass}>
          Methodology
        </Link>
      </nav>
    </header>
  );
}
