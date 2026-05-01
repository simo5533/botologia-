"use client";

import { Grid } from "@react-three/drei";
import { HOLO_CYAN } from "@/components/scene/SceneCanvas";

export interface NeonGridFloorProps {
  position?: [number, number, number];
  size?: number;
  divisions?: number;
  color?: string;
}

/**
 * Grille au sol type holographique / neon (lignes cyan).
 */
export function NeonGridFloor({
  position = [0, -1.5, 0],
  size = 20,
  divisions = 20,
  color = HOLO_CYAN,
}: NeonGridFloorProps) {
  return (
    <group position={position}>
      <Grid
        infiniteGrid
        sectionSize={size / divisions}
        sectionThickness={0.4}
        sectionColor={color}
        fadeDistance={25}
        fadeStrength={1.2}
        followCamera={false}
      />
    </group>
  );
}
