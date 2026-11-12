import { profile } from "@/data/projects";
import type { Locale } from "@/i18n/config";

type Props = { text: string; legal: string; source: string; locale: Locale };

const sourceUrl = "https://github.com/alexxandre80/portfolio";

// Année figée au build, recalculée à chaque déploiement
export async function Footer({ text, legal, source, locale }: Props) {
  "use cache";
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-295 flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-8">
        <span>
          © {new Date().getFullYear()} Alexandre Mandra · {text}{" "}
          {/* Pour qui veut voir comment le site est fait */}
          <a href={sourceUrl} target="_blank" rel="noopener" className="text-ink underline-offset-2 hover:underline">{source} ↗</a>
        </span>
        <span className="flex gap-5">
          <a href={`/${locale}/legal`} className="hover:text-ink">{legal}</a>
          <a href={profile.github} target="_blank" rel="noopener" className="hover:text-ink">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noopener" className="hover:text-ink">LinkedIn</a>
        </span>
      </div>
    </footer>
  );
}
