# Guide d'utilisation — Dashboard BOSS

## Accès

- **URL :** `/botoadmin/boss` (depuis le menu Admin → Dashboard BOSS).
- **Rôle requis :** BOSS uniquement. Les comptes ADMIN peuvent voir le lien mais reçoivent « Accès réservé au BOSS » sur les données.
- **Authentification :** Même session que l’admin (`ADMIN_PROTECTION_ENABLED=true`). Connexion avec un compte dont le rôle est `boss`.

## Compte BOSS par défaut (après seed)

- **Email :** `boss@botoologia.local`
- **Mot de passe :** `admin123` (à changer en production)

Création/mise à jour : `npm run db:seed`.

## Contenu du dashboard

1. **Statistiques générales**
   - Utilisateurs (total, actifs ce mois)
   - Sessions, journaux d’audit, demandes de contact
   - Revenus (total et ce mois) — alimentés par la table `Revenue` si besoin

2. **Graphiques**
   - Inscriptions par jour (30 derniers jours)
   - Répartition des utilisateurs par rôle (user, admin, boss)
   - Activité (audit) par jour
   - Inscriptions par mois

3. **Export**
   - Boutons « Export users CSV » et « Export contacts CSV » (téléchargement direct).

## APIs BOSS (exclusif BOSS)

| Méthode | Route | Description |
|--------|--------|-------------|
| GET | `/api/boss/dashboard` | Données du tableau de bord |
| GET | `/api/boss/statistics` | Statistiques détaillées (séries pour graphiques) |
| GET | `/api/boss/users/analytics` | Analytics utilisateurs (par rôle, période) |
| GET | `/api/boss/revenue` | Revenus (total, par période) |
| GET | `/api/boss/reports/:period` | Rapports (monthly, quarterly, yearly) |
| GET | `/api/boss/export/:type` | Export CSV/JSON (users, audit, contacts) |

Toutes ces routes exigent une session avec le rôle **BOSS**. Les actions BOSS sont enregistrées dans `AuditLog` (ex. `boss.dashboard.view`, `boss.export`).

## Revenus

La table `Revenue` permet de stocker les montants par période (month, quarter, year). Sans enregistrement, les revenus affichés sont à 0. Pour alimenter les données : insérer des lignes via Prisma Studio ou une future interface d’administration.

## Permissions

- **BOSS** : accès à tout l’admin (dashboard, stats, tables) **et** aux routes et au dashboard BOSS.
- **ADMIN** : accès à l’admin uniquement (pas aux APIs ni à la page BOSS).
