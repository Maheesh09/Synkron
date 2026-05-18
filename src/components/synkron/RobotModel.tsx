import { useEffect, useState, Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface RobotModelProps {
  scene?: string;
}

export default function RobotModel({
  scene = "/scene.splinecode",
}: RobotModelProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[350px] lg:min-h-[500px] flex items-center justify-center bg-transparent">
        <div className="relative flex h-12 w-12">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-12 w-12 bg-teal-500"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] lg:min-h-[500px] relative select-none">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-transparent">
            <div className="relative flex h-12 w-12">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-12 w-12 bg-teal-500"></span>
            </div>
          </div>
        }
      >
        <Spline scene={scene} className="w-full h-full" />
      </Suspense>
    </div>
  );
}
