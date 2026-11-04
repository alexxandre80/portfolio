"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pauseOffscreen } from "@/lib/pauseOffscreen";

gsap.registerPlugin(useGSAP);

const layouts = {
  hero: [
    "size-[520px] bg-(--blob-1) -top-30 right-[4%]",
    "size-[420px] bg-(--blob-2) top-55 right-[30%] max-md:hidden",
    "size-[360px] bg-(--blob-3) top-95 -right-20",
  ],
  projects: [
    "size-[520px] bg-(--blob-1) top-[40%] -left-50 opacity-35!",
    "size-[360px] bg-(--blob-3) bottom-[15%] right-[10%] opacity-35!",
  ],
};

// Formes colorées floues derrière les surfaces en verre
export function Blobs({ variant }: { variant: keyof typeof layouts }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const drifts = gsap.utils.toArray<HTMLElement>(".blob").map((blob, i) =>
        gsap.to(blob, { x: "random(-80, 80)", y: "random(-60, 60)", duration: "random(8, 12)", repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.5 }),
      );
      const stopObserving = pauseOffscreen(scope.current, drifts);

      if (variant !== "hero") return stopObserving;
      gsap.from(".blob", { scale: 0.4, opacity: 0, duration: 1.6, stagger: 0.15, ease: "expo.out" });
      const qx = gsap.quickTo(scope.current, "x", { duration: 1.5, ease: "power3" });
      const qy = gsap.quickTo(scope.current, "y", { duration: 1.5, ease: "power3" });
      const onMove = (e: MouseEvent) => {
        qx((e.clientX / innerWidth - 0.5) * 50);
        qy((e.clientY / innerHeight - 0.5) * 30);
      };
      addEventListener("mousemove", onMove);
      return () => {
        stopObserving();
        removeEventListener("mousemove", onMove);
      };
    },
    { scope },
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div ref={scope} className="absolute inset-0">
        {layouts[variant].map((cls) => (
          <div key={cls} className={`blob absolute rounded-full opacity-75 blur-[70px] max-md:blur-[50px] ${cls}`} />
        ))}
      </div>
    </div>
  );
}
