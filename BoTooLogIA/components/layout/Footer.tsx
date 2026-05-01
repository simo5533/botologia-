"use client";

import Link from "next/link";
import { useRef, useState, useEffect, type CSSProperties } from "react";
import { publicNavLinks } from "@/lib/data/navigation";
import { VIDEO_POSTER } from "@/lib/seo/video-posters";
import { cn } from "@/lib/utils";

/** Même découpe que la marque bannière / header : BoToo — Log (cyan) — IA */
function FooterBrandWordmark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={cn("font-heading text-white", className)} style={style}>
      BoToo<span style={{ color: "#00c8ff" }}>Log</span>IA
    </span>
  );
}

/**
 * Footer futuriste — vidéo background, liens, slogan, CTA, mentions
 */
export function Footer({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, []);

  return (
    <footer
      className={cn("overflow-hidden", className)}
      style={{
        position: "relative",
        background: "#04060f",
        boxShadow: "0 0 60px rgba(0,212,255,0.12), 0 0 120px rgba(0,212,255,0.06), inset 0 1px 0 rgba(0,212,255,0.08)",
      }}
      role="contentinfo"
    >
      {/* ══════════════════════════════════════
          VIDÉO BACKGROUND
          ══════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <video
          ref={videoRef}
          poster={VIDEO_POSTER.footer}
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
            transition: "opacity 1s ease",
            willChange: "opacity",
          }}
          aria-hidden
        >
          <source src="/videos/footer-bg.mp4" type="video/mp4" />
        </video>

        {/* Fallback fond sombre si vidéo absente */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #020b1a, #000d22)",
            opacity: ready ? 0 : 1,
            transition: "opacity 1s ease",
          }}
          aria-hidden
        />
      </div>

      {/* Overlay pour lisibilité — légèrement éclairé comme la bannière */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(4,6,15,0.72) 0%, rgba(4,6,15,0.82) 100%)",
        }}
        aria-hidden
      />

      {/* Ligne lumineuse haut — même esprit que la bannière */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          zIndex: 2,
          background:
            "linear-gradient(90deg, transparent 5%, rgba(0,212,255,0.6) 20%, rgba(0,212,255,0.9) 50%, rgba(0,212,255,0.6) 80%, transparent 95%)",
          boxShadow: "0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.2)",
        }}
        aria-hidden
      />

      {/* ══════════════════════════════════════
          CONTENU DU FOOTER
          ══════════════════════════════════════ */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* SECTION PRINCIPALE */}
        <div
          className={cn(
            "mx-auto flex w-full max-w-[1280px] flex-col items-stretch gap-10 px-4 pb-9 pt-10 sm:px-7 sm:py-14 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-10 lg:pb-11 lg:pt-16"
          )}
        >
          {/* Logo + tagline */}
          <div className="flex min-w-0 flex-col gap-2.5 sm:min-w-[200px]">
            <Link
              href="/"
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              <FooterBrandWordmark />
            </Link>
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.65)",
                margin: 0,
                fontWeight: 300,
              }}
            >
              Le Futur dès aujourd&apos;hui
            </p>

            {/* Dot animé */}
            <div
              className="footer-dot"
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "rgba(0,200,255,0.6)",
                border: "1px solid rgba(0,200,255,0.8)",
                marginTop: "12px",
                willChange: "transform, opacity",
              }}
              aria-hidden
            />
          </div>

          {/* Navigation — liens existants (publicNavLinks) */}
          <nav
            className="flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-3 md:flex-1 md:justify-start"
            aria-label="Navigation pied de page"
          >
            {publicNavLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.75)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                  padding: "4px 0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#00c8ff";
                  e.currentTarget.style.textShadow = "0 0 12px rgba(0,200,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex w-full max-w-none flex-col items-stretch gap-2.5 md:max-w-[280px] md:items-end">
            <Link
              href="/botolink"
              style={{
                display: "inline-flex",
                width: "100%",
                justifyContent: "center",
                maxWidth: "100%",
                boxSizing: "border-box" as const,
                alignItems: "center",
                gap: "10px",
                padding: "12px 26px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #00c8ff, #0094cc)",
                color: "#000d1a",
                fontSize: "0.95rem",
                fontWeight: 800,
                textDecoration: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                willChange: "transform",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0,200,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span>⊙</span>
              <span>Entrer dans le futur</span>
            </Link>

            <Link
              href="/botolab"
              className="block text-center text-[0.9rem] md:text-end"
              style={{
                color: "rgba(0,200,255,0.7)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s ease",
                padding: "4px 0",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#00c8ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(0,200,255,0.7)")
              }
            >
              BoTo Lab →
            </Link>
          </div>
        </div>

        {/* SÉPARATEUR — ligne visible type bannière */}
        <div className="mx-auto max-w-[1280px] px-4 sm:px-7">
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.25), transparent)",
              boxShadow: "0 0 8px rgba(0,212,255,0.15)",
            }}
          />
        </div>

        {/* COPYRIGHT */}
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-3 px-4 py-6 sm:px-7 sm:py-7">
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()}{" "}
            <FooterBrandWordmark style={{ fontWeight: 700, color: "rgba(255,255,255,0.82)" }} />
            . Tous droits réservés.
          </p>
          <p className="m-0 flex max-w-lg flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center leading-relaxed [word-break:break-word]">
            <span
              className="inline bg-gradient-to-r from-sky-200 via-[#00d4ff] to-cyan-300 bg-clip-text text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-transparent drop-shadow-[0_0_12px_rgba(0,212,255,0.25)] sm:text-[0.85rem]"
              style={{ WebkitBackgroundClip: "text" }}
            >
              RC : 183221
            </span>
            <span className="text-[0.7rem] text-white/35 sm:text-[0.75rem]" aria-hidden="true">
              —
            </span>
            <span
              className="inline bg-gradient-to-r from-cyan-300 via-[#00a8e6] to-blue-400 bg-clip-text text-[0.8rem] font-semibold tracking-[0.04em] text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.2)] sm:text-[0.85rem]"
              style={{ WebkitBackgroundClip: "text" }}
            >
              ICE : 003896691000005
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
