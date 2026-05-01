# Configuration Prisma 7 — BoTooLogIA

Ce document décrit la configuration Prisma 7 et comment éviter les conflits entre l’extension Prisma dans VS Code/Cursor et la CLI Prisma 7.

---

## 1. Versions utilisées

| Package            | Version  |
|--------------------|----------|
| `prisma` (CLI)     | **7.4.0** |
| `@prisma/client`   | **7.4.0** |
| `@prisma/adapter-pg` | **7.4.0** |

Pour vérifier localement :

```bash
npx prisma --version
```

Vous devez voir `prisma : 7.4.0` et `@prisma/client : 7.4.0`.

---

## 2. Conflit extension / CLI (Prisma 5/6 vs 7)

En **Prisma 7**, l’URL de connexion du datasource n’est **plus** définie dans `schema.prisma` mais dans **`prisma.config.ts`** (voir [Upgrade to Prisma 7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)).

- La **CLI Prisma 7** considère le schéma valide sans `url` dans le bloc `datasource`.
- L’**extension Prisma** peut encore appliquer les règles Prisma 5/6 et afficher un avertissement du type **« Argument "url" is missing in data source block "db" »**.

Ce message est un **faux positif** tant que vous utilisez Prisma 7 et que l’URL est bien définie dans `prisma.config.ts`.

---

## 3. Configuration de l’éditeur (`.vscode/settings.json`)

Le fichier `.vscode/settings.json` du projet contient :

```json
{
  "prisma.pinToPrisma6": false,
  "prisma.enableDiagnostics": true,
  "prisma.fileWatcher": true
}
```

- **`prisma.pinToPrisma6": false`** : force l’utilisation du langage / validateur **Prisma 7** par l’extension (ne pas « épingler » au serveur Prisma 6).
- **`prisma.enableDiagnostics": true`** : conserve les diagnostics pour ne pas masquer les **vraies** erreurs.
- **`prisma.fileWatcher": true`** : garde le file watcher pour la génération du client.

Si l’extension affiche encore une invite pour choisir la version (Prisma 6 vs 7), choisir **Prisma 7** ou exécuter la commande **« Prisma: Unpin the current workspace from Prisma 6 »** dans la palette de commandes.

---

## 4. Commentaire dans `schema.prisma`

Un commentaire a été ajouté au-dessus du bloc `datasource db` pour expliquer pourquoi il n’y a pas d’argument `url` et que tout avertissement de l’IDE à ce sujet peut être ignoré, la référence étant `npx prisma validate`.

---

## 5. Pas de `.prismalintrc` pour ce cas

Les faux positifs concernent la **validation du schéma** (règles Prisma 5/6 vs 7), pas les règles de style/lint. Aucun fichier `.prismalintrc` n’est nécessaire pour résoudre le conflit extension/CLI décrit ici.

---

## 6. Vérifications à faire

À la racine du projet (où se trouve `package.json`) :

```bash
npx prisma validate
npx prisma generate
```

- **`npx prisma validate`** doit se terminer sans erreur (schéma valide pour Prisma 7).
- **`npx prisma generate`** doit générer le client sans erreur.

En cas de migration :

```bash
npx prisma migrate dev
```

(À n’utiliser que si vous avez des migrations et une base de dev configurée.)

---

## 7. Réplication sur une autre machine

1. Cloner le dépôt (le fichier `.vscode/settings.json` est versionné).
2. Installer les dépendances : `npm install`.
3. Vérifier la version Prisma : `npx prisma --version` (7.4.x).
4. Si l’extension Prisma affiche encore « url is missing » :
   - Vérifier que l’extension est à jour (Marketplace / Cursor).
   - S’assurer que `prisma.pinToPrisma6` est bien à `false` dans `.vscode/settings.json`.
   - Exécuter **« Prisma: Unpin the current workspace from Prisma 6 »** si l’invite apparaît.
   - Redémarrer l’éditeur si besoin.
5. Référence de vérité : **`npx prisma validate`** doit réussir.

---

## 8. Résumé

| Élément                         | Rôle |
|--------------------------------|------|
| **Référence de validité**      | `npx prisma validate` (CLI Prisma 7) |
| **URL de connexion**           | `prisma.config.ts` → `datasource.url` (et `env("DATABASE_URL")`) |
| **Extension**                  | `prisma.pinToPrisma6: false` pour utiliser Prisma 7 |
| **Warning « url is missing »**  | Faux positif si validate réussit ; ignorer ou suivre §7 |

Ne pas désactiver globalement les diagnostics Prisma (`prisma.enableDiagnostics: false`) pour ne pas cacher de vraies erreurs de schéma.

---

## 9. Audit base de données et optimisations

Un audit complet du schéma, de la configuration et de la sécurité a été réalisé. Voir :

| Document | Contenu |
|----------|---------|
| **docs/DATABASE_ANALYSIS.md** | Structure de la base, requêtes SQL d’inspection, décision schéma public vs privé |
| **docs/CRITICAL_ISSUES.md** | Problèmes identifiés (critique / haute priorité / moyen / bas) et statut des correctifs |
| **docs/DATABASE_AUDIT_REPORT.md** | Rapport d’audit, optimisations appliquées, checklist et recommandations |

**Scripts ajoutés :** `npm run db:validate` (prisma validate), `npm run db:format` (prisma format).
