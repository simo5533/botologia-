# Performance base de données — BoTooLogIA

## Index (résumé)

| Table    | Index | Usage |
|----------|--------|--------|
| User     | PK(id), unique(email) | Lookup, login |
| User     | @@index(createdAt) | Liste triée, stats "nouveaux ce mois" |
| User     | @@index(role) | groupBy(role), filtres par rôle |
| Session  | PK(id), unique(tokenHash) | Lookup session |
| Session  | @@index(expiresAt) | Purge sessions expirées |
| Session  | @@index(userId) | Sessions par utilisateur |
| AuditLog | @@index(action), @@index(createdAt), @@index([action, createdAt]) | Filtres et tri |
| Contact  | @@index(createdAt), @@index(status), @@index([status, createdAt]) | Listes, export, filtres |
| Revenue  | @@unique + @@index(periodType, periodValue) | Lookup par période |

## Pool de connexions

Dans l’URL de connexion (production), limiter le nombre de connexions pour éviter la saturation PostgreSQL :

```
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=10"
```

Ajuster `connection_limit` selon la charge et les limites du serveur (souvent 10–20 par instance).

## Purge des sessions expirées

Pour garder la table `Session` légère, appeler régulièrement la purge (cron quotidien ou au démarrage) :

```ts
import { purgeExpiredSessions } from "@/lib/db/session-cleanup";
await purgeExpiredSessions();
```

Exemple cron (Node ou script externe) : une fois par jour suffit.

## Requêtes coûteuses à éviter

- Éviter les `findMany` sans `take`/pagination sur de grosses tables (User, AuditLog, Contact). Les listes admin utilisent déjà la pagination.
- Pour les agrégations BOSS (stats, rapports), les requêtes sont parallélisées (`Promise.all`) et ciblées (count, groupBy, plages de dates). Les index permettent d’éviter les full scan.

## Maintenance PostgreSQL (optionnel)

En production, exécuter périodiquement :

```sql
VACUUM ANALYZE "User";
VACUUM ANALYZE "Session";
VACUUM ANALYZE "AuditLog";
VACUUM ANALYZE "Contact";
VACUUM ANALYZE "Revenue";
```

Ou pour toute la base : `VACUUM ANALYZE;` (selon la fenêtre de maintenance).
