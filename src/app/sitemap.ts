import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])), "x-default": siteUrl } },
  }));
}
