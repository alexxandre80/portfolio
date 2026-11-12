"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { hunterStats, profile } from "@/data/projects";

gsap.registerPlugin(useGSAP);

type Props = { dict: Dictionary["hero"]; demo: Dictionary["heroDemo"] };

// Réponses réelles de Qwen 3 8B pour Naughty Dog, vérifiées contre Wikidata (dépôt hallucination-hunter)
const answers = [
  { title: "Uncharted 2: Among Thieves", verdict: "confirmed" },
  { title: "The Last of Us", verdict: "confirmed" },
  { title: "The Last of Us Part II", verdict: "confirmed" },
  { title: "Uncharted 3: Drake's Deception", verdict: "confirmed" },
  { title: "Crash Bandicoot 4: It's About Time", verdict: "contradicted", credit: "Toys for Bob" },
] as const;

// Remplace {strict}, {verifiable} et {recall} par les chiffres publiés, pour qu'ils ne divergent jamais du texte
export const explainMetrics = (text: string) =>
  text.replace(/\{(strict|verifiable|recall)\}/g, (_, key: keyof typeof hunterStats) => String(hunterStats[key]));

const words = (text: string) => text.split(" ").map((w, i) => <span key={i} className="word inline-block">{w}&nbsp;</span>);

export function Hero({ dict, demo }: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (reduce) tl.timeScale(100);

      tl.from(".badge", { y: 10, opacity: 0, duration: 0.5 }, 0.2)
        .from(".word", { y: 24, opacity: 0, filter: "blur(6px)", duration: 0.7, stagger: 0.04 }, 0.3)
        .from(".reveal", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.8)
        .from(".panel", { y: 40, opacity: 0, duration: 0.9 }, 0.4);

      // La question se tape, puis chaque réponse du modèle reçoit son verdict. Joué une seule fois
      const prompt = scope.current!.querySelector<HTMLElement>(".prompt")!;
      const full = prompt.dataset.text ?? "";
      const typed = { chars: 0 };
      tl.set(prompt, { textContent: "" }, 1)
        .to(typed, { chars: full.length, duration: full.length * 0.035, ease: "none", onUpdate: () => { prompt.textContent = full.slice(0, Math.round(typed.chars)); } }, 1.1)
        .from(".answer", { opacity: 0, x: -10, duration: 0.35, stagger: 0.35 }, "+=0.2")
        .from(".verdict", { scale: 0, duration: 0.3, stagger: 0.35, ease: "back.out(3)" }, "<0.2")
        .from(".demo-note", { opacity: 0, y: 6, duration: 0.5 }, "+=0.2")
        .from(".demo-stats", { opacity: 0, duration: 0.5 }, "<0.2");
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
          <a href={profile.github} target="_blank" rel="noopener" className="glass rounded-[10px] px-4 py-2.5 text-sm font-medium transition hover:-translate-y-px">
            GitHub ↗
          </a>
        </div>
        <div className="reveal mt-10 flex flex-wrap gap-6 text-[13px] text-muted">
          {dict.skills.map((s) => (
            <span key={s.label}><b className="font-medium text-ink">{s.label}</b> {s.value}</span>
          ))}
        </div>
      </div>

      <div className="panel glass overflow-hidden rounded-[20px]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 text-[13px]">
          <span className="flex gap-1.5" aria-hidden>{[0, 1, 2].map((i) => <i key={i} className="size-2.5 rounded-full bg-line" />)}</span>
          <span className="font-medium">hallucination-hunter</span>
          <span className="font-mono text-[11px] text-muted">{demo.model}</span>
        </div>

        <div className="p-4">
          <p className="mb-3 font-mono text-[13px] text-accent">
            › <span className="prompt" data-text={demo.prompt}>{demo.prompt}</span>
          </p>
          <ul className="grid gap-2">
            {answers.map((answer) => (
              <li key={answer.title} className="answer glass-inner flex items-center gap-3 rounded-xl px-3 py-2.5">
                <span className={`verdict grid size-6 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold ${answer.verdict === "confirmed" ? "bg-ok/15 text-ok" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`}>
                  {answer.verdict === "confirmed" ? "✓" : "!"}
                </span>
                {/* Sur écran étroit, le verdict passe sous le titre au lieu de déborder */}
                <span className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-3">
                  <span className="block truncate text-sm font-medium">{answer.title}</span>
                  <span className="block font-mono text-[11px] text-muted sm:ml-auto sm:shrink-0">
                    {answer.verdict === "confirmed" ? demo.confirmed : `${demo.contradicted} · ${"credit" in answer ? answer.credit : ""}`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="demo-note mt-3 text-xs leading-relaxed text-muted">{demo.note}</p>
        </div>

        <div className="demo-stats flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-4 py-3 text-xs text-muted">
          <span>{demo.scope}</span>
          <span><b className="font-mono text-sm text-ink">{hunterStats.strict}–{hunterStats.verifiable} %</b> {demo.precision}</span>
          <span><b className="font-mono text-sm text-ink">{hunterStats.recall} %</b> {demo.recall}</span>
          <a href="#projets" className="ml-auto font-medium text-accent hover:underline">{demo.link} →</a>
          <p className="demo-explain basis-full text-[11px] leading-relaxed">{explainMetrics(demo.explain)}</p>
        </div>
      </div>
    </div>
  );
}
