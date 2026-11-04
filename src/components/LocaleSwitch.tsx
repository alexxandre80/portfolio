"use client";

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

  // Lien classique, pas <Link> : changer de langue change la mise en page racine, et une navigation
  // côté client recrée <html> sans l'attribut data-theme posé par le script de démarrage.
  // Un vrai chargement de page relance ce script et conserve le thème choisi.
  return (
    <a
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
    </a>
  );
}
