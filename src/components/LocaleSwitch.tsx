"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeCookie, locales, type Locale } from "@/i18n/config";

type Props = { current: Locale; label: string };

export function LocaleSwitch({ current, label }: Props) {
  const pathname = usePathname();
  const other = locales.find((l) => l !== current)!;
  const href = pathname.replace(/^\/(fr|en)(?=\/|$)/, `/${other}`);

  // Mémorise le choix pour que le proxy ne réapplique pas la langue du navigateur
  const remember = () => {
    document.cookie = `${localeCookie}=${other}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <Link
      href={href}
      hrefLang={other}
      onClick={remember}
      aria-label={label}
      className="rounded-lg bg-chip px-2.5 py-1.5 font-mono text-xs text-muted"
    >
      {locales.map((l, i) => (
        <span key={l}>
          {i > 0 && " / "}
          <span className={l === current ? "font-medium text-ink" : ""}>{l.toUpperCase()}</span>
        </span>
      ))}
    </Link>
  );
}
