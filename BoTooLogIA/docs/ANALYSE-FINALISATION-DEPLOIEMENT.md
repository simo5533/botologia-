# Analyse — Finalisation et déploiement BoTooLogIA

**Objectif :** Tout ce qu’il manque pour finaliser et déployer le projet en production.

---

## 1. Ce qui est déjà en place

| Domaine | État |
|--------|------|
| **Front** | Next.js 14, App Router, pages publiques (BoToHub, BoToLab, BoToWorks, BoToAdvantage, BoToLink), design 3D/holographique, chatbot, accessibilité (ARIA, reduced motion). |
| **Admin** | `/botoadmin` (dashboard, stats, tables users/audit/contacts), protection optionnelle par cookie session. |
| **Auth** | Login (`/login`), POST `/api/auth/login`, session en base (token hashé), cookie HttpOnly/Secure en prod, logout. |
| **API** | Health, users CRUD, admin stats/audit-logs, contact (AuditLog), validation Zod, garde `requireAdminSession`. |
| **Base** | Prisma + PostgreSQL, schéma User/Session/AuditLog, seed (admin par défaut), `db:push` / config migrations dans `prisma.config.ts`. |
| **Sécurité** | Headers (HSTS, CSP, X-Frame-Options, etc.), rate limiting (mémoire), `.env.example`, pas de secrets en dur. |
| **Doc** | README, SETUP-DB, BACKEND, SECURITY, ANALYSE_PROFONDEUR. |

---

## 2. Manques pour finaliser

### 2.1 Environnement et Docker

- **`.env.example`** ne contient pas les variables lues par `docker-compose.yml` :
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
- **Action :** Ajouter dans `.env.example` (avec valeurs d’exemple cohérentes avec SETUP-DB) pour que `npm run db:up` fonctionne après un simple `cp .env.example .env`.

### 2.2 Base de données — Migrations

- Le projet utilise **`db:push`** (synchro schéma directe). Le dossier **`prisma/migrations`** est configuré dans `prisma.config.ts` mais vide / non utilisé.
- En production, les migrations versionnées sont recommandées (historique, rollback, déploiements reproductibles).
- **Action :** Créer une migration initiale (`npx prisma migrate dev --name init`) et documenter que en prod on utilise `prisma migrate deploy` (et plus `db:push`).

### 2.3 Production — Variables et protection admin

- **`ADMIN_PROTECTION_ENABLED`** est à `"false"` dans `.env.example` : en prod il doit être **`"true"** pour exiger le login sur `/botoadmin` et les APIs admin.
- **`JWT_SECRET`** : doit être un secret fort (32+ caractères), unique par environnement ; `.env.example` indique "CHANGEZ_MOI_32_CARACTERES_MINIMUM".
- **Action :** Documenter clairement dans README ou DEPLOIEMENT : en prod, `ADMIN_PROTECTION_ENABLED=true`, `NODE_ENV=production`, `JWT_SECRET` généré, `DATABASE_URL` avec TLS.

### 2.4 Tests

- Aucun script **test** (Jest, Vitest, Playwright, etc.) dans le `package.json` du projet.
- **Action (recommandé) :** Ajouter au minimum :
  - Tests unitaires ou d’intégration pour les routes critiques (ex. `/api/health`, `/api/auth/login`, `/api/contact`, garde admin).
  - Optionnel : E2E (Playwright) pour login + une page admin.

### 2.5 Qualité de build

- **ESLint** est désactivé pendant le build (`ignoreDuringBuilds: true` dans `next.config.js`) à cause d’un bug mentionné (aria-query/rolesMap). Le typage TypeScript est vérifié (`ignoreBuildErrors: false`).
- **Action :** Corriger la config ESLint ou les dépendances pour réactiver le lint en build, ou au moins exécuter `npm run lint` en CI.

### 2.6 Content-Security-Policy (CSP)

- La CSP dans `next.config.js` contient **`'unsafe-inline'`** et **`'unsafe-eval'`** pour les scripts. Cela réduit la protection XSS.
- **Action :** À moyen terme, envisager des nonces ou hashes pour les scripts (Next.js peut les gérer) pour retirer `unsafe-inline` / `unsafe-eval` en prod.

### 2.7 Rate limiting en production

- Le rate limiting est **en mémoire** (Map). Sur plusieurs instances ou après redémarrage, les compteurs sont réinitialisés ; en plus, pas de partage entre instances.
- **Action :** Pour un déploiement multi-instances ou une charge élevée, utiliser un store externe (ex. Redis, Upstash) comme indiqué dans SECURITY.md.

### 2.8 Données sensibles dans les logs

- En dev, Prisma logue les requêtes (`log: ["query", "error", "warn"]`) ; en prod seulement `["error"]` — c’est bon.
- **SECURITY.md** rappelle de ne pas logger de PII (email, noms) en clair : à vérifier dans `lib/logger` et les appels à `createAuditLog` (les détails contact sont en base ; éviter de les écrire en clair dans les logs applicatifs).

### 2.9 Documentation à jour

- **`docs/ANALYSE_PROFONDEUR.md`** indique qu’« aucune route ne crée encore de session » : c’est faux, le login est implémenté. À mettre à jour pour éviter la confusion.

---

## 3. Manques pour le déploiement

### 3.1 Pas de Dockerfile ni d’image applicative

- Il n’y a pas de **Dockerfile** pour construire et exécuter l’app Next.js en production.
- **Action :** Ajouter un Dockerfile multi-stage (build Next.js puis `next start`) et optionnellement un `docker-compose.prod.yml` (app + DB) ou documenter l’usage sur une plateforme (Vercel, Railway, etc.).

### 3.2 Pas de CI/CD

- Aucun dossier **`.github/workflows`** (ou équivalent GitLab, etc.) pour :
  - install, lint, typecheck, build ;
  - éventuellement tests ;
  - déploiement ou livraison d’image.
- **Action :** Créer au minimum un workflow CI (lint, typecheck, build, tests si présents). Optionnel : CD (déploiement automatique sur tag ou branche).

### 3.3 Pas de configuration plateforme (Vercel / autre)

- Aucun **`vercel.json`** (ou config équivalente) pour redirections, env, ou health check.
- **Action :** Si déploiement sur Vercel : ajouter `vercel.json` si besoin (rewrites, env). Sinon, documenter la plateforme cible et les variables requises.

### 3.4 Health check et base de données

- **GET /api/health** existe et renvoie le statut DB. Les plateformes (Kubernetes, Docker Compose, PaaS) peuvent l’utiliser comme health check.
- **Action :** Documenter l’URL de health check (ex. `GET /api/health`) et le fait que en prod la DB doit être disponible (migrations appliquées avant démarrage).

### 3.5 Secrets et variables en production

- **À configurer côté hébergeur :**  
  `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PROTECTION_ENABLED=true`, `NODE_ENV=production`, `NEXT_PUBLIC_APP_URL` (URL réelle du site).
- **Action :** Rédiger une section « Déploiement » (README ou `docs/DEPLOIEMENT.md`) listant les variables obligatoires et les étapes (build, migrations, start).

### 3.6 Génération du client Prisma au build

- Le script **`build`** fait `prisma generate && next build` : le client Prisma est bien généré avant le build. En déploiement, il faut que **`DATABASE_URL`** soit disponible au moment du build si des migrations ou du seed sont exécutés ; pour un build « sans DB », souvent seul `prisma generate` a besoin de tourner (pas de connexion). Vérifier selon la plateforme.

---

## 4. Checklist finale avant mise en production

- [ ] `.env.example` contient `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (pour Docker).
- [ ] Migrations Prisma créées et utilisées en prod (`migrate deploy`).
- [ ] En prod : `ADMIN_PROTECTION_ENABLED=true`, `NODE_ENV=production`, `JWT_SECRET` fort et unique.
- [ ] En prod : `DATABASE_URL` avec TLS et identifiants dédiés.
- [ ] ESLint réactivé en build ou au moins exécuté en CI.
- [ ] Tests ajoutés (au moins health + auth + contact) et exécutés en CI.
- [ ] Documentation déploiement (variables, commandes, health check).
- [ ] Dockerfile (et éventuellement docker-compose prod) ou instructions pour la plateforme choisie.
- [ ] CI (GitHub Actions ou autre) : install, lint, typecheck, build, tests.
- [ ] Mise à jour de `docs/ANALYSE_PROFONDEUR.md` (auth/session déjà en place).
- [ ] (Optionnel) Rate limit avec Redis ; durcissement CSP.

---

## 5. Résumé des fichiers à créer ou modifier

| Fichier | Action |
|---------|--------|
| `.env.example` | Ajouter `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`. |
| `prisma/migrations` | Créer migration initiale ; doc pour `migrate deploy` en prod. |
| `Dockerfile` | Créer (multi-stage Next.js). |
| `.github/workflows/ci.yml` (ou équivalent) | Créer (lint, typecheck, build, tests). |
| `docs/DEPLOIEMENT.md` | Créer (variables, étapes, health check). |
| `README.md` ou `docs/` | Mentionner prod : ADMIN_PROTECTION_ENABLED, JWT_SECRET, migrations. |
| `docs/ANALYSE_PROFONDEUR.md` | Corriger la phrase sur l’absence de route de session. |
| `package.json` | Ajouter script `test` et dépendances de test si vous en ajoutez. |
| `next.config.js` | À terme : réactiver ESLint en build ; plus tard, durcir CSP. |

---

*Document généré pour finaliser et déployer BoTooLogIA en production.*
