# BoTooLogIA

Site et back-office pour l’agence **BoTooLogIA** — Next.js 14 (App Router), TypeScript strict, Prisma 7, PostgreSQL, Tailwind, Framer Motion, auth session + bcrypt + 2FA (speakeasy).

**Roadmap & backlog (checklist technique, OWASP, fonctionnalités à ajouter)** : voir [`CARTOGRAPHIE-FONCTIONNALITES-ET-BACKLOG.md`](./CARTOGRAPHIE-FONCTIONNALITES-ET-BACKLOG.md).

## Prérequis

- **Node.js** ≥ 18 (LTS recommandé)
- **Docker** + Docker Compose v2 (pour PostgreSQL local)
- **Git**

## Quick start (5 commandes)

```bash
git clone <votre-repo> && cd <dossier-projet>
cp .env.example .env
# Éditer .env : NEXTAUTH_SECRET, JWT_SECRET (≥ 32 caractères)
docker compose up -d
npx prisma migrate deploy
npm run db:seed:admins
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) (redirection vers `/botohub`).  
Admin : `/botoadmin` (cookie session requis si `ADMIN_PROTECTION_ENABLED=true` en production).

## Architecture (ASCII)

```
                    ┌─────────────────┐
                    │   Navigateur    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Next.js 14     │
                    │  App Router     │
                    │  middleware.ts  │
                    └────────┬────────┘
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌──────▼──────┐ ┌─────▼─────┐
       │ Pages RSC/  │ │ Route       │ │ Prisma    │
       │ Client      │ │ Handlers    │ │ Client    │
       │             │ │ /api/*      │ │ + adapter │
       └─────────────┘ └──────┬──────┘ └─────┬─────┘
                              │              │
                              │       ┌──────▼──────┐
                              │       │ PostgreSQL  │
                              │       │ (Docker)    │
                              └───────┴─────────────┘
```

## Variables d’environnement

Référence complète : **`.env.example`**. Obligatoires pour un boot strict (instrumentation) :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL PostgreSQL |
| `NEXTAUTH_SECRET` | Secret session (≥ 32 caractères) |
| `JWT_SECRET` | Secret JWT / 2FA pending (≥ 32 caractères) |

Optionnel : `SKIP_ENV_VALIDATION=1` (tests / CI ciblés), clés `ANTHROPIC_*`, SMTP, réseaux sociaux publics.

## Scripts npm

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement Next.js |
| `npm run build` | Build production (`prisma generate` inclus) |
| `npm run start` | Serveur production |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest |
| `npm run test:coverage` | Vitest + couverture (seuils sur modules listés dans `vitest.config.ts`) |
| `npm run db:up` | `docker compose up -d` (PostgreSQL port **5433**) |
| `npm run db:down` | Arrêt des conteneurs |
| `npm run db:reset` | `down -v` + `up -d` (perte des données volume) |
| `npm run db:migrate` | `prisma migrate dev` (local) |
| `npm run db:migrate:deploy` | `prisma migrate deploy` (CI / prod) |
| `npm run db:seed` | Seed général |
| `npm run db:seed:admins` | Comptes admin / 2FA de démo |
| `npm run db:studio` | Prisma Studio |
| `npm run db:check` | Test de connexion (`scripts/check-db.js`) |
| `npm run check:all` | typecheck + test + build |

**Adminer** (UI SQL) : `docker compose --profile admin up -d` → [http://localhost:8080](http://localhost:8080) (serveur : `db`).

## Docker

- **`docker-compose.yml`** : PostgreSQL 16, healthcheck, volume `botoologia_pgdata`, port **5433→5432**. Profils : `app` (Next dans Docker), `tools` (Prisma push/studio), `admin` (Adminer).
- **`docker-compose.override.yml`** : volumes pour hot reload du service `app` (si vous utilisez le profil `app`).

Développement classique : **BDD dans Docker**, **Next sur l’hôte** (`npm run dev`) avec `DATABASE_URL` pointant sur `127.0.0.1:5433`.

## Sécurité

- **Pages admin** : `/botoadmin` et `/admin` — redirection vers `/login` si pas de cookie session (selon `ADMIN_PROTECTION_ENABLED` et `NODE_ENV`).
- **API admin** : contrôle **côté serveur** via `requireAdminSession` / `requireBossSession` (`lib/api/auth-guard.ts`), jamais seulement le client.
- **Rate limiting** : `/api/auth/*` (limite dédiée, `lib/middleware/rate-limit-auth.ts`) ; autres `/api/*` et pages admin (`lib/middleware/rate-limit.ts`).
- **Erreurs Prisma** : `lib/db-error-handler.ts` — codes type **P1001** → **503** « Service temporairement indisponible ». Utiliser `respondApiCatch` dans les `catch` ou envelopper avec `withApiErrorHandler`.

## Troubleshooting

| Problème | Piste |
|----------|--------|
| **Prisma P1001** | PostgreSQL arrêté → `docker compose up -d`, vérifier `DATABASE_URL` (port **5433** en local). |
| **Conflit de port 5433** | Modifier le mapping dans `docker-compose.yml` ou arrêter l’autre service. |
| **Build / dev : env invalide** | Renseigner `NEXTAUTH_SECRET` et `JWT_SECRET` (≥ 32 car.) ou `SKIP_ENV_VALIDATION=1` pour du local expérimental. |
| **2FA / accès admin** | Voir seeds (`db:seed:admins`), reset secret en base ou nouveau seed sur environnement de dev. |
| **Migrations vs `db push`** | Préférer `prisma migrate deploy` en CI/prod. Un historique uniquement `db push` peut nécessiter une base neuve avant `migrate deploy`. |

## Stack principale

Next.js 14 · React 18 · TypeScript · Tailwind · Framer Motion · Prisma 7 · PostgreSQL · Zod · bcrypt · speakeasy · Vitest.

## Licence

Projet privé — usage selon les termes du dépôt.
