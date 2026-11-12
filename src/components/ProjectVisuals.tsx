"use client";

import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pauseOffscreen } from "@/lib/pauseOffscreen";

gsap.registerPlugin(useGSAP);

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Cadre commun : le visuel occupe le bas de la carte, bord à bord
function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative -mx-6 mt-5 -mb-6 flex-1 overflow-hidden border-t border-line ${className}`} aria-hidden>
      {children}
    </div>
  );
}

/* Roue de la fortune : elle tourne, s'arrête sur une initiale, puis recommence */

const names = ["A", "B", "C", "D", "E", "F"];
const fills = ["var(--accent)", "#8b5cf6", "#14b8a6", "var(--accent)", "#8b5cf6", "#14b8a6"];
const step = 360 / names.length;

// Arrondi pour que le serveur et le navigateur produisent exactement le même SVG
const round = (n: number) => Math.round(n * 100) / 100;

// Point sur le cercle, angle en degrés compté depuis le haut dans le sens horaire
const at = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return [round(Math.sin(rad) * r), round(-Math.cos(rad) * r)];
};

export function WheelVisual({ label }: { label: string }) {
  const scope = useRef<HTMLDivElement>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const wheel = scope.current!.querySelector(".wheel")!;
      // repeatRefresh retire un angle au hasard à chaque tour de boucle
      const loop = gsap.timeline({ repeat: -1, repeatRefresh: true, delay: 1 })
        .call(() => setWinner(null))
        .to(wheel, { rotation: "+=random(720, 1079)", duration: 2.8, ease: "power4.out", svgOrigin: "0 0" })
        .call(() => {
          // Le segment sous le pointeur est celui dont l'angle d'origine vaut -rotation
          const angle = Number(gsap.getProperty(wheel, "rotation"));
          const under = ((-angle % 360) + 360) % 360;
          setWinner(names[Math.floor(under / step)]);
        })
        .to({}, { duration: 2 });
      return pauseOffscreen(scope.current, [loop]);
    },
    { scope },
  );

  return (
    <Frame>
      <div ref={scope} className="flex h-full min-h-36 items-center justify-center gap-5 px-6 py-4">
        <svg viewBox="-52 -56 104 108" className="size-28 shrink-0">
          <g className="wheel">
            {names.map((n, i) => {
              const [x1, y1] = at(i * step, 48);
              const [x2, y2] = at((i + 1) * step, 48);
              const [tx, ty] = at((i + 0.5) * step, 32);
              return (
                <g key={n}>
                  <path d={`M0 0L${x1} ${y1}A48 48 0 0 1 ${x2} ${y2}Z`} fill={fills[i]} fillOpacity={i % 2 ? 0.9 : 0.7} stroke="var(--bg)" strokeWidth="1.5" />
                  <text x={tx} y={ty} fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="central">{n}</text>
                </g>
              );
            })}
            <circle r="7" fill="var(--bg)" stroke="var(--line)" />
          </g>
          <path d="M-6 -55L6 -55L0 -44Z" fill="var(--ink)" />
        </svg>
        <div className="min-w-0">
          <div className="text-xs text-muted">{label}</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-accent">{winner ?? "…"}</div>
        </div>
      </div>
    </Frame>
  );
}

/* Dispatch Dub : la piste audio bascule entre la voix anglaise et la voix française */

const bars = Array.from({ length: 40 }, (_, i) => Math.round(25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)) * 75));

export function WaveVisual() {
  const scope = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<"EN" | "FR">("EN");

  useGSAP(
    () => {
      if (reduced()) return;
      const els = gsap.utils.toArray<HTMLElement>(".bar");
      const bars = els.map((bar) =>
        gsap.to(bar, { scaleY: "random(0.3, 1)", duration: "random(0.3, 0.7)", repeat: -1, yoyo: true, repeatRefresh: true, ease: "sine.inOut" }),
      );

      // Couleurs lues au moment de la bascule, pour suivre le thème clair ou sombre
      let french = false;
      const color = () => {
        const css = getComputedStyle(document.documentElement);
        if (french) return css.getPropertyValue("--accent").trim();
        const [r, g, b] = [1, 3, 5].map((i) => parseInt(css.getPropertyValue("--muted").trim().slice(i, i + 2), 16));
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
      };

      // La nouvelle voix « remplace » l'ancienne en balayant les barres de gauche à droite
      const loop = gsap.timeline({ repeat: -1, repeatRefresh: true })
        .to({}, { duration: 2.6 })
        .call(() => {
          french = !french;
          setLang(french ? "FR" : "EN");
        })
        .to(els, { backgroundColor: color, duration: 0.25, stagger: 0.012, ease: "none" });
      return pauseOffscreen(scope.current, [...bars, loop]);
    },
    { scope },
  );

  return (
    <Frame>
      <div ref={scope} className="flex h-full min-h-36 items-center gap-5 px-6 py-5">
        <div className="flex shrink-0 flex-col gap-1.5 font-mono text-xs">
          {(["EN", "FR"] as const).map((l) => (
            <span key={l} className={`rounded-md px-2 py-1 transition-colors duration-300 ${lang === l ? "bg-accent text-white" : "bg-chip text-muted"}`}>
              {l}
            </span>
          ))}
        </div>
        <div className="wave flex h-16 flex-1 items-center gap-0.75">
          {bars.map((h, i) => (
            <span
              key={i}
              className="bar block flex-1 rounded-full bg-muted/50"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <span className="hidden shrink-0 font-mono text-[11px] text-muted sm:block">dialogue_042.wav</span>
      </div>
    </Frame>
  );
}

/* TowerDash : des joueurs grimpent la tour low poly, un seul atteint le sommet */

// Étages de la tour, du bas vers le haut : [demi-largeur basse, demi-largeur haute, y bas, y haut]
const tiers = [
  [46, 38, 118, 92],
  [36, 29, 92, 68],
  [27, 20, 68, 46],
  [18, 12, 46, 28],
] as const;

export function TowerVisual() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
      tl.set(".player", { y: 0, opacity: 1 })
        .set(".crown", { scale: 0, opacity: 0, svgOrigin: "100 18" })
        .to(".p1", { y: -30, duration: 0.8, ease: "power1.inOut" })
        .to(".p2", { y: -30, duration: 0.8, ease: "power1.inOut" }, "<0.15")
        .to(".p3", { y: -30, duration: 0.8, ease: "power1.inOut" }, "<0.15")
        .to(".p3", { opacity: 0, scale: 0.2, duration: 0.3, transformOrigin: "center" })
        .to(".p1", { y: -56, duration: 0.7, ease: "power1.inOut" })
        .to(".p2", { y: -56, duration: 0.7, ease: "power1.inOut" }, "<0.1")
        .to(".p2", { opacity: 0, scale: 0.2, duration: 0.3, transformOrigin: "center" })
        .to(".p1", { y: -88, duration: 1, ease: "power2.inOut" })
        .to(".crown", { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(3)" })
        .to({}, { duration: 1.2 });
      return pauseOffscreen(scope.current, [tl]);
    },
    { scope },
  );

  return (
    <Frame className="grid min-h-36 place-items-center">
      <div className="absolute size-60 rounded-full bg-(--blob-3) opacity-25 blur-[60px]" />
      <div ref={scope} className="relative">
        <svg viewBox="40 8 120 116" className="h-32 w-auto">
          {tiers.map(([bw, tw, by, ty], i) => (
            <g key={i}>
              {/* Deux faces par étage, chacune d'une teinte différente : l'effet low poly */}
              <path d={`M${100 - bw} ${by}L100 ${by + 4}L100 ${ty + 4}L${100 - tw} ${ty}Z`} fill="var(--accent)" fillOpacity={0.55 + i * 0.1} />
              <path d={`M100 ${by + 4}L${100 + bw} ${by}L${100 + tw} ${ty}L100 ${ty + 4}Z`} fill="#8b5cf6" fillOpacity={0.45 + i * 0.1} />
              <path d={`M${100 - tw} ${ty}L100 ${ty - 3}L${100 + tw} ${ty}L100 ${ty + 4}Z`} fill="#c4b5fd" fillOpacity={0.5} />
            </g>
          ))}
          <path className="crown" d="M92 18L94 10L98 14L100 8L102 14L106 10L108 18Z" fill="#f59e0b" />
          <circle className="player p1" cx="100" cy="114" r="3.5" fill="#14b8a6" />
          <circle className="player p2" cx="88" cy="114" r="3.5" fill="#f43f5e" />
          <circle className="player p3" cx="112" cy="114" r="3.5" fill="#f59e0b" />
        </svg>
      </div>
    </Frame>
  );
}

/* Worms en Python : un tir en cloche d'un ver à l'autre, explosion, cratère et points de vie */

// Terrain en colonnes de blocs, comme les DirtBlock du jeu d'origine
const cols = Array.from({ length: 30 }, (_, i) => Math.round(42 + 20 * Math.sin(i * 0.42) + 9 * Math.sin(i * 1.3)));
const ground = (i: number) => 150 - cols[i];
const shooter = { col: 4, x: 90 };
const target = { col: 25, x: 510 };
const start = { x: shooter.x, y: ground(shooter.col) - 12 };
const end = { x: target.x, y: ground(target.col) - 6 };
// Point de contrôle de la courbe de Bézier : la parabole culmine bien au-dessus des deux vers
const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 150 };

const along = (t: number) => ({
  x: (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x,
  y: (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y,
});

export function ArtilleryVisual({ labels }: { labels: { angle: string; power: string } }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const shell = { t: 0 };
      const crater = scope.current!.querySelector<SVGRectElement>(`.col-${target.col}`)!;
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, delay: 0.8 });
      tl.set(".trail", { strokeDashoffset: 1 })
        .set(".shell", { opacity: 0, attr: { cx: start.x, cy: start.y } })
        .set(".boom", { scale: 0, opacity: 1, svgOrigin: `${end.x} ${end.y}` })
        .set(".hp-b", { attr: { width: 36 } })
        .set(crater, { attr: { y: ground(target.col), height: cols[target.col] } })
        .set(shell, { t: 0 })
        .to(".shell", { opacity: 1, duration: 0.1 })
        .to(shell, {
          t: 1,
          duration: 1.5,
          ease: "none",
          onUpdate: () => {
            const p = along(shell.t);
            gsap.set(".shell", { attr: { cx: p.x, cy: p.y } });
          },
        })
        .to(".trail", { strokeDashoffset: 0, duration: 1.5, ease: "none" }, "<")
        .set(".shell", { opacity: 0 })
        .to(".boom", { scale: 1, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 })
        .to(crater, { attr: { y: ground(target.col) + 10, height: cols[target.col] - 10 }, duration: 0.2 }, "<")
        .to(".hp-b", { attr: { width: 20 }, duration: 0.5, ease: "power2.out" }, "<")
        .to(".trail", { opacity: 0, duration: 0.6 }, "+=0.8")
        .set(".trail", { opacity: 1 });
      return pauseOffscreen(scope.current, [tl]);
    },
    { scope },
  );

  const worm = (x: number, col: number, color: string, flip = false) => (
    <g transform={`translate(${x} ${ground(col) - 12})${flip ? " scale(-1 1)" : ""}`}>
      <rect x="-7" y="-2" width="14" height="14" rx="7" fill={color} />
      <circle cx="3" cy="2" r="2" fill="#fff" />
      <circle cx="3.6" cy="2" r="0.9" fill="#111" />
    </g>
  );

  return (
    <Frame>
      <div ref={scope} className="relative h-full min-h-44">
        <svg viewBox="0 0 600 150" preserveAspectRatio="xMidYMax meet" className="absolute inset-x-0 bottom-0 h-full w-full">
          {cols.map((h, i) => (
            <rect key={i} className={`col-${i}`} x={i * 20} y={150 - h} width="20" height={h} fill="var(--accent)" fillOpacity={0.18 + (i % 2) * 0.06} />
          ))}
          {cols.map((h, i) => (
            <rect key={`top-${i}`} x={i * 20} y={150 - h} width="20" height="4" fill="#14b8a6" fillOpacity="0.7" />
          ))}

          <path className="trail" d={`M${start.x} ${start.y}Q${control.x} ${control.y} ${end.x} ${end.y}`} pathLength={1} fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="1" strokeDashoffset="1" />

          {worm(shooter.x, shooter.col, "#f43f5e")}
          {worm(target.x, target.col, "#8b5cf6", true)}
          <rect x={shooter.x - 18} y={ground(shooter.col) - 26} width="36" height="4" rx="2" fill="#22c55e" />
          <rect x={target.x - 18} y={ground(target.col) - 26} width="36" height="4" rx="2" fill="var(--chip)" />
          <rect className="hp-b" x={target.x - 18} y={ground(target.col) - 26} width="36" height="4" rx="2" fill="#22c55e" />

          <circle className="shell" cx={start.x} cy={start.y} r="4" fill="var(--ink)" opacity="0" />
          <circle className="boom" cx={end.x} cy={end.y} r="22" fill="#f59e0b" />
          <circle className="boom" cx={end.x} cy={end.y} r="14" fill="#f43f5e" />
        </svg>
        <span className="absolute top-3 left-6 font-mono text-[11px] text-muted">
          {labels.angle} 52° · {labels.power} 78
        </span>
      </div>
    </Frame>
  );
}

/* hallucination-hunter : de vrais jeux cités pour Ubisoft Montréal reçoivent leur verdict, puis les scores se remplissent */

type HunterLabels = {
  studio: string;
  explain: string;
  confirmed: string;
  contradicted: string;
  notFound: string;
  strict: string;
  verifiable: string;
  recall: string;
};

// Réponses réelles de Qwen 3 8B, vérifiées contre Wikidata (résultats publiés dans le dépôt du projet)
const hunterRows = [
  { title: "Assassin's Creed II", verdict: "confirmed" },
  { title: "Rainbow Six Siege", verdict: "confirmed" },
  { title: "Watch Dogs: Legion", verdict: "contradicted", credit: "Ubisoft Toronto" },
  { title: "Assassin's Creed Odyssey", verdict: "contradicted", credit: "Ubisoft Quebec" },
  { title: "Rainbow Six Siege: Operation Vortex", verdict: "notFound" },
] as const;

const verdictStyle = {
  confirmed: { icon: "✓", className: "bg-ok/15 text-ok" },
  contradicted: { icon: "!", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  notFound: { icon: "?", className: "bg-chip text-muted" },
} as const;

export function VerdictVisual({ labels, stats }: { labels: HunterLabels; stats: { strict: number; verifiable: number; recall: number } }) {
  const scope = useRef<HTMLDivElement>(null);
  const bars = [
    { label: labels.verifiable, value: stats.verifiable },
    { label: labels.strict, value: stats.strict },
    { label: labels.recall, value: stats.recall },
  ];

  useGSAP(
    () => {
      if (reduced()) return;
      const fills = gsap.utils.toArray<HTMLElement>(".hfill");
      const values = gsap.utils.toArray<HTMLElement>(".hvalue");
      // Les pourcentages suivent le remplissage des barres au lieu d'être affichés en permanence
      const counters = fills.map(() => ({ value: 0 }));
      const render = () => values.forEach((el, i) => { el.textContent = `${Math.round(counters[i].value)} %`; });

      // En pause jusqu'à ce que la carte soit visible : pauseOffscreen la lance à l'arrivée du visiteur,
      // qui voit donc les barres se remplir au lieu de tomber sur des compteurs à 0 %
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });
      tl.set(".hrow", { opacity: 0, x: -12 })
        .set(".hbadge", { scale: 0 })
        .set(fills, { width: 0 })
        .set(counters, { value: 0 })
        .call(render)
        .addLabel("rows", 0.2);
      gsap.utils.toArray<HTMLElement>(".hrow").forEach((row, i) => {
        tl.to(row, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }, i === 0 ? "rows" : ">")
          .to(row.querySelector(".hbadge"), { scale: 1, duration: 0.3, ease: "back.out(3)" }, "+=0.25");
      });
      // Les barres se remplissent pendant que les jeux apparaissent, pas après
      fills.forEach((fill, i) => {
        const target = Number(fill.dataset.value);
        const at = `rows+=${0.3 + i * 0.15}`;
        tl.to(fill, { width: `${target}%`, duration: 2, ease: "power2.out" }, at)
          .to(counters[i], { value: target, duration: 2, ease: "power2.out", onUpdate: render }, at);
      });
      // Fin de boucle : jeux, barres et chiffres disparaissent ensemble
      tl.to({}, { duration: 3 })
        .addLabel("reset")
        .to(".hrow", { opacity: 0, duration: 0.4, stagger: 0.05 }, "reset")
        .to(fills, { width: 0, duration: 0.5, ease: "power2.in" }, "reset")
        .to(counters, { value: 0, duration: 0.5, ease: "power2.in", onUpdate: render }, "reset");
      return pauseOffscreen(scope.current, [tl]);
    },
    { scope },
  );

  return (
    <Frame>
      <div ref={scope} className="grid gap-6 px-6 py-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-2 font-mono text-[11px] text-muted">{labels.studio} Ubisoft Montréal</div>
          <ul className="grid gap-1.5">
            {hunterRows.map((row) => {
              const style = verdictStyle[row.verdict];
              return (
                <li key={row.title} className="hrow flex items-center gap-2.5 text-[13px]">
                  <span className={`hbadge grid size-5 shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold ${style.className}`}>{style.icon}</span>
                  <span className="truncate">{row.title}</span>
                  <span className="ml-auto shrink-0 font-mono text-[11px] text-muted">
                    {labels[row.verdict]}
                    {"credit" in row ? ` · ${row.credit}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="grid content-center gap-3">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="mb-1 flex justify-between font-mono text-[11px] text-muted">
                <span>{bar.label}</span>
                <span className="hvalue text-ink tabular-nums">{bar.value} %</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-chip">
                <span className="hfill block h-full rounded-full bg-linear-to-r from-accent to-violet-500" data-value={bar.value} style={{ width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
          {/* Les visiteurs ne savaient pas ce que mesurent précision et rappel */}
          <p className="text-[11px] leading-relaxed text-muted">
            {labels.explain.replace(/\{(strict|verifiable|recall)\}/g, (_, key: keyof typeof stats) => String(stats[key]))}
          </p>
        </div>
      </div>
    </Frame>
  );
}
