"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHead } from "./SectionHead";
import { pauseOffscreen } from "@/lib/pauseOffscreen";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Cards = Dictionary["method"]["cards"];

const icons: Record<keyof Cards, ReactNode> = {
  idea: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />,
  ai: <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />,
  data: <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />,
  secure: <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4" />,
  code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />,
};

const layout: Record<keyof Cards, string> = {
  idea: "md:col-span-2",
  ai: "md:col-span-4",
  data: "md:col-span-2",
  secure: "md:col-span-2",
  code: "md:col-span-2",
};

export function Method({ dict }: { dict: Dictionary["method"] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".mcard", { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".mgrid", start: "top 80%" } });

      // Les étapes s'allument tour à tour, puis la boucle recommence
      const steps = gsap.utils.toArray<HTMLElement>(".mstep");
      const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
      steps.forEach((step) => {
        loop.to(step, { backgroundColor: "var(--accent)", color: "#fff", duration: 0.25 })
          .to(step, { backgroundColor: "var(--chip)", color: "var(--muted)", duration: 0.25 }, "+=0.5");
      });
      return pauseOffscreen(steps[0]?.closest("ol") ?? null, [loop]);
    },
    { scope },
  );

  return (
    <section id="methode" ref={scope} className="relative py-24">
      <div className="mx-auto max-w-295 px-4 sm:px-8">
        <SectionHead eyebrow={dict.eyebrow} title={dict.title} />
        <div className="mgrid grid gap-4 md:grid-cols-6">
          {(Object.keys(layout) as (keyof Cards)[]).map((key) => {
            const card = dict.cards[key];
            return (
              <article key={key} className={`mcard glass flex flex-col rounded-[20px] p-6 ${layout[key]}`}>
                <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {icons[key]}
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.text}</p>
                {"steps" in card && (
                  <ol className="mt-auto flex flex-wrap items-center gap-2 pt-6 font-mono text-xs">
                    {card.steps.map((s, i) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="mstep rounded-lg bg-chip px-2.5 py-1.5 text-muted">{s}</span>
                        <span className="text-muted" aria-hidden>{i < card.steps.length - 1 ? "→" : "↺"}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
