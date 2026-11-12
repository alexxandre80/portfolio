import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { Blobs } from "@/components/Blobs";
import { Hero } from "@/components/Hero";
import { StackMarquee } from "@/components/StackMarquee";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { Method } from "@/components/Method";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { profile } from "@/data/projects";
import { siteUrl } from "@/data/site";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary();

  // Données structurées : disent aux moteurs que la page présente une personne, et relient le site,
  // LinkedIn et GitHub à la même identité. Seulement ce que le site affiche déjà (pas d'employeur)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // Nom du site affiché par Google au-dessus du lien (sans lui, il affiche « Vercel »)
      { "@type": "WebSite", name: "Alexandre Mandra", url: `${siteUrl}/` },
      {
        "@type": "ProfilePage",
        url: `${siteUrl}/${locale}`,
        inLanguage: locale,
        mainEntity: {
          "@type": "Person",
          name: "Alexandre Mandra",
          jobTitle: "Software Engineer",
          description: dict.meta.description,
          url: siteUrl,
          address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
          sameAs: [profile.linkedin, profile.github],
          knowsAbout: ["Python", "PHP", "TypeScript", "Web scraping", "Data pipelines", "LLM", "Generative AI"],
        },
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="relative">
        <Blobs variant="hero" />
        <Hero dict={dict.hero} demo={dict.heroDemo} />
      </section>
      <StackMarquee />
      <Projects dict={dict.projects} />
      <Journey dict={dict.journey} />
      <Method dict={dict.method} />
      <About dict={dict.about} />
      <Contact dict={dict.contact} locale={locale} />
      <Footer text={dict.footer.built} legal={dict.footer.legal} source={dict.footer.source} locale={locale} />
    </main>
  );
}
