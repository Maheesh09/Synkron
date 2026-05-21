import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

function Grid() {
  return (
    <mesh rotation={[-(65 * Math.PI) / 180, 0, 0]} position={[0, -4.5, 0]}>
      <planeGeometry args={[80, 80, 40, 40]} />
      <meshBasicMaterial color="#2DD4BF" wireframe transparent opacity={0.08} />
    </mesh>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 36,
        y: Math.random() * 18 - 4,
        z: (Math.random() - 0.5) * 12 - 2,
        speed: 0.4 + Math.random() * 0.6,
        offset: i * 0.41,
      })),
    [count],
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    data.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.cos(t * p.speed * 0.5 + p.offset) * 0.7,
        p.y + Math.sin(t * p.speed * 0.4 + p.offset) * 1.1,
        p.z,
      );
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.045, 6, 6]} />
      <meshBasicMaterial color="#818CF8" transparent opacity={0.5} />
    </instancedMesh>
  );
}

function TealParticles({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 30,
        y: Math.random() * 14 - 3,
        z: (Math.random() - 0.5) * 10,
        speed: 0.3 + Math.random() * 0.5,
        offset: i * 0.67,
      })),
    [count],
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    data.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed * 0.4 + p.offset) * 0.9,
        p.y + Math.cos(t * p.speed * 0.3 + p.offset) * 0.8,
        p.z,
      );
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.035, 6, 6]} />
      <meshBasicMaterial color="#2DD4BF" transparent opacity={0.35} />
    </instancedMesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 1.4;
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 1.4;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.03;
    camera.position.y += (target.current.y - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") setIsMobile(window.innerWidth < 768);
  }, []);
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 52 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <CameraRig />
      <Grid />
      <Particles count={isMobile ? 55 : 130} />
      <TealParticles count={isMobile ? 25 : 60} />
    </Canvas>
  );
}
