# Analyse approfondie de la base de données BoTooLogIA

**Date :** 2026-02-16  
**Contexte :** Audit Prisma 7, schéma PostgreSQL, sécurité et performances.

---

## 1. Structure du schéma (depuis `schema.prisma`)

### 1.1 Schémas PostgreSQL

| Schéma   | Usage actuel |
|----------|----------------|
| **public** | Schéma utilisé par défaut (paramètre `?schema=public` dans `DATABASE_URL`). Toutes les tables Prisma sont créées dans `public`. |

*Pour exécuter l’inspection directe en base :*
```sql
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;
SELECT current_schema();
```

### 1.2 Tables et types

| Table     | Type   | Modèle Prisma | Relations |
|-----------|--------|----------------|-----------|
| User      | table  | User           | Session (1-n), AuditLog (1-n) |
| Session   | table  | Session        | User (n-1) |
| AuditLog  | table  | AuditLog       | User (n-1, optionnel) |
| Contact   | table  | Contact        | — |
| Revenue   | table  | Revenue        | — |

### 1.3 Enums

- **Role** : user, admin, boss  
- **UserStatus** : active, verified, suspended, banned  
- **AuditSeverity** : LOW, MEDIUM, HIGH, CRITICAL  
- **ContactStatus** : new, read, archived  

### 1.4 Index définis dans le schéma

| Table    | Index |
|----------|--------|
| User     | createdAt, role, status, email (email déjà couvert par @unique) |
| Session  | expiresAt, userId |
| AuditLog | action, createdAt, (action, createdAt), severity |
| Contact  | createdAt, status, (status, createdAt) |
| Revenue  | (periodType, periodValue) + @@unique sur même couple |

### 1.5 Contraintes et intégrité

- **User** : `email` @unique, clé primaire `id` (cuid).  
- **Session** : `userId` → User.id (onDelete: Cascade), `tokenHash` @unique.  
- **AuditLog** : `userId` → User.id (onDelete: SetNull), optionnel.  
- **Revenue** : @@unique([periodType, periodValue]).  

---

## 2. Requêtes d’analyse à exécuter en base

*À lancer une fois la base accessible (ex. `psql -U postgres -d botoologia` ou via Prisma Studio / script).*

### 2.1 Tables et schéma

```sql
SELECT table_schema, table_name, table_type
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;
```

### 2.2 Permissions sur le schéma public

```sql
SELECT nspname AS schema_name, nspowner::regrole AS owner, nspacl AS permissions
FROM pg_namespace
WHERE nspname = 'public';
```

### 2.3 Index créés

```sql
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename;
```

### 2.4 Contraintes (FK, UNIQUE, etc.)

```sql
SELECT tc.table_schema, tc.table_name, tc.constraint_name, tc.constraint_type, kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY tc.table_schema, tc.table_name, tc.constraint_type;
```

### 2.5 Statistiques (après exécution de l’app)

```sql
SELECT schemaname, tablename, seq_scan, idx_scan, n_live_tup
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
```

### 2.6 Taille des tables

```sql
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 3. Décision schéma public vs privé

### 3.1 Contexte BoTooLogIA

- Application **mono-tenant**, une instance par déploiement.  
- Pas de multi-tenancy ni de partage du même serveur PostgreSQL avec d’autres apps.  
- Données sensibles (comptes, 2FA, audit) mais pas niveau bancaire/santé.  

### 3.2 Décision

**Conserver le schéma `public`** avec durcissement des permissions (révocation sur PUBLIC, droits limités au rôle de l’application).

**Justification :** simplicité, compatibilité outils/Prisma, une seule base par environnement. Un schéma dédié (ex. `botoologia`) pourrait être envisagé plus tard si plusieurs applications partagent le même cluster PostgreSQL.

### 3.3 Sécurisation recommandée (si accès SQL direct)

À exécuter par un superutilisateur après création des tables :

```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO postgres;  -- remplacer par le rôle de l'app si différent
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO postgres;
```

---

## 4. Synthèse

- **Schéma Prisma :** cohérent, relations et contraintes correctes, enums utilisés.  
- **Index :** présents sur les champs de filtre et de jointure principaux.  
- **Schéma PostgreSQL :** rester en `public` avec permissions restreintes.  
- **Documentation :** les requêtes ci-dessus permettent de compléter cette analyse une fois la base disponible.
