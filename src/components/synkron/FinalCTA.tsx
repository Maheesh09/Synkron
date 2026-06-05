import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

function useCountUp(end: number, start: boolean, dur = 2) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / (dur * 1000), 1);
      setV(Math.round(p * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, start, dur]);
  return v;
}

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const repoCount = useCountUp(847, inView);

  return (
    <section
      id="waitlist"
      ref={ref}
      className="py-20 md:py-[160px] px-6 relative overflow-hidden"
    >
      {/* Animated orbs */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-[65%] -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "rgba(45,212,191,0.06)",
          filter: "blur(120px)",
          animation: "float-orb1 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-[35%] -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "rgba(129,140,248,0.06)",
          filter: "blur(100px)",
          animation: "float-orb2 10s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-display font-extrabold text-white"
            style={{
              fontSize: "clamp(34px, 8vw, 80px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Start syncing
            <br />
            <span className="text-gradient">today.</span>
          </h2>
          <p className="text-slate-400 mt-5 text-base sm:text-lg leading-relaxed">
            Connect your GitLab repositories and keep your documentation perfectly in sync.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex justify-center"
        >
          <motion.a
            href="/app"
            whileHover={{
              scale: 1.04,
              y: -2,
              boxShadow: "0 0 40px rgba(45,212,191,0.45)",
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto rounded-full bg-teal-400 hover:bg-teal-300 text-[#04040A] font-semibold px-8 py-3 transition-colors whitespace-nowrap"
          >
            Connect GitLab →
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 text-slate-600 text-sm font-mono"
        >
          Already syncing: {repoCount.toLocaleString()} repositories
        </motion.p>
      </div>
    </section>
  );
}
