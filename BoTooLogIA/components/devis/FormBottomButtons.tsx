"use client";

import { isExternalCreneauLink, resolveCreneauHref } from "@/lib/booking";

type FormBottomButtonsProps = {
  submitting?: boolean;
  /** false = le bouton d’envoi est affiché ailleurs (ex. barre d’actions étape 5) */
  showSubmitButton?: boolean;
};

export function FormBottomButtons({
  submitting,
  showSubmitButton = true,
}: FormBottomButtonsProps) {
  return (
    <div
      style={{
        marginTop: "40px",
        padding: "32px",
        borderRadius: "20px",
        background: "rgba(0,200,255,0.03)",
        border: "1px solid rgba(0,200,255,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <p
        style={{
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.45)",
          margin: 0,
          textAlign: "center",
          letterSpacing: "0.03em",
        }}
      >
        {showSubmitButton
          ? "Prêt à transformer votre entreprise ?"
          : "Dernière étape : vérifiez le récapitulatif et votre créneau, puis confirmez l’envoi."}
      </p>

      <div
        style={{
          width: "60px",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          maxWidth: "560px",
        }}
      >
        {showSubmitButton ? (
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "16px 28px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #00c8ff 0%, #0094cc 100%)",
              color: "#000d1a",
              fontSize: "0.95rem",
              fontWeight: 800,
              border: "none",
              cursor: submitting ? "wait" : "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              position: "relative",
              overflow: "hidden",
              opacity: submitting ? 0.85 : 1,
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.transform = "translateY(-3px)";
              btn.style.boxShadow = "0 12px 35px rgba(0,200,255,0.35)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.transform = "translateY(0)";
              btn.style.boxShadow = "none";
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                transform: "translateX(-100%)",
                transition: "transform 0.5s ease",
              }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>🚀</span>
            <span style={{ position: "relative", zIndex: 1 }}>
              {submitting ? "Envoi en cours…" : "Entrer dans le futur"}
            </span>
            <span style={{ position: "relative", zIndex: 1 }}>→</span>
          </button>
        ) : null}

        {isExternalCreneauLink() ? (
          <a
            href={resolveCreneauHref()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.8rem",
              color: "rgba(0,200,255,0.75)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Préférez-vous un agenda externe (Cal.com / Calendly) ?
          </a>
        ) : null}
      </div>

      <p
        style={{
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.2)",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        Sans engagement · Réponse garantie sous 24h ouvrées
      </p>
    </div>
  );
}
