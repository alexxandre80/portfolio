"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { profile } from "@/data/projects";

gsap.registerPlugin(useGSAP);

type Props = { dict: Dictionary["hero"]; pipeline: Dictionary["pipeline"] };

const words = (text: string) => text.split(" ").map((w, i) => <span key={i} className="word inline-block">{w}&nbsp;</span>);

export function Hero({ dict, pipeline }: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (reduce) tl.timeScale(100);

      tl.from(".badge", { y: 10, opacity: 0, duration: 0.5 }, 0.2)
        .from(".word", { y: 24, opacity: 0, filter: "blur(6px)", duration: 0.7, stagger: 0.04 }, 0.3)
        .from(".reveal", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.8)
        .from(".panel", { y: 40, opacity: 0, duration: 0.9 }, 0.4)
        .from(".step", { x: -12, opacity: 0, duration: 0.4, stagger: 0.12 }, 0.9);

      // Illustration du principe, sans chiffres : chaque étape se remplit puis se valide
      gsap.utils.toArray<HTMLElement>(".step").forEach((step, i) => {
        const at = 1.4 + i * 0.45;
        tl.to(step.querySelector(".fill"), { width: "100%", duration: 0.8, ease: "power2.inOut" }, at)
          .fromTo(step.querySelector(".check"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(3)" }, at + 0.7);
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative z-10 mx-auto grid max-w-295 items-center gap-14 px-4 pt-32 pb-24 sm:px-8 md:pt-42 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <span className="badge glass inline-flex items-center rounded-full px-3 py-1.5 text-[13px] text-muted">{dict.badge}</span>
        <h1 className="mt-6 text-[clamp(38px,5vw,60px)] leading-[1.05] font-semibold tracking-[-0.035em]">
          {words(dict.title)}
          {dict.highlight.split(" ").map((w, i) => (
            <span key={i} className="word text-gradient inline-block">{w}&nbsp;</span>
          ))}
        </h1>
        <p className="reveal mt-5 max-w-[520px] text-lg leading-relaxed text-muted">{dict.lead}</p>
        <div className="reveal mt-8 flex flex-wrap gap-3">
          <a href="#projets" className="rounded-[10px] bg-ink px-4 py-2.5 text-sm font-medium text-bg transition hover:-translate-y-px hover:shadow-[0_8px_24px_-6px_#3b5bdb66]">
            {dict.ctaProjects} →
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener" className="glass rounded-[10px] px-4 py-2.5 text-sm font-medium transition hover:-translate-y-px">
            {dict.ctaLinkedin} ↗
          </a>
        </div>
        <div className="reveal mt-10 flex flex-wrap gap-6 text-[13px] text-muted">
          {dict.skills.map((s) => (
            <span key={s.label}><b className="font-medium text-ink">{s.label}</b> {s.value}</span>
          ))}
        </div>
      </div>

      <div className="panel glass overflow-hidden rounded-[20px]" aria-hidden>
        <div className="flex items-center justify-between border-b border-line px-4 py-3 text-[13px]">
          <span className="flex gap-1.5">{[0, 1, 2].map((i) => <i key={i} className="size-2.5 rounded-full bg-line" />)}</span>
          <span>{pipeline.title}</span>
          <span className="w-[42px]" />
        </div>
        <div className="grid gap-2.5 p-4">
          {pipeline.steps.map((s, i) => (
            <div key={s.title} className="step glass-inner grid grid-cols-[32px_1fr_auto] items-center gap-x-3 gap-y-2.5 rounded-xl p-3">
              <span className="grid size-8 place-items-center rounded-lg bg-accent-soft font-mono text-[13px] font-medium text-accent">0{i + 1}</span>
              <div>
                <div className="text-sm font-medium">{s.title}</div>
                <div className="mt-0.5 text-xs text-muted">{s.desc}</div>
              </div>
              <span className="check grid size-6 place-items-center rounded-full bg-ok/15 text-xs text-ok">✓</span>
              <div className="col-start-2 col-end-4 h-1 overflow-hidden rounded bg-chip">
                <span className="fill block h-full w-0 rounded bg-linear-to-r from-accent to-violet-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
