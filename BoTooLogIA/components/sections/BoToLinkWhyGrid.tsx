"use client";

const WHY_ITEMS = [
  {
    icon: "⚡",
    title: "Itérations visibles",
    desc:
      "Des jalons et des points d’étape réguliers pour suivre l’avancement sans promesse de durée figée hors devis.",
    color: "#fbbf24",
  },
  {
    icon: "🎯",
    title: "Sur mesure",
    desc:
      "Solutions adaptées à votre contexte plutôt qu’un produit carton-pâte ; le périmètre est défini ensemble.",
    color: "#00c8ff",
  },
  {
    icon: "🔒",
    title: "Données & conformité",
    desc:
      "Traitement des données et exigences (ex. RGPD) pris en compte lorsque votre projet les impose.",
    color: "#00e5a0",
  },
  {
    icon: "📈",
    title: "Critères métier avec vous",
    desc:
      "Les objectifs suivis après mise en ligne sont définis avec vos équipes ; pas de chiffre de résultat inventé dans la vitrine.",
    color: "#7b5cff",
  },
  {
    icon: "🤝",
    title: "Périmètre contractuel clair",
    desc:
      "Livrables, maintenance éventuelle et post-lancement sont précisés dans la proposition commerciale, pas sous forme de statistiques marketing.",
    color: "#ff4d6d",
  },
  {
    icon: "🌍",
    title: "Collaboration fluide",
    desc:
      "Basés au Maroc, nous travaillons aussi à distance selon vos contraintes organisationnelles.",
    color: "#00c8ff",
  },
] as const;

export function BoToLinkWhyGrid() {
  return (
    <div className="bl-why-grid">
      {WHY_ITEMS.map((item, i) => (
        <div key={i} className="bl-why-card">
          <div className="bl-why-icon" style={{ color: item.color }}>
            {item.icon}
          </div>
          <h3 className="bl-why-title">{item.title}</h3>
          <p className="bl-why-desc">{item.desc}</p>
          <div
            className="bl-why-line"
            style={{
              background: `linear-gradient(90deg, ${item.color}60, transparent)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
