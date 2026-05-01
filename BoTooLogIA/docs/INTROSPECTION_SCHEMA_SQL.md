# Introspection du schéma PostgreSQL — Explication de la requête

Ce document décrit la requête SQL d’introspection du catalogue PostgreSQL utilisée pour lister tables/vues matérialisées et leurs colonnes (métadonnées, clés, FK, types, etc.).

---

## 1. Vue d’ensemble

La requête interroge les tables système **`pg_catalog`** pour produire, par table (ou vue matérialisée) :

- **Niveau table** : `schema`, `name`
- **Niveau colonnes** (sous-requête agrégée en JSON) : pour chaque colonne : `name`, `fk_column`, `fk_table`, `fk_schema`, `datatype_schema`, `datatype`, `autoinc`, `computed`, `default`, `nullable`, `options` (enum), `pk`

Les paramètres `$1`…`$12` servent à garder la requête paramétrable (schémas exclus, types d’objets, seuils).

---

## 2. Tables du catalogue utilisées

| Table / objet | Rôle |
|---------------|------|
| `pg_class` (`cls`) | Objets relationnels (tables, vues matérialisées) : `oid`, `relname`, `relnamespace`, `relkind` |
| `pg_namespace` (`ns`, `tns`, `fk_ns`) | Schémas : `nspname`, `oid` |
| `pg_attribute` (`att`, `fk_att`) | Colonnes : `attname`, `atttypid`, `attnum`, `attidentity`, `attgenerated`, `attnotnull`, `attrelid`, `attisdropped` |
| `pg_type` (`typ`) | Types (datatype) : `typname`, `typnamespace`, `oid` |
| `pg_constraint` (`pk_con`, `fk_con`) | Contraintes PK (`contype = 'p'`) et FK (`contype = 'f'`) : `conrelid`, `conkey`, `confrelid`, `confkey` |
| `pg_attrdef` (`def`) | Valeurs par défaut : `adbin`, `adrelid`, `adnum` |
| `pg_enum` (`enm`) | Valeurs des types enum : `enumtypid`, `enumlabel` |

---

## 3. Jointures principales (niveau table)

- **`cls` INNER JOIN `ns`** sur `cls.relnamespace = ns.oid`  
  → associer chaque table à son schéma (`nspname`).

Filtres appliqués sur les lignes table :

- **`ns.nspname !~ $9`** : exclure les schémas dont le nom matche le motif (ex. `'^pg_'` pour les schémas système).
- **`ns.nspname != $10`** : exclure un schéma par nom (ex. `'information_schema'`).
- **`cls.relkind IN ($11, $12)`** : ne garder que certains types d’objets, ex. `'r'` (table) et `'m'` (vue matérialisée).

---

## 4. Sous-requête colonnes (agrégat JSON)

Pour chaque table, une sous-requête construit la liste des colonnes puis **`json_agg(agg)`** (avec `coalesce(..., '[]')`) pour produire le champ `columns`.

### 4.1 Jointures (niveau colonne)

- **`att`** : colonnes de la table (`attrelid = cls.oid`).
- **`typ`** sur `typ.oid = att.atttypid` → type de la colonne.
- **`tns`** sur `tns.oid = typ.typnamespace` → schéma du type (ex. `pg_catalog`, `public`).
- **`pk_con`** (LEFT) : `contype = $5` (ex. `'p'`), `conrelid = cls.oid`, `att.attnum = any(conkey)` → indiquer si la colonne fait partie de la PK et à quelle position (`array_position(conkey, att.attnum)` → champ `pk`).
- **`fk_con`** (LEFT) : `contype = $6` (ex. `'f'`), même table, `att.attnum = any(conkey)` → FK dont cette colonne est partie.
- **`fk_cls`** sur `fk_cls.oid = fk_con.confrelid` → table référencée.
- **`fk_ns`** sur `fk_ns.oid = fk_cls.relnamespace` → schéma de la table référencée.
- **`fk_att`** sur `fk_att.attrelid = fk_cls.oid` et `fk_att.attnum = any(confkey)` → colonne référencée (pour `fk_column`).
- **`def`** (LEFT) sur `def.adrelid = att.attrelid` et `def.adnum = att.attnum` → expression par défaut (`pg_get_expr(adbin, adrelid)` → champ `default`).
- **`pg_enum`** (dans une sous-sous-requête) : pour les types enum, `enumtypid = typ.oid` → liste des `enumlabel` → champ `options`.

### 4.2 Champs calculés (colonnes)

| Champ | Signification |
|-------|----------------|
| `name` | `att.attname` |
| `fk_column` | `fk_att.attname` (colonne cible de la FK) |
| `fk_table` | `fk_cls.relname` |
| `fk_schema` | `fk_ns.nspname` |
| `datatype_schema` | `tns.nspname` |
| `datatype` | `typ.typname` |
| `autoinc` | `att.attidentity != $1` OU (défaut présent ET `pg_get_expr(adbin, adrelid)` LIKE `$2`, ex. `'nextval%'`) |
| `computed` | `att.attgenerated != $3` (générée = stockée/virtuelle) |
| `default` | `pg_get_expr(def.adbin, def.adrelid)` |
| `nullable` | `att.attnotnull != $4` |
| `options` | `json_agg(enumlabel)` pour le type enum, sinon `'[]'` |
| `pk` | `array_position(pk_con.conkey, att.attnum)` (position dans la PK, ou NULL) |

### 4.3 Filtres sur les colonnes

- **`att.attrelid = cls.oid`** : colonnes de la table courante.
- **`att.attnum >= $7`** : ex. `0` pour ignorer les colonnes système (numéros négatifs).
- **`att.attisdropped != $8`** : ex. `false` pour exclure les colonnes supprimées.

---

## 5. Paramètres typiques

| Param | Exemple | Rôle |
|-------|--------|------|
| $1 | `''` | Comparaison `attidentity` (identité / auto-inc) |
| $2 | `'nextval%'` | Pattern LIKE sur l’expression default (séquences) |
| $3 | `''` | Comparaison `attgenerated` (colonne générée) |
| $4 | `''` | Comparaison `attnotnull` (nullable) |
| $5 | `'p'` | Type de contrainte : clé primaire |
| $6 | `'f'` | Type de contrainte : clé étrangère |
| $7 | `0` | Numéro d’attribut minimum (exclure les colonnes système) |
| $8 | `false` | Exclure les colonnes droppées |
| $9 | `'^pg_'` | Regex : exclure les schémas dont le nom commence par `pg_` |
| $10 | `'information_schema'` | Exclure le schéma `information_schema` |
| $11 | `'r'` | `relkind` : table ordinaire |
| $12 | `'m'` | `relkind` : vue matérialisée |

---

## 6. Utilisation dans le projet

- **Requête SQL adaptée** (schémas/relkind paramétrables) : `prisma/scripts/introspect-schema.sql` (référence avec paramètres en commentaire).
- **Script Node** : `npm run db:introspect` exécute `scripts/introspect-schema.ts` (connexion via `DATABASE_URL`, sortie JSON ou tableau). Options : `-- --output=json|table`, `-- --schemas=public,autre`. Si ts-node échoue (ESM), utiliser `npm run db:introspect:tsx`.
- Voir aussi **DEMARRAGE.md** pour la configuration de la base et **PRISMA_SETUP.md** pour Prisma.
