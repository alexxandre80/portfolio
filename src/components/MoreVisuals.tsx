"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pauseOffscreen } from "@/lib/pauseOffscreen";
import { Frame, reduced } from "./ProjectVisuals";

gsap.registerPlugin(useGSAP);

/* pi-coding-agent : une demande part du téléphone, passe par le DEV et la relecture, puis arrive en PROD */

type AgentLabels = {
  phone: string;
  prompt: string;
  dev: string;
  devSub: string;
  review: string;
  reviewSub: string;
  prod: string;
  prodOk: string;
  quota: string;
};

export function AgentVisual({ labels }: { labels: AgentLabels }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      // Lancée à l'arrivée de la carte à l'écran (pauseOffscreen), comme la carte hallucination-hunter
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });
      tl.set(".astage", { opacity: 0.35, borderColor: "var(--line)" })
        .set(".acheck", { scale: 0 })
        .set(".abadge", { scale: 0.6, opacity: 0 });
      gsap.utils.toArray<HTMLElement>(".astage").forEach((stage) => {
        tl.to(stage, { opacity: 1, borderColor: "var(--accent)", duration: 0.35, ease: "power2.out" }, "+=0.35")
          .to(stage.querySelectorAll(".acheck"), { scale: 1, duration: 0.3, ease: "back.out(3)" }, "+=0.25")
          .to(stage.querySelectorAll(".abadge"), { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }, "<")
          .to(stage, { borderColor: "var(--line)", duration: 0.3 }, "+=0.2");
      });
      tl.to({}, { duration: 2.5 }).to(".astage", { opacity: 0.35, duration: 0.4 });
      return pauseOffscreen(scope.current, [tl]);
    },
    { scope },
  );

  const stage = "astage rounded-xl border border-line bg-chip/60 p-3";
  const title = "mb-2 font-mono text-[11px] text-muted";

  return (
    <Frame>
      <div ref={scope} className="px-6 py-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className={stage}>
            <div className={title}>{labels.phone}</div>
            <p className="text-[13px] leading-snug">{labels.prompt}</p>
          </div>
          <div className={stage}>
            <div className={title}>{labels.dev}</div>
            <p className="flex items-center gap-2 font-mono text-[13px]">
              <span className="acheck grid size-4 place-items-center rounded-full bg-ok/15 text-[10px] text-ok">✓</span>
              commit a3f9c2e
            </p>
            <p className="mt-1 text-[11px] text-muted">{labels.devSub}</p>
          </div>
          <div className={stage}>
            <div className={title}>{labels.review}</div>
            <p className="flex items-center gap-2 text-[13px]">
              <span className="acheck grid size-4 place-items-center rounded border border-accent bg-accent text-[10px] text-white">✓</span>
              {labels.reviewSub}
            </p>
            <p className="mt-1 font-mono text-[11px]"><span className="text-ok">+12</span> <span className="text-red-500">−4</span></p>
          </div>
          <div className={stage}>
            <div className={title}>{labels.prod}</div>
            <span className="abadge inline-block rounded-full border border-ok/40 px-2.5 py-1 text-xs font-medium text-ok">{labels.prodOk}</span>
          </div>
        </div>
        <p className="mt-3 font-mono text-[11px] text-muted">{labels.quota}</p>
      </div>
    </Frame>
  );
}

/* Argon One : la température monte et redescend, le ventilateur suit la courbe réglée dans le tableau de bord */

// Paliers réels du tableau de bord : à partir de 45 °C 30 %, 55 °C 55 %, 60 °C 100 %
const fanSteps: [number, number][] = [[45, 30], [55, 55], [60, 100]];
const speedAt = (t: number) => fanSteps.reduce((s, [temp, speed]) => (t >= temp ? speed : s), 0);
const tx = (t: number) => 16 + ((t - 30) / 40) * 132;
const sy = (s: number) => 96 - s * 0.8;
// Courbe en escalier : la vitesse change d'un coup à chaque palier
const curve = [[30, 0], ...fanSteps.flatMap(([t, s], i) => [[t, i ? fanSteps[i - 1][1] : 0], [t, s]]), [70, 100]]
  .map(([t, s]) => `${Math.round(tx(t))},${Math.round(sy(s))}`)
  .join(" ");

export function FanVisual({ labels }: { labels: { temp: string; fan: string } }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const root = scope.current!;
      const dot = root.querySelector(".fdot")!;
      const readout = root.querySelector(".freadout")!;
      const spin = gsap.to(".fblades", { rotation: 360, svgOrigin: "186 52", duration: 0.6, ease: "none", repeat: -1 }).timeScale(0);
      const state = { t: 36 };
      const render = () => {
        const speed = speedAt(state.t);
        dot.setAttribute("cx", String(Math.round(tx(state.t))));
        dot.setAttribute("cy", String(Math.round(sy(speed))));
        readout.textContent = `${Math.round(state.t)} °C · ${speed} %`;
        spin.timeScale(speed / 100);
      };
      const tl = gsap.timeline({ repeat: -1 })
        .to(state, { t: 66, duration: 5, ease: "sine.inOut", onUpdate: render })
        .to({}, { duration: 1 })
        .to(state, { t: 36, duration: 5, ease: "sine.inOut", onUpdate: render })
        .to({}, { duration: 1 });
      return pauseOffscreen(root, [tl, spin]);
    },
    { scope },
  );

  return (
    <Frame>
      <div ref={scope} className="px-6 py-4">
        <div className="mb-1 flex justify-between font-mono text-[11px] text-muted">
          <span>{labels.temp} → {labels.fan}</span>
          <span className="freadout text-ink tabular-nums">36 °C · 0 %</span>
        </div>
        <svg viewBox="0 0 220 104" className="w-full">
          {[0, 50, 100].map((s) => (
            <line key={s} x1="16" x2="148" y1={sy(s)} y2={sy(s)} stroke="var(--line)" strokeWidth="0.6" />
          ))}
          <polyline points={curve} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
          <circle className="fdot" cx={Math.round(tx(36))} cy={sy(0)} r="4" fill="#f97316" />
          {/* Ventilateur : trois pales dont la vitesse suit la courbe */}
          <circle cx="186" cy="52" r="26" fill="none" stroke="var(--line)" strokeWidth="1.5" />
          <g className="fblades" fill="var(--accent)" fillOpacity="0.75">
            {[0, 120, 240].map((a) => (
              <path key={a} d="M186 52 C 180 40, 182 30, 192 29 C 196 38, 194 46, 186 52Z" transform={`rotate(${a} 186 52)`} />
            ))}
          </g>
          <circle cx="186" cy="52" r="3.5" fill="var(--ink)" />
          <text x="16" y="104" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">30 °C</text>
          <text x="148" y="104" fontSize="7" fill="var(--muted)" textAnchor="end" fontFamily="var(--font-mono)">70 °C</text>
        </svg>
      </div>
    </Frame>
  );
}

/* Album : des cartes stylisées (sans illustration) se cochent, la progression avance, une cote évolue */

const types = ["#22c55e", "#f97316", "#3b82f6", "#eab308", "#a855f7", "#eab308", "#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#eab308", "#3b82f6", "#ef4444"];
const missing = new Set([6, 13]);
const toCheck = [3, 9, 11];
const priceLine = "0,30 10,26 20,28 30,22 40,24 50,18 60,20 70,14 80,16 90,9 100,11 110,6";

export function AlbumVisual({ labels }: { labels: { owned: string; trend: string; tip: string } }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const root = scope.current!;
      const counter = root.querySelector(".acount")!;
      const count = { n: 148 };
      const render = () => { counter.textContent = `${Math.round(count.n)} / 208`; };
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });
      tl.set(".pending", { opacity: 0.25 })
        .set(".pending .tick", { scale: 0 })
        .set(count, { n: 148 })
        .call(render)
        .set(".abar", { scaleX: 148 / 208 })
        .fromTo(".aprice", { strokeDashoffset: 160 }, { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" });
      gsap.utils.toArray<HTMLElement>(".pending").forEach((card, i) => {
        tl.to(card, { opacity: 1, duration: 0.3 }, i ? "+=0.4" : "-=0.6")
          .to(card.querySelector(".tick"), { scale: 1, duration: 0.3, ease: "back.out(3)" }, "<0.1")
          .to(count, { n: 149 + i, duration: 0.3, onUpdate: render }, "<")
          .to(".abar", { scaleX: (149 + i) / 208, duration: 0.3 }, "<");
      });
      tl.to({}, { duration: 2.5 });
      return pauseOffscreen(root, [tl]);
    },
    { scope },
  );

  return (
    <Frame>
      <div ref={scope} className="px-6 py-4">
        <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] text-muted">
          <span><b className="acount text-sm font-medium text-ink tabular-nums">151 / 208</b> {labels.owned}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-chip">
          <span className="abar block h-full origin-left rounded-full bg-accent" style={{ transform: `scaleX(${151 / 208})` }} />
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {types.map((color, i) => (
            <span
              key={i}
              className={`relative aspect-[5/7] rounded-[4px] border ${missing.has(i) ? "border-dashed border-line opacity-25" : "border-transparent"} ${toCheck.includes(i) ? "pending" : ""}`}
              style={missing.has(i) ? undefined : { background: color }}
            >
              {!missing.has(i) && <span className="absolute inset-x-[12%] top-[10%] h-[42%] rounded-[2px] bg-white/35" />}
              {toCheck.includes(i) && (
                <span className="tick absolute -top-1 -right-1 grid size-3.5 place-items-center rounded-full bg-ok text-[8px] text-white">✓</span>
              )}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <svg viewBox="0 0 110 34" className="h-8 w-28 shrink-0">
            <polyline className="aprice" points={priceLine} fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="160" strokeLinejoin="round" />
          </svg>
          <p className="font-mono text-[11px] leading-snug text-muted">
            {labels.trend} <span className="text-ok">+7 %/sem</span>
            <br />
            {labels.tip}
          </p>
        </div>
      </div>
    </Frame>
  );
}
