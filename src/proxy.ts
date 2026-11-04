import { NextResponse, type NextRequest } from "next/server";
import { fallbackLocale, hasLocale, localeCookie, locales, type Locale } from "@/i18n/config";

// Choix explicite du visiteur (cookie) d'abord, puis langue du navigateur
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(localeCookie)?.value;
  if (saved && hasLocale(saved)) return saved;

  const preferred = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .find((p) => hasLocale(p.lang));

  return (preferred?.lang as Locale | undefined) ?? fallbackLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

// Exclus : fichiers internes de Next, fichiers avec extension, et l'icône iOS (servie à la racine, sans extension)
export const config = {
  matcher: ["/((?!_next|apple-icon|.*\\..*).*)"],
};
