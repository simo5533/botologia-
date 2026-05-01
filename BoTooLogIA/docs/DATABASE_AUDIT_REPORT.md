# Rapport d'audit base de données — BoTooLogIA

**Date d'audit :** 2026-02-16  
**Périmètre :** Schéma Prisma 7, configuration, sécurité schéma PostgreSQL, performances.

---

## 1. Résumé exécutif

| Élément | Valeur |
|--------|--------|
| Base de données | PostgreSQL |
| Schéma PostgreSQL | **public** (conservé, avec recommandations de durcissement) |
| ORM | Prisma 7.4.0 |
| Adapter | @prisma/adapter-pg 7.4.0 |
| Tables | 5 (User, Session, AuditLog, Contact, Revenue) |
| Enums | 4 (Role, UserStatus, AuditSeverity, ContactStatus) |
| Relations | User ↔ Session (1-n), User ↔ AuditLog (1-n) |

**Verdict :** Aucun problème critique bloquant. Schéma cohérent, relations et contraintes correctes. Corrections de niveau moyen appliquées (index, type texte long, scripts).

---

## 2. Problèmes identifiés et traités

### 2.1 Niveau critique

- **Aucun.** DATABASE_URL géré par prisma.config.ts, tous les modèles ont un @id, relations complètes, client généré dans `generated/prisma`.

### 2.2 Niveau haute priorité

- **Aucun.** @unique sur User.email, index sur colonnes de filtre, onDelete défini (Cascade pour Session, SetNull pour AuditLog), @default sur champs attendus.

### 2.3 Niveau moyen (corrigés)

1. **Index redondant**  
   - Avant : User avait `@@index([email])` alors que `email` est déjà `@unique` (index implicite).  
   - Après : Index [email] supprimé ; ajout de `@@index([role, status])` pour les requêtes combinées.

2. **Type pour texte long**  
   - Avant : Contact.message en `String` (VARCHAR par défaut).  
   - Après : `String @db.Text` pour les messages potentiellement longs.

3. **Index composite**  
   - Ajout de `@@index([role, status])` sur User pour les filtres type « rôle + statut ».

### 2.4 Niveau bas (corrigés)

1. **Scripts npm**  
   - Ajout de `db:validate` (prisma validate) et `db:format` (prisma format) dans package.json.

---

## 3. Schéma public vs privé

### 3.1 Décision

**Conserver le schéma `public`**, avec durcissement des permissions si accès SQL direct (révocation sur PUBLIC, droits limités au rôle de l’application).

### 3.2 Justification

- Application mono-tenant, une instance par environnement.
- Un seul projet sur le serveur PostgreSQL.
- Simplicité pour l’équipe et compatibilité outils/Prisma.
- Pas de contrainte réglementaire imposant un schéma dédié.

### 3.3 Sécurisation recommandée

En production, exécuter (avec le rôle approprié) :

```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO <role_app>;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO <role_app>;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO <role_app>;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO <role_app>;
```

---

## 4. Configuration Prisma vérifiée

### 4.1 prisma/schema.prisma

- **Generator :** `provider = "prisma-client"`, `output = "../generated/prisma"` (Prisma 7).
- **Datasource :** `provider = "postgresql"`, pas d’`url` (correct pour Prisma 7, URL dans prisma.config.ts).
- **Modèles :** Tous avec @id @default(cuid()), relations avec champs de clé étrangère et references, onDelete défini où pertinent.

### 4.2 prisma.config.ts

- Import `defineConfig` et `env` depuis `"prisma/config"`.
- `import "dotenv/config"` en tête pour charger .env.
- `datasource.url = env("DATABASE_URL")`, pas de credentials en dur.

### 4.3 .env

- DATABASE_URL requis ; format attendu :  
  `postgresql://user:password@host:port/database?schema=public`

---

## 5. Optimisations appliquées

### 5.1 Index

- User : createdAt, role, status, (role, status). Email couvert par @unique.
- Session : expiresAt, userId.
- AuditLog : action, createdAt, (action, createdAt), severity.
- Contact : createdAt, status, (status, createdAt).
- Revenue : (periodType, periodValue) + contrainte unique.

### 5.2 Relations

- Session → User : onDelete Cascade (suppression des sessions si user supprimé).
- AuditLog → User : onDelete SetNull (conserver les logs avec userId à null).

### 5.3 Types

- Contact.message : `@db.Text` pour contenu long.
- Revenue.amount : `Decimal @db.Decimal(12, 2)` déjà présent.

---

## 6. Recommandations futures

1. **Exécuter les requêtes SQL** du fichier `docs/DATABASE_ANALYSIS.md` une fois la base disponible (tailles, stats, permissions) et mettre à jour l’analyse si besoin.
2. **Monitorer** les requêtes lentes (logs Prisma, pg_stat_user_tables) après mise en charge.
3. **Réviser les index** (trimestriel ou après ajout de nouveaux filtres).
4. **Backup** : sauvegardes régulières (pg_dump ou outil hébergeur).
5. En cas de **multi-apps** sur le même PostgreSQL : envisager un schéma dédié (ex. `botoologia`) et migration.

---

## 7. Checklist finale

- [x] Schéma Prisma validé (npx prisma validate)
- [x] prisma.config.ts correct, pas de credentials en dur
- [x] .env / DATABASE_URL documentés
- [x] Tous les modèles ont un @id
- [x] Relations complètes (fields + references)
- [x] onDelete défini sur les relations concernées
- [x] Index sur colonnes de filtre / jointure
- [x] Contact.message en @db.Text
- [x] Scripts db:validate et db:format ajoutés
- [x] Documentation : DATABASE_ANALYSIS.md, CRITICAL_ISSUES.md, DATABASE_AUDIT_REPORT.md
- [ ] Tests en base (migrate/push + prisma studio) à faire lorsque la base est accessible

---

## 9. Objectif 98/100 (complété)

Voir **docs/DATABASE_SCORE_98.md** pour la grille de score et le détail des ajouts :

- Table **AppSettings** + helpers `lib/db/app-settings.ts`.
- Script **prisma/scripts/secure-public-schema.sql**.
- Index supplémentaires (lastLoginAt, userId sur AuditLog, email sur Contact, composite Session).
- Champs **updatedAt** sur Contact et Revenue ; **Revenue.label** en @db.Text.
- Schéma aligné Prisma 7 (url uniquement dans prisma.config.ts).

---

## 8. Fichiers modifiés ou créés

| Fichier | Action |
|---------|--------|
| prisma/schema.prisma | Index User (role, status), Contact.message @db.Text, suppression index [email] redondant |
| package.json | Ajout scripts db:validate, db:format |
| docs/DATABASE_ANALYSIS.md | Créé |
| docs/CRITICAL_ISSUES.md | Créé |
| docs/DATABASE_AUDIT_REPORT.md | Créé (ce fichier) |
| docs/PRISMA_SETUP.md | Mis à jour (section audit) |
