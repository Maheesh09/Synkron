import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMouseTilt } from "@/hooks/useMouseTilt";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHealth, getRepos, getRuns } from "@/lib/api";

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let start: number
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

function Gauge({ value, isLoading }: { value: number; isLoading: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const n = useCountUp(value);
  const R = 78;
  const C = 2 * Math.PI * R;
  return (
    <div ref={ref} className="relative w-[200px] h-[200px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="gaugeg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={R} stroke="rgba(255,255,255,0.07)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="100" cy="100" r={R}
          stroke="url(#gaugeg)" strokeWidth="10" fill="none" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={inView ? { strokeDashoffset: C - (C * (isLoading ? 0 : value)) / 100 } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-extrabold text-white" style={{ fontSize: 52, lineHeight: 1 }}>
          {isLoading ? <div className="h-8 w-16 rounded-md bg-white/[0.07] animate-pulse" /> : n}
        </span>
        <span className="text-slate-500 text-base">/100</span>
      </div>
    </div>
  );
}

const bullets = [
  "Real-time health score per repository",
  "Pipeline run history with full agent logs",
  "Learns from human corrections over time",
];

export function DashboardPreview() {
  const { ref, tilt, onMouseMove, onMouseLeave } = useMouseTilt(6);
  const statsRef = useRef(null);
  
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    staleTime: 60_000,
    enabled: typeof window !== 'undefined',
  });
  const { data: repos = [] } = useQuery({
    queryKey: ['repos'],
    queryFn: getRepos,
    staleTime: 60_000,
    enabled: typeof window !== 'undefined',
  });
  const { data: runs = [] } = useQuery({
    queryKey: ['runs'],
    queryFn: () => getRuns(20),
    staleTime: 60_000,
    enabled: typeof window !== 'undefined',
  });

  const isLoading = health === undefined;

  const healthScoreRaw = health?.success_rate ?? 94;
  const docsInSyncRaw = health?.docs_updated ?? 127;
  const mrsTodayRaw = runs.filter(r => r.status === 'completed' && new Date(r.created_at) > new Date(Date.now()-86400000)).length || (health?.completed_runs ?? 12);
  const repoCountRaw = repos.length > 0 ? repos.length : (health?.total_runs ? repos.length : 47);
  const acceptanceRateRaw = health?.success_rate ?? 94;

  const docsInSync = useCountUp(docsInSyncRaw);
  const mrsToday = useCountUp(mrsTodayRaw);
  const repoCount = useCountUp(repoCountRaw);
  const acceptanceRate = useCountUp(acceptanceRateRaw);

  return (
    <section id="dashboard" className="py-16 md:py-[120px] px-6 bg-[#04040A] relative">
      {/* Edge separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">
            Live dashboard
          </p>
          <h2
            className="font-display font-bold text-white mt-3"
            style={{
              fontSize: "clamp(34px, 4.5vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Know your doc health{" "}
            <span className="text-gradient">at a glance.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mt-5">
            Synkron tracks documentation staleness across every repo — runs,
            agents, and acceptance rates all in one view.
          </p>
          <ul className="mt-7 space-y-3">
            {bullets.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-3 text-slate-300"
              >
                <span className="text-teal-400 mt-0.5">—</span>
                {t}
              </motion.li>
            ))}
          </ul>
          <motion.a
            href="#"
            whileHover={{ x: 4 }}
            className="inline-flex items-center gap-2 mt-8 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium"
          >
            <TrendingUp className="w-4 h-4" strokeWidth={2} />
            See the full dashboard →
          </motion.a>
        </motion.div>

        {/* Card side */}
        <motion.div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200 }}
        >
          <motion.div
            animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="rounded-3xl border border-white/[0.08] bg-[#0D0D1C] p-7 shadow-[0_40px_120px_-30px_rgba(45,212,191,0.15)] overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Documentation Health</span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                Live
              </span>
            </div>

            <div className="mt-6">
              <Gauge value={healthScoreRaw} isLoading={isLoading} />
            </div>

            <div ref={statsRef} className="mt-6 space-y-0">
              {[
                ["Docs in sync", isLoading ? <div className="h-5 w-12 rounded-md bg-white/[0.07] animate-pulse inline-block" /> : `${docsInSync} / ${repoCount}`],
                ["MRs opened today", isLoading ? <div className="h-5 w-6 rounded-md bg-white/[0.07] animate-pulse inline-block" /> : `${mrsToday}`],
                ["Avg acceptance rate", isLoading ? <div className="h-5 w-10 rounded-md bg-white/[0.07] animate-pulse inline-block" /> : `${acceptanceRate}%`],
              ].map(([k, v], i) => (
                <div
                  key={k as string}
                  className={`flex items-center justify-between py-3 ${
                    i > 0 ? "border-t border-white/[0.06]" : ""
                  }`}
                >
                  <span className="text-slate-400 text-sm">{k}</span>
                  <span className="text-white font-mono text-sm font-medium flex items-center h-5">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
