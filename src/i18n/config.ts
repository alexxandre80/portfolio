export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

// Langue servie quand le navigateur ne demande ni le français ni l'anglais
export const fallbackLocale: Locale = "en";

export const localeCookie = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
