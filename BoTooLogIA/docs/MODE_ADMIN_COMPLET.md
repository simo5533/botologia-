# Mode administrateur BoTooLogIA (BoToAdmin)

Documentation de référence : accès, protection, écrans, APIs, données et base PostgreSQL.

---

## 1. Vue d’ensemble

Le **panneau admin** est servi sous le préfixe **`/botoadmin`**. Il utilise un layout dédié (`app/(admin)/layout.tsx`) : thème sombre, sidebar, sans header/footer du site public.

| Zone | URL | Rôle requis |
|------|-----|-------------|
| Dashboard | `/botoadmin` | `admin`, `boss` ou `super_admin` |
| Analytics CEO | `/botoadmin/analytics` | idem |
| CRM Prospects | `/botoadmin/crm` | idem |
| Notifications | `/botoadmin/notifications` | idem |
| Statistiques | `/botoadmin/stats` | idem |
| Tables (données brutes) | `/botoadmin/tables` | idem |
| Dashboard BOSS | `/botoadmin/boss` | **`boss` uniquement** (voir §4) |

La connexion se fait via **`/login`** avec redirection vers `/botoadmin` pour les comptes autorisés.

---

## 2. Protection et session

### 2.1 Règle centralisée (`lib/admin-protection.ts`)

- La protection est **activée par défaut** (développement et production).
- Pour la **désactiver** localement (tests sans cookie admin) : dans `.env`,  
  `ADMIN_PROTECTION_ENABLED=false`

### 2.2 Couches de sécurité

1. **Middleware** (`middleware.ts`) : si protection active, les chemins `/botoadmin/*` et `/admin/*` exigent la **présence du cookie de session** ; sinon redirection vers `/login?redirect=…`.
2. **Layout serveur** (`app/(admin)/layout.tsx`) : vérifie que l’utilisateur existe et a un rôle parmi **`admin`**, **`boss`**, **`super_admin`**.
3. **Routes API** (`lib/api/auth-guard.ts`) :
   - **`requireAdminSession`** : `admin`, `boss`, `super_admin` — la majorité des `/api/admin/*`, utilisateurs, prospects (liste/modif), analytics agrégées.
   - **`requireStrictAdminSession`** : **`admin` uniquement** — actions très sensibles si utilisées.
   - **`requireBossSession`** : **`boss` uniquement** — `/api/boss/*` (dashboard BOSS, exports CSV, statistiques avancées).

Tant que `ADMIN_PROTECTION_ENABLED=false`, les gardes API renvoient un **accès simulé** (`bypass`) pour faciliter le développement sans session réelle — à éviter en production.

---

## 3. Fonctionnalités par écran

### 3.1 Dashboard (`/botoadmin`)

- **Données réelles** via `GET /api/admin/stats` : comptages utilisateurs, sessions, journaux d’audit.
- Cartes cliquables vers Tables et Statistiques.

### 3.2 Statistiques (`/botoadmin/stats`)

- Même source que le dashboard, horodatage affiché.

### 3.3 Tables (`/botoadmin/tables`)

Onglets avec données **issues de la base** (pagination quand prévu) :

| Onglet (`?tab=`) | API principale | Actions |
|------------------|----------------|---------|
| `users` | `GET/POST /api/users`, `DELETE /api/users/:id` | Création utilisateur (email, nom, rôle user/admin/boss), suppression |
| `audit` | `GET /api/admin/audit-logs` | Lecture |
| `contacts` | `GET /api/admin/contacts` | Lecture |
| `prospects` | `GET /api/prospects` | Lecture (devis / pipeline) |
| `revenue` | `GET /api/admin/revenue` | Lecture |
| `analytics` | `GET /api/admin/analytics` | Lecture événements |
| `pageviews` | `GET /api/admin/page-views` | Lecture |
| `settings` | `GET /api/admin/app-settings` | Lecture clés/valeurs `AppSettings` |

### 3.4 Analytics CEO (`/botoadmin/analytics`)

- Tableaux et graphiques (Recharts) alimentés par **`GET /api/analytics/stats`** (agrégats Prisma : événements, pages, services, délais).
- Données **réelles** une fois le tracking alimenté (`Analytics`, formulaires BoToLink, etc.).

### 3.5 CRM Prospects (`/botoadmin/crm`)

- Liste des **`Prospect`** avec recherche.
- Changement de statut (`PATCH /api/prospects/:id`) — colonnes Kanban par statut (`NOUVEAU`, `CONTACTE`, …).

### 3.6 Notifications (`/botoadmin/notifications`)

- Fusion **contacts BoToLink** (filtre source) et **prospects / devis**.
- Affichage créneaux RDV (`appointmentAt`) avec format FR (`formatAppointmentFr`).

### 3.7 Dashboard BOSS (`/botoadmin/boss`)

- Réservé au rôle **`boss`** (sinon message « Accès réservé au BOSS »).
- **`GET /api/boss/dashboard`** et **`GET /api/boss/statistics`** : métriques agrégées, graphiques (inscriptions, audit, rôles).
- **Exports CSV** : `GET /api/boss/export/users` et `.../contacts` (`format=csv`).

---

## 4. Rôles : qui voit quoi

| Rôle | BoToAdmin (sauf BOSS) | `/botoadmin/boss` | API `/api/boss/*` |
|------|----------------------|-------------------|-------------------|
| `user` | Non | Non | Non |
| `admin` | Oui | Non | Non |
| `super_admin` | Oui | Non | Non |
| `boss` | Oui | Oui | Oui |

Les routes **`/api/boss/*`** et les exports CSV exigent une session **`boss`**.

---

## 5. Base de données (PostgreSQL / Prisma)

Les tables sont définies dans **`prisma/schema.prisma`** et créées par les migrations **`prisma/migrations/`**.

### 5.1 Modèles utiles au mode admin

| Modèle | Usage principal dans l’admin |
|--------|-------------------------------|
| `User` | Comptes, rôles, niveaux admin |
| `Session` | Sessions actives (stats) |
| `AuditLog` | Traçabilité des actions |
| `Contact` | Demandes BoToLink / contact |
| `Prospect` | Pipeline devis / CRM |
| `Activity` | Activités liées aux prospects |
| `Revenue` | Revenus enregistrés |
| `Analytics` | Événements comportementaux |
| `PageView` | Vues de pages |
| `AppSettings` | Paramètres clé/valeur |
| `Notification` | Notifications utilisateur (modèle générique) |
| `BotConversation` | Historiques assistant (optionnel) |
| `ScheduledTask` | Tâches planifiées (optionnel) |

### 5.2 Commandes

```bash
# Appliquer le schéma sur la base (déploiement / CI)
npx prisma migrate deploy

# Développement : nouveau fichier de migration après édition du schema
npx prisma migrate dev

# Données de base + comptes admin/boss (voir seed)
npm run db:seed
```

Aucune table « manquante » n’est requise pour le mode admin actuel : le schéma existant couvre ces fonctionnalités.

---

## 6. Comptes de démonstration (seed)

Définis dans **`prisma/seed.ts`** et **`docs/APRES_SEED.md`** :

- **`admin@botoologia.local`** / **`boss@botoologia.local`** — mot de passe seed par défaut : **`admin123`** (à changer en production).
- Admins nominatifs avec niveaux (`adminLevel`) et mots de passe dédiés dans le seed.

---

## 7. Fichiers clés à retenir

| Fichier | Rôle |
|---------|------|
| `lib/admin-protection.ts` | Activation/désactivation protection |
| `lib/api/auth-guard.ts` | Contrôle session pour les API |
| `middleware.ts` | Cookie obligatoire sur `/botoadmin` |
| `app/(admin)/layout.tsx` | Garde rôles côté serveur |
| `components/layout/AdminSidebar.tsx` | Navigation latérale |

---

## 8. Dépannage rapide

- **« Non autorisé » / stats vides** : vérifier `DATABASE_URL`, utilisateur connecté avec rôle admin/boss/super_admin, et cookie présent après login.
- **BOSS inaccessible** : se connecter avec un utilisateur **`role = boss`** (ex. seed `boss@botoologia.local`).
- **Désactiver temporairement la protection** : `ADMIN_PROTECTION_ENABLED=false` dans `.env` (uniquement environnement de dev).
