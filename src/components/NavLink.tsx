"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";

type Props = { locale: Locale; anchor: string; className?: string; children: ReactNode };

// Ancre simple sur l'accueil (défilement fluide), lien complet depuis les autres pages
export function NavLink({ locale, anchor, className, children }: Props) {
  const home = usePathname() === `/${locale}`;
  return (
    <a href={home ? `#${anchor}` : `/${locale}#${anchor}`} className={className}>
      {children}
    </a>
  );
}
