import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { Footer } from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: `${dict.legal.title} · Alexandre Mandra`, robots: { index: false } };
}

export default async function LegalPage() {
  const locale = await getLocale();
  const { legal, footer } = await getDictionary();

  return (
    <main>
      <article className="mx-auto max-w-3xl px-4 pt-36 pb-24 sm:px-8">
        <a href={`/${locale}`} className="text-sm text-muted transition-colors hover:text-ink">← {legal.back}</a>
        <h1 className="mt-6 text-[clamp(30px,4vw,44px)] font-semibold tracking-[-0.03em]">{legal.title}</h1>
        <p className="mt-2 font-mono text-xs text-muted">{legal.updated}</p>

        <div className="glass mt-10 divide-y divide-line rounded-[20px]">
          {legal.sections.map((s) => (
            <section key={s.title} className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                {s.body.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          ))}
        </div>
      </article>
      <Footer text={footer.built} legal={footer.legal} locale={locale} />
    </main>
  );
}
