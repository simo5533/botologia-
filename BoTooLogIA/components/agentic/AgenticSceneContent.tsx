"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const EYE_WORLD: [number, number, number] = [-1.05, 0.2, 0.78];

const TILE_GEOM = new THREE.PlaneGeometry(0.15, 0.2);
const TILE_EDGES = new THREE.EdgesGeometry(TILE_GEOM);

const CYAN = "#00E5FF";
const CYAN_DIM = "#00E5FF88";

interface AgenticSceneContentProps {
  mouse: { x: number; y: number };
  scrollProgress: number;
  scanSweep: number;
}

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

export function AgenticSceneContent({
  mouse,
  scrollProgress,
  scanSweep,
}: AgenticSceneContentProps) {
  const faceRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);
  const portalRef = useRef<THREE.Group>(null);
  const tilesRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [hoveredTileIndex, setHoveredTileIndex] = useState(-1);
  const tileMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const prevHovered = useRef(-1);
  const { camera } = useThree();

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (faceRef.current) {
      const mx = mouse.x * 0.08;
      const my = mouse.y * 0.06;
      faceRef.current.rotation.y = mx;
      faceRef.current.rotation.x = my;
    }
    if (handRef.current) {
      const mx = mouse.x * 0.06;
      const my = mouse.y * 0.05;
      handRef.current.rotation.y = mx;
      handRef.current.rotation.x = my;
    }
    if (portalRef.current) {
      const mx = mouse.x * 0.02;
      const my = mouse.y * 0.02;
      portalRef.current.rotation.z = mx;
      portalRef.current.rotation.x = my;
    }
    if (tilesRef.current) {
      const mx = mouse.x * 0.1;
      const my = mouse.y * 0.08;
      tilesRef.current.rotation.y = mx * 0.3;
      tilesRef.current.rotation.x = my * 0.3;
    }

    ndc.set(mouse.x, mouse.y);
    raycaster.setFromCamera(ndc, camera);
    const objects = tileMeshRefs.current.filter(Boolean) as THREE.Mesh[];
    const hits = raycaster.intersectObjects(objects);
    const hitIndex = hits[0]?.object?.userData?.tileIndex ?? -1;
    if (hitIndex !== prevHovered.current) {
      prevHovered.current = hitIndex;
      setHoveredTileIndex(hitIndex);
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 4, 6]} intensity={1.2} color={CYAN} />
      <pointLight position={[-4, 2, 4]} intensity={0.5} color="#8b5cf6" />
      <spotLight
        position={[0, 5, 2]}
        angle={0.4}
        penumbra={0.6}
        intensity={1}
        color={CYAN}
      />

      <ConnectionBeams hoveredTileIndex={hoveredTileIndex} />
      <FaceSilhouette groupRef={faceRef} timeRef={timeRef} scanSweep={scanSweep} />
      <RoboticHand groupRef={handRef} timeRef={timeRef} />
      <PortalFrame groupRef={portalRef} scrollProgress={scrollProgress} />
      <DataTiles
        groupRef={tilesRef}
        timeRef={timeRef}
        scanSweep={scanSweep}
        hoveredTileIndex={hoveredTileIndex}
        tileMeshRefs={tileMeshRefs}
      />
      <GroundGrid scrollProgress={scrollProgress} />
      <DustParticles timeRef={timeRef} />
    </>
  );
}

function ConnectionBeams({ hoveredTileIndex }: { hoveredTileIndex: number }) {
  return (
    <group>
      {TILE_POSITIONS.map((pos, i) => {
        const isHovered = i === hoveredTileIndex;
        return (
          <Line
            key={i}
            points={[EYE_WORLD, pos]}
            color={isHovered ? CYAN : CYAN_DIM}
            lineWidth={isHovered ? 1.4 : 0.7}
          />
        );
      })}
    </group>
  );
}

const FaceSilhouette = ({
  groupRef,
  timeRef,
  scanSweep,
}: {
  groupRef: React.RefObject<THREE.Group>;
  timeRef: React.MutableRefObject<number>;
  scanSweep: number;
}) => {

  const centerGlowRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const t = timeRef.current;
    const period = 2.5;
    const pulse = 0.7 + 0.3 * Math.sin((t * 2 * Math.PI) / period);
    if (centerGlowRef.current) {
      const mat = centerGlowRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = pulse * (1 + scanSweep * 0.3);
    }
  });

  return (
    <group ref={groupRef} position={[-1.2, 0, 0]}>
      {/* Ceramic face silhouette — flattened sphere / ellipsoid */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.8, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial
          color="#e8e8ec"
          metalness={0.2}
          roughness={0.6}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Circuit lines on cheek (decals) */}
      <lineSegments position={[-0.3, -0.2, 0.82]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={4}
            array={new Float32Array([0, 0, 0, 0.15, -0.1, 0, 0.15, -0.1, 0, 0.25, -0.25, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={CYAN} opacity={0.5} transparent />
      </lineSegments>

      {/* Eye + Iris Scanner */}
      <group position={[0.15, 0.2, 0.78]}>
        <EyeScanner timeRef={timeRef} scanSweep={scanSweep} centerGlowRef={centerGlowRef} />
      </group>
    </group>
  );
};

function EyeScanner({
  timeRef,
  scanSweep,
  centerGlowRef,
}: {
  timeRef: React.MutableRefObject<number>;
  scanSweep: number;
  centerGlowRef: React.RefObject<THREE.Mesh>;
}) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = timeRef.current;
    if (ring1.current) ring1.current.rotation.z = t * 0.3;
    if (ring2.current) ring2.current.rotation.z = t * -0.2;
    if (ring3.current) ring3.current.rotation.z = t * 0.4;
  });

  return (
    <group>
      {/* Iris base */}
      <mesh>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.3 + scanSweep * 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Rotating HUD rings */}
      <mesh ref={ring1} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.1, 0.105, 32]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} rotation={[0, 0, Math.PI / 3]}>
        <ringGeometry args={[0.12, 0.125, 32]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring3} rotation={[0, 0, Math.PI / 6]}>
        <ringGeometry args={[0.14, 0.145, 32]} />
        <meshBasicMaterial color={CYAN_DIM} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Radial lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 12) * Math.PI * 2]}>
          <planeGeometry args={[0.002, 0.14]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Center glow */}
      <mesh ref={centerGlowRef}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

const RoboticHand = ({
  groupRef,
  timeRef,
}: {
  groupRef: React.RefObject<THREE.Group>;
  timeRef: React.MutableRefObject<number>;
}) => {
  const fingerRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const t = timeRef.current;
    fingerRefs.current.forEach((f, i) => {
      if (f) f.rotation.x = 0.02 * Math.sin(t * 0.8 + i * 0.5);
    });
  });

  return (
    <group ref={groupRef} position={[1.3, 0.1, 0.5]}>
      {/* Palm — matte white casing */}
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.35, 0.12]} />
        <meshPhysicalMaterial color="#f5f5f7" metalness={0.05} roughness={0.75} />
      </mesh>
      {/* Fingers — chrome joints + matte */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[-0.06 + i * 0.04, 0.22, 0]}>
          <mesh ref={(r) => { fingerRefs.current[i] = r; }} castShadow>
            <boxGeometry args={[0.04, 0.2, 0.05]} />
            <meshPhysicalMaterial color="#e0e0e8" metalness={0.4} roughness={0.45} />
          </mesh>
        </group>
      ))}
      {/* Thumb */}
      <group position={[0.1, 0.08, 0]}>
        <mesh ref={(r) => { fingerRefs.current[4] = r; }} castShadow>
          <boxGeometry args={[0.05, 0.18, 0.06]} />
          <meshPhysicalMaterial color="#e0e0e8" metalness={0.4} roughness={0.45} />
        </mesh>
      </group>
      {/* Hologram icons above hand */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.2 * Math.cos((i - 1) * 0.5), 0.5 + i * 0.08, 0.3]}>
          <ringGeometry args={[0.06, 0.07, 16]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const PortalFrame = ({
  groupRef,
  scrollProgress,
}: {
  groupRef: React.RefObject<THREE.Group>;
  scrollProgress: number;
}) => {
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (innerRef.current) {
      innerRef.current.rotation.z += delta * 0.1;
    }
  });

  const scale = 1 + scrollProgress * 0.3;
  const opacity = Math.max(0.3, 1 - scrollProgress * 1.2);

  return (
    <group ref={groupRef} position={[0, 0, -2]} scale={scale}>
      <mesh ref={innerRef}>
        <torusGeometry args={[1.8, 0.03, 16, 64]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={opacity * 0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[1.5, 0.02, 8, 48]} />
        <meshBasicMaterial
          color={CYAN_DIM}
          transparent
          opacity={opacity * 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Warp distortion plane */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshBasicMaterial
          color="#001a2e"
          transparent
          opacity={opacity * 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const TILE_POSITIONS: [number, number, number][] = [
  [-0.8, 0.6, 0.2], [0.4, 0.7, 0.1], [-0.5, -0.5, 0.3], [0.9, 0.2, 0],
  [-0.3, 0.9, -0.2], [0.6, -0.6, 0.2], [-0.9, 0.1, 0.1], [0.2, 0.5, 0.4],
  [-0.6, -0.3, 0.1], [0.7, 0.4, -0.1], [-0.2, -0.7, 0.2], [0.5, -0.2, 0.3],
  [-0.4, 0.3, 0.2], [0.8, -0.4, 0.1], [-0.7, 0.5, 0], [0.3, -0.6, 0.2],
  [-0.1, 0.6, 0.15], [0.6, 0.1, -0.15],
];

const DataTiles = ({
  groupRef,
  timeRef,
  scanSweep,
  hoveredTileIndex,
  tileMeshRefs,
}: {
  groupRef: React.RefObject<THREE.Group>;
  timeRef: React.MutableRefObject<number>;
  scanSweep: number;
  hoveredTileIndex: number;
  tileMeshRefs: React.MutableRefObject<(THREE.Mesh | null)[]>;
}) => {
  return (
    <group ref={groupRef}>
      {TILE_POSITIONS.map((pos, i) => (
        <DataTile
          key={i}
          position={pos}
          index={i}
          timeRef={timeRef}
          scanSweep={scanSweep}
          isHovered={i === hoveredTileIndex}
          meshRef={(el) => { tileMeshRefs.current[i] = el; }}
        />
      ))}
    </group>
  );
};

function DataTile({
  position,
  index,
  timeRef,
  scanSweep: _scanSweep,
  isHovered,
  meshRef,
}: {
  position: [number, number, number];
  index: number;
  timeRef: React.MutableRefObject<number>;
  scanSweep: number;
  isHovered: boolean;
  meshRef: (el: THREE.Mesh | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const scaleTarget = useRef(new THREE.Vector3(1, 1, 1));
  useFrame(() => {
    const t = timeRef.current;
    const drift = 0.02 * Math.sin(t * 0.5 + index * 0.3);
    if (groupRef.current) {
      groupRef.current.position.set(
        position[0] + drift * 0.5,
        position[1] + drift,
        position[2]
      );
      scaleTarget.current.setScalar(isHovered ? 1.07 : 1);
      groupRef.current.scale.lerp(scaleTarget.current, 0.08);
    }
  });

  const opacity = 0.2 + (isHovered ? 0.35 : 0.08) + 0.05 * Math.sin(timeRef.current + index);

  return (
    <group ref={groupRef}>
      <mesh
        ref={(el) => {
          if (el) (el as THREE.Mesh).userData.tileIndex = index;
          meshRef(el);
        }}
        geometry={TILE_GEOM}
      >
        <meshPhysicalMaterial
          color={isHovered ? "#e8f8ff" : "#ffffff"}
          metalness={0.1}
          roughness={0.2}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={TILE_EDGES}>
        <lineBasicMaterial color={CYAN} transparent opacity={isHovered ? 0.95 : 0.5} />
      </lineSegments>
    </group>
  );
}

function GroundGrid({ scrollProgress }: { scrollProgress: number }) {
  const opacity = Math.max(0, 0.4 - scrollProgress * 0.5);
  return (
    <group position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color="#0a0e18"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <gridHelper args={[20, 20, 0x00e5ff, 0x060a12]} position={[0, 0, 0.01]} />
      <mesh>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color="#060a12"
          transparent
          opacity={1 - opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function DustParticles({ timeRef: _timeRef }: { timeRef: React.MutableRefObject<number> }) {
  const count = 30;
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 6;
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 2] -= delta * 0.2;
        if (pos[i * 3 + 2] < -3) pos[i * 3 + 2] = 2;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={CYAN} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}
