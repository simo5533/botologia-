# Rapport d'Audit Complet — BoTooLogIA

**Date :** Février 2025  
**Objectif :** Audit approfondi (architecture, configuration, base de données, authentification) et base pour les phases d'amélioration.

---

## PHASE 1 — AUDIT COMPLET

### 1. Architecture du projet

#### Structure des dossiers

```
BoTooLogIA/
├── app/
│   ├── (public)/          # Pages publiques (BoToHub, BoToLab, BoToWorks, BoToAdvantage, BoToLink)
│   ├── (admin)/           # Zone admin : /botoadmin (dashboard, stats, tables)
│   ├── (auth)/            # Login
│   ├── agentic/           # Page agentic
│   ├── api/               # Routes API (health, auth, users, admin, contact)
│   ├── layout.tsx, page.tsx, globals.css
├── components/            # UI, layout, sections, effects, botohub, agentic
├── lib/
│   ├── api/               # auth-guard, response
│   ├── auth/              # config, password, session
│   ├── chatbot/
│   ├── data/              # navigation, services, social
│   ├── db/                # prisma, audit
│   ├── middleware/        # rate-limit
│   ├── validations/       # Zod : auth, user, contact, audit, common
│   ├── logger.ts, utils.ts, ...
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── (migrations/ vide — db:push utilisé)
├── generated/prisma/     # Client Prisma généré
├── public/
├── scripts/
├── docs/
├── next.config.js
├── middleware.ts          # Rate limit + protection admin
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

#### Technologies utilisées

| Couche | Technologie |
|--------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Langage** | TypeScript |
| **UI** | React 18, TailwindCSS, Framer Motion, Radix UI (ShadCN base), Lucide |
| **3D / effets** | Three.js, React Three Fiber, Drei, Postprocessing |
| **Base de données** | PostgreSQL (Prisma 7, driver @prisma/adapter-pg) |
| **Validation** | Zod |
| **Auth** | Session en base (token hashé), cookie HttpOnly, pas de JWT côté client |
| **Build** | Next.js (webpack), Prisma generate |

**Backend :** pas d’Express ni de serveur HTTP séparé. Le « backend » est constitué des **Route Handlers** Next.js sous `app/api/` et de la couche **lib/** (db, auth, validations).

---

### 2. Vérification de la configuration

#### Fichiers de configuration examinés

| Fichier | Rôle |
|---------|------|
| `.env.example` | Modèle d’env (DATABASE_URL, JWT_SECRET, ADMIN_PROTECTION_ENABLED, POSTGRES_*) |
| `next.config.js` | Headers sécurité (HSTS, CSP, X-Frame-Options, etc.), compress, webpack aliases |
| `middleware.ts` | Rate limit sur `/api/*` et `/botoadmin/*`, redirection login si admin protégé |
| `tsconfig.json` | Alias `@/` |
| `prisma.config.ts` | Schema path, migrations path, DATABASE_URL |
| `tailwind.config.ts` | Design tokens, thème |
| `components.json` | ShadCN |

#### Variables d’environnement nécessaires

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | Oui | Connexion PostgreSQL |
| `JWT_SECRET` | Oui (auth) | Min. 32 caractères (session/crypto) |
| `NODE_ENV` | Recommandé | development / production |
| `ADMIN_PROTECTION_ENABLED` | Non | "true" = protéger /botoadmin et APIs admin |
| `NEXT_PUBLIC_APP_URL` | Optionnel | URL du site (CORS, emails) |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Si Docker | Pour docker-compose |

#### Sécurité (config)

- **CORS :** Pas de config CORS explicite ; API et front même origine (Next.js).
- **Headers :** HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy dans `next.config.js`.
- **CSP :** `script-src` contient `'unsafe-inline'` et `'unsafe-eval'` (à durcir si possible).
- **Déploiement :** Aucun Dockerfile ni CI/CD (`.github/workflows`) ni `vercel.json` dans l’audit.

---

### 3. Base de données

#### Type et accès

- **Moteur :** PostgreSQL.
- **ORM / Client :** Prisma 7, client généré dans `generated/prisma`, adaptateur `@prisma/adapter-pg`.

#### Schémas / modèles

| Modèle | Champs principaux | Rôle |
|--------|-------------------|------|
| **User** | id (cuid), email (unique), passwordHash?, name?, **role** ("user" \| "admin"), createdAt, updatedAt | Utilisateurs et rôles |
| **Session** | id, userId, tokenHash (unique), expiresAt, createdAt | Sessions (cascade delete user) |
| **AuditLog** | id, action, userId?, resource?, details (Json?), ip?, createdAt | Traçabilité |

#### Relations

- `User` 1 — N `Session` (onDelete: Cascade).
- `AuditLog` : pas de clé étrangère vers User (userId en string optionnel).

#### Collections / tables actuelles

- `User`
- `Session`
- `AuditLog`

#### Index et performances

- **Prisma :** index implicites sur `@id`, `@unique` (email, tokenHash).
- **Manquants :** pas d’index explicites dans le schéma pour :
  - `AuditLog(action)`, `AuditLog(createdAt)` (requêtes par action et par date)
  - `Session(tokenHash)` déjà unique
  - `Session(expiresAt)` pour purge des sessions expirées

**Recommandation :** ajouter `@@index([action])`, `@@index([createdAt])` sur `AuditLog` ; éventuellement `@@index([expiresAt])` sur `Session`.

#### Migrations

- Dossier `prisma/migrations` configuré dans `prisma.config.ts` mais **vide** ; le projet utilise `db:push`. Pour la production, utiliser des migrations versionnées (`prisma migrate`).

---

### 4. Authentification et rôles actuels

#### Mécanisme d’authentification

- **Session stockée en base :** token aléatoire (32 bytes base64url), hash SHA-256 en base, cookie `session` (HttpOnly, SameSite=Lax, Secure en prod).
- **Pas de JWT côté client :** le cookie est l’unique preuve de session ; `JWT_SECRET` est utilisé côté serveur (config auth).
- **Lib :** `lib/auth/session.ts` (createSession, getSessionUserId, deleteSession, cookie), `lib/auth/password.ts` (hash/vérif), `lib/auth/config.ts` (getJwtSecret).

#### Rôles actuels

- **user** (défaut)
- **admin**

Rôle stocké dans `User.role` ; validations Zod : `z.enum(["user", "admin"])`.

#### Middlewares de protection

- **middleware.ts (Next.js) :**
  - Rate limiting sur `/api/*` et `/botoadmin/*`.
  - Si `ADMIN_PROTECTION_ENABLED === "true"` et chemin sous `/botoadmin`, redirection vers `/login` si pas de cookie `session`.
- **lib/api/auth-guard.ts :**
  - `requireAdminSession(request)` : vérifie cookie, charge la session en base, exige `role === "admin"`. Si `ADMIN_PROTECTION_ENABLED !== "true"`, bypass (allowed).

#### Routes protégées (APIs)

- Toutes les routes qui appellent `requireAdminSession` sont réservées aux **admin** (quand la protection est activée) :
  - GET/POST `/api/users`
  - PATCH/DELETE `/api/users/[id]`
  - GET/POST `/api/admin/audit-logs`
  - GET `/api/admin/stats`

#### Permissions par rôle

| Rôle | Accès |
|------|--------|
| **Non connecté** | Pages publiques, POST /api/contact, GET /api/health. Pas /botoadmin ni APIs admin si protection activée. |
| **user** | Idem (le front n’expose pas d’espace « user » ; le rôle user existe en base). |
| **admin** | Dashboard /botoadmin, stats, tables (users, audit, contacts), toutes les APIs admin et users. |

---

### 5. Problèmes identifiés

| Priorité | Problème | Recommandation |
|----------|----------|-----------------|
| Haute | Rôle limité à user/admin | Ajouter le rôle **BOSS** et une garde dédiée. |
| Haute | Pas d’index sur AuditLog (action, createdAt) | Ajouter @@index pour les listes et filtres. |
| Moyenne | Pas de couche service/repository formalisée | Introduire des services (ex. boss-stats) pour réutilisation et tests. |
| Moyenne | Gestion d’erreurs non centralisée | Créer un handler d’erreurs API commun (format JSON, logs). |
| Moyenne | ESLint désactivé en build | Corriger la config / dépendances et réactiver. |
| Basse | CSP avec unsafe-inline / unsafe-eval | Durcir à moyen terme (nonces/hashes). |
| Basse | Rate limit en mémoire | Pour multi-instances, utiliser Redis (ou équivalent). |

---

### 6. Recommandations prioritaires

1. **Ajouter le rôle BOSS** avec schéma, garde `requireBossSession` (ou requireBossOrAdmin), routes et dashboard dédiés.
2. **Optimiser la base :** index sur `AuditLog(action, createdAt)`, éventuellement `Session(expiresAt)`.
3. **Backend :** centraliser les réponses d’erreur et garder les validations Zod ; ajouter une couche service pour les stats BOSS.
4. **Config / déploiement :** documenter les variables et les environnements (dev/staging/prod) ; ajouter CI (lint, typecheck, build) et Dockerfile si déploiement conteneurisé.

---

*Rapport d’audit — BoTooLogIA. À utiliser pour les phases 2 (BOSS), 3 (renforcement backend) et 4 (configuration et documentation).*
