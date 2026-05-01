-- Introspection schéma PostgreSQL (requête paramétrée $1 à $12).
-- Tables système : pg_class, pg_namespace, pg_attribute, pg_type, pg_constraint, pg_attrdef, pg_enum.
-- Retour : schema, name, columns (json_agg : name, fk_column, fk_table, fk_schema, datatype_schema, datatype, autoinc, computed, default, nullable, options, pk).
-- Filtres : ns.nspname !~ $9, ns.nspname != $10, relkind IN ($11, $12), attnum >= $7, attisdropped != $8.
-- Utilisation : npm run db:introspect [-- --output=json|table] [-- --schemas=public,autre]

SELECT
  "ns"."nspname" AS "schema",
  "cls"."relname" AS "name",
  (SELECT COALESCE(json_agg(agg), '[]') FROM (
    SELECT
      "att"."attname" AS "name",
      "fk_att"."attname" AS "fk_column",
      "fk_cls"."relname" AS "fk_table",
      "fk_ns"."nspname" AS "fk_schema",
      "tns"."nspname" AS "datatype_schema",
      "typ"."typname" AS "datatype",
      ("att"."attidentity" != $1 OR ("def"."adbin" IS NOT NULL AND pg_get_expr("def"."adbin", "def"."adrelid") LIKE $2)) AS "autoinc",
      "att"."attgenerated" != $3 AS "computed",
      pg_get_expr("def"."adbin", "def"."adrelid") AS "default",
      "att"."attnotnull" != $4 AS "nullable",
      COALESCE((SELECT json_agg("enm"."enumlabel") FROM "pg_catalog"."pg_enum" AS "enm" WHERE "enm"."enumtypid" = "typ"."oid"), '[]') AS "options",
      array_position("pk_con"."conkey", "att"."attnum") AS "pk"
    FROM "pg_catalog"."pg_attribute" AS "att"
    INNER JOIN "pg_catalog"."pg_type" AS "typ" ON "typ"."oid" = "att"."atttypid"
    INNER JOIN "pg_catalog"."pg_namespace" AS "tns" ON "tns"."oid" = "typ"."typnamespace"
    LEFT JOIN "pg_catalog"."pg_constraint" AS "pk_con" ON "pk_con"."contype" = $5 AND "pk_con"."conrelid" = "cls"."oid" AND "att"."attnum" = ANY("pk_con"."conkey")
    LEFT JOIN "pg_catalog"."pg_constraint" AS "fk_con" ON "fk_con"."contype" = $6 AND "fk_con"."conrelid" = "cls"."oid" AND "att"."attnum" = ANY("fk_con"."conkey")
    LEFT JOIN "pg_catalog"."pg_class" AS "fk_cls" ON "fk_cls"."oid" = "fk_con"."confrelid"
    LEFT JOIN "pg_catalog"."pg_namespace" AS "fk_ns" ON "fk_ns"."oid" = "fk_cls"."relnamespace"
    LEFT JOIN "pg_catalog"."pg_attribute" AS "fk_att" ON "fk_att"."attrelid" = "fk_cls"."oid" AND "fk_att"."attnum" = ANY("fk_con"."confkey")
    LEFT JOIN "pg_catalog"."pg_attrdef" AS "def" ON "def"."adrelid" = "att"."attrelid" AND "def"."adnum" = "att"."attnum"
    WHERE "att"."attrelid" = "cls"."oid" AND "att"."attnum" >= $7 AND "att"."attisdropped" != $8
  ) AS agg) AS "columns"
FROM "pg_catalog"."pg_class" AS "cls"
INNER JOIN "pg_catalog"."pg_namespace" AS "ns" ON "cls"."relnamespace" = "ns"."oid"
WHERE "ns"."nspname" !~ $9 AND "ns"."nspname" != $10 AND "cls"."relkind" IN ($11, $12)
ORDER BY "ns"."nspname", "cls"."relname";
