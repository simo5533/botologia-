"use client";

import { useState } from "react";
import { CardVideoBackground } from "./CardVideoBackground";

const CARD_VIDEO_SRC = "/videos/fond-carte-service.mp4";

type ValueCardServiceStyleProps = {
  title: string;
  description: string;
  index?: number;
  delay?: number;
};

/**
 * Même rendu de fond que les cartes ServiceCard (vidéo + overlay + bordure cyan, etc.).
 * Contenu simplifié : titre + texte (section Nos valeurs).
 */
export function ValueCardServiceStyle({
  title,
  description,
  index = 0,
  delay = 0,
}: ValueCardServiceStyleProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="value-service-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={
        {
          position: "relative",
          overflow: "hidden",
          "--delay": `${delay}ms`,
          animationDelay: `${delay}ms`,
        } as React.CSSProperties
      }
    >
      <CardVideoBackground
        videoSrc={CARD_VIDEO_SRC}
        overlayOpacity={0.82}
        className="vc-card-video-root"
      >
        <div className="vc-vignette" />
        <div className="vc-scanlines" />
        <div
          className="vc-border"
          style={{
            borderColor: hovered
              ? "rgba(0,200,255,0.45)"
              : "rgba(0,200,255,0.15)",
            boxShadow: hovered
              ? "inset 0 0 40px rgba(0,200,255,0.06), 0 0 30px rgba(0,200,255,0.1)"
              : "none",
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          }}
        />
        <div
          className="vc-corner vc-tl"
          style={{
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s ease",
          }}
        />
        <div
          className="vc-corner vc-br"
          style={{
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s ease",
          }}
        />
        <div
          className="vc-bottom-line"
          style={{
            width: hovered ? "80%" : "30%",
            opacity: hovered ? 0.8 : 0.3,
            transition: "width 0.4s ease, opacity 0.3s ease",
          }}
        />

        <div className="vc-content">
          <div
            className="vc-index"
            style={{
              opacity: hovered ? 1 : 0.5,
              transition: "opacity 0.3s ease",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <h3
            className="vc-title"
            style={{
              textShadow: hovered
                ? "0 2px 10px rgba(0,0,0,0.9), 0 0 30px rgba(0,200,255,0.25)"
                : "0 2px 10px rgba(0,0,0,0.9)",
              transition: "text-shadow 0.3s ease",
            }}
          >
            {title}
          </h3>
          <div
            className="vc-separator"
            style={{
              width: hovered ? "50px" : "25px",
              transition: "width 0.4s ease",
            }}
          />
          <p
            className="vc-desc"
            style={{
              opacity: hovered ? 0.9 : 0.75,
              transition: "opacity 0.3s ease",
            }}
          >
            {description}
          </p>
        </div>
      </CardVideoBackground>

      <style jsx>{`
        .value-service-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          cursor: default;
          animation: vc-appear 0.7s ease forwards;
          opacity: 0;
          transform: translateY(24px);
          will-change: transform, box-shadow;
        }

        .value-service-card:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(0, 200, 255, 0.25),
            0 0 40px rgba(0, 200, 255, 0.08);
        }

        @keyframes vc-appear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vc-card-video-root {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .vc-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0, 0, 0, 0.4) 100%
          );
          pointer-events: none;
        }

        .vc-scanlines {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0, 200, 255, 0.012) 3px,
            rgba(0, 200, 255, 0.012) 4px
          );
        }

        .vc-border {
          position: absolute;
          inset: 0;
          z-index: 4;
          border-radius: 18px;
          border: 1px solid rgba(0, 200, 255, 0.15);
          pointer-events: none;
        }

        .vc-corner {
          position: absolute;
          z-index: 5;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }

        .vc-tl {
          top: 12px;
          left: 12px;
          border-top: 1.5px solid rgba(0, 200, 255, 0.7);
          border-left: 1.5px solid rgba(0, 200, 255, 0.7);
          border-radius: 2px 0 0 0;
        }

        .vc-br {
          bottom: 12px;
          right: 12px;
          border-bottom: 1.5px solid rgba(0, 200, 255, 0.7);
          border-right: 1.5px solid rgba(0, 200, 255, 0.7);
          border-radius: 0 0 2px 0;
        }

        .vc-bottom-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 1px;
          z-index: 5;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 200, 255, 0.6),
            transparent
          );
          pointer-events: none;
        }

        .vc-content {
          position: relative;
          z-index: 10;
          padding: 28px 24px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          height: 100%;
        }

        .vc-index {
          font-family: "Courier New", monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(0, 200, 255, 0.6);
          letter-spacing: 0.15em;
          line-height: 1;
        }

        .vc-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #00c8ff;
          line-height: 1.3;
          letter-spacing: -0.01em;
          margin: 0;
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
        }

        .vc-separator {
          height: 1.5px;
          background: linear-gradient(
            90deg,
            rgba(0, 200, 255, 0.5),
            transparent
          );
          border-radius: 1px;
        }

        .vc-desc {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.65;
          font-weight: 300;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);
          margin: 0;
        }

        @media (max-width: 768px) {
          .value-service-card {
            min-height: 240px;
          }
          .vc-content {
            padding: 22px 18px 20px;
          }
          .value-service-card:hover {
            transform: translateY(-4px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .value-service-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
