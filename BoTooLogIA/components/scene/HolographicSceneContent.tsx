"use client";

import { HologramOrb } from "@/components/holographic/HologramOrb";
import { NeonGridFloor } from "@/components/holographic/NeonGridFloor";

/**
 * Contenu par défaut de la scène : orbes + grille neon.
 * À utiliser comme children de <SceneCanvas> ou <DynamicSceneCanvas>.
 */
export function HolographicSceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1} color="#00d4ff" />
      <pointLight position={[-2, 2, 2]} intensity={0.5} color="#3b82f6" />
      <HologramOrb position={[0, 0.5, 0]} scale={0.4} speed={0.2} />
      <HologramOrb position={[-0.8, -0.3, 0.2]} scale={0.2} speed={0.15} />
      <HologramOrb position={[0.6, -0.2, -0.1]} scale={0.25} speed={0.25} />
      <NeonGridFloor position={[0, -1.2, 0]} size={15} divisions={15} />
    </>
  );
}
