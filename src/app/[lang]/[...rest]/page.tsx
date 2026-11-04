import { notFound } from "next/navigation";

// Cette route ne fait que déclencher la 404 : la validation de navigation instantanée n'a pas de sens ici
export const instant = false;

// Toute URL inconnue sous /fr ou /en affiche la page 404 du site
export default function CatchAll() {
  notFound();
}
