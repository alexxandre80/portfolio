"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHead } from "./SectionHead";
import { Blobs } from "./Blobs";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function About({ dict }: { dict: Dictionary["about"] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".para", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".para", start: "top 85%" } });
      gsap.from(".fact", { x: 20, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: ".facts", start: "top 85%" } });
    },
    { scope },
  );

  return (
    <section id="a-propos" ref={scope} className="relative py-24">
      <Blobs variant="projects" />
      <div className="relative z-10 mx-auto max-w-295 px-4 sm:px-8">
        <SectionHead eyebrow={dict.eyebrow} title={dict.title} />
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {dict.paragraphs.map((p) => (
              <p key={p} className="para">{p}</p>
            ))}
          </div>
          <dl className="facts glass divide-y divide-line self-start rounded-[20px]">
            {dict.facts.map((f) => (
              <div key={f.label} className="fact flex items-baseline justify-between gap-4 px-5 py-4">
                <dt className="font-mono text-xs text-muted">{f.label}</dt>
                <dd className="text-right text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
