import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { Blobs } from "@/components/Blobs";

export default async function NotFound() {
  const locale = await getLocale();
  const { notFound } = await getDictionary();

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <Blobs variant="hero" />
      <div className="glass relative z-10 max-w-md rounded-[20px] p-10 text-center">
        <div className="font-mono text-sm text-accent">404</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{notFound.title}</h1>
        <p className="mt-3 text-muted">{notFound.text}</p>
        <a href={`/${locale}`} className="mt-8 inline-block rounded-[10px] bg-ink px-5 py-3 text-sm font-medium text-bg transition hover:-translate-y-px">
          {notFound.back}
        </a>
      </div>
    </main>
  );
}
