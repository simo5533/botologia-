# Rapport technique BoTooLogIA — à transmettre à Claude

**Date de référence :** 22 mars 2026  
**Objectif :** état du projet, ce qui fonctionne, ce qui manque, comment lancer les tests.

---

## 1. Chemins importants (Windows)

| Rôle | Chemin |
|------|--------|
| Dossier où lancer `npm` depuis le Bureau | `C:\Users\User\Desktop\BoTooLogIA` (contient un `package.json` qui délègue) |
| Projet Next.js réel (code source) | `C:\Users\User\Desktop\BoTooLogIA\BoTooLogIA\BoTooLogIA` |
| Workspace intermédiaire (scripts délégués) | `C:\Users\User\Desktop\BoTooLogIA\BoTooLogIA` |

**Erreur fréquente :** lancer `npm` dans `Desktop\BoTooLogIA` sans le `package.json` racine → `ENOENT package.json`. Utiliser soit la racine Bureau ci-dessus (avec délégation), soit aller directement dans `...\BoTooLogIA\BoTooLogIA\BoTooLogIA`.

---

## 2. Stack technique

- **Framework :** Next.js 14 (App Router), React 18, TypeScript  
- **UI :** Tailwind CSS, Framer Motion, Radix UI, composants type shadcn  
- **Données :** Prisma 7, PostgreSQL, client généré dans `generated/prisma`  
- **Auth :** sessions cookie, bcrypt, 2FA (speakeasy)  
- **Tests :** Vitest  
- **Node :** moteur attendu ≥ 18 (vérifier avec `node -v`)

---

## 3. Ce qui fonctionne (vérifié)

1. **Dépendances npm** — `npm run install:project` depuis `Desktop\BoTooLogIA` → dépendances à jour dans le sous-projet.  
2. **ESLint** — `npm run lint` → aucune erreur ni avertissement.  
3. **TypeScript** — `npm run typecheck` → `tsc --noEmit` OK.  
4. **Tests automatisés** — `npm run test` (Vitest) :  
   - **6** fichiers de test  
   - **33** tests, tous passés  
   - Couverture indicative : garde API admin, route analytics track, helpers Prisma, base de connaissances du bot, mots de passe bcrypt, helpers réponses API.  
5. **Schéma Prisma** — `npx prisma validate` → schéma valide.  
6. **Build production** — `npm run build` → compilation Next.js réussie (après correctifs `dynamic = force-dynamic` sur les routes API utilisant la BDD, pour éviter les appels Prisma pendant le build sans DB).

---

## 4. Ce qui manque / bloque

### 4.1 Base PostgreSQL (bloquant pour le full stack)

- Script `node scripts/check-db.js` (dans le dossier réel du projet) : **échec Prisma P1001** — impossible de joindre le serveur PostgreSQL.  
- Configuration typique lue depuis `.env` : hôte **`127.0.0.1`**, port **`5433`**, base **`botoologia`**.  
- **Tant que PostgreSQL n’est pas démarré** sur ce host/port avec les bons identifiants :  
  - pas de persistance (utilisateurs, sessions, contacts, analytics en BDD, admin, etc.) ;  
  - les tests Vitest **passent quand même** (ils ne dépendent pas tous d’une DB réelle pour cette batterie).  

**Actions attendues côté environnement :**

1. Démarrer PostgreSQL (souvent via Docker : `docker compose up -d` ou scripts du repo type `npm run db:up` / `db:up-safe`).  
2. Vérifier `DATABASE_URL` dans `.env` (alignée sur le port réel du conteneur).  
3. Appliquer le schéma : `npx prisma db push` ou migrations selon la doc du projet.  
4. Optionnel : seeds (`npm run db:seed`, `db:seed:admins`).  
5. Re-tester : `node scripts/check-db.js`.

### 4.2 Autres points (non bloquants pour les tests)

- Avertissement Vitest sur l’API CJS de Vite : **dépréciation**, pas un échec.  
- Mise à jour possible Prisma 7.4 → 7.5 (message informatif au `prisma generate`).

---

## 5. Commandes à copier-coller (PowerShell)

### Depuis le Bureau (recommandé)

```powershell
cd C:\Users\User\Desktop\BoTooLogIA
npm run install:project
npm run lint
npm run typecheck
npm run test
npm run build
```

### Tests uniquement

```powershell
cd C:\Users\User\Desktop\BoTooLogIA
npm run test
```

### Depuis le dossier source direct

```powershell
cd C:\Users\User\Desktop\BoTooLogIA\BoTooLogIA\BoTooLogIA
npm install
npm run test
npx prisma validate
node scripts/check-db.js
```

---

## 6. Synthèse pour décision

| Domaine | État |
|---------|------|
| Code / lint / types | OK |
| Tests Vitest (33) | OK |
| Schéma Prisma | OK |
| Build Next.js | OK (avec DB optionnelle au build grâce aux routes API dynamiques) |
| PostgreSQL runtime | **À démarrer** — sinon P1001, pas de full stack persistant |

**En une phrase :** le dépôt est sain pour le développement et la CI locale (lint, types, tests, build) ; il manque **uniquement** une instance **PostgreSQL joignable** sur la `DATABASE_URL` pour valider l’application complète avec données réelles.

---

## 7. Fichiers utiles dans le repo

- `package.json` — scripts `dev`, `build`, `test`, `typecheck`, `db:*`, etc.  
- `prisma/schema.prisma` — modèle de données  
- `prisma.config.ts` — configuration Prisma 7 (URL datasource)  
- `.env.example` — modèle de variables (ne pas commiter `.env`)  
- `scripts/check-db.js` — test de connexion DB  
- `.github/workflows/ci.yml` — pipeline (tsc, prisma validate, vitest, build)

---

*Fin du rapport — prêt à être collé dans une conversation Claude ou joint en pièce jointe.*
