# Rapport final — Finalisation full-stack, base de données et sécurité

**Projet :** BoTooLogIA  
**Date du rapport :** 22 mars 2026  
**Objectif :** Liste exhaustive de ce qui manque pour un produit « prêt production », vérification détaillée du modèle de données et des risques sécurité, avec priorités.

---

## 1. Synthèse exécutive

| Pilier | Maturité estimée | Blocage production ? |
|--------|------------------|----------------------|
| **Full-stack (UI + API + parcours)** | ~75–85 % | Non pour une V1 interne ; **oui** pour une V1 client B2B exigeante |
| **Base de données (Prisma / PostgreSQL)** | ~80 % | Non si migrations déployées et sauvegardes en place |
| **Sécurité** | Intermédiaire → bon | **Points critiques** à traiter avant exposition large (LLM public, health, secrets) |

**En une phrase :** le socle (auth session, 2FA, rate limits, Zod partiel, admin partiel, Prisma riche) est solide ; il manque surtout **homogénéisation admin**, **endpoints sensibles** (coût / fuite), **intégrité BDD** (FKs, enums), **observabilité / RGPD / tests** pour clôturer un niveau « staff engineer / production-ready ».

---

## 2. Ce qui manque pour finaliser le full-stack

### 2.1 Panneau admin (`/botoadmin`)

| Manque | Détail | Priorité |
|--------|--------|----------|
| Parcours utilisateurs dédiés | Pas de `botoadmin/users` ni `users/[id]` : tout passe par l’onglet « Tables » | P1 |
| CRUD utilisateur complet | Pas de mot de passe à la création, pas de reset admin, pas de révocation sessions depuis UI riche | P1 |
| Cohérence rôles UI / API | Layout admin n’inclut pas `super_admin` alors que l’API peut l’autoriser | P0 |
| Paramètres application | `GET /api/admin/app-settings` sans `PATCH` branché (schéma `updateSettingsSchema` inutilisé) | P1 |
| Audit UI dédiée | Filtres date / export CSV / colonnes « acteur vs cible » | P2 |
| Contacts / revenues | Pas de pages dédiées complètes (assignation, notes, machine à états revenue) | P2 |
| Navigation | Sidebar sans entrées explicites Paramètres, Audit, Utilisateurs (spec produit) | P2 |

### 2.2 API et conventions

| Manque | Détail | Priorité |
|--------|--------|----------|
| Préfixe `/api/admin/users` | Utilisateurs sous `/api/users` : à documenter ou à migrer pour clarté ops | P2 |
| `requireRole` unifié | Pattern `NextResponse` 401/403 + `deletedAt` / `status` centralisés (au lieu de multiples variantes) | P1 |
| Validation query 100 % | Ex. `GET /api/prospects` : `status` / `search` sans Zod strict ; contacts : filtres partiels | P1 |
| `readMutationJson` | Corps JSON invalide → `{}` : pas de 400 explicite (écart OWASP / DX) | P2 |

### 2.3 Front public & parcours métier

| Manque | Détail | Priorité |
|--------|--------|----------|
| Cohérence design | Thème sombre / titres dégradés : vérifier toutes les landing (BoToHub, BoToLab, BoToWorks, BoToLink, etc.) | P3 |
| Formulaires | Enterprise / contact : alignement messages d’erreur, accessibilité (ARIA), états chargement | P2 |
| Agent / chat | `/api/agent-ia` sans auth : risque coût ; à traiter côté prod (voir §4) | P0 |

### 2.4 Qualité, CI, exploitation

| Manque | Détail | Priorité |
|--------|--------|----------|
| Tests admin | Pas de suite Vitest `lib/__tests__/admin/*` ; E2E admin minimal | P1 |
| `npm audit` en CI | Bloquer HIGH/CRITICAL selon politique | P1 |
| Backup / restore | Procédure hors repo (runbook) | P0 prod |
| APM / corrélation | `requestId` dans logs API | P2 |
| Documentation runbook | Déploiement, variables obligatoires, rotation secrets | P1 |

---

## 3. Base de données — vérification détaillée

### 3.1 Inventaire des modèles (état actuel)

| Modèle | Rôle | Points notables |
|--------|------|-------------------|
| **User** | Comptes, rôles, 2FA, statut, soft delete | `passwordHash` nullable (comptes sans mot de passe possibles) ; `deletedAt` présent |
| **Session** | Sessions serveur (hash token) | `isValid`, `revokedAt`, index `(userId, isValid)` — bon pour révocation |
| **AuditLog** | Traçabilité | `resource` + `resourceId` (pas `targetType` séparé) ; `userId` = acteur (attention aux bugs d’assignation côté app) |
| **Contact** | Demandes BoToLink / formulaires | `assignedTo` **sans FK** vers `User` |
| **Revenue** | Chiffre | `status` en **String** libre (pas enum Prisma) |
| **AppSettings** | Config clé/valeur | `value` en **String** `@db.Text` (pas `Json`) ; `updatedBy` **sans FK** |
| **Analytics** | Événements | `metadata` Json ; volumétrie à anticiper |
| **PageView** | Vues pages | Idem volumétrie |
| **Prospect** + **Activity** | CRM | `assignedTo` / `authorId` **sans FK** User |
| **Notification** | In-app | `type` String ; `userId` nullable (broadcast possible en logique métier) |
| **BotConversation** | Historique bot | `messages` Json ; pas de relation Prisma vers `User` (champ `userId` seul) |
| **ScheduledTask** | Tâches planifiées | `status` String |

### 3.2 Points forts schéma

- **CUID** partout pour les PK : ordre chronologique approximatif, pas d’énumération simple d’entiers.
- **Soft delete** sur la majorité des tables métier (`deletedAt`).
- **Index** pertinents sur `User(role, status)`, `AuditLog(action, createdAt)`, `Contact(status, createdAt)`, `Prospect(status, createdAt)`, etc.
- **Enums** : `Role`, `UserStatus`, `AuditSeverity`, `ContactStatus`, `ProspectStatus` — bonne base.
- **Relations** : `Session` → `User` avec `onDelete: Cascade` ; `AuditLog` → `User` `SetNull` (conforme conservation des logs).

### 3.3 Écarts et risques données

| Sujet | Risque | Recommandation |
|-------|--------|----------------|
| **FK manquantes** | Orphelins, intégrité faible (`assignedTo`, `updatedBy`, `authorId`) | Migrations P1 : FK optionnelles vers `User.id` après nettoyage des valeurs invalides |
| **Revenue.status** | Valeurs incohérentes en base | Enum Prisma + migration données |
| **AppSettings.value** | Bool/number sérialisés en texte | Accepter si parsing strict côté app ; ou migrer vers `Json` + validation par clé |
| **User sans mot de passe** | Comptes créés par admin inutilisables ou comportement login ambigu | Forcer mot de passe ou flux « invitation » |
| **DELETE user (API actuelle)** | Suppression **physique** alors que `deletedAt` existe | Passer en soft delete + invalider sessions |
| **Volumétrie Analytics / PageView** | Croissance illimitée | Job d’archivage / TTL (déjà des idées dans `maintenance`) + index/partitionnement si gros volume |
| **BotConversation.messages** | Json non structuré côté DB | Valider taille / forme côté API (Zod) pour limiter DoS stockage |

### 3.4 Opérations à ne pas oublier en production

1. `npx prisma migrate deploy` (jamais seulement `db push` sans discipline).
2. Utilisateur PostgreSQL **dédié**, mot de passe fort, `DATABASE_URL` avec **TLS** si hébergeur distant (`sslmode=require` selon fournisseur).
3. **Sauvegardes** planifiées (PG dump / service managé) + test de restauration trimestriel.
4. **Rotation** des secrets (JWT, session, 2FA pending) en cas de fuite.

---

## 4. Sécurité — analyse détaillée

### 4.1 Déjà en place (à conserver)

- Sessions **côté serveur** (hash en base), cookies **HttpOnly**, **Secure** en production, **SameSite** (Lax session, Strict pending 2FA).
- **2FA** : fenêtre TOTP courte, anti-rejeu (`lastUsedTotpToken` / `lastUsedTotpAt`), lockout après échecs.
- **Rate limiting** middleware (global API, login, 2FA, contact, auth misc).
- **Origine** : `verify-api-origin` sur mutations si `NEXT_PUBLIC_APP_URL` défini.
- **Zod** sur une majorité des routes sensibles (auth, bot chat, agent body, etc.).
- **Erreurs API** : `respondApiCatch` / mapping Prisma → pas de fuite Prisma client en 503.
- **Headers** : `next.config.js` (HSTS, CSP, X-Frame-Options, etc.) — voir limites ci-dessous.

### 4.2 Risques prioritaires (à traiter)

| ID | Thème | Description | CWE (réf.) |
|----|--------|-------------|------------|
| **S1** | Coût / abus | `POST /api/agent-ia` **sans authentification** : appels LLM si clés présentes | CWE-306 |
| **S2** | Fuite d’information | `GET /api/health` **public** avec agrégats (comptes tables, etc.) | CWE-200 |
| **S3** | CSRF / origine | Si `NEXT_PUBLIC_APP_URL` absent, pas de contrôle d’`Origin` sur mutations | CWE-352 |
| **S4** | Validation | `JSON.parse` dans `/api/contact` pour branche « devis » sans schéma Zod sur le contenu interne | CWE-20 |
| **S5** | CSP | `script-src` avec **unsafe-inline** et **unsafe-eval** : surface XSS aggravée | CWE-79 / 1021 |
| **S6** | Admin | Middleware pages admin : présence **cookie** seulement, pas re-validation rôle à chaque requête | CWE-284 |
| **S7** | Admin | **super_admin** bloqué au layout alors qu’autorisé en API | Incohérence accès |
| **S8** | Audit | `POST /api/admin/audit-logs` permet de **forger** des lignes d’audit | Intégrité des journaux |
| **S9** | Traçabilité | Certaines actions enregistrent `userId` = **cible** au lieu de l’**admin** connecté | Forensics fausses |
| **S10** | Secrets | Fichiers `.env` locaux : risque si commit / partage ; rotation si exposition | CWE-798 |

### 4.3 Recommandations par couche

- **Auth / session** : documenter durée de vie ; envisager **SameSite=Strict** sur session si tous les flux passent par même site ; session admin plus courte (spec 8h) si besoin compliance.
- **Autorisation** : une fonction **`requireRole`** unique (401 vs 403), vérifier `deletedAt` + `status` sur chaque route protégée.
- **Données** : utiliser **`sanitizeUserForApi`** (ou `select` strict) sur **toute** réponse incluant un user ; jamais `passwordHash`, `twoFactorSecret`, backup codes.
- **Logs** : pas de corps de requête contenant mots de passe ; sanitizer `\r\n` pour log injection.
- **Dépendances** : `npm audit` + politique de mise à jour Next / Prisma.

---

## 5. Plan de finalisation recommandé (ordre)

1. **P0 — Sécurité** : protéger ou quota `/api/agent-ia` ; restreindre ou authentifier `/api/health` en prod ; garantir `NEXT_PUBLIC_APP_URL` en prod ; corriger incohérence **super_admin** (layout).
2. **P0 — Données** : soft delete utilisateur + audit avec **bon userId** ; empêcher création user sans mot de passe ou flux explicite.
3. **P1 — Admin** : PATCH settings ; users API/UI (reset mdp, révoquer sessions, filtres) ; Zod sur toutes les query strings listées.
4. **P1 — BDD** : FK optionnelles + enums `Revenue` / types notification si pertinent.
5. **P2 — RGPD** : export / anonymisation utilisateur ; rétention documentée.
6. **P2 — Tests** : Vitest admin + extension Playwright (settings, users, 403).

---

## 6. Vérifications rapides (checklist avant mise en prod)

```text
[ ] DATABASE_URL avec utilisateur limité + TLS si distant
[ ] NEXTAUTH_SECRET, JWT_SECRET, PENDING_2FA_SECRET ≥ 32 caractères aléatoires
[ ] NEXT_PUBLIC_APP_URL = URL canonique HTTPS
[ ] ADMIN_PROTECTION_ENABLED=true
[ ] prisma migrate deploy exécuté sur l’environnement cible
[ ] Sauvegardes DB actives et testées
[ ] npm run build && npm run test && npm run lint sans erreur
[ ] npm audit — plan pour HIGH/CRITICAL résiduels
[ ] Aucun secret dans le dépôt Git (grep sk-, clés API, .env commité)
```

---

## 7. Documents complémentaires dans le dépôt

- `CARTOGRAPHIE-FONCTIONNALITES-ET-BACKLOG.md` — backlog fonctionnel et checklist technique.
- `RAPPORT-AUDIT-COMPLET.md` — audit transversal (à recouper avec ce rapport : certaines notes sont antérieures au schéma actuel).
- `prisma/schema.prisma` — source de vérité du modèle de données.

---

*Fin du rapport. Mettre à jour ce fichier après chaque vague majeure (admin, sécurité, migrations).*
