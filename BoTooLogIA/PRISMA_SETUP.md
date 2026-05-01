# Configuration Prisma 7 - BOTOOLOGIA

## Versions
- Prisma CLI : 7.4.0
- @prisma/client : 7.4.0

## Important
En Prisma 7, l'URL de connexion est définie dans `prisma.config.ts`, PAS dans `schema.prisma`.

Si l'IDE affiche "url is missing" dans schema.prisma, c'est un **FAUX POSITIF**.

## Validation
La référence de validité est toujours :
```bash
npx prisma validate
```

Si cette commande réussit, le schéma est correct.

## Warnings IDE
Les warnings de l'extension Prisma peuvent être ignorés si :
1. `npx prisma validate` réussit
2. `npx prisma generate` réussit
3. L'application se connecte correctement à la DB

## Configuration IDE
Le fichier `.vscode/settings.json` force l'extension à utiliser Prisma 7 :
- `prisma.pinToPrisma6: false`
- `prisma.trace.server: "verbose"` (debug si besoin)

## Nouveau dev
1. `npm install`
2. Vérifier `.vscode/settings.json` existe
3. Redémarrer l'éditeur
4. Exécuter **"Prisma: Unpin the current workspace from Prisma 6"** si une popup apparaît
5. `npx prisma generate`

## Fichiers critiques
| Fichier | Rôle | Statut |
|---------|------|--------|
| `.vscode/settings.json` | `prisma.pinToPrisma6: false` | OK |
| `prisma.config.ts` | `datasource.url` = `env("DATABASE_URL")` | OK |
| `prisma/schema.prisma` | `datasource db` **sans** `url` | OK |
| `.env` | `DATABASE_URL="postgresql://..."` | OK (présent) |

## Commandes de référence
```bash
npx prisma --version   # Vérifier version
npx prisma validate    # Référence de vérité
npx prisma generate    # Générer le client
npx prisma migrate dev # Migrations
npx prisma studio      # UI admin DB
```

## `migrate deploy` (production / CI / Vercel)

- **But** : appliquer les migrations **déjà versionnées** dans `prisma/migrations/` sur une base existante, **sans** mode interactif (contrairement à `migrate dev`).

| Contexte | Commande |
|----------|-----------|
| **Local** (même `.env` que le dev) | `npx prisma migrate deploy` ou `npm run db:migrate:deploy` |
| **Vercel** | Déjà exécuté au build : `npx prisma migrate deploy && npm run build` (`vercel.json`) |
| **Base distante** (Neon, etc.) | Mets `DATABASE_URL` dans le terminal ou `.env`, puis `npx prisma migrate deploy` |

Prérequis : `DATABASE_URL` pointe vers la base cible ; le réseau autorise la connexion (SSL souvent `?sslmode=require`).

## Prisma Studio (interface graphique)

**Prisma Studio n’est pas une “app” à déployer sur Vercel** comme le site : c’est un outil **local** (ou conteneur privé) qui lit/écrit la base. **Ne l’expose pas sur Internet sans protection** (VPN, IP allowlist, etc.).

| Mode | Commande / usage |
|------|-------------------|
| **Local** (`.env` avec `DATABASE_URL`) | `npm run db:studio` ou `npx prisma studio` → souvent [http://localhost:5555](http://localhost:5555) |
| **URL explicite** (ex. copie depuis Neon) | `npx prisma studio --url "postgresql://..."` |
| **Docker** (DB du compose) | `npm run db:studio:docker` ou `docker compose --profile tools run --rm prisma-studio` |

Pour une base **de production**, utilise Studio depuis ta machine avec une **URL lecture seule** ou un **rôle limité** si ton fournisseur le permet ; évite les URLs avec droits superuser sur un poste non sécurisé.

**Forcer l'extension Prisma 7 :** `Ctrl+Shift+P` → *Prisma: Unpin the current workspace from Prisma 6*
