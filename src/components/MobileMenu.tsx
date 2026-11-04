"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

type Props = { locale: Locale; label: string; links: { anchor: string; text: string }[] };

// Menu des sections pour les écrans étroits, où les liens du header sont masqués
export function MobileMenu({ locale, label, links }: Props) {
  const [open, setOpen] = useState(false);
  const home = usePathname() === `/${locale}`;

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={label}
        className="grid size-8 cursor-pointer place-items-center rounded-lg bg-chip text-muted transition-colors hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav id="mobile-menu" className="glass bg-bg/95! absolute top-[calc(100%+8px)] right-0 left-0 grid rounded-[18px] p-2">
          {links.map((l) => (
            <a
              key={l.anchor}
              href={home ? `#${l.anchor}` : `/${locale}#${l.anchor}`}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-[15px] transition-colors hover:bg-chip"
            >
              {l.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
