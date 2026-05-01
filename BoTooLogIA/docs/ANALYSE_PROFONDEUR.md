# Analyse en profondeur — BoTooLogIA

**Date :** 2025  
**Objectif :** Vue complète du projet, base de données, et éléments manquants complétés.

---

## 1. Vue d’ensemble du projet

| Zone | Contenu |
|------|--------|
| **Front public** | Next.js 14 (App Router), pages BoToHub, BoToLab, BoToWorks, BoToLink, BoToAdvantage, thème clair/sombre, chatbot, sections 3D/holographiques |
| **Admin** | `/botoadmin` — Dashboard, Stats, Tables (utilisateurs, audit, contacts). Données 100 % issues de la base. |
| **Backend** | Routes API sous `app/api/`, Prisma (PostgreSQL), validation Zod, garde admin (cookie session). |
| **Sécurité** | Headers (next.config), rate limit, `SECURITY.md`, `.env.example` pour la prod. |

---

## 2. Base de données (Prisma + PostgreSQL)

### 2.1 Schéma (`prisma/schema.prisma`)

| Modèle | Champs | Rôle |
|--------|--------|------|
| **User** | id, email, name?, role, createdAt, updatedAt | Utilisateurs (admin/user). Lié à Session. |
| **Session** | id, userId, tokenHash, expiresAt, createdAt | Sessions (pour auth future). Cascade delete si user supprimé. |
| **AuditLog** | id, action, userId?, resource?, details?, ip?, createdAt | Traçabilité : création/mise à jour/suppression users, demandes de contact. |

### 2.2 Utilisation en base

- **User** : créés via admin (POST /api/users), modifiés (PATCH /api/users/[id]), supprimés (DELETE /api/users/[id]). Liste : GET /api/users (paginé).
- **Session** : modèle prêt pour login/session ; aucune API ne crée encore de session (cookie `session` non posé par l’app).
- **AuditLog** : créé automatiquement à chaque user create/update/delete, à chaque POST /api/contact (action `contact.request`), et possiblement par l’admin (POST /api/admin/audit-logs).

### 2.3 Données de base (seed)

- **Commande :** `npm run db:seed` ou `npx prisma db seed`
- **Contenu :** 1 utilisateur admin (`admin@botoologia.local`) si absent ; 2 entrées AuditLog si la table est vide.
- **Fichier :** `prisma/seed.ts` (exécuté via `tsx`).

---

## 3. APIs et flux de données

| Méthode | Route | Auth | Rôle |
|---------|--------|------|------|
| GET | /api/health | Non | Santé + statut DB |
| GET | /api/users | Admin si protection | Liste paginée users (base) |
| POST | /api/users | Admin si protection | Créer user + audit (base) |
| PATCH | /api/users/[id] | Admin si protection | Modifier user + audit (base) |
| DELETE | /api/users/[id] | Admin si protection | Supprimer user + audit (base) |
| GET | /api/admin/stats | Admin si protection | Agrégats users, sessions, auditLogs (base) |
| GET | /api/admin/audit-logs | Admin si protection | Liste paginée, option `?action=...` (base) |
| POST | /api/admin/audit-logs | Admin si protection | Créer une entrée audit (base) |
| POST | /api/contact | Non | Demande de contact → AuditLog (base) |

Toutes les écritures passent par Prisma et sont **sauvegardées en base**. L’admin ne fait que lire/écrire via ces APIs.

---

## 4. Ce qui manquait et ce qui a été ajouté

### 4.1 Déjà en place avant cette analyse

- Schéma Prisma (User, Session, AuditLog), migrations / db push.
- GET /api/health, GET /api/users, GET /api/admin/stats, GET|POST /api/admin/audit-logs.
- POST /api/users, PATCH /api/users/[id], lib/db/audit, validations Zod.
- Dashboard et Stats admin alimentés par l’API, Tables (onglets Utilisateurs, Audit).
- Formulaire « Créer un utilisateur » en admin (sauvegarde en base).
- Seed (admin + 2 audit logs), BACKEND.md, SECURITY.md.

### 4.2 Ajouts réalisés (analyse + complétion)

| Élément | Fichiers / Détail |
|--------|-------------------|
| **POST /api/contact** | `app/api/contact/route.ts`, `lib/validations/contact.ts` — Formulaire BoToLink enregistré en base (AuditLog `contact.request`). |
| **Formulaire BoToLink → API** | `app/(public)/botolink/page.tsx` — Submit vers POST /api/contact, message de succès/erreur. |
| **DELETE /api/users/[id]** | `app/api/users/[id]/route.ts` — Suppression user + entrée d’audit `user.delete`. |
| **Bouton Supprimer (admin)** | `app/(admin)/botoadmin/tables/page.tsx` — Colonne Actions, bouton Supprimer par ligne, rechargement liste. |
| **Filtre par action (audit-logs)** | `app/api/admin/audit-logs/route.ts` — Paramètre optionnel `?action=contact.request` (ou autre). |
| **Onglet Contacts (admin)** | `app/(admin)/botoadmin/tables/page.tsx` — Onglet « Contacts », appels GET avec `action=contact.request`, affichage Nom, Email, Message, Date. |
| **Documentation** | `docs/ANALYSE_PROFONDEUR.md` (ce fichier), mise à jour `docs/BACKEND.md` (routes + seed). |

---

## 5. Recommandations

- **Auth :** Le login est implémenté : POST `/api/auth/login` crée une Session en base et pose le cookie `session`. Le middleware et la garde API (`requireAdminSession`) s’appuient sur ce cookie. JWT_SECRET est utilisé côté serveur ; le modèle Session lie le token à un User.
- **Rate limiting :** En production à forte charge, remplacer le store en mémoire par Redis (ou équivalent).
- **Contact :** Les demandes sont dans AuditLog ; pour une liste dédiée « Contacts » avec statut (lu/non lu), envisager un modèle `Contact` et une migration.

---

## 6. Commandes utiles

```bash
npm run db:generate   # Générer le client Prisma
npm run db:push        # Appliquer le schéma à la base (dev)
npm run db:migrate     # Migrations versionnées
npm run db:seed        # Données de base (admin + audit)
npm run db:studio      # Interface Prisma Studio
```
