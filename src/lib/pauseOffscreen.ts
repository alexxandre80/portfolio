import type gsap from "gsap";

// Met en pause les animations en boucle quand leur bloc sort de l'écran, et les relance à son retour.
// Retourne la fonction de nettoyage à renvoyer depuis useGSAP.
export function pauseOffscreen(el: Element | null, animations: gsap.core.Animation[]) {
  if (!el) return () => {};
  const observer = new IntersectionObserver(([entry]) => {
    animations.forEach((a) => (entry.isIntersecting ? a.resume() : a.pause()));
  });
  observer.observe(el);
  return () => observer.disconnect();
}
