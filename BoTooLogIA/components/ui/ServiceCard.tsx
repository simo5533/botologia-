"use client";

import { useState } from "react";
import Link from "next/link";
import { CardVideoBackground } from "./CardVideoBackground";

/** Vidéo des cartes — fond carte service (public/videos/fond-carte-service.mp4) */
const CARD_VIDEO_SRC = "/videos/fond-carte-service.mp4";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  linkText?: string;
  delay?: number;
  index?: number;
  /** Clic / Entrée sur la carte (ex. panneau holo BoToLab) — le lien CTA propage l’annulation. */
  onOpenDetail?: () => void;
}

export default function ServiceCard({
  icon,
  title,
  description,
  href = "/botolink",
  linkText = "Entrer dans le futur →",
  delay = 0,
  index = 0,
  onOpenDetail,
}: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);

  const handleOpenDetail = () => {
    onOpenDetail?.();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (!onOpenDetail) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenDetail();
    }
  };

  return (
    <div
      className="service-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpenDetail ? handleOpenDetail : undefined}
      onKeyDown={onOpenDetail ? handleCardKeyDown : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
      aria-haspopup={onOpenDetail ? "dialog" : undefined}
      aria-label={
        onOpenDetail
          ? `${title} — ouvrir le briefing holo détaillé`
          : undefined
      }
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
        className="sc-card-video-root"
      >
        <div className="sc-vignette" />
      <div className="sc-scanlines" />

      <div
        className="sc-border"
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
        className="sc-corner sc-tl"
        style={{
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        className="sc-corner sc-br"
        style={{
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        className="sc-bottom-line"
        style={{
          width: hovered ? "80%" : "30%",
          opacity: hovered ? 0.8 : 0.3,
          transition: "width 0.4s ease, opacity 0.3s ease",
        }}
      />

      <div className="sc-content">
        <div
          className="sc-badge"
          style={{
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.3s ease",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <div
          className="sc-icon"
          style={{
            transform: hovered
              ? "scale(1.1) rotate(-4deg)"
              : "scale(1) rotate(0deg)",
            background: hovered
              ? "rgba(0,200,255,0.22)"
              : "rgba(0,200,255,0.10)",
            boxShadow: hovered
              ? "0 0 25px rgba(0,200,255,0.35)"
              : "none",
            transition:
              "transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          {icon}
        </div>
        <h3
          className="sc-title"
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
          className="sc-separator"
          style={{
            width: hovered ? "50px" : "25px",
            transition: "width 0.4s ease",
          }}
        />
        <p
          className="sc-desc"
          style={{
            opacity: hovered ? 0.9 : 0.75,
            transition: "opacity 0.3s ease",
          }}
        >
          {description}
        </p>
        <Link
          href={href}
          className="sc-link"
          onClick={(e) => onOpenDetail && e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          style={{
            color: hovered ? "#7df0ff" : "#00c8ff",
            gap: hovered ? "10px" : "6px",
            textShadow: hovered
              ? "0 0 15px rgba(0,200,255,0.6)"
              : "none",
            transition: "color 0.2s ease, gap 0.2s ease, text-shadow 0.2s ease",
            position: "relative",
            zIndex: 12,
          }}
        >
          <span>{linkText.replace(" →", "")}</span>
          <span
            style={{
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 0.2s ease",
              display: "inline-block",
            }}
          >
            →
          </span>
        </Link>
      </div>
      </CardVideoBackground>

      <style jsx>{`
        .service-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          animation: sc-appear 0.7s ease forwards;
          opacity: 0;
          transform: translateY(24px);
          will-change: transform, box-shadow;
          transition:
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.35s ease;
        }

        .service-card:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(0, 200, 255, 0.25),
            0 0 40px rgba(0, 200, 255, 0.08);
        }

        @keyframes sc-appear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sc-card-video-root {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .sc-vignette {
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

        .sc-scanlines {
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

        .sc-border {
          position: absolute;
          inset: 0;
          z-index: 4;
          border-radius: 18px;
          border: 1px solid rgba(0, 200, 255, 0.15);
          pointer-events: none;
        }

        .sc-corner {
          position: absolute;
          z-index: 5;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }

        .sc-tl {
          top: 12px;
          left: 12px;
          border-top: 1.5px solid rgba(0, 200, 255, 0.7);
          border-left: 1.5px solid rgba(0, 200, 255, 0.7);
          border-radius: 2px 0 0 0;
        }

        .sc-br {
          bottom: 12px;
          right: 12px;
          border-bottom: 1.5px solid rgba(0, 200, 255, 0.7);
          border-right: 1.5px solid rgba(0, 200, 255, 0.7);
          border-radius: 0 0 2px 0;
        }

        .sc-bottom-line {
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

        .sc-content {
          position: relative;
          z-index: 10;
          padding: 28px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
        }

        .sc-badge {
          font-family: "Courier New", monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(0, 200, 255, 0.6);
          letter-spacing: 0.15em;
          line-height: 1;
        }

        .sc-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          border: 1px solid rgba(0, 200, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00c8ff;
          will-change: transform;
        }

        .sc-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.3;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .sc-separator {
          height: 1.5px;
          background: linear-gradient(
            90deg,
            rgba(0, 200, 255, 0.5),
            transparent
          );
          border-radius: 1px;
        }

        .sc-desc {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.65;
          font-weight: 300;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);
          margin: 0;
          flex: 1;
        }

        .sc-link {
          display: inline-flex;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.03em;
          width: fit-content;
          padding: 6px 0;
        }

        @media (max-width: 768px) {
          .service-card {
            min-height: 270px;
          }
          .sc-content {
            padding: 22px 18px 20px;
          }
          .service-card:hover {
            transform: translateY(-4px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .service-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .sc-video {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
