# Analyse en profondeur et tests des rôles — BoTooLogIA

**Date :** Février 2025  
**Objectif :** Vue détaillée du projet, cartographie des fonctionnalités par rôle (user, admin, boss) et plan de tests manuels/automatisés.

---

## 1. Vue d’ensemble du projet

| Composant | Technologie / Détail |
|-----------|----------------------|
| **Front** | Next.js 14 (App Router), thème sombre/clair, sections 3D/holographiques, chatbot |
| **Auth** | Session cookie, login (email + mot de passe), 2FA (TOTP + codes de secours), rôles user / admin / boss |
| **Backend** | Routes API sous `app/api/`, Prisma 7 + PostgreSQL, validation Zod, gardes par rôle |
| **Sécurité** | Rate limit (middleware), ADMIN_PROTECTION_ENABLED, headers (next.config), JWT_SECRET pour session |

---

## 2. Rôles et gardes d’authentification

### 2.1 Définition des rôles (schéma Prisma)

- **user** : utilisateur standard (site public, pas d’accès admin).
- **admin** : accès back-office (Dashboard, Stats, Tables, Contacts) ; peut gérer utilisateurs et audit.
- **boss** : tout ce que fait admin **plus** Dashboard BOSS, rapports, statistiques, export, revenus.

### 2.2 Gardes API (`lib/api/auth-guard.ts`)

| Garde | Rôles autorisés | Usage |
|-------|-----------------|--------|
| `requireAdminSession` | **admin**, **boss** | Routes admin : stats, users, audit-logs, contacts. |
| `requireBossSession` | **boss** uniquement | Routes BOSS : dashboard, statistics, revenue, reports, export, users/analytics. |
| `requireStrictAdminSession` | **admin** uniquement (pas boss) | Réservé pour actions sensibles si besoin (ex. config, suppression critique). |

**Comportement :** Si `ADMIN_PROTECTION_ENABLED` ≠ `"true"` (et pas en production), les gardes laissent passer sans session (bypass dev).

### 2.3 Middleware (`middleware.ts`)

- **Rate limiting** : appliqué sur `/api/*` et `/botoadmin/*`.
- **Protection admin** : si `ADMIN_PROTECTION_ENABLED=true` (ou prod), toute requête vers `/botoadmin/*` sans cookie de session → redirection vers `/login?redirect=/botoadmin/...`.

---

## 3. Cartographie des fonctionnalités par rôle

### 3.1 Rôle **user** (utilisateur non admin)

| Fonctionnalité | Page / API | Détail |
|----------------|------------|--------|
| Navigation site public | `/`, `/botohub`, `/botolab`, `/botoworks`, `/botolink`, `/botoadvantage` | Accès sans connexion. |
| Connexion | `/login` | POST `/api/auth/login` (email + mot de passe). |
| 2FA (si activé sur le compte) | `/login` → étape 2 | POST `/api/auth/verify-2fa` (code TOTP ou code de secours). |
| Session | Cookie `session` | Après login, session valide pour toute l’app. |
| Lien « Admin » + Déconnexion | Navbar (AuthNav) | Si connecté : lien vers `/botoadmin` (selon rôle côté API) + bouton Déconnexion (POST `/api/auth/logout`). |
| Formulaire contact | `/botolink` | POST `/api/contact` (public, pas d’auth). |

**Comportement attendu :** Un **user** peut se connecter, voir le site, utiliser le formulaire contact, se déconnecter. S’il clique sur « Admin », il accède à `/botoadmin` mais les **APIs** admin (stats, users, etc.) renverront **401** car `requireAdminSession` exige admin ou boss.

### 3.2 Rôle **admin**

| Fonctionnalité | Page / API | Détail |
|----------------|------------|--------|
| Tout ce que peut faire **user** | — | Idem. |
| Accès back-office | `/botoadmin` | Middleware laisse passer (session présente). |
| Dashboard | `/botoadmin` | GET `/api/admin/stats` → cartes (utilisateurs, sessions, audit, activité). |
| Statistiques | `/botoadmin/stats` | Page dédiée (stats détaillées si implémentée). |
| Tables | `/botoadmin/tables` | Onglets **Utilisateurs**, **Audit**, **Contacts**. |
| Liste utilisateurs | GET `/api/users` | Pagination, liste + création (POST) + suppression (DELETE). |
| Liste audit | GET `/api/admin/audit-logs` | Filtre optionnel `?action=...`. |
| Liste contacts | GET `/api/admin/contacts` | Table Contact (modèle dédié), pagination, filtre `status`. |
| Déconnexion | Sidebar admin | Bouton « Déconnexion » → POST `/api/auth/logout` → redirect `/login`. |
| **Pas d’accès** | `/botoadmin/boss` | Page affichée mais GET `/api/boss/dashboard` et autres APIs BOSS → **401** (réservé BOSS). |

### 3.3 Rôle **boss**

| Fonctionnalité | Page / API | Détail |
|----------------|------------|--------|
| Tout ce que peut faire **admin** | — | Idem (requireAdminSession accepte boss). |
| Dashboard BOSS | `/botoadmin/boss` | GET `/api/boss/dashboard`, GET `/api/boss/statistics` → KPIs, graphiques, revenus. |
| Rapports | GET `/api/boss/reports/[period]` | Données par période. |
| Revenus | GET `/api/boss/revenue` | Données revenus. |
| Export | GET `/api/boss/export/[type]` | Export (ex. CSV) selon type. |
| Analytics utilisateurs | GET `/api/boss/users/analytics` | Données pour rapports utilisateurs. |

---

## 4. Résumé des routes API protégées

| Route | Méthode | Garde | Rôle(s) |
|-------|---------|-------|---------|
| `/api/auth/login` | POST | — | Public |
| `/api/auth/logout` | POST | — | Public (supprime la session). |
| `/api/auth/session` | GET | — | Public (retourne user si connecté). |
| `/api/auth/verify-2fa` | POST | — | Public (après login 2FA). |
| `/api/auth/register` | POST | — | Public (si implémenté). |
| `/api/contact` | POST | — | Public |
| `/api/users` | GET, POST | requireAdminSession | admin, boss |
| `/api/users/[id]` | GET, PATCH, DELETE | requireAdminSession | admin, boss |
| `/api/admin/stats` | GET | requireAdminSession | admin, boss |
| `/api/admin/audit-logs` | GET, POST | requireAdminSession | admin, boss |
| `/api/admin/contacts` | GET | requireAdminSession | admin, boss |
| `/api/boss/dashboard` | GET | requireBossSession | boss |
| `/api/boss/statistics` | GET | requireBossSession | boss |
| `/api/boss/revenue` | GET | requireBossSession | boss |
| `/api/boss/reports/[period]` | GET | requireBossSession | boss |
| `/api/boss/users/analytics` | GET | requireBossSession | boss |
| `/api/boss/export/[type]` | GET | requireBossSession | boss |

---

## 5. Plan de tests des fonctionnalités par rôle

### 5.1 Prérequis

- Base de données lancée (`npm run db:up:standalone`).
- Seed exécuté : `npm run db:seed` (admin, boss) et optionnellement `npm run db:seed:admins` (3 admins 2FA).
- App en cours d’exécution : `npm run dev` (http://localhost:3000).
- `ADMIN_PROTECTION_ENABLED="true"` dans `.env` pour tester la protection.

### 5.2 Tests **user** (ex. créer un user en base avec role=user ou utiliser un compte sans accès admin)

| # | Scénario | Étapes | Résultat attendu |
|---|----------|--------|-------------------|
| U1 | Accès site public sans connexion | Ouvrir `/`, `/botohub`, `/botolink` | Pages affichées, pas de redirection. |
| U2 | Connexion avec compte user | Login avec un compte `role=user` | Redirection après login (ex. `/botohub` ou redirect). |
| U3 | Accès /botoadmin sans session | Ouvrir `/botoadmin` sans être connecté | Redirection vers `/login?redirect=/botoadmin`. |
| U4 | Après connexion user : appel API admin | Connecté en user, ouvrir `/botoadmin` puis charger la page (appels GET `/api/admin/stats`, etc.) | Dashboard affiché (middleware OK) mais données peuvent échouer en 401 selon implémentation côté page. Si la page appelle les APIs, **401** pour `/api/admin/stats`, `/api/users`, etc. |
| U5 | Déconnexion depuis la Navbar | Cliquer « Déconnexion » (AuthNav) | POST `/api/auth/logout`, redirection, plus de session. |
| U6 | Formulaire contact | Remplir et envoyer le formulaire sur `/botolink` | POST `/api/contact` 200, message succès. |

### 5.3 Tests **admin** (admin@botoologia.local / admin123 ou aomarlaasri@gmail.com + 2FA)

| # | Scénario | Étapes | Résultat attendu |
|---|----------|--------|-------------------|
| A1 | Connexion admin (sans 2FA) | Login admin@botoologia.local / admin123 | Session créée, redirection. |
| A2 | Connexion admin 2FA | Login aomarlaasri@gmail.com + mot de passe → saisie code TOTP ou code de secours | Session créée après verify-2fa. |
| A3 | Accès Dashboard | Aller sur `/botoadmin` | Stats affichées (utilisateurs, sessions, audit, activité). |
| A4 | Tables – Utilisateurs | Onglet Utilisateurs, pagination | Liste des users, bouton Créer, Supprimer par ligne. |
| A5 | Créer un utilisateur | Formulaire : email, nom, rôle (user/admin/boss) → Envoyer | POST `/api/users` 200, nouvel user en base, message succès. |
| A6 | Supprimer un utilisateur | Cliquer Supprimer sur une ligne (hors soi-même si possible) | DELETE `/api/users/[id]` 200, liste rafraîchie. |
| A7 | Tables – Audit | Onglet Audit (journaux) | Liste des entrées, pagination. |
| A8 | Tables – Contacts | Onglet Contacts | Liste des demandes de contact (GET `/api/admin/contacts` ou audit avec action=contact.request selon implémentation). |
| A9 | Déconnexion depuis la sidebar | Cliquer « Déconnexion » dans AdminSidebar | POST `/api/auth/logout`, redirection vers `/login`. |
| A10 | Accès page BOSS en admin | Aller sur `/botoadmin/boss` | Message « Accès réservé au BOSS » ou erreur (APIs BOSS en 401). |

### 5.4 Tests **boss** (boss@botoologia.local / admin123)

| # | Scénario | Étapes | Résultat attendu |
|---|----------|--------|-------------------|
| B1 | Connexion boss | Login boss@botoologia.local / admin123 | Session créée. |
| B2 | Dashboard BOSS | Aller sur `/botoadmin/boss` | Données dashboard + statistiques (revenus, users par rôle, etc.). |
| B3 | Toutes les fonctionnalités admin | Dashboard, Stats, Tables (users, audit, contacts) | Même comportement qu’admin (toutes les APIs admin acceptent boss). |
| B4 | Export (si bouton/lien présent) | Déclencher un export (CSV ou autre) | GET `/api/boss/export/[type]` 200, fichier téléchargé. |
| B5 | Déconnexion | Sidebar ou Navbar | Session supprimée, redirect login. |

### 5.5 Tests transversaux

| # | Scénario | Résultat attendu |
|---|----------|-------------------|
| T1 | Rate limit | Envoyer beaucoup de requêtes vers `/api/*` ou `/botoadmin` | Après seuil : 429 + header Retry-After. |
| T2 | Session expirée / cookie supprimé | Supprimer le cookie puis aller sur `/botoadmin` | Redirection vers `/login?redirect=...`. |
| T3 | Mot de passe incorrect | Login avec mauvais mot de passe | 401, message d’erreur. |
| T4 | 2FA : code invalide | Saisir un mauvais code TOTP | 401 ou message « Code invalide ». |

---

## 6. Tests automatisés existants

- **Vitest** : `npm run test` (ou `vitest run`).
- Fichiers identifiés :
  - `lib/auth/__tests__/password.test.ts` : hash/verify mot de passe.
  - `lib/api/__tests__/response.test.ts` : helpers de réponse API.

**Note :** Sous Windows, Vitest peut échouer avec une erreur `@rollup/rollup-win32-x64-msvc`. Si besoin : `rm -r node_modules package-lock.json` puis `npm i` (ou équivalent PowerShell).

Pour couvrir les rôles et les gardes, on peut ajouter des tests unitaires pour `auth-guard.ts` (mock Prisma/session) et des tests d’intégration ou E2E pour les scénarios ci-dessus (Playwright/Cypress ou appels API avec cookies).

---

## 7. Commandes utiles

```bash
npm run dev              # Démarrer l’app
npm run db:up:standalone # Démarrer PostgreSQL (port 5433)
npm run db:seed          # Seed admin + boss
npm run db:seed:admins   # Seed 3 admins 2FA
npm run test             # Lancer les tests Vitest
npm run db:studio        # Prisma Studio (vérifier les rôles en base)
```

---

## 8. Synthèse

- **User** : site public, login, 2FA si activé, formulaire contact, déconnexion ; pas d’accès aux données admin/API admin (401).
- **Admin** : tout le back-office sauf la section BOSS (dashboard BOSS, rapports, export, analytics) ; APIs admin OK, APIs BOSS en 401.
- **Boss** : tout (admin + BOSS) ; toutes les APIs protégées accessibles.

Cette analyse et ce plan de tests permettent de valider manuellement et, à terme, d’automatiser les vérifications pour chaque rôle.
