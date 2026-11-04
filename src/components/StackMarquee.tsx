"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { stack } from "@/data/projects";
import { pauseOffscreen } from "@/lib/pauseOffscreen";

gsap.registerPlugin(useGSAP);

// Couleurs de marque trop sombres pour le mode sombre : on retombe sur la couleur du texte
const brandColor = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 60 ? "var(--ink)" : `#${hex}`;
};

export function StackMarquee() {
  const track = useRef<HTMLUListElement>(null);
  const loop = useRef<gsap.core.Tween>(null);

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    loop.current = gsap.to(track.current, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    return pauseOffscreen(track.current, [loop.current]);
  });

  // Ralentit au survol pour laisser le temps de lire
  const speed = (timeScale: number) => loop.current && gsap.to(loop.current, { timeScale, duration: 0.6 });

  return (
    <div className="relative z-10 overflow-hidden border-y border-line py-5" onMouseEnter={() => speed(0.15)} onMouseLeave={() => speed(1)}>
      {/* Liste doublée pour une boucle sans saut */}
      <ul ref={track} className="flex w-max font-mono text-sm text-muted">
        {[...stack, ...stack].map((tech, i) => (
          <li
            key={i}
            aria-hidden={i >= stack.length}
            style={{ "--brand": brandColor(tech.hex) } as CSSProperties}
            className="group flex items-center gap-2.5 pr-12 transition-colors hover:text-ink"
          >
            <svg viewBox={tech.viewBox} className="size-5 fill-current transition-colors group-hover:fill-(--brand)" aria-hidden>
              <path d={tech.path} />
            </svg>
            {tech.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
