# BoTooLogIA — Sécurité des données (niveau production)

## Principes

- **Secrets** : Jamais en dur. Utiliser `.env` (ignoré par Git), `.env.example` comme modèle.
- **PII** : Ne pas logger d’informations personnelles (email, noms) en clair. En prod, limiter les logs à des métadonnées.
- **HTTPS** : En production, forcer HTTPS (HSTS déjà configuré dans `next.config.js`).
- **Données sensibles** : JWT et tokens uniquement côté serveur ; ne pas exposer `JWT_SECRET` au client.

## Variables d’environnement

| Variable | Rôle | Production |
|----------|------|------------|
| `DATABASE_URL` | Connexion PostgreSQL | URL TLS, utilisateur dédié, mot de passe fort |
| `JWT_SECRET` | Signature des tokens | Min. 32 caractères, généré aléatoirement |
| `ADMIN_PROTECTION_ENABLED` | Protéger `/botoadmin` et APIs admin | `true` |
| `NODE_ENV` | Environnement | `production` |

## APIs protégées

Lorsque `ADMIN_PROTECTION_ENABLED=true` :

- `/api/users` et `/api/admin/*` exigent un cookie de session valide (sinon 401).
- `/botoadmin/*` redirige vers `/` si pas de session.

En production, faire évoluer la garde vers une vérification JWT réelle (voir `lib/api/auth-guard.ts`).

## Headers de sécurité

Définis dans `next.config.js` : HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy.

## Rate limiting

En mémoire par IP (100 req/min sur API et admin). Pour une grosse charge, utiliser un store externe (ex. Redis / Upstash).

## Base de données

- Migrations versionnées (Prisma).
- Pas de données sensibles en clair dans les logs de requêtes ; en prod, `log: ["error"]` uniquement.
