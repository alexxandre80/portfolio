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

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <main>
      <section className="relative">
        <Blobs variant="hero" />
        <Hero dict={dict.hero} pipeline={dict.pipeline} />
      </section>
      <StackMarquee />
      <Projects dict={dict.projects} />
      <Journey dict={dict.journey} />
      <Method dict={dict.method} />
      <About dict={dict.about} />
      <Contact dict={dict.contact} locale={locale} />
      <Footer text={dict.footer.built} legal={dict.footer.legal} locale={locale} />
    </main>
  );
}
