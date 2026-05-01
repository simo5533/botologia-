"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import type { ReactNode } from "react";

const HOLO_CYAN = "#00d4ff";
const HOLO_CYAN_RGB = { r: 0, g: 212 / 255, b: 1 };

export interface SceneCanvasProps {
  children: ReactNode;
  /** Désactiver postprocessing (ex. prefers-reduced-motion) */
  disableEffects?: boolean;
  /** Limiter DPR pour mobile (ex. 1.5) */
  dprMax?: number;
  /** Classe du conteneur */
  className?: string;
  /** Camera position [x,y,z] */
  camera?: { position: [number, number, number]; fov?: number };
}

const defaultCamera = { position: [0, 0, 5] as [number, number, number], fov: 50 };

/**
 * Wrapper R3F avec postprocessing (Bloom, Noise, ChromaticAberration).
 * Optimisé mobile : dpr limité, effects désactivables pour reduced-motion.
 */
export function SceneCanvas({
  children,
  disableEffects = false,
  dprMax = typeof window !== "undefined" && "ontouchstart" in window ? 1.5 : 2,
  className = "",
  camera = defaultCamera,
}: SceneCanvasProps) {
  const glConfig = useMemo(
    () => ({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance" as const,
      stencil: false,
      depth: true,
    }),
    []
  );
  const chromaticOffset = useMemo(() => new Vector2(0.0015, 0.0015), []);

  return (
    <div className={`relative w-full h-full min-h-[200px] ${className}`}>
      <Canvas
        dpr={[1, dprMax]}
        camera={{ position: camera.position, fov: camera.fov ?? 50 }}
        gl={glConfig}
        frameloop="always"
      >
        <color attach="background" args={["transparent"]} />
        <Suspense fallback={null}>{children}</Suspense>
        {!disableEffects && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={0.8}
              mipmapBlur
            />
            <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={chromaticOffset}
              radialModulation={false}
              modulationOffset={0}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

export { HOLO_CYAN, HOLO_CYAN_RGB };
