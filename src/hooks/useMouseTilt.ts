import { useRef, useState, useCallback, useEffect } from "react";

export function useMouseTilt(maxDegrees = 10) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const check = () =>
      setEnabled(window.innerWidth >= 768 && !window.matchMedia("(pointer: coarse)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ rotateY: px * maxDegrees * 2, rotateX: -py * maxDegrees * 2 });
    },
    [enabled, maxDegrees],
  );

  const onMouseLeave = useCallback(() => setTilt({ rotateX: 0, rotateY: 0 }), []);

  return { ref, tilt, onMouseMove, onMouseLeave, enabled };
}
