# Analyse en profondeur du frontend BoTooLogIA

## 1. Objectif et périmètre

Analyse complète du frontend (stack, structure, dépendances, environnement) et procédure d’installation forcée avec vérification pour un environnement de travail fiable.

**Hypothèses :** Windows 10/11, PowerShell, Node.js installé ou à installer, pas de proxy bloquant npm.

---

## 2. Stack technique

| Couche | Technologie | Version (package.json) | Rôle |
|--------|-------------|------------------------|------|
| **Framework** | Next.js | 14.2.18 | App Router, SSR, routing, métadonnées |
| **UI** | React | 18.3.1 | Composants, hooks |
| **Langage** | TypeScript | 5.6.3 | Typage, build |
| **Styles** | Tailwind CSS | 3.4.15 | Utility-first, thème custom |
| **PostCSS** | postcss, autoprefixer | 8.4.49, 10.4.20 | Traitement CSS |
| **Animations** | Framer Motion | 11.11.17 | Animations (avec reduced-motion) |
| **Icônes** | Lucide React | 0.460.0 | Icônes |
| **Composants UI** | Radix UI | slot, dialog, dropdown, label, separator, tabs | Accessibilité, primitives |
| **Utilitaires CSS** | class-variance-authority, clsx, tailwind-merge | — | Variants Button, `cn()` |
| **3D / WebGL** | three, @react-three/fiber, @react-three/drei, three-stdlib | ^0.169, ^8.17, ^9.114, ^2.29 | Scènes 3D, holographie |
| **Post-processing 3D** | postprocessing, @react-three/postprocessing | ^6.36, ^2.16 | Effets 3D |
| **Animation 3D** | @react-spring/three | ^9.7.0 | Physique/spring 3D |
| **Scroll** | Lenis | ^1.1.0 | Smooth scroll |
| **Lottie** | lottie-react | ^2.4.0 | Animations vectorielles |
| **Tilt** | react-parallax-tilt | ^1.7.0 | Effet parallaxe/tilt |

**Node :** `engines.node` = `>=18.0.0` ; `.nvmrc` = `20` (recommandé Node 20 LTS).

---

## 3. Structure du projet (frontend)

```
BoTooLogIA/
├── app/
│   ├── (admin)/                    # Routes admin
│   │   ├── layout.tsx              # Layout admin (sidebar)
│   │   └── botoadmin/
│   │       ├── page.tsx
│   │       ├── stats/page.tsx
│   │       └── tables/page.tsx
│   ├── (public)/                   # Routes publiques
│   │   ├── layout.tsx              # Navbar + Footer + CTA
│   │   ├── botohub/page.tsx        # Home
│   │   ├── botoadvantage/, botolab/, botolink/, botoworks/  # Sous-pages
│   ├── globals.css                 # Design system, tokens, scanlines, focus
│   ├── layout.tsx                  # Root : fonts, metadata, ClientProviders
│   └── page.tsx                    # Redirect / → /botohub
├── components/
│   ├── ui/                         # Button (ShadCN-style)
│   ├── layout/                     # Navbar, Footer, AdminSidebar, SectionWrapper, SkipLink
│   ├── sections/                  # Hero, CTA, ServiceTablets
│   ├── cards/                     # HolographicServiceCard, TabletServiceCard
│   ├── holographic/               # FloatingCard3D, HologramOrb, NeonGridFloor, ScanlineBackground
│   ├── scene/                     # SceneCanvas, DynamicSceneCanvas, HolographicSceneContent
│   ├── providers/                 # LenisProvider
│   ├── ClientProviders.tsx        # TeleportProvider, ClickSound, ChatbotWidget, Lenis
│   ├── ChatbotWidget.tsx, CtaLink.tsx, TeleportProvider.tsx, ClickSoundProvider.tsx
├── lib/
│   ├── data/                      # navigation.ts, services.ts
│   └── utils.ts, useClickSound.ts, useReducedMotion.ts
├── public/images/
├── scripts/
│   ├── verify-deps.js             # Vérifie présence de toutes les deps dans node_modules
│   ├── install-deps.ps1           # Installation forcée (clean + install)
│   ├── diagnose-node.ps1, fix-path-current-session.ps1, forcer-environnement.ps1
├── tailwind.config.ts             # Thème, content, keyframes, couleurs holographiques
├── postcss.config.js
├── next.config.js                 # reactStrictMode, transpilePackages: three, postprocessing, three-stdlib
├── tsconfig.json                  # paths @/* → ./*
├── .nvmrc                         # 20
├── .npmrc                         # legacy-peer-deps, timeouts, etc.
└── package.json
```

---

## 4. Dépendances (détail)

### Production (package.json)

- **next**, **react**, **react-dom** — Cœur Next/React.
- **framer-motion**, **lucide-react** — Animations et icônes.
- **class-variance-authority**, **clsx**, **tailwind-merge** — Gestion des classes (Button, `cn()`).
- **@radix-ui/react-slot**, **dialog**, **dropdown-menu**, **label**, **separator**, **tabs** — Primitives UI.
- **three**, **@react-three/fiber**, **@react-three/drei**, **three-stdlib** — 3D.
- **postprocessing**, **@react-three/postprocessing** — Effets 3D.
- **@react-spring/three** — Springs 3D.
- **lenis** — Smooth scroll.
- **react-parallax-tilt** — Tilt/parallaxe.
- **lottie-react** — Lottie.

### Développement

- **@types/node**, **@types/react**, **@types/react-dom**, **@types/three** — Types.
- **typescript** — Compilation.
- **tailwindcss**, **postcss**, **autoprefixer** — CSS.
- **eslint**, **eslint-config-next** — Lint.

Toutes doivent être présentes dans `node_modules` après `npm install` (vérification via `npm run verify-deps`).

---

## 5. Configuration critique

| Fichier | Points importants |
|---------|-------------------|
| **next.config.js** | `transpilePackages: ['three', 'postprocessing', 'three-stdlib']` requis pour la 3D. |
| **tsconfig.json** | `paths["@/*"] = ["./*"]` — imports `@/components/...`, `@/lib/...`. |
| **tailwind.config.ts** | `content` sur `app/`, `components/`, `lib/`. `darkMode: "class"`. Tokens holographiques. |
| **.npmrc** | `legacy-peer-deps=true`, `fetch-retries=5`, `fetch-timeout=120000` pour limiter les conflits et timeouts. |
| **.nvmrc** | Node 20 recommandé. |

---

## 6. Procédure d’installation forcée et vérification

### 6.1 Vérifier Node et npm

```powershell
node -v   # Attendu: v18.x ou v20.x
npm -v    # Attendu: 9.x ou 10.x
```

Si `node` ou `npm` n’est pas reconnu : installer Node.js LTS depuis https://nodejs.org/ et redémarrer le terminal.

### 6.2 Répertoire du projet

Toutes les commandes ci-dessous sont à exécuter dans :

`C:\Users\hassa\Desktop\BoTooLogIA\BoTooLogIA`

### 6.3 Installation avec nettoyage et force (option A — script existant)

```powershell
cd C:\Users\hassa\Desktop\BoTooLogIA\BoTooLogIA
powershell -ExecutionPolicy Bypass -File scripts/install-deps.ps1
```

Le script : nettoie le cache, supprime `node_modules` et `package-lock.json`, puis lance `npm install --legacy-peer-deps` (avec repli sur `--force` puis install standard).

### 6.4 Installation manuelle avec force (option B)

**Note :** `npm install` peut prendre 5 à 10 minutes (nombreuses dépendances). Ne pas interrompre.

```powershell
cd C:\Users\hassa\Desktop\BoTooLogIA\BoTooLogIA
npm cache clean --force
# Optionnel : repartir de zéro (long sur Windows)
# Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
# Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install --legacy-peer-deps --force
```

### 6.5 Vérification des dépendances

```powershell
npm run verify-deps
```

Sortie attendue : `OK: N dépendances installées.` (sans liste de manquantes). Si des paquets manquent, réexécuter l’installation.

### 6.6 Vérification du build

```powershell
npm run build
```

Un build Next.js réussi sans erreur TypeScript ni erreur de modules confirme un environnement correct.

### 6.7 Lancer le serveur de dev

```powershell
npm run dev
```

Ouvrir http://localhost:3000 (redirection vers `/botohub`).

---

## 7. Résumé exécutif

- **Stack :** Next.js 14 (App Router), React 18, TypeScript, Tailwind, Framer Motion, Radix, Three.js / R3F / Drei, Lenis, Lottie.
- **Structure :** Routes (public) / (admin), composants layout/sections/cards/holographic/scene, lib/data + utils, design system dans `globals.css` et `tailwind.config.ts`.
- **Environnement :** Node >= 18 (recommandé 20), npm avec `legacy-peer-deps` et optionnellement `--force` en cas de conflits.
- **Pour un environnement “bien forcé” :** exécuter le script `install-deps.ps1` (ou la séquence manuelle), puis `npm run verify-deps` et `npm run build`. En cas d’échec, vérifier Node/npm, droits du dossier, et réseau (proxy/firewall).

---

## 8. Commandes rapides (résumé)

À exécuter dans `C:\Users\hassa\Desktop\BoTooLogIA\BoTooLogIA` :

| Action | Commande |
|--------|----------|
| **Tout installer + vérifier + build** | `npm run install:force` |
| **Vérifier deps + build (sans réinstaller)** | `npm run verify-env` |
| **Vérifier les paquets uniquement** | `npm run verify-deps` |
| **Lancer le dev** | `npm run dev` |
