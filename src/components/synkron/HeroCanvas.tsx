import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

function Grid() {
  return (
    <mesh rotation={[-(65 * Math.PI) / 180, 0, 0]} position={[0, -4, 0]}>
      <planeGeometry args={[80, 80, 40, 40]} />
      <meshBasicMaterial color="#2DD4BF" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 20 - 5,
        z: (Math.random() - 0.5) * 15 - 2.5,
      })),
    [count],
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    data.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.cos(t * 0.7 + i) * 0.6,
        p.y + Math.sin(t + i) * 0.9,
        p.z,
      );
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#818CF8" transparent opacity={0.55} />
    </instancedMesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 1.6;
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 1.6;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroCanvas() {
  const [count, setCount] = useState(150);
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) setCount(50);
  }, []);
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <CameraRig />
      <Grid />
      <Particles count={count} />
    </Canvas>
  );
}
