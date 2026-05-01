"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { ReactNode } from "react";
import { AgenticSceneContent } from "./AgenticSceneContent";

export interface AgenticSceneCanvasProps {
  children?: ReactNode;
  mouse?: { x: number; y: number };
  scrollProgress?: number;
  scanSweep?: number;
  disableEffects?: boolean;
  className?: string;
}

export function AgenticSceneCanvas({
  mouse = { x: 0, y: 0 },
  scrollProgress = 0,
  scanSweep = 0,
  disableEffects = false,
  className = "",
}: AgenticSceneCanvasProps) {
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

  return (
    <div className={`relative w-full h-full min-h-screen ${className}`}>
      <Canvas
        dpr={[1, Math.min(2, typeof window !== "undefined" && "ontouchstart" in window ? 1.5 : 2)]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={glConfig}
        frameloop="always"
      >
        <color attach="background" args={["#011C40"]} />
        <Suspense fallback={null}>
          <AgenticSceneContent
            mouse={mouse}
            scrollProgress={scrollProgress}
            scanSweep={scanSweep}
          />
        </Suspense>
        {/* Full: Bloom + DOF (focal target = eye scanner ~5.3) + Vignette + Noise */}
        {!disableEffects ? (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              intensity={0.7}
              mipmapBlur
            />
            <DepthOfField
              focusDistance={0.02}
              focalLength={0.05}
              bokehScale={1.5}
              worldFocusDistance={5.3}
              worldFocusRange={2}
            />
            <Vignette
              eskil={false}
              offset={0.15}
              darkness={1.2}
              blendFunction={BlendFunction.NORMAL}
            />
            <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
          </EffectComposer>
        ) : (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={0.5}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
