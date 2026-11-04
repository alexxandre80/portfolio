import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/data/site";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Appliqué avant le premier rendu pour éviter un flash du mauvais thème
const themeScript = `(function(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t})()`;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();
  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { canonical: `/${locale}`, languages: { fr: "/fr", en: "/en" } },
    // L'image d'aperçu vient de opengraph-image.tsx, ajoutée automatiquement par Next
    openGraph: {
      type: "website",
      siteName: "Alexandre Mandra",
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen overflow-x-hidden font-sans">
        <SmoothScroll />
        <Header dict={dict.nav} locale={locale} />
        {children}
      </body>
    </html>
  );
}
