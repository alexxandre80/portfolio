import type { Dictionary } from "@/i18n/dictionaries";
import {
  siClaude, siDocker, siGithubactions, siMongodb, siMysql, siNodedotjs, siPhp, siPostgresql,
  siPuppeteer, siPython, siReact, siSocketdotio, type SimpleIcon,
} from "simple-icons";
import { devicon } from "./devicon";

export type ProjectId = keyof Dictionary["projects"]["items"];

export type Project = {
  id: ProjectId;
  size: "big" | "sm" | "md" | "wide";
  stack: string[];
  href?: string;
  visual?: "engine" | "wheel" | "wave" | "tower" | "artillery" | "verdict";
};

export const profile = {
  github: "https://github.com/alexxandre80",
  linkedin: "https://www.linkedin.com/in/alexandre-mandra-b7a659148/",
};

// Grille : hallucination-hunter en pleine largeur (le projet data qui étaye le hero), puis Blind Test
// en grand avec la Roue et TowerDash à côté, puis Dispatch Dub et le Worms
export const projects: Project[] = [
  { id: "hunter", size: "wide", visual: "verdict", stack: ["Python", "Ollama", "Qwen 3", "Wikidata", "SPARQL", "Streamlit", "pytest"], href: "https://github.com/alexxandre80/hallucination-hunter" },
  { id: "blindtest", size: "big", visual: "engine", stack: ["React", "Node.js", "Express", "Socket.io", "PostgreSQL", "Prisma", "Better Auth", "Docker"], href: "https://github.com/alexxandre80/Blindtest-Saas" },
  { id: "wheel", size: "sm", visual: "wheel", stack: ["JavaScript", "PHP"], href: "https://alexxandre80.github.io/wheel/" },
  // Pas de lien : la version finale présentée en soutenance n'est pas sur GitHub
  { id: "towerdash", size: "sm", visual: "tower", stack: ["Unity", "C#", "Photon"] },
  { id: "dispatch", size: "md", visual: "wave", stack: ["Electron", "Node.js", "GitHub Actions"], href: "https://github.com/alexxandre80/Dispatch-dub" },
  { id: "worms", size: "md", visual: "artillery", stack: ["Python", "Pygame"], href: "https://github.com/alexxandre80/Projet_Python" },
];

// Résultats publiés de hallucination-hunter (v1, Qwen 3 8B, 22 studios), en pourcentage
export const hunterStats = { strict: 33, verifiable: 46, recall: 9, cited: 188 };

export type TechLogo = { title: string; viewBox: string; path: string; hex: string };

const icon = ({ title, path, hex }: SimpleIcon): TechLogo => ({ title, path, hex, viewBox: "0 0 24 24" });

export const stack: TechLogo[] = [
  icon(siPhp), icon(siPython), icon(siNodedotjs), icon(siReact), icon(siMysql), icon(siMongodb),
  icon(siPostgresql), icon(siDocker), devicon.playwright, icon(siPuppeteer), devicon.aws,
  icon(siGithubactions), icon(siClaude), icon(siSocketdotio),
];
