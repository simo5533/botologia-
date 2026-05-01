"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { HOLO_CYAN } from "@/components/scene/SceneCanvas";

export interface HologramOrbProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  /** Vitesse de rotation (rad/s) */
  speed?: number;
}

/**
 * Sphère holographique émissive (cyan) avec rotation douce.
 */
export function HologramOrb({
  position = [0, 0, 0],
  scale = 1,
  color = HOLO_CYAN,
  speed = 0.3,
}: HologramOrbProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.95}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}
