# Rapport détaillé du projet BoTooLogIA

**Date du rapport :** 2025  
**Version projet :** 0.1.0  
**Type :** Front-end Next.js 14 — Agence IA (identité futuriste, holographique).

---

## 1. Identité et positionnement

| Élément | Valeur |
|--------|--------|
| **Marque** | BoTooLogIA |
| **Slogan** | Le Futur dès aujourd'hui |
| **Ton** | Visionnaire, premium, corporate tech |
| **Design** | Futuriste, holographique, glassmorphism, fond clair, palette cyan/bleu |
| **CTA principal** | « Monter à bord » (icône UFO animée, effet propulsion au survol) |
| **CTA secondaire** | « Entrer dans le futur » |
| **Public cible** | Décideurs et équipes techniques (agence IA) |

Les CTAs apparaissent sur toutes les pages publiques sauf BoToAdmin.

---

## 2. Stack technique

### 2.1 Core

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Node.js** | ≥ 18.0.0 (`.nvmrc` : 20) | Runtime |
| **Next.js** | 14.2.18 | Framework (App Router) |
| **React** | 18.3.1 | UI |
| **TypeScript** | 5.6.3 | Typage |
| **TailwindCSS** | 3.4.15 | Styles |
| **PostCSS** | 8.4.49 | Pipeline CSS |
| **Autoprefixer** | 10.4.20 | Préfixes navigateurs |

### 2.2 UI et animation

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Framer Motion** | 11.11.17 | Animations (dont useReducedMotion) |
| **Lucide React** | 0.460.0 | Icônes |
| **Radix UI** | slot, dialog, dropdown-menu, label, separator, tabs | Primitives accessibles |
| **class-variance-authority** | 0.7.0 | Variants (ex. Button) |
| **clsx** + **tailwind-merge** | 2.1.1 / 2.5.4 | Utilitaire `cn()` |

### 2.3 Outillage

| Outil | Version | Rôle |
|-------|---------|------|
| **ESLint** | 8.57.1 | Lint |
| **eslint-config-next** | 14.2.18 | Règles Next |
| **@types/node** | 22.9.0 | Types Node |
| **@types/react** / **react-dom** | 18.3.x | Types React |

---

## 3. Structure du projet

```
BoTooLogIA/
├── app/
│   ├── (admin)/                    # Zone admin (pas de CTA public)
│   │   ├── layout.tsx              # Layout sidebar uniquement
│   │   └── botoadmin/
│   │       ├── page.tsx           # Dashboard (stats, tableau)
│   │       ├── stats/page.tsx
│   │       └── tables/page.tsx
│   ├── (public)/                   # Zone publique
│   │   ├── layout.tsx             # Navbar + main + PublicCtaBlock + Footer
│   │   ├── botohub/page.tsx       # BoToHub — hero, services, valeurs
│   │   ├── botolab/               # BoToLab — services (layout + page)
│   │   ├── botoworks/             # BoToWorks — portfolio (layout + page)
│   │   ├── botoadvantage/         # BoToAdvantage — pourquoi nous (layout + page)
│   │   └── botolink/              # BoToLink — contact (layout + page)
│   ├── globals.css                # Tokens, Tailwind, scanlines, focus
│   ├── layout.tsx                 # Root : fonts, metadata, lang="fr"
│   └── page.tsx                   # Redirection / → /botohub
├── components/
│   ├── ui/button.tsx              # Button (ShadCN-style, variants)
│   ├── layout/
│   │   ├── Navbar.tsx             # Nav sticky, menu mobile, focus trap
│   │   ├── Footer.tsx             # Liens, slogan, CTAs
│   │   ├── AdminSidebar.tsx       # Sidebar admin (glow)
│   │   ├── SectionWrapper.tsx     # Section avec titre (h1/h2)
│   │   └── SkipLink.tsx           # Lien d’évitement
│   ├── sections/
│   │   ├── HeroHolographic.tsx    # Hero avec glow, scanlines, CTAs
│   │   ├── UfoCtaButton.tsx       # CTA « Monter à bord » + icône UFO
│   │   └── PublicCtaBlock.tsx    # Bloc CTA sur pages publiques
│   └── cards/
│       └── HolographicServiceCard.tsx  # Carte service (tilt, glow)
├── lib/
│   ├── data/
│   │   ├── navigation.ts         # publicNavLinks, adminNavLinks
│   │   └── services.ts           # 6 services (titres, descriptions, icônes)
│   └── utils.ts                  # cn()
├── scripts/
│   ├── verify-deps.js            # Vérifie présence des paquets
│   ├── install-deps.ps1          # Install propre (PowerShell)
│   ├── diagnose-node.ps1         # Diagnostic Node/npm
│   └── fix-path-current-session.ps1
├── styles/README.md              # Doc tokens
├── docs/
│   ├── ANALYSE_FRONT.md
│   ├── ANALYSE_ENVIRONNEMENT.md
│   ├── NPM_NON_RECONNU.md
│   ├── NPM_POWERSHELL_WINDOWS.md
│   └── RAPPORT_PROJET.md         # Ce fichier
├── .nvmrc                        # 20
├── .npmrc                        # engine-strict, legacy-peer-deps, timeout
├── .gitignore
├── .eslintrc.json
├── components.json               # ShadCN
├── next.config.js
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── npm-install.bat               # Install propre forcée (Windows)
├── tout-installer-et-lancer.bat  # Détection Node + install + dev
├── ouvrir-terminal-avec-node.bat
├── ouvrir-powershell-avec-node.bat
└── install-and-run.bat
```

---

## 4. Routes et pages

| Route | Label | Rôle | Metadata (titre) |
|-------|--------|------|-------------------|
| `/` | — | Redirection vers `/botohub` | — |
| `/botohub` | BoToHub | Hero, 6 cartes services, 3 valeurs | BoToHub — BoTooLogIA |
| `/botolab` | BoToLab | Grille 6 cartes (R&D, prototypage, ML Ops, etc.) | BoToLab — BoTooLogIA |
| `/botoworks` | BoToWorks | Portfolio (6 projets) | BoToWorks — BoTooLogIA |
| `/botoadvantage` | BoToAdvantage | Timeline, stats, tableau comparaison | BoToAdvantage — BoTooLogIA |
| `/botolink` | BoToLink | Formulaire contact + bloc RDV | BoToLink — BoTooLogIA |
| `/botoadmin` | BoToAdmin | Dashboard (stats, tableau) | — |
| `/botoadmin/stats` | Statistiques | Placeholder | — |
| `/botoadmin/tables` | Tables | Placeholder | — |

Toutes les pages publiques ont un layout commun (navbar, contenu, bloc CTA, footer). BoToAdmin a son propre layout (sidebar, pas de CTA public).

---

## 5. Design system

### 5.1 Polices

- **Titres** : Space Grotesk (`--font-space-grotesk`)
- **Corps** : Inter (`--font-inter`)  
Chargement via `next/font/google`, `display: swap`.

### 5.2 Tokens (globals.css)

- **Light (défaut)** : `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--ring`, `--radius`.
- **Dark** : mêmes noms, valeurs adaptées (slate).
- **Effets** : `.scanlines` (overlay optionnel), `.glass`, `.holographic-border`, `*:focus-visible` (ring cyan).

### 5.3 Tailwind (extensions)

- **Couleurs** : `border`, `holographic` (cyan, blue, purple, glow), `glass` (light, border).
- **Ombres** : `glow`, `glow-lg`, `hologram`.
- **Animations** : `scanline`, `pulse-glow`, `float`.
- **Background** : `holographic-gradient`.
- **Content** : `app/**`, `components/**`, `lib/**`.

---

## 6. Données métier

### 6.1 Navigation (`lib/data/navigation.ts`)

- **publicNavLinks** : BoToHub, BoToLab, BoToWorks, BoToAdvantage, BoToLink (href + label).
- **adminNavLinks** : Dashboard, Statistiques, Tables.

### 6.2 Services (`lib/data/services.ts`)

Six services : IA sur mesure, Automatisation intelligente, Data & Analytics, NLP & Vision, Conseil stratégique, Formation & Upskilling (titre, description, icône Lucide).

---

## 7. Configuration technique

### 7.1 package.json

- **engines** : `node": ">=18.0.0"`.
- **scripts** : `dev`, `build`, `start`, `lint`, `verify-deps`.
- Dépendances en versions figées (sans `^`) pour reproductibilité.

### 7.2 tsconfig.json

- **paths** : `@/*` → `./*`.
- **strict** : true.
- **jsx** : preserve (Next).
- **moduleResolution** : bundler.

### 7.3 next.config.js

- **reactStrictMode** : true.
- **devIndicators.buildActivity** : true.

### 7.4 .npmrc

- **engine-strict** : false.
- **legacy-peer-deps** : true.
- **fetch-retries** : 5.
- **fetch-timeout** : 120000.

---

## 8. Installation et exécution (Windows)

### 8.1 Prérequis

- Node.js 18+ (recommandé 20 LTS).
- npm (inclus avec Node).

### 8.2 Commandes

```bash
cd "c:\Users\hp\OneDrive\Bureau\BoTooLogIA"
npm install
npm run dev
```

Ou (install propre) : **npm-install.bat** puis `npm run dev`.  
Ou tout en un : **tout-installer-et-lancer.bat**.

### 8.3 PowerShell (install propre)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-deps.ps1
npm run dev
```

### 8.4 Vérification des dépendances

```bash
npm run verify-deps
```

---

## 9. Accessibilité et SEO

- **Skip link** : « Aller au contenu principal » (vers `#main-content`).
- **Menu mobile** : fermeture Escape, focus trap, restauration du focus au toggle.
- **useReducedMotion** : utilisé (Hero, PublicCtaBlock, cartes, BoToAdmin, BoToLab, BoToWorks, BoToAdvantage, BoToLink).
- **ARIA** : `aria-label`, `aria-labelledby`, `role`, `scope="col"` sur tables.
- **SEO** : metadata (title, description) par page publique ; `lang="fr"` sur `<html>`.
- **Hiérarchie** : h1 par page (SectionWrapper `headingLevel={1}`), puis h2/h3.

---

## 10. Documentation existante

| Fichier | Contenu |
|---------|---------|
| **README.md** | Stack, structure, prérequis, installation, scripts, pages, build. |
| **docs/ANALYSE_FRONT.md** | Principes, points forts, axes d’amélioration, correctifs appliqués. |
| **docs/ANALYSE_ENVIRONNEMENT.md** | Stack, structure, dépendances, config, prérequis, dépannage. |
| **docs/NPM_NON_RECONNU.md** | Solutions si npm non reconnu (CMD / installation Node). |
| **docs/NPM_POWERSHELL_WINDOWS.md** | Diagnostic et correction npm dans PowerShell / VS Code. |

---

## 11. État actuel du projet

| Critère | État |
|---------|------|
| **Installation** | Scripts batch + PowerShell pour install propre et contour des erreurs. |
| **Branding** | Libellés BoToHub / BoToLink dans nav, metadata, titres de section. |
| **Routes** | Inchangées (/botohub, /botolink, etc.). |
| **Build** | Config Next + Tailwind + TS cohérente ; pas de modification d’architecture. |
| **Dépendances** | Versions figées, `.npmrc` et scripts pour install robuste. |
| **Windows** | .bat et .ps1 pour PATH, cache, install avec legacy-peer-deps / force. |

---

## 12. Résumé

BoTooLogIA est un front-end Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, orienté agence IA avec identité futuriste et holographique. Le projet est structuré en zones publique et admin, avec design system (tokens, polices, couleurs), composants réutilisables (layout, sections, cartes, UI), et données centralisées dans `lib/data`. L’installation et le lancement sont couverts par des scripts Windows (batch et PowerShell) et une documentation dédiée (npm, PATH, PowerShell). Les libellés de navigation et de metadata sont alignés sur le branding (BoToHub, BoToLink) ; les routes et l’architecture restent inchangées.
