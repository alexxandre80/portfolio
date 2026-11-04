"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { sendContact } from "@/app/actions/contact";
import { limits, topics, type ContactField, type ContactState } from "@/data/contact";
import { profile } from "@/data/projects";
import { SectionHead } from "./SectionHead";

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
    onTurnstileLoad?: () => void;
  }
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const scriptUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad";

// Widget anti-spam Cloudflare : il ajoute au formulaire un champ caché cf-turnstile-response
function useTurnstile(locale: Locale) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    const render = () => {
      if (!box.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(box.current, {
        sitekey: siteKey,
        language: locale,
        theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      });
    };

    if (window.turnstile) render();
    else {
      window.onTurnstileLoad = render;
      if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [locale]);

  const reset = useCallback(() => {
    if (widget.current) window.turnstile?.reset(widget.current);
  }, []);
  return { box, reset };
}

const initial: ContactState = { status: "idle" };

export function Contact({ dict, locale }: { dict: Dictionary["contact"]; locale: Locale }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const { box, reset } = useTurnstile(locale);

  // Un jeton Turnstile ne sert qu'une fois : on en redemande un après chaque envoi raté
  useEffect(() => {
    if (state.status === "error") reset();
  }, [state, reset]);

  const sent = state.status === "success" && dismissed !== state;
  const invalid = (field: ContactField) => state.fields?.includes(field);
  const value = (field: ContactField) => state.values?.[field];
  const input = (field: ContactField) =>
    `w-full rounded-xl border bg-chip px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent-soft ${invalid(field) ? "border-red-500" : "border-line"}`;

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto grid max-w-295 gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHead eyebrow={dict.eyebrow} title={dict.title} />
          <p className="-mt-4 max-w-md text-lg leading-relaxed text-muted">{dict.lead}</p>
          <p className="mt-8 text-sm text-muted">{dict.elsewhere}</p>
          <div className="mt-3 flex gap-3">
            <a href={profile.linkedin} target="_blank" rel="noopener" className="glass rounded-[10px] px-4 py-2.5 text-sm font-medium transition hover:-translate-y-px">LinkedIn ↗</a>
            <a href={profile.github} target="_blank" rel="noopener" className="glass rounded-[10px] px-4 py-2.5 text-sm font-medium transition hover:-translate-y-px">GitHub ↗</a>
          </div>
        </div>

        <div className="glass rounded-[20px] p-6 sm:p-8">
          {sent ? (
            <div className="grid min-h-80 place-items-center text-center" role="status">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-ok/15 text-xl text-ok">✓</span>
                <h3 className="mt-4 text-xl font-semibold">{dict.successTitle}</h3>
                <p className="mt-2 text-muted">{dict.successText}</p>
                <button type="button" onClick={() => setDismissed(state)} className="mt-6 cursor-pointer text-sm text-accent hover:underline">
                  {dict.again}
                </button>
              </div>
            </div>
          ) : (
            <form action={action} className="grid gap-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium">
                  {dict.name}
                  <input name="name" defaultValue={value("name")} required maxLength={limits.name} autoComplete="name" className={input("name")} aria-invalid={invalid("name")} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  {dict.email}
                  <input name="email" type="email" defaultValue={value("email")} required maxLength={limits.email} autoComplete="email" className={input("email")} aria-invalid={invalid("email")} />
                </label>
              </div>

              <fieldset className="grid gap-1.5">
                <legend className="mb-1.5 text-sm font-medium">{dict.topic}</legend>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t, i) => (
                    <label key={t} className="cursor-pointer">
                      <input type="radio" name="topic" value={t} defaultChecked={value("topic") ? value("topic") === t : i === 0} className="peer sr-only" />
                      <span className="block rounded-full border border-line bg-chip px-3.5 py-2 text-[13px] text-muted transition peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-ink peer-focus-visible:ring-4 peer-focus-visible:ring-accent-soft">
                        {dict.topics[t]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="grid gap-1.5 text-sm font-medium">
                {dict.message}
                <textarea name="message" defaultValue={value("message")} required rows={6} minLength={limits.messageMin} maxLength={limits.message} placeholder={dict.messagePlaceholder} className={`${input("message")} resize-y`} aria-invalid={invalid("message")} />
              </label>

              {/* Piège à robots, invisible pour les humains */}
              <input name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] size-px opacity-0" aria-hidden />

              <div ref={box} className="min-h-16.25" />

              {state.status === "error" && state.error && (
                <p className="text-sm text-red-500" role="alert">{dict.errors[state.error]}</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-xs text-xs text-muted">{dict.privacy}</p>
                <button type="submit" disabled={pending} className="cursor-pointer rounded-[10px] bg-ink px-5 py-3 text-sm font-medium text-bg transition hover:-translate-y-px disabled:cursor-wait disabled:opacity-60">
                  {pending ? dict.sending : `${dict.submit} →`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
