"use client";

import { VIDEO_POSTER } from "@/lib/seo/video-posters";

/**
 * Bloc robot repositionné entre le titre BoToHub et le carousel.
 * Vidéo Widget BOTO + texte "BoTooLogIA active la puissance de l'IA...".
 */
export function RobotSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 24px 24px",
        position: "relative",
        gap: "14px",
      }}
    >
      {/* Ligne décorative haut */}
      <div
        style={{
          width: "1px",
          height: "28px",
          background:
            "linear-gradient(to bottom, transparent, rgba(0,200,255,0.4))",
          marginBottom: "-4px",
        }}
        aria-hidden
      />

      {/* Conteneur vidéo avec halo */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Halo animé derrière la vidéo */}
        <div
          className="robot-section-halo"
          style={{
            position: "absolute",
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,200,255,0.15), transparent 70%)",
            willChange: "transform, opacity",
          }}
          aria-hidden
        />

        {/* Cercle avec vidéo Widget BOTO */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "1px solid rgba(0,200,255,0.25)",
            background: "rgba(0,200,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            overflow: "hidden",
            boxShadow: "0 0 8px rgba(0,200,255,0.3)",
          }}
        >
          <video
            src="/videos/Widget-BOTO.mp4"
            poster={VIDEO_POSTER.widget}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            aria-label="Widget BoTooLogIA"
          />
        </div>
      </div>

      {/* Texte */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "520px",
        }}
      >
        <p
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "rgba(0,200,255,0.85)",
            lineHeight: 1.75,
            fontWeight: 400,
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          BoTooLogIA active la puissance de l&apos;IA, des idées robustes comme
          nos robots, boostez votre croissance grâce à notre expertise en IA.
        </p>
      </div>

      {/* Ligne décorative bas */}
      <div
        style={{
          width: "1px",
          height: "28px",
          background:
            "linear-gradient(to bottom, rgba(0,200,255,0.4), transparent)",
          marginTop: "-4px",
        }}
        aria-hidden
      />

      {/* Point central avec halo */}
      <div
        className="robot-section-dot"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "rgba(0,200,255,0.5)",
          border: "1px solid rgba(0,200,255,0.7)",
          willChange: "transform, opacity",
        }}
        aria-hidden
      />
    </div>
  );
}
