"use client";

import { useRef, useState, useEffect } from "react";
import { posterForVideoSrc } from "@/lib/seo/video-posters";

export interface CardVideoBackgroundProps {
  /** Source de la vidéo (ex: /videos/fond-carte-service.mp4) */
  videoSrc: string;
  /** Image de couverture avant chargement lecture */
  poster?: string;
  /** Opacité de l’overlay pour la lisibilité. Minimum 0.80, recommandé 0.80–0.85. */
  overlayOpacity?: number;
  /** Contenu rendu au-dessus de la vidéo (z-index 10). */
  children?: React.ReactNode;
  /** ClassName pour le conteneur (position relative + overflow hidden). */
  className?: string;
}

const CLAMP_OVERLAY = (v: number) => Math.min(1, Math.max(0.8, v));

/**
 * Composant universel : fond vidéo pour cartes avec overlay lisible.
 * Règles : overlay 0.80–0.85 min, contenu z-index 10, will-change opacity, autoPlay muted loop playsInline.
 */
export function CardVideoBackground({
  videoSrc,
  poster: posterProp,
  overlayOpacity = 0.82,
  children,
  className = "",
}: CardVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const opacity = CLAMP_OVERLAY(overlayOpacity);
  const poster = posterProp ?? posterForVideoSrc(videoSrc);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [videoSrc]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Vidéo en fond — z-index 0 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <video
          ref={videoRef}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlayThrough={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.6s ease",
            willChange: "opacity",
          }}
          aria-hidden
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Overlay pour lisibilité — 0.80–0.85 min */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(135deg, rgba(0,8,25,${opacity}) 0%, rgba(0,15,40,${Math.max(0.8, opacity - 0.05)}) 100%)`,
          pointerEvents: "none",
        }}
        aria-hidden
      />

      {/* Contenu au-dessus — z-index 10 */}
      {children != null && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
