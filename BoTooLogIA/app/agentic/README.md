# Agentic AI Landing Page

Landing hyper-premium pour le produit "Agentic AI Full-Stack" : scène 3D (visage biométrique, œil scanner, main robotique, portail), postprocessing (Bloom, DOF, bruit), curseur custom et sections complètes.

## Lancer le projet

```bash
# À la racine du projet Next.js (BoTooLogIA)
npm install
npm run dev
```

Puis ouvrir **http://localhost:3000/agentic**.

## Structure des fichiers

- `app/agentic/page.tsx` — Page principale (hero + sections)
- `app/agentic/layout.tsx` — Layout (metadata, thème, bruit, scanlines)
- `components/agentic/` — Hero 3D, overlay, curseur
  - `AgenticHeroSection.tsx` — Section hero (canvas dynamique + overlay)
  - `AgenticSceneCanvas.tsx` — Canvas R3F + postprocessing
  - `AgenticSceneContent.tsx` — Scène 3D (visage, main, portail, tuiles, beams)
  - `HeroOverlay.tsx` — Titre, sous-texte, CTAs, chips, HUD
  - `FuturisticCursor.tsx` — Curseur custom (désactivé sur touch / reduced-motion)
- `components/agentic/sections/` — Sections sous le hero
  - `AgentWorkflowSection.tsx` — Perceive → Plan → Act → Verify
  - `FeaturesSection.tsx` — 6 cartes glass + effet lumière curseur
  - `LiveDemoSection.tsx` — Terminal + graphique factices
  - `TestimonialsSection.tsx` — 3 témoignages
  - `PricingSection.tsx` — 3 tiers (milieu mis en avant, bordure animée)
  - `FinalCtaSection.tsx` — CTA « Teleport your team into the future »
  - `ScanSweepLine.tsx` — Ligne de scan au scroll (motif récurrent)

## Modifier les couleurs

- **Tailwind** : dans `tailwind.config.ts`, section `theme.extend.colors.agentic` et `luna` :
  - `agentic.cyan` : glow principal (#00E5FF)
  - `agentic.glass` / `agentic["glass-border"]` : glassmorphism
  - `luna.1` … `luna.5` : palette Luna (dégradés, grille)
- **Scène 3D** : dans `AgenticSceneContent.tsx`, constantes `CYAN`, `CYAN_DIM` et couleurs des matériaux (visage, main, tuiles).
- **Background global** : dans `layout.tsx` la classe `bg-agentic-bg` ; le dégradé est défini dans `tailwind.config.ts` sous `backgroundImage["agentic-bg"]`.

## Désactiver la 3D ou alléger les effets

- **Désactiver toute la 3D** : dans `AgenticHeroSection.tsx`, ne pas rendre `DynamicCanvas` et afficher à la place un fond statique (ex. `div` avec `bg-agentic-bg` ou dégradé Luna). Exemple :

  ```tsx
  // Remplacer <DynamicCanvas ... /> par :
  <div className="absolute inset-0 bg-agentic-bg" />
  ```

- **Réduire les effets (low-end)** : la scène reçoit déjà `disableEffects={!!reduceMotion}` (Framer Motion `useReducedMotion()`). Quand `disableEffects` est vrai, le canvas n’affiche que le **Bloom** (pas de DOF, Vignette ni Noise). Pour forcer le mode light partout, passer `disableEffects={true}` à `AgenticSceneCanvas`.

## Passer à un embed Spline (fallback)

1. Créer une scène dans [Spline](https://spline.design), l’exporter en mode « embed » (iframe ou script).
2. Installer `@splinetool/react-spline` (ou utiliser l’iframe fournie par Spline).
3. Dans `AgenticHeroSection.tsx`, remplacer le rendu de `DynamicCanvas` par un composant qui rend soit le canvas R3F (si 3D custom), soit le viewer Spline. Exemple avec iframe :

  ```tsx
  const useSpline = process.env.NEXT_PUBLIC_AGENTIC_USE_SPLINE === "true";
  // ...
  {useSpline ? (
    <iframe src="https://my.spline.design/..." className="absolute inset-0 w-full h-full border-0" />
  ) : (
    <DynamicCanvas ... />
  )}
  ```

4. Optionnel : ajouter `NEXT_PUBLIC_AGENTIC_USE_SPLINE=true` dans `.env.local` pour basculer sans changer le code.

## Performance

- Le canvas 3D est chargé en **dynamic import** avec `ssr: false` et un fallback de chargement.
- **Suspense** entoure le contenu de la scène dans le Canvas.
- Sur appareils « low-end » ou `prefers-reduced-motion`, seuls le **Bloom** et un DPR modéré sont utilisés.
- Les textures sont minimales ; les matériaux utilisent couleurs procédurales / dégradés quand c’est possible.
