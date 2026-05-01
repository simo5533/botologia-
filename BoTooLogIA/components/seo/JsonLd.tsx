interface JsonLdProps {
  /** Objet sérialisable (ex. avec @context + @graph) */
  data: Record<string, unknown>;
}

/** JSON-LD — échappement basique contre fin de script </ dans les chaînes */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
