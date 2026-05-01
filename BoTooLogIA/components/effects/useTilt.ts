"use client";

import { useCallback, useEffect, useState } from "react";

const MAX_TILT = 8;
const PERSPECTIVE = 1000;
const MOBILE_BREAKPOINT = 768;

/**
 * Hook 3D tilt au survol (mousemove).
 * - rotationX / rotationY max 8deg, perspective 1000px
 * - désactivé sur mobile (< 768px)
 * - évite re-renders excessifs via state batch
 */
export function useTilt() {
  const [isMobile, setIsMobile] = useState(true);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isMobile) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTransform({
        rotateY: x * MAX_TILT,
        rotateX: -y * MAX_TILT,
      });
    },
    [isMobile]
  );

  const onMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
  }, []);

  const style =
    !isMobile && (transform.rotateX !== 0 || transform.rotateY !== 0)
      ? {
          transform: `perspective(${PERSPECTIVE}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        }
      : undefined;

  return { onMouseMove, onMouseLeave, style, isTiltEnabled: !isMobile };
}
