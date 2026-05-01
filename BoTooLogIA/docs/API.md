# Documentation API — BoTooLogIA

## Authentification

Les routes protégées utilisent un cookie de session (`session`) posé par `POST /api/auth/login` (ou après `POST /api/auth/verify-2fa` si 2FA est activé). En production, activer `ADMIN_PROTECTION_ENABLED=true` pour exiger la session sur les zones admin et BOSS.

- **Login en 2 étapes** : si le compte a un secret 2FA, la réponse à `POST /api/auth/login` contient `data.needs2FA: true` et un cookie `pending2fa` est posé. Le client doit alors appeler `POST /api/auth/verify-2fa` avec `{ "code": "123456" }` (code TOTP ou code de secours) pour obtenir la session.
- **Sécurité** : verrouillage après 5 échecs (15 min), comptes suspendus/bannis refusés, audit des échecs et succès (sévérité + IP + user-agent).

---

## Routes publiques

| Méthode | Route | Description |
|---------|--------|--------------|
| GET | `/api/health` | Santé de l’API et de la base (200 ok, 503 degraded) |
| POST | `/api/auth/login` | Connexion (body: `{ email, password }`) → cookie session ou `needs2FA: true` + cookie `pending2fa` |
| POST | `/api/auth/verify-2fa` | Vérification 2FA (body: `{ code }`, cookie `pending2fa`) → cookie session |
| POST | `/api/auth/logout` | Déconnexion (supprime le cookie) |
| GET | `/api/auth/session` | Utilisateur courant si session valide |
| POST | `/api/contact` | Demande de contact (body: `{ name, email, message }`) |
| POST | `/api/bot/chat` | Réponse du bot guide (body: `{ message: string }`) → `{ reply, link? }` (base de connaissances locale) |

---

## Routes Admin (session admin ou BOSS)

| Méthode | Route | Description |
|---------|--------|--------------|
| GET | `/api/users` | Liste paginée (?page=1&limit=20) |
| POST | `/api/users` | Créer un utilisateur (body: `{ email, name?, role }`) |
| PATCH | `/api/users/[id]` | Modifier un utilisateur |
| DELETE | `/api/users/[id]` | Supprimer un utilisateur |
| GET | `/api/admin/stats` | Statistiques (users, sessions, auditLogs) |
| GET | `/api/admin/audit-logs` | Liste paginée (?page, limit, action) |
| POST | `/api/admin/audit-logs` | Créer une entrée d’audit |

---

## Routes BOSS (session BOSS uniquement)

| Méthode | Route | Description |
|---------|--------|--------------|
| GET | `/api/boss/dashboard` | Données tableau de bord |
| GET | `/api/boss/statistics` | Statistiques détaillées (séries pour graphiques) |
| GET | `/api/boss/users/analytics` | Analytics utilisateurs (par rôle, périodes) |
| GET | `/api/boss/revenue` | Revenus (total, par période) |
| GET | `/api/boss/reports/:period` | Rapport (period: monthly \| quarterly \| yearly) |
| GET | `/api/boss/export/:type` | Export CSV (type: users \| audit \| contacts). ?format=json pour JSON |

---

## Format des réponses

- Succès : `{ success: true, data: ... }`
- Erreur : `{ success: false, error: "message" }` (optionnel : `details`)
- Codes : 200, 201 (création), 400 (validation), 401 (non autorisé), 403 (interdit), 404, 429 (rate limit), 500

## Rate limiting

100 requêtes / minute / IP sur `/api/*` et `/botoadmin/*`. En cas de dépassement : 429 avec en-tête `Retry-After`.
