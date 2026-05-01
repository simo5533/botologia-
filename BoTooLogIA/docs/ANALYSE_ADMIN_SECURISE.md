# Analyse — Système d’administration sécurisé BOTOOLOGIA

## Stack réelle du projet

| Composant | Technologie utilisée |
|-----------|----------------------|
| Framework | **Next.js 14** (App Router) |
| Base de données | **PostgreSQL** (Prisma 7, adapter pg) |
| ORM | **Prisma** (génération client dans `generated/prisma`) |
| Auth | Cookie de session (token hashé en base), **scrypt** (lib/auth/password.ts) |
| Validation | **Zod** |

**Note :** Le cahier des charges mentionnait Express + MongoDB. L’implémentation est réalisée sur la stack existante (Next.js + Prisma + PostgreSQL) pour conserver la cohérence du projet.

---

## Existant analysé

- **Auth :** `lib/auth/session.ts` (création/suppression session, cookie `session`), `lib/auth/password.ts` (scrypt).
- **Garde admin :** `lib/api/auth-guard.ts` — `requireAdminSession()` (admin ou boss), `requireBossSession()` (boss uniquement). Bypass si `ADMIN_PROTECTION_ENABLED !== "true"`.
- **Login :** `POST /api/auth/login` (email + mot de passe), audit login.failure / login.success, cookie HttpOnly.
- **Modèles :** User (email, passwordHash, name, role), Session, AuditLog, Contact, Revenue. Rôles : `user`, `admin`, `boss`.
- **Routes admin :** `/api/users`, `/api/admin/stats`, `/api/admin/audit-logs`, `/api/admin/contacts` — toutes protégées par `requireAdminSession`.
- **Routes BOSS :** `/api/boss/*` — `requireBossSession`.
- **UI :** `(auth)/login`, `(admin)/botoadmin/*` (dashboard, stats, tables, boss). Pas de 2FA ni de distinction ADMIN strict vs BOSS.

---

## Plan d’implémentation (priorités)

1. **Schéma Prisma** — User : 2FA (secret, backup codes), statut, niveau admin, verrouillage après échecs ; AuditLog : sévérité.
2. **Authentification multi-étapes** — Login étape 1 (email/mdp) → si 2FA activé, étape 2 (code TOTP) ; token temporaire pour l’étape 2.
3. **Middlewares** — `requireStrictAdmin` (ADMIN uniquement), audit avec sévérité, rate limit sur `/api/auth/login`.
4. **Seed 3 admins** — Aomar (niveau 1), Elhassane (niveau 2), Basma (niveau 3) ; mots de passe forts, 2FA, backup codes, QR.
5. **Page login admin** — Étapes visuelles (1 → 2), messages d’erreur génériques, badge “Espace sécurisé”.
6. **Dashboard admin** — Alertes, liens existants, renforcement des contrôles côté API.
7. **Documentation** — API, procédures sécurité, première connexion.

---

## Hiérarchie des rôles

- **ADMIN** : contrôle total (utilisateurs, contenu, config, BDD, sécurité). Seuls les comptes avec `role = admin` accèdent aux actions sensibles (CRUD users, config, etc.).
- **BOSS** : analytics et rapports uniquement (`/api/boss/*`, dashboard BOSS).
- **USER** : accès standard (pas d’accès admin).

Les routes “admin strict” (gestion utilisateurs, config) utilisent `requireStrictAdminSession` (role === 'admin'). Les routes “admin ou boss” (dashboard, stats, audit en lecture) conservent `requireAdminSession`.

---

## Implémenté (phase 1)

- **Schéma Prisma** : User (firstName, lastName, adminLevel, status, twoFactorSecret, twoFactorBackupCodes, lastLoginAt, passwordChangedAt, failedLoginAttempts, lockedUntil), AuditLog (severity, userAgent), enums UserStatus et AuditSeverity.
- **2FA** : `lib/auth/two-factor.ts` (TOTP + codes de secours), `lib/auth/pending-2fa.ts` (token signé pour l’étape 2), `POST /api/auth/verify-2fa`.
- **Login** : étape 1 (email/mot de passe) → si 2FA, cookie `pending2fa` et `needs2FA` ; étape 2 (code) → session. Verrouillage après 5 échecs (15 min), refus si compte suspendu/banni, audit avec sévérité et user-agent.
- **Page login** : indicateur d’étapes, formulaire code 2FA, badge "Espace sécurisé", messages d’erreur génériques.
- **Garde** : `requireStrictAdminSession` dans `lib/api/auth-guard.ts` pour les routes réservées aux ADMIN.
- **Seed 3 admins** : `npm run db:seed:admins` crée Aomar (niveau 1), Elhassane (2), Basma (3) avec mot de passe fort, 2FA et codes de secours, et écrit les identifiants dans `ADMIN_CREDENTIALS.txt` (à supprimer après sauvegarde).
- **Variables d’environnement** : `JWT_SECRET` ou `PENDING_2FA_SECRET` (32+ caractères) requis pour le token pending2fa.
