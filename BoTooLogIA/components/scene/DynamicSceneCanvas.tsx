"use client";

import dynamic from "next/dynamic";
import type { SceneCanvasProps } from "./SceneCanvas";

/**
 * Chargement dynamique du canvas 3D (SSR désactivé, bundle séparé).
 */
const SceneCanvasDynamic = dynamic(
  () => import("./SceneCanvas").then((m) => m.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-[rgb(var(--background))]/50 rounded-2xl">
        <div className="h-8 w-8 animate-pulse rounded-full bg-holographic-cyan/30" />
      </div>
    ),
  }
);

export function DynamicSceneCanvas(props: SceneCanvasProps) {
  return <SceneCanvasDynamic {...props} />;
}
