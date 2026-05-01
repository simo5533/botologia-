# Analyse de l'environnement — BoTooLogIA

## 1. Stack technique

| Outil | Version / Rôle |
|-------|----------------|
| **Node.js** | Requis 18.x LTS ou 20.x (recommandé pour Next.js 14) |
| **npm** | Inclus avec Node.js (v9+) |
| **Next.js** | 14.2.18 (App Router) |
| **React** | ^18.3.1 |
| **TypeScript** | ^5.6.3 |
| **TailwindCSS** | ^3.4.15 |
| **PostCSS** | ^8.4.49 + autoprefixer ^10.4.20 |
| **Framer Motion** | ^11.11.17 |
| **Lucide React** | ^0.460.0 |
| **Radix UI** | slot, dialog, dropdown-menu, label, separator, tabs |
| **class-variance-authority** | ^0.7.0 |
| **clsx** + **tailwind-merge** | utilitaires CSS |

## 2. Structure du projet

```
BoTooLogIA/
├── app/
│   ├── (admin)/          # Routes admin (BoToAdmin) — layout dédié
│   ├── (public)/         # Routes publiques — layout navbar + footer + CTA
│   ├── globals.css       # Tokens, Tailwind layers, scanlines, focus
│   ├── layout.tsx        # Root : fonts, metadata, lang="fr"
│   └── page.tsx         # Redirection → /botohub
├── components/
│   ├── ui/               # Button (ShadCN-style)
│   ├── layout/           # Navbar, Footer, AdminSidebar, SectionWrapper, SkipLink
│   ├── sections/         # HeroHolographic, UfoCtaButton, PublicCtaBlock
│   └── cards/            # HolographicServiceCard
├── lib/
│   ├── data/             # navigation, services
│   └── utils.ts          # cn()
├── styles/               # Doc des tokens
├── docs/                 # ANALYSE_FRONT, ANALYSE_ENVIRONNEMENT
├── tailwind.config.ts    # Thème, couleurs, keyframes, content paths
├── postcss.config.js     # tailwindcss + autoprefixer
├── tsconfig.json         # paths @/* → ./*
├── next.config.js        # reactStrictMode
└── package.json
```

## 3. Dépendances critiques pour le build

- **next**, **react**, **react-dom** : cœur du front.
- **tailwindcss**, **postcss**, **autoprefixer** : CSS et purge.
- **typescript** : compilation TS.
- **framer-motion** : animations (avec useReducedMotion).
- **@radix-ui/react-slot** : utilisé par `Button` (asChild).
- **class-variance-authority**, **clsx**, **tailwind-merge** : classes du Button et `cn()`.

Aucune dépendance optionnelle manquante pour un build de production.

## 4. Configuration et risques connus

| Fichier | Rôle | Risque |
|---------|------|--------|
| **tsconfig.json** | `paths["@/*"]` = `["./*"]` | Aucun si on n’ajoute pas de racine au-dessus de la racine projet. |
| **tailwind.config.ts** | `content` pointe vers `app/`, `components/`, `lib/` | Aligné avec la structure réelle du projet. |
| **postcss.config.js** | Plugins Tailwind + Autoprefixer | Standard. |
| **next.config.js** | `reactStrictMode: true` | Aucun. |
| **globals.css** | `--background` / `--foreground` en `250 250 252` (sans `rgb()`) | Utilisés dans `bg-[rgb(var(--background))]` — valide en CSS moderne. |

## 5. Prérequis pour l’installation

1. **Node.js** installé et disponible en ligne de commande.
   - Téléchargement : https://nodejs.org/ (LTS).
   - Vérification : `node -v` et `npm -v` dans un terminal.
2. **Pas de proxy / pare-feu** bloquant l’accès à `registry.npmjs.org` (pour `npm install`).
3. **Droits en écriture** sur le dossier du projet (création de `node_modules` et `package-lock.json`).

## 6. Commandes pour forcer l’installation et le front

Dans le répertoire du projet :

```bash
# Installation des dépendances (obligatoire une fois)
npm install

# Build de production (vérifie que le front compile)
npm run build

# Lancer le serveur de développement
npm run dev
```

Après `npm run dev`, ouvrir **http://localhost:3000** (redirection vers `/botohub`).

## 7. En cas d’échec de `npm install`

- **« npm n’est pas reconnu »** : Node.js absent ou pas dans le PATH. Réinstaller Node.js en cochant l’option d’ajout au PATH, puis rouvrir le terminal (ou Cursor).
- **EACCES / permissions** : lancer le terminal en tant qu’utilisateur (pas « en tant qu’administrateur ») ou corriger les droits sur le dossier.
- **Réseau (ETIMEDOUT, etc.)** : vérifier proxy / VPN / pare-feu ; en entreprise, configurer `npm config set proxy` / `https-proxy` si besoin.
- **Erreurs de résolution** : supprimer `node_modules` et `package-lock.json`, puis relancer `npm install`.

## 8. Résumé

- L’environnement du projet est **standard** (Next 14, React 18, TypeScript, Tailwind, Framer Motion).
- Aucune erreur de lint repérée sur `app/`, `components/`, `lib/`.
- Le front est conçu pour **build** et **tourner** dès que `npm install` puis `npm run dev` (ou `npm run build` + `npm start`) réussissent sur une machine où Node.js et npm sont disponibles.
