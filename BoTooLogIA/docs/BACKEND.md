# Backend BoTooLogIA — Structure et sécurité

## Structure

- **`app/api/`** — Routes API (App Router)
  - `GET /api/health` — Santé + connexion base
  - `GET /api/users` — Liste paginée (protégée par session admin si `ADMIN_PROTECTION_ENABLED=true`)
  - `POST /api/users` — Créer un utilisateur (admin), sauvegarde en base + audit
  - `PATCH /api/users/[id]` — Modifier un utilisateur (admin), sauvegarde en base + audit
  - `DELETE /api/users/[id]` — Supprimer un utilisateur (admin), sauvegarde audit en base
  - `GET /api/admin/stats` — Statistiques dashboard (users, sessions, auditLogs)
  - `GET /api/admin/audit-logs` — Liste paginée des journaux d'audit (option : `?action=contact.request` pour les contacts)
  - `POST /api/admin/audit-logs` — Créer une entrée d'audit (admin)
  - **BOSS (rôle boss uniquement)** : `GET /api/boss/dashboard`, `GET /api/boss/statistics`, `GET /api/boss/users/analytics`, `GET /api/boss/revenue`, `GET /api/boss/reports/:period`, `GET /api/boss/export/:type`
  - `POST /api/contact` — Demande de contact (BoToLink), sauvegarde en base (AuditLog)
- **`lib/services/`** — Services métier (ex. `boss-service.ts` pour agrégations BOSS)
- **`lib/db/`** — Client Prisma (PostgreSQL), singleton
- **`lib/validations/`** — Schémas Zod (validation des entrées)
- **`lib/api/`** — Helpers réponses API (`apiSuccess`, `apiError`, etc.)
- **`lib/auth/`** — Config auth (JWT_SECRET, etc.)
- **`lib/middleware/`** — Rate limiting
- **`middleware.ts`** — Rate limit sur `/api/*` et `/botoadmin/*`, protection admin (optionnelle)
- **`prisma/`** — Schéma PostgreSQL, migrations

## Sécurité

- **Headers** (next.config.js) : HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy
- **Rate limiting** : 100 requêtes / minute / IP sur API et admin (en mémoire ; pour la prod à grande échelle, utiliser Redis)
- **Validation** : Toutes les entrées API validées avec Zod ; `apiValidationError` pour les erreurs 400
- **Secrets** : `.env` ignoré par Git ; utiliser `.env.example` comme modèle
- **Détails** : Voir `docs/SECURITY.md` pour la sécurité des données en production

## Base de données

- **PostgreSQL** + **Prisma** (migrations, typage fort)
- Créer `.env` à partir de `.env.example`, renseigner `DATABASE_URL`
- Commandes : `npm run db:generate`, `npm run db:push`, `npm run db:migrate`, `npm run db:seed`, `npm run db:studio`

## Démarrage

1. `cp .env.example .env` puis éditer `.env` (DATABASE_URL, JWT_SECRET)
2. `npm install`
3. `npm run db:push` (ou `npm run db:migrate` pour des migrations versionnées)
4. `npm run dev`

## Protéger l’admin

Dans `middleware.ts`, décommenter le bloc qui redirige vers `/` si le cookie de session est absent pour forcer l’authentification sur `/botoadmin/*`.
