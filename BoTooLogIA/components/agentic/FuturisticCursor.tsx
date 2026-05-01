"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const CYAN = "#00E5FF";
const MAGNET_STRENGTH = 0.25;
const TRAIL_LEN = 8;

function useCanUseCursor() {
  const [canUse, setCanUse] = useState(false);
  useEffect(() => {
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanUse(!touch && !reduced);
  }, []);
  return canUse;
}

export function FuturisticCursor() {
  const canUse = useCanUseCursor();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([]);
  const raf = useRef<number>(0);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const magneticRef = useRef<{ x: number; y: number } | null>(null);

  const updateTarget = useCallback((clientX: number, clientY: number) => {
    targetRef.current = { x: clientX, y: clientY };
  }, []);

  useEffect(() => {
    if (!canUse) return;
    const onMove = (e: MouseEvent) => updateTarget(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove, { passive: true });

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.("a, button, [role='button'], [data-cursor-magnetic]")) {
        setIsHover(true);
        const rect = target.getBoundingClientRect();
        magneticRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    };
    const onOut = () => {
      setIsHover(false);
      magneticRef.current = null;
    };
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);

    const onDown = () => setIsClick(true);
    const onUp = () => setIsClick(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [canUse, updateTarget]);

  useEffect(() => {
    if (!canUse) return;
    let mounted = true;
    const loop = () => {
      if (!mounted) return;
      raf.current = requestAnimationFrame(loop);
      const target = targetRef.current;
      let { x, y } = posRef.current;
      const magnet = magneticRef.current;
      if (magnet) {
        x += (magnet.x - x) * MAGNET_STRENGTH;
        y += (magnet.y - y) * MAGNET_STRENGTH;
      } else {
        x += (target.x - x) * 0.2;
        y += (target.y - y) * 0.2;
      }
      posRef.current = { x, y };
      setPos({ x, y });
      setTrail((prev) => {
        const next = [{ x, y }, ...prev].slice(0, TRAIL_LEN);
        return next;
      });
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [canUse]);

  if (!canUse) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998]"
      aria-hidden
    >
      {/* Trail blur dots */}
      {trail.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-agentic-cyan"
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
            opacity: 0.15 * (1 - i / TRAIL_LEN),
            width: 6 + (TRAIL_LEN - i) * 2,
            height: 6 + (TRAIL_LEN - i) * 2,
          }}
        />
      ))}
      {/* Outer ring */}
      <motion.div
        className="absolute rounded-full border-2 border-agentic-cyan"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          width: isHover ? 56 : 32,
          height: isHover ? 56 : 32,
          opacity: isHover ? 0.6 : 0.35,
          boxShadow: `0 0 20px ${CYAN}40`,
        }}
        animate={{
          scale: isClick ? 1.15 : 1,
          opacity: isHover ? 0.6 : 0.35,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
      {/* Center dot */}
      <motion.div
        className="absolute h-2 w-2 rounded-full bg-agentic-cyan"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 12px ${CYAN}`,
        }}
        animate={{ scale: isClick ? 1.4 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      {/* Click ripple + scan wave pulse */}
      {isClick && (
        <>
          <motion.div
            className="absolute rounded-full border-2 border-agentic-cyan"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              width: 32,
              height: 32,
              boxShadow: `0 0 20px ${CYAN}60`,
            }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full border border-agentic-cyan"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              width: 48,
              height: 48,
              boxShadow: `0 0 40px ${CYAN}40`,
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </>
      )}
    </div>
  );
}
