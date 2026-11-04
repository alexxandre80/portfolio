"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHead } from "./SectionHead";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Journey({ dict }: { dict: Dictionary["journey"] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // La ligne de la frise se dessine au rythme du scroll
      gsap.from(".line", { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".job").forEach((job) => {
        gsap.from(job, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: job, start: "top 85%" } });
      });
      gsap.from(".side", { y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".side", start: "top 85%" } });
    },
    { scope },
  );

  return (
    <section id="parcours" ref={scope} className="relative py-14 md:py-24">
      <div className="mx-auto max-w-295 px-4 sm:px-8">
        <SectionHead eyebrow={dict.eyebrow} title={dict.title} />

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h3 className="mb-6 font-mono text-xs tracking-widest text-muted uppercase">{dict.experienceTitle}</h3>
            <ol className="timeline relative space-y-6 pl-8">
              <span className="line absolute top-2 bottom-2 left-[7px] w-px bg-linear-to-b from-accent via-violet-500 to-line" aria-hidden />
              {dict.experience.map((job, i) => (
                <li key={job.company} className="job relative">
                  <span className={`absolute top-6 -left-8 size-[15px] rounded-full border-2 border-bg ${i === 0 ? "bg-accent shadow-[0_0_0_4px_var(--accent-soft)]" : "bg-muted/50"}`} aria-hidden />
                  <article className="glass rounded-[20px] p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="text-lg font-semibold tracking-[-0.02em]">
                        {job.role} <span className="text-muted">· {job.company}</span>
                      </h4>
                      <span className="font-mono text-xs text-muted">{job.period}</span>
                    </div>
                    <div className="mt-1 text-[13px] text-muted">{job.place}</div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{job.desc}</p>
                    {job.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
                        {job.bullets.map((b) => (
                          <li key={b} className="flex gap-2.5">
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {job.stack.map((s) => (
                        <span key={s} className="rounded-md bg-chip px-2 py-1 font-mono text-[11px] text-muted">{s}</span>
                      ))}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-12">
            <div className="side">
              <h3 className="mb-6 font-mono text-xs tracking-widest text-muted uppercase">{dict.educationTitle}</h3>
              <div className="glass divide-y divide-line rounded-[20px]">
                {dict.education.map((e) => (
                  <div key={e.degree} className="p-5">
                    <div className="font-mono text-xs text-muted">{e.period} · {e.school}</div>
                    <div className="mt-1.5 text-[15px] leading-snug font-medium">{e.degree}</div>
                    {e.note && <div className="mt-1 text-[13px] text-accent">{e.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
