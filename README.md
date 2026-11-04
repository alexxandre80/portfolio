# Alexandre Mandra · Portfolio

Site personnel bilingue (français / anglais) : parcours, projets, méthode de travail et formulaire de contact.

🌐 **[alexandre-mandra.vercel.app](https://alexandre-mandra.vercel.app)**

## Stack

| Rôle | Outils |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components), React 19, TypeScript |
| Style | Tailwind CSS v4, thèmes clair et sombre en variables CSS |
| Animations | GSAP (`useGSAP`, ScrollTrigger), Lenis pour le défilement fluide |
| Contact | Server Action, Resend pour l'envoi, Cloudflare Turnstile contre le spam |
| Hébergement | Vercel |

## Points notables

- **Bilingue sans librairie** : `src/proxy.ts` choisit la langue (cookie, sinon en-tête `Accept-Language`) et redirige vers `/fr` ou `/en`. Les textes vivent dans `src/i18n/dictionaries/*.json`, lus côté serveur via `next/root-params`.
- **Visuels de projets faits main** : chaque carte de projet a son animation en SVG + GSAP (`src/components/ProjectVisuals.tsx`, `EngineDiagram.tsx`), sans image ni dépendance supplémentaire.
- **Sobriété** : les animations respectent `prefers-reduced-motion` et se mettent en pause hors de l'écran (`src/lib/pauseOffscreen.ts`).
- **Formulaire de contact** : validation côté serveur, champ piège anti-robots, vérification Turnstile, email envoyé en texte brut. Aucune donnée n'est stockée par le site.

## Structure

```
src/
├── app/[lang]/        pages (accueil, mentions légales, 404), layout, image de partage
├── app/actions/       Server Action du formulaire de contact
├── components/        sections et visuels
├── data/              projets, technos, configuration du site
├── i18n/              langues et dictionnaires FR / EN
├── lib/               utilitaires
└── proxy.ts           détection de la langue
```

## Lancer le projet en local

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev
```

Sans clé Resend, le formulaire affiche le message dans le terminal au lieu de l'envoyer. Le fichier `.env.example` contient les clés de test officielles de Turnstile.

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile |
| `RESEND_API_KEY` | Envoi des emails |
| `CONTACT_TO_EMAIL` | Adresse qui reçoit les messages |
| `CONTACT_FROM_EMAIL` | Expéditeur (optionnel) |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site (optionnel) |

## Droits

Le code est consultable pour référence. Les textes et le contenu personnel du site appartiennent à Alexandre Mandra.
