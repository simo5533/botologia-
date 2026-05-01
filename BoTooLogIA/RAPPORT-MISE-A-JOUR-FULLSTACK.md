# Rapport — Mise à jour full-stack BoTooLogIA & suite des travaux

**Dernière mise à jour du document :** 23 mars 2026  
**Projet :** BoTooLogIA (Next.js 14, Prisma 7, PostgreSQL, auth session + 2FA)

Ce rapport sert à **visualiser l’état global** du stack et à **poursuivre les tâches** de manière structurée (revue, onboarding, ou assistance IA).

---

## 1. Où se trouve le code

| Élément | Chemin Windows (exemple) |
|--------|---------------------------|
| Racine pratique `npm` (délégation) | `...\Desktop\BoTooLogIA` |
| **Projet applicatif (source de vérité)** | `...\Desktop\BoTooLogIA\BoTooLogIA\BoTooLogIA` |

Toujours exécuter `docker compose`, `prisma`, `npm run build`, etc. **depuis le dossier qui contient** `package.json`, `app/`, `prisma/`, `docker-compose.yml`.

---

## 2. Stack full-stack (vue d’ensemble)

| Couche | Technologies |
|--------|----------------|
| **Front** | Next.js 14 App Router, React 18, TypeScript strict, Tailwind, Framer Motion, Radix, scènes 3D (Three / R3F) |
| **API** | Route Handlers `app/api/**`, Zod, helpers `lib/api/*` |
| **Auth** | Cookies session, bcrypt, 2FA (speakeasy), garde serveur `lib/api/auth-guard.ts` |
| **Données** | PostgreSQL, Prisma 7 (`@prisma/adapter-pg`), client généré dans `generated/prisma` |
| **Config BDD** | `prisma.config.ts` + `DATABASE_URL` (`.env`) |
| **Ops local** | Docker Compose (Postgres 16, port hôte **5433**) |
| **Qualité** | ESLint, Vitest, couverture ciblée (`vitest.config.ts`), CI GitHub Actions |
| **Observabilité** | `lib/logger.ts` (éviter `console.log` en prod pour la logique métier) |

---

## 3. Mises à jour récentes (niveau full-stack)

### 3.1 Infrastructure & base de données

- **`docker-compose.yml`** (racine projet réel) : PostgreSQL **16-alpine**, mapping **5433:5432**, **healthcheck**, volume persistant **`botoologia_pgdata`**, variables **`POSTGRES_*`** via `.env`. Services optionnels : **Adminer** (profil `admin`, port 8080), **app** / **prisma-push** / **prisma-studio** (profils `app` / `tools`).
- **`docker-compose.override.yml`** : volumes pour **hot reload** si vous lancez Next **dans** Docker (profil `app`). Usage courant : **DB dans Docker + `npm run dev` sur l’hôte**.
- **Prisma** : ajout de **`deletedAt`** (soft delete) sur tous les modèles ; ajout de **`updatedAt`** là où il manquait (Session, AuditLog, Analytics, PageView, Activity, Notification). Nouvelle migration : `prisma/migrations/20260322180000_soft_delete_and_timestamps/`.
- **`migration_lock.toml`** : verrou fournisseur PostgreSQL pour les migrations.

### 3.2 Sécurité & middleware

- **`middleware.ts`** :
  - **Rate limiting dédié** aux routes **`/api/auth/*`** (`lib/middleware/rate-limit-auth.ts`, plafond plus bas que l’API générale).
  - Rate limiting **global** pour le reste de **`/api/*`** et pages admin.
  - Protection des chemins **`/botoadmin`** et **`/admin`** (cookie session, selon `ADMIN_PROTECTION_ENABLED` et `NODE_ENV`).
- Les routes **`/api/admin/*`** et **`/api/boss/*`** restent protégées **côté serveur** par `requireAdminSession` / `requireBossSession` (pas de confiance au seul front).

### 3.3 Erreurs base de données & robustesse API

- **`lib/db-error-handler.ts`** : erreurs Prisma « serveur injoignable » (ex. **P1001**, init) → réponse **503** JSON `{ error: "Service temporairement indisponible" }` + log structuré via `logger`.
- **`lib/api/with-api-error-handler.ts`** : intègre ce mapping avant le 500 générique.
- **`respondApiCatch`** : à utiliser dans les `catch` des routes ; **exemple appliqué** : `app/api/auth/login/route.ts`.
- **`lib/api/response.ts`** : helper **`apiServiceUnavailable`** (503).
- **`app/api/health/route.ts`** : `console.error` remplacé par **`logger`**.

### 3.4 Environnement & boot

- **`lib/env-validation.ts`** : validation Zod de **`DATABASE_URL`**, **`NEXTAUTH_SECRET`**, **`JWT_SECRET`** (min. 32 caractères).
- **`instrumentation.ts`** : appelle `validateEnvOrThrow()` au démarrage **Node** (Next `instrumentationHook`).
- **`vitest.config.ts`** : `SKIP_ENV_VALIDATION=1` + secrets factices pour les tests afin de ne pas bloquer Vitest.

### 3.5 CI/CD

- **`.github/workflows/ci.yml`** : service **Postgres 16**, **`prisma generate`**, **`prisma migrate deploy`**, **`tsc`**, **`prisma validate`**, **ESLint**, **`vitest run --coverage`** (seuils sur fichiers listés dans `vitest.config.ts`), **`npm run build`**.

### 3.6 Documentation & dépendances

- **`README.md`** : quick start, schéma ASCII, scripts, troubleshooting (P1001, ports, 2FA).
- **`.env.example`** : variables regroupées et commentées.
- **`package.json`** : dépendances explicites **`@prisma/client-runtime-utils`**, **`@vitest/coverage-v8`** ; script **`check:deploy`** inclut lint + couverture + build.

### 3.7 Tests

- **~51 tests** Vitest (fichiers sous `lib/**/__tests__` et `app/**/__tests__`), dont nouveaux : `db-error-handler`, `env-validation`, `rate-limit-auth`, `with-api-error-handler`, extensions `response.test.ts`.

---

## 4. État actuel (checklist rapide)

| Vérification | Statut attendu (après `docker compose up` + `.env` correct) |
|--------------|-------------------------------------------------------------|
| `npx prisma validate` | OK |
| `npm run typecheck` | OK |
| `npm run lint` | OK |
| `npm run test` | OK |
| `npm run test:coverage` | OK (seuils sur périmètre configuré) |
| `npm run build` | OK |
| `node scripts/check-db.js` | OK si Postgres joignable sur `DATABASE_URL` |
| `npx prisma migrate deploy` | OK sur base alignée avec l’historique des migrations |

**Sans Docker / sans Postgres** : le code compile et les tests passent, mais toute fonctionnalité **persistante** (login BDD, admin, CRM, etc.) reste **indisponible** (erreurs type **P1001**).

---

## 5. Dette technique & sujets ouverts (à traiter ensuite)

### Priorité haute

1. **Propager `respondApiCatch` (ou `withApiErrorHandler`)** sur **toutes** les routes `app/api/**` qui utilisent Prisma ou `createAuditLog`, pour un comportement 503 homogène.
2. **Soft delete opérationnel** : si vous utilisez `deletedAt`, ajouter **`where: { deletedAt: null }`** (ou extension Prisma) sur les lectures métier pour ne pas renvoyer d’entités « supprimées ».
3. **Audit sécurité 2FA** : relecture bout en bout de `verify-2fa`, `pending-2fa`, `two-factor.ts`, cookies, durées, et scénarios de rejeu.

### Priorité moyenne

4. **Rate limiting prod** : remplacer ou compléter le store **en mémoire** par **Redis / Upstash** pour les déploiements multi-instances.
5. **E2E** : Playwright ou Cypress sur parcours critique (login, 2FA, page admin, formulaire contact).
6. **Emails** : vérifier SMTP en préprod (variables `SMTP_*` dans `.env.example`).

### Priorité basse / qualité

7. Harmoniser les **deux niveaux** de dossiers `BoTooLogIA` (racine Bureau vs projet réel) pour éviter les erreurs `ENOENT package.json`.
8. Mettre à jour **Browserslist / caniuse-lite** si le build affiche l’avertissement.
9. Envisager **Prisma 7.5** quand vous aurez un créneau de régression.

---

## 6. Commandes utiles pour la suite

```powershell
cd C:\Users\User\Desktop\BoTooLogIA\BoTooLogIA\BoTooLogIA

# Démarrer la BDD
docker compose up -d

# Appliquer les migrations (CI / prod / base neuve)
npx prisma migrate deploy

# Développement local avec création de migration
npm run db:migrate

# Seeds
npm run db:seed:admins

# Qualité
npm run typecheck
npm run lint
npm run test
npm run test:coverage
npm run build

# App
npm run dev
```

**Adminer** : `docker compose --profile admin up -d` → http://localhost:8080 (serveur **`db`**).

---

## 7. Fichiers de référence pour continuer

| Sujet | Fichiers |
|-------|----------|
| Schéma & migrations | `prisma/schema.prisma`, `prisma/migrations/*`, `prisma.config.ts` |
| Auth API | `lib/api/auth-guard.ts`, `lib/auth/*`, `app/api/auth/*` |
| Erreurs DB | `lib/db-error-handler.ts`, `lib/api/with-api-error-handler.ts` |
| Middleware | `middleware.ts`, `lib/middleware/rate-limit.ts`, `rate-limit-auth.ts` |
| Env | `.env.example`, `lib/env-validation.ts`, `instrumentation.ts` |
| CI | `.github/workflows/ci.yml` |
| Docker | `docker-compose.yml`, `docker-compose.override.yml` |

---

## 8. Synthèse en une phrase

**Le projet est structuré pour un déploiement full-stack cohérent (Docker, migrations, CI, gestion d’erreurs DB, rate limit auth, validation d’env au boot) ; la suite logique consiste surtout à généraliser les `catch` API, activer le soft delete en requêtes, et renforcer 2FA / rate limit en production.**

---

*Document à joindre ou à copier dans une conversation pour reprendre le travail sans perdre le contexte.*
