"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const LAYER_SMALL = 0;   // 70% — loin, très petites, mouvement lent
const LAYER_MEDIUM = 1;  // 25% — moyen
const LAYER_BRIGHT = 2;  // 5% — proches, glow cyan

interface Star {
  x: number;
  y: number;
  size: number;
  layer: number;
  twinklePhase: number;
  twinkleDuration: number;
  driftSpeed: number;
  hasGlow: boolean;
  baseOpacity: number;
}

/** Pseudo-aléatoire 0–1 déterministe pour répartition équilibrée */
function seed(x: number, y: number): number {
  const n = Math.abs((x * 92837111 + y * 6892871) % 1e9);
  return n / 1e9;
}

/** Répartition équilibrée : grille avec léger décalage déterministe (évite regroupement) */
function generateStars(width: number, height: number): Star[] {
  const stars: Star[] = [];

  const pixelCount = width * height;
  const total = pixelCount < 800000 ? Math.floor(pixelCount / 12000) : Math.min(400, Math.floor(pixelCount / 8000));
  const n1 = Math.floor(total * 0.7);
  const n2 = Math.floor(total * 0.25);
  const n3 = total - n1 - n2;

  const cols = Math.ceil(Math.sqrt(n1 * (width / height)));
  const rows = Math.ceil(n1 / cols);
  const cellW = width / cols;
  const cellH = height / rows;
  for (let row = 0; row < rows && stars.length < n1; row++) {
    for (let col = 0; col < cols && stars.length < n1; col++) {
      const gx = col * cellW;
      const gy = row * cellH;
      const jitter = 0.4;
      const x = gx + (seed(gx, gy) * 2 - 1) * cellW * jitter;
      const y = gy + (seed(gy, gx) * 2 - 1) * cellH * jitter;
      if (x >= 0 && x < width && y >= 0 && y < height) {
        stars.push({
          x,
          y,
          size: 1 + seed(gx + 1, gy) * 1,
          layer: LAYER_SMALL,
          twinklePhase: seed(x, y + 1) * 6,
          twinkleDuration: 4 + seed(y, x) * 4,
          driftSpeed: 0.15 + seed(x * 2, y) * 0.1,
          hasGlow: false,
          baseOpacity: 0.5 + seed(y, x * 2) * 0.3,
        });
      }
    }
  }

  for (let i = 0; i < n2; i++) {
    const x = (seed(i * 7, i * 13) * 0.9 + 0.05) * width;
    const y = (seed(i * 11, i * 17) * 0.9 + 0.05) * height;
    stars.push({
      x,
      y,
      size: 1.5 + seed(i, i + 5) * 0.5,
      layer: LAYER_MEDIUM,
      twinklePhase: seed(i, i + 1) * 6,
      twinkleDuration: 4 + seed(i, i + 2) * 4,
      driftSpeed: 0.35 + seed(i * 3, i) * 0.2,
      hasGlow: false,
      baseOpacity: 0.55 + seed(i, i + 3) * 0.35,
    });
  }

  for (let i = 0; i < n3; i++) {
    const x = (seed(i * 31, i * 19) * 0.85 + 0.075) * width;
    const y = (seed(i * 23, i * 41) * 0.85 + 0.075) * height;
    stars.push({
      x,
      y,
      size: 3,
      layer: LAYER_BRIGHT,
      twinklePhase: seed(i * 2, i) * 6,
      twinkleDuration: 5 + seed(i, i * 2) * 3,
      driftSpeed: 0.25 + seed(i, i * 5) * 0.15,
      hasGlow: true,
      baseOpacity: 0.7 + seed(i, i * 7) * 0.25,
    });
  }

  return stars;
}

/** Twinkle: opacity 0.4 → 1 → 0.4, durée en secondes, phase décalée */
function twinkle(tSeconds: number, phase: number, duration: number): number {
  const cycle = (tSeconds + phase) % duration;
  const half = duration / 2;
  const x = cycle < half ? cycle / half : (duration - cycle) / half;
  return 0.4 + 0.6 * x;
}

export function LuxuryStarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 1920, h: 1080 });
  const [isMobile, setIsMobile] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const shootingRef = useRef<{ x: number; y: number; t: number; duration: number } | null>(null);
  const nextShootingRef = useRef(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const stars = useMemo(() => generateStars(size.w, size.h), [size.w, size.h]);

  const resize = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setSize({ w, h });
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w <= 0 || size.h <= 0) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = size.w;
    canvas.height = size.h;
    startTimeRef.current = performance.now();
    lastTimeRef.current = 0;

    const loop = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const h = size.h;
      const sixtySecondCycle = (elapsed % 60) * (h / 60);

      ctx.clearRect(0, 0, size.w, size.h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const parallax = isMobile ? 0 : 1;
      const p1 = parallax * 4 * (mx - 0.5);
      const p2 = parallax * 10 * (mx - 0.5);
      const p3 = parallax * 18 * (mx - 0.5);
      const py1 = parallax * 3 * (my - 0.5);
      const py2 = parallax * 6 * (my - 0.5);
      const py3 = parallax * 12 * (my - 0.5);

      for (const s of stars) {
        const layerMul = s.layer === LAYER_SMALL ? 0.5 : s.layer === LAYER_MEDIUM ? 1 : 0.7;
        const layerOffset = sixtySecondCycle * s.driftSpeed * layerMul;
        const px = s.layer === LAYER_SMALL ? p1 : s.layer === LAYER_MEDIUM ? p2 : p3;
        const py = s.layer === LAYER_SMALL ? py1 : s.layer === LAYER_MEDIUM ? py2 : py3;
        let drawX = (s.x + px) % size.w;
        if (drawX < 0) drawX += size.w;
        let drawY = (s.y + layerOffset + py) % (h + 40);
        if (drawY < 0) drawY += h + 40;

        const op = s.baseOpacity * twinkle(elapsed, s.twinklePhase, s.twinkleDuration);

        if (s.hasGlow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(0, 200, 255, 0.6)";
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, Math.max(0.5, s.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      if (!isMobile && elapsed > nextShootingRef.current) {
        nextShootingRef.current = elapsed + 15 + Math.random() * 10;
        shootingRef.current = {
          x: Math.random() * size.w,
          y: Math.random() * size.h * 0.5,
          t: 0,
          duration: 1.2,
        };
      }
      const delta = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = now;
      const sh = shootingRef.current;
      if (sh) {
        sh.t += delta;
        const progress = Math.min(1, sh.t / sh.duration);
        const x = sh.x + progress * size.w * 0.4;
        const y = sh.y + progress * size.h * 0.25;
        const alpha = 1 - progress;
        ctx.strokeStyle = `rgba(220, 240, 255, ${alpha * 0.9})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        if (progress >= 1) shootingRef.current = null;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, stars, isMobile]);

  return (
    <div
      className="fixed inset-0 -z-[1] pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Fond principal gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, #0b1f3a 0%, #050b16 40%, #000000 100%)",
        }}
      />
      {/* Halo central très léger */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 80, 120, 0.08) 0%, transparent 70%)",
        }}
      />
      {/* Canvas étoiles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={size.w}
        height={size.h}
      />
      {/* Grain subtil 2% */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
