# Analyse approfondie — Base de données BoTooLogIA

## 1. État actuel

### 1.1 Modèles (avant corrections)

| Modèle    | Champs principaux                          | Index actuels                    |
|-----------|--------------------------------------------|----------------------------------|
| User      | id, email (unique), passwordHash?, name?, role, createdAt, updatedAt | PK, unique(email)               |
| Session   | id, userId, tokenHash (unique), expiresAt, createdAt | PK, unique(tokenHash), @@index(expiresAt) |
| AuditLog  | id, action, userId?, resource?, details (Json?), ip?, createdAt | PK, @@index(action), @@index(createdAt) |
| Revenue   | id, amount, currency, periodType, periodValue, label, createdAt | PK, @@unique(periodType, periodValue), @@index(periodType, periodValue) |

### 1.2 Patterns de requêtes identifiés

- **User** : `findUnique(email)` (login), `findUnique(id)` (session, PATCH/DELETE), `findMany(skip, take, orderBy createdAt desc)` (liste admin), `count()`, `groupBy(role)`, `count(where createdAt gte)` (stats). Manques : index sur **createdAt** (tri et filtres de période), index sur **role** (groupBy et filtres).
- **Session** : `findFirst(tokenHash, expiresAt gt now)` (validation session), `create`, `deleteMany(tokenHash)`. Index **userId** manquant pour requêtes par utilisateur (ex. liste des sessions, purge par user).
- **AuditLog** : `findMany(where action?, skip, take, orderBy createdAt desc)`, `count(where action?, where createdAt gte)`. Filtre combiné **action + createdAt** très fréquent → index composite **(action, createdAt)** manquant. Pas de clé étrangère vers User → intégrité référentielle faible.
- **Revenue** : `findMany(orderBy periodType, periodValue)`. Index existant suffisant.
- **Contacts** : stockés uniquement dans AuditLog (action = "contact.request") → requêtes par scan + filtre JSON. Pas de table dédiée → pas d’index dédié, export et listes coûteux.

### 1.3 Problèmes identifiés

| Priorité | Problème | Impact |
|----------|----------|--------|
| Haute    | Pas d’index User(createdAt) | Listes et stats par période lentes sur gros volumes |
| Haute    | Pas d’index User(role) | groupBy(role) et filtres par rôle moins efficaces |
| Haute    | Pas d’index composite AuditLog(action, createdAt) | Filtres "action + période" lents |
| Haute    | Contacts uniquement dans AuditLog | Export/liste contacts = full scan + JSON, pas de statut (lu/non lu) |
| Moyenne  | AuditLog.userId sans FK vers User | Pas d’intégrité référentielle, pas de SetNull si suppression user |
| Moyenne  | Pas d’index Session(userId) | Requêtes "sessions d’un user" non optimisées |
| Basse    | role en String au lieu d’enum | Moindre contrainte en base, pas d’optimisation type enum PostgreSQL |

---

## 2. Corrections et fonctionnalités ajoutées

### 2.1 Schéma

- **Enum Role** : `user | admin | boss` en enum Prisma (et type PostgreSQL) pour contraintes et performance.
- **User** : `@@index([createdAt])`, `@@index([role])`.
- **Session** : `@@index([userId])`.
- **AuditLog** : `@@index([action, createdAt])`, relation optionnelle vers User avec `onDelete: SetNull`.
- **Contact** (nouveau) : table dédiée (id, name, email, message, status, createdAt, source?) avec index sur createdAt, status, et (status, createdAt) pour listes/export performants et statut (new, read, archived).

### 2.2 Fonctionnalités

- **Table Contact** : création à chaque demande de contact (POST /api/contact) en plus de l’entrée AuditLog (dual-write). Comptages et export BOSS utilisent Contact en priorité (fallback AuditLog si vide).
- **Intégrité** : AuditLog.userId → User.id avec onDelete: SetNull pour conserver les logs après suppression d’un user.
- **Performance** : index ci-dessus pour limiter les full scan et accélérer tri/filtres.

### 2.3 Maintenance et production

- Pool de connexions : `DATABASE_URL?connection_limit=10` (ou valeur adaptée à l’hébergeur).
- Logs Prisma : en prod uniquement `["error"]` (déjà en place).
- Purge des sessions expirées : script ou cron appelant une fonction dédiée (ex. `deleteMany(where { expiresAt: { lt: now } })`) pour garder la table Session légère.

---

## 3. Résumé des index (après optimisation)

| Table    | Index | Usage |
|----------|--------|------|
| User     | PK(id), unique(email) | Lookup, login |
| User     | @@index(createdAt) | Liste triée, stats "nouveaux ce mois" |
| User     | @@index(role) | groupBy(role), filtres par rôle |
| Session  | PK(id), unique(tokenHash) | Lookup session |
| Session  | @@index(expiresAt) | Purge sessions expirées, "sessions actives" |
| Session  | @@index(userId) | Sessions par utilisateur |
| AuditLog | PK(id) | — |
| AuditLog | @@index(action) | Filtre par action |
| AuditLog | @@index(createdAt) | Tri et plages de dates |
| AuditLog | @@index([action, createdAt]) | Filtre action + période (requêtes composées) |
| Contact  | PK(id), @@index(createdAt), @@index(status), @@index([status, createdAt]) | Listes, export, filtres par statut |
| Revenue  | Existant | — |
