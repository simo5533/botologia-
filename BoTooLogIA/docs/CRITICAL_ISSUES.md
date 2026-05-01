# Problèmes critiques et correctifs — BoTooLogIA

**Date :** 2026-02-16  
**Lien :** Audit base de données et configuration Prisma 7.

---

## Niveau CRITIQUE (bloquant)

| # | Problème | Statut | Action |
|---|----------|--------|--------|
| 1 | DATABASE_URL manquant ou incorrect | ✅ Vérifié | Défini dans `.env`, chargé via `prisma.config.ts` (env "DATABASE_URL"). |
| 2 | Modèle sans @id | ✅ Aucun | Tous les modèles ont `id` avec `@id @default(cuid())`. |
| 3 | Relation cassée (champ manquant) | ✅ Aucun | Session.userId, AuditLog.userId présents ; fields/references cohérents. |
| 4 | Client Prisma non généré | ✅ OK | `output = "../generated/prisma"`, script `db:generate` présent. |
| 5 | Migration / schéma incohérent | ✅ Vérifié | Une migration existante (passwordHash) ; schéma aligné avec les modèles. |

---

## Niveau HAUTE PRIORITÉ (bugs potentiels)

| # | Problème | Statut | Action |
|---|----------|--------|--------|
| 1 | @unique sur email | ✅ OK | User.email a `@unique`. |
| 2 | Index sur colonnes WHERE fréquentes | ✅ OK | Index sur role, status, createdAt, userId, expiresAt, action, severity. |
| 3 | onDelete spécifié | ✅ OK | Session → Cascade, AuditLog → SetNull. |
| 4 | Valeurs par défaut (createdAt, role, status) | ✅ OK | @default(now()), @default(user), @default(active), etc. |
| 5 | Nullable vs required | ⚠️ À tenir | email/id requis ; champs optionnels (name, passwordHash, userId AuditLog) marqués avec `?`. |

---

## Niveau MOYEN (performance / qualité)

| # | Problème | Statut | Action |
|---|----------|--------|--------|
| 1 | Index redondant | ✅ Corrigé | Suppression de `@@index([email])` sur User (déjà couvert par @unique). |
| 2 | Type long texte | ✅ Corrigé | Contact.message passé en `String` avec `@db.Text` pour messages longs. |
| 3 | Enum au lieu de String | ✅ OK | Role, UserStatus, AuditSeverity, ContactStatus en enums. |
| 4 | Index composite utile | ✅ Ajouté | User : `@@index([role, status])` pour filtres combinés. |

---

## Niveau BAS (cosmétique)

| # | Problème | Statut | Action |
|---|----------|--------|--------|
| 1 | Scripts npm manquants | ✅ Corrigé | Ajout de `db:validate` et `db:format` dans package.json. |
| 2 | Commentaires schéma | ✅ OK | Commentaires présents sur datasource et champs sensibles. |

---

## Récapitulatif

- **Critique :** 0 problème restant.  
- **Haute priorité :** 0 problème restant.  
- **Moyen :** 3 points traités (index email, Contact.message, index composite User).  
- **Bas :** 1 point traité (scripts db:validate, db:format).

Tous les points identifiés lors de l’audit ont été traités ou documentés.

---

## Mise à jour post-objectif 98/100

- **Prisma 7 :** `url` retiré du bloc `datasource` dans `schema.prisma` (URL uniquement dans `prisma.config.ts`).
- **Index ajoutés :** User.lastLoginAt ; Session(expiresAt, userId) ; AuditLog.userId ; Contact.email.
- **Champs ajoutés :** Contact.updatedAt, Revenue.updatedAt, Revenue.label en @db.Text.
- **Nouvelle table :** AppSettings (paramètres clé-valeur) + `lib/db/app-settings.ts`.
- **Script SQL :** `prisma/scripts/secure-public-schema.sql` pour durcir les permissions sur le schéma public.
- **Score cible :** 98/100 — voir `docs/DATABASE_SCORE_98.md`.
