import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { LocaleSwitch } from "./LocaleSwitch";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

type Props = { dict: Dictionary["nav"]; locale: Locale };

const link = "hidden text-muted transition-colors hover:text-ink md:inline";

export function Header({ dict, locale }: Props) {
  return (
    <header className="glass max-md:bg-bg/90! fixed top-4 left-1/2 z-20 w-[min(1120px,calc(100%-32px))] -translate-x-1/2 rounded-[18px]">
      <div className="flex h-15 items-center justify-between pr-2.5 pl-4">
        <a href={`/${locale}`} className="flex items-center gap-2.5 font-semibold">
          <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs font-semibold text-bg">AM</span>
          <span className="max-sm:hidden">Alexandre Mandra</span>
        </a>
        <nav className="flex items-center gap-3 text-sm sm:gap-6">
          <NavLink locale={locale} anchor="projets" className={link}>{dict.projects}</NavLink>
          <NavLink locale={locale} anchor="parcours" className={link}>{dict.journey}</NavLink>
          <NavLink locale={locale} anchor="methode" className={link}>{dict.method}</NavLink>
          <NavLink locale={locale} anchor="a-propos" className={link}>{dict.about}</NavLink>
          <MobileMenu
            locale={locale}
            label={dict.menu}
            links={[
              { anchor: "projets", text: dict.projects },
              { anchor: "parcours", text: dict.journey },
              { anchor: "methode", text: dict.method },
              { anchor: "a-propos", text: dict.about },
            ]}
          />
          <LocaleSwitch current={locale} label={dict.language} />
          <ThemeToggle label={dict.theme} />
          <NavLink locale={locale} anchor="contact" className="rounded-[10px] bg-ink px-3 py-2 text-sm whitespace-nowrap font-medium text-bg transition hover:-translate-y-px sm:px-4 sm:py-2.5">
            {dict.contact}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
