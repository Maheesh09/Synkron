import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMouseTilt } from "@/hooks/useMouseTilt";

function Gauge({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1500, 1);
      setN(Math.round(p * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

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
        <circle cx="100" cy="100" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="100" cy="100" r={R}
          stroke="url(#gaugeg)" strokeWidth="10" fill="none" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={inView ? { strokeDashoffset: C - (C * value) / 100 } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-extrabold text-white" style={{ fontSize: 56, lineHeight: 1 }}>{n}</span>
        <span className="text-slate-500 text-lg">/100</span>
      </div>
    </div>
  );
}

export function DashboardPreview() {
  const { ref, tilt, onMouseMove, onMouseLeave } = useMouseTilt(6);
  return (
    <section className="py-[120px] px-6 bg-[#04040A]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">Live dashboard</p>
          <h2 className="font-display font-bold text-white mt-3" style={{ fontSize: "clamp(34px, 4.5vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Know your doc health at a glance.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mt-5">
            Synkron tracks documentation staleness across every repo, runs, agents, and acceptance rates — all in one dashboard.
          </p>
          <ul className="mt-7 space-y-3 text-slate-300">
            {[
              "Real-time health score per repository",
              "Pipeline run history with full agent logs",
              "Learns from human corrections over time",
            ].map((t) => (
              <li key={t} className="flex gap-3"><span className="text-teal-400">—</span>{t}</li>
            ))}
          </ul>
          <a href="#" className="inline-block mt-8 text-teal-400 hover:text-teal-300 nav-link">See the full dashboard →</a>
        </div>

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
            className="rounded-3xl border border-white/[0.08] bg-[#0D0D1C] p-7 shadow-[0_40px_120px_-30px_rgba(45,212,191,0.2)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Documentation Health</span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" /> Live
              </span>
            </div>
            <div className="mt-6"><Gauge value={87} /></div>
            <div className="mt-6 space-y-3">
              {[
                ["Docs in sync", "143 / 156"],
                ["MRs opened today", "7"],
                ["Avg acceptance rate", "94%"],
              ].map(([k, v], i) => (
                <div key={k} className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-white/[0.06]" : ""}`}>
                  <span className="text-slate-400 text-sm">{k}</span>
                  <span className="text-white font-mono text-sm">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
