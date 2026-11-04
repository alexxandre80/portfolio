"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { pauseOffscreen } from "@/lib/pauseOffscreen";

gsap.registerPlugin(useGSAP);

type Labels = Dictionary["projects"]["engine"];

// Positions horizontales des trois acteurs, en % de la largeur
const pos = { host: 15, server: 50, players: 85 };

// Schéma du moteur temps réel : les événements Socket.io circulent entre animateur, serveur et joueurs
export function EngineDiagram({ labels }: { labels: Labels }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const hop = (sel: string, from: number, to: number) =>
        gsap.timeline()
          .set(sel, { left: `${from}%`, opacity: 0 })
          .to(sel, { opacity: 1, duration: 0.2 })
          .to(sel, { left: `${to}%`, duration: 0.9, ease: "power2.inOut" }, "<")
          .to(sel, { opacity: 0, duration: 0.2 }, "-=0.2");

      const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.6, delay: 1 })
        .add(hop(".p-buzz", pos.players, pos.server))
        .add(hop(".p-buzz", pos.server, pos.host))
        .add(hop(".p-verdict", pos.host, pos.server), "+=0.3")
        .add(hop(".p-score", pos.server, pos.players))
        .add(hop(".p-score-host", pos.server, pos.host), "<");
      return pauseOffscreen(scope.current, [loop]);
    },
    { scope },
  );

  const packet = "absolute top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 font-mono text-[11px] text-white opacity-0 shadow-lg";

  return (
    <div ref={scope} className="relative -mx-6 mt-5 -mb-6 min-h-64 flex-1 overflow-hidden border-t border-line" aria-hidden>
      <div className="absolute top-1/2 left-1/2 size-75 -translate-1/2 rounded-full bg-(--blob-1) opacity-40 blur-[60px]" />
      <div className="absolute top-1/2 right-[15%] left-[15%] border-t border-dashed border-muted/40" />

      <span className={`p-buzz bg-violet-500 ${packet}`}>{labels.events.buzz}</span>
      <span className={`p-verdict bg-accent ${packet}`}>{labels.events.verdict}</span>
      <span className={`p-score bg-teal-500 ${packet}`}>{labels.events.score}</span>
      <span className={`p-score-host bg-teal-500 ${packet}`}>{labels.events.score}</span>

      <Node x={pos.host} label={labels.host} sub={labels.hostSub}>
        <path d="M3 5h18v11H3zM8 20h8M12 16v4" />
      </Node>
      <Node x={pos.server} label={labels.server} sub="Socket.io" strong>
        <path d="M4 5h16v5H4zM4 14h16v5H4zM8 7.5h.01M8 16.5h.01" />
      </Node>
      <Node x={pos.players} label={labels.players} sub={labels.playersSub}>
        <path d="M7 3h7v13H7zM10 13h1M14 7h3v13h-7v-1" />
      </Node>
    </div>
  );
}

type NodeProps = { x: number; label: string; sub: string; strong?: boolean; children: React.ReactNode };

function Node({ x, label, sub, strong, children }: NodeProps) {
  return (
    <div className="absolute top-1/2 z-10 flex -translate-1/2 flex-col items-center gap-2" style={{ left: `${x}%` }}>
      <div className={`glass grid size-14 place-items-center rounded-2xl ${strong ? "text-accent" : "text-ink"}`}>
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </svg>
      </div>
      <div className="text-center leading-tight">
        <div className="text-[13px] font-medium">{label}</div>
        <div className="font-mono text-[10px] text-muted">{sub}</div>
      </div>
    </div>
  );
}
