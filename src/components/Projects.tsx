"use client";

import { useRef, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { hunterStats, profile, projects } from "@/data/projects";
import { Blobs } from "./Blobs";
import { SectionHead } from "./SectionHead";
import { EngineDiagram } from "./EngineDiagram";
import { ArtilleryVisual, TowerVisual, VerdictVisual, WaveVisual, WheelVisual } from "./ProjectVisuals";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const spans = {
  big: "md:col-span-4 md:row-span-2 min-h-[420px] md:min-h-[500px]",
  sm: "md:col-span-2",
  md: "md:col-span-3",
  wide: "md:col-span-6",
};

// Reflet qui suit le curseur sur la carte
const spotlight = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export function Projects({ dict }: { dict: Dictionary["projects"] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".head", { y: 20, opacity: 0, duration: 0.7, scrollTrigger: { trigger: ".head", start: "top 85%" } });
      gsap.from(".card", { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".bento", start: "top 80%" } });
    },
    { scope },
  );

  return (
    <section id="projets" ref={scope} className="relative py-14 md:py-24">
      <Blobs variant="projects" />
      <div className="relative z-10 mx-auto max-w-295 px-4 sm:px-8">
        <SectionHead eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead}>
          <a href={profile.github} target="_blank" rel="noopener" className="glass rounded-[10px] px-4 py-2.5 text-sm font-medium transition hover:-translate-y-px">
            {dict.github} →
          </a>
        </SectionHead>

        <div className="bento grid gap-4 md:grid-cols-6">
          {projects.map((p) => {
            const t = dict.items[p.id];
            const Tag = p.href ? "a" : "div";
            return (
              <Tag
                key={p.id}
                {...(p.href && { href: p.href, target: "_blank", rel: "noopener" })}
                onPointerMove={spotlight}
                className={`card glass group relative flex min-h-60 flex-col justify-between overflow-hidden rounded-[20px] p-6 transition-transform duration-300 hover:-translate-y-1 ${spans[p.size]}`}
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(360px_circle_at_var(--mx,50%)_var(--my,50%),var(--spot),transparent_60%)]" />
                {p.href && (
                  // Libellé explicite : la flèche seule n'était pas perçue comme un lien, ni où il mène
                  <span className="absolute top-5 right-5 rounded-full bg-chip px-3 py-1.5 text-xs font-medium transition-colors group-hover:bg-ink group-hover:text-bg">
                    {p.href.includes("github.com") ? dict.linkCode : dict.linkTry} ↗
                  </span>
                )}
                <div>
                  <span className={`block font-mono text-[11px] text-muted ${p.href ? "pr-24" : ""}`}>{t.tag}</span>
                  <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.02em]">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t.desc}</p>
                  {p.visual && <Chips items={p.stack} />}
                </div>
                {p.visual === "engine" && <EngineDiagram labels={dict.engine} />}
                {p.visual === "wheel" && <WheelVisual label={dict.wheel.pick} />}
                {p.visual === "wave" && <WaveVisual />}
                {p.visual === "tower" && <TowerVisual />}
                {p.visual === "artillery" && <ArtilleryVisual labels={dict.artillery} />}
                {p.visual === "verdict" && <VerdictVisual labels={dict.hunter} stats={hunterStats} />}
                {!p.visual && <Chips items={p.stack} />}
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((s) => (
        <span key={s} className="rounded-md bg-chip px-2 py-1 font-mono text-[11px] text-muted">{s}</span>
      ))}
    </div>
  );
}
