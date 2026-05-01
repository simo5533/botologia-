"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const animate = () => {
      const dx = posRef.current.x - currentRef.current.x;
      const dy = posRef.current.y - currentRef.current.y;

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      currentRef.current.x += dx * 0.15;
      currentRef.current.y += dy * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      cursorRef.current?.classList.add("scale-[2.5]", "border-cyan-400/80", "bg-cyan-400/10");
      dotRef.current?.classList.add("opacity-0");
    };
    const onLeave = () => {
      cursorRef.current?.classList.remove("scale-[2.5]", "border-cyan-400/80", "bg-cyan-400/10");
      dotRef.current?.classList.remove("opacity-0");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    const interactives = document.querySelectorAll("a, button, input, textarea, [role='button']");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      id="botoologia-custom-cursor"
      className="pointer-events-none"
      aria-hidden
    >
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          border: "1px solid rgba(0,200,255,0.5)",
          willChange: "transform",
          transform: "translate(-100px, -100px) translate(-50%, -50%)",
        }}
        aria-hidden
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cyan-400 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          willChange: "transform",
          transform: "translate(-100px, -100px) translate(-50%, -50%)",
        }}
        aria-hidden
      />
    </div>
  );
}
