"use client";

import { useEffect, useRef } from "react";

/**
 * Section type "Guiding Light" — thème bleu fancy et noir.
 * Spotlight qui suit la souris (bloc robot + texte déplacés dans WhyBoToHubSection).
 */
export function GuidingLightSection() {
  const spotlightRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ target: { x: 0, y: 0 }, current: { x: 0, y: 0 }, last: { x: 0, y: 0 } });
  const cursorDetectedRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    const mask = maskRef.current;
    if (!spotlight || !mask) return;

    const init = () => {
      const sr = spotlight.getBoundingClientRect();
      const cx = sr.width / 2;
      const cy = sr.height / 2;
      mouseRef.current.current.x = mouseRef.current.target.x = cx;
      mouseRef.current.current.y = mouseRef.current.target.y = cy;
    };

    const updateCursor = (clientX: number, clientY: number) => {
      if (!cursorDetectedRef.current) return;
      mouseRef.current.last.x = clientX;
      mouseRef.current.last.y = clientY;
      const sr = spotlight.getBoundingClientRect();
      const inside =
        clientX >= sr.left &&
        clientX <= sr.right &&
        clientY >= sr.top &&
        clientY <= sr.bottom;
      if (inside) {
        mouseRef.current.target.x = clientX - sr.left;
        mouseRef.current.target.y = clientY - sr.top;
        mask.classList.add("guiding-light-mask-active");
      } else {
        mask.classList.remove("guiding-light-mask-active");
      }
    };

    const onMouse = (e: MouseEvent) => {
      cursorDetectedRef.current = true;
      updateCursor(e.clientX, e.clientY);
    };

    const onScroll = () => {
      if (cursorDetectedRef.current) updateCursor(mouseRef.current.last.x, mouseRef.current.last.y);
    };

    window.addEventListener("mouseenter", onMouse, { once: true });
    window.addEventListener("mouseover", onMouse, { once: true });
    document.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", init);
    setTimeout(init, 100);

    const animate = () => {
      const m = mouseRef.current;
      m.current.x += (m.target.x - m.current.x) * 0.1;
      m.current.y += (m.target.y - m.current.y) * 0.1;
      spotlight.style.setProperty("--mouse-x", `${m.current.x}px`);
      spotlight.style.setProperty("--mouse-y", `${m.current.y}px`);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", init);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="guiding-light-theme bg-[#0a0a0a] text-[#7dd3fc]">
      <section
        ref={spotlightRef}
        className="guiding-light-spotlight relative w-full min-h-screen flex flex-col justify-center items-center gap-6 px-8 py-16"
        style={{ ["--mouse-x" as string]: "50%", ["--mouse-y" as string]: "50%" }}
      >
        <div
          ref={maskRef}
          className="guiding-light-mask absolute inset-0 pointer-events-none bg-[#0a0a0a] opacity-0 transition-opacity duration-300"
          style={{
            maskImage: "radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), transparent 0%, transparent 40%, #0a0a0a 80%, #0a0a0a 100%)",
            WebkitMaskImage: "radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), transparent 0%, transparent 40%, #0a0a0a 80%, #0a0a0a 100%)",
          }}
          aria-hidden
        />
      </section>
    </div>
  );
}
