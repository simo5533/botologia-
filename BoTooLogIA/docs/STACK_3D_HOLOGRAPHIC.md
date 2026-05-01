# Stack 3D & effets holographiques — BoTooLogIA

## Bibliothèques installées

| Package | Rôle |
|--------|------|
| `three` | Moteur 3D WebGL |
| `@react-three/fiber` | Rendu React/Three.js |
| `@react-three/drei` | Helpers (Grid, etc.) |
| `three-stdlib` | Utilitaires Three |
| `@react-spring/three` | Physique/spring 3D |
| `postprocessing` | Effets post-rendu (bloom, etc.) |
| `@react-three/postprocessing` | EffectComposer, Bloom, Noise, ChromaticAberration |
| `lenis` | Smooth scroll |
| `react-parallax-tilt` | Micro 3D hover sur cartes |
| `lottie-react` | Animations Lottie (effets UI) |

## Installation propre (Windows)

```batch
npm-install.bat
```

Ou manuellement :

```batch
rd /s /q node_modules 2>nul
del package-lock.json 2>nul
npm cache clean --force
npm install --legacy-peer-deps
```

## Structure

- **`components/scene/`** — Canvas R3F, postprocessing, chargement dynamique (SSR désactivé).
- **`components/holographic/`** — HologramOrb, FloatingCard3D, ScanlineBackground, NeonGridFloor.
- **`components/providers/LenisProvider.tsx`** — Smooth scroll Lenis.

## Utilisation

- **Scène 3D (orbes + grille)** : `<DynamicSceneCanvas><HolographicSceneContent /></DynamicSceneCanvas>`.
- **Reduced motion** : passer `disableEffects` à `SceneCanvas` et désactiver le tilt sur `FloatingCard3D`.
- **Mobile** : `dprMax={1.5}` sur `SceneCanvas`, section 3D montée via `IntersectionObserver` dans `Hero3DBackground`.

## Config Next.js

- `transpilePackages: ['three', 'postprocessing', 'three-stdlib']` dans `next.config.js`.

## Design system

- Couleur holographique : `#00d4ff` (cyan), exportée comme `HOLO_CYAN` depuis `SceneCanvas`.
- Glassmorphism et ombres cohérentes avec `app/globals.css` et `tailwind.config.ts`.
