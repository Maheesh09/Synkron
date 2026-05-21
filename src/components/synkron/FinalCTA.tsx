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
      className="py-[160px] px-6 relative overflow-hidden"
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
              fontSize: "clamp(48px, 7vw, 80px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Stop lying
            <br />
            <span className="text-gradient">in your docs.</span>
          </h2>
          <p className="text-slate-400 mt-5 text-lg leading-relaxed">
            Synkron is in early access. Join the waitlist.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setDone(true);
          }}
          className="mt-9"
        >
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <motion.input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  whileFocus={{ borderColor: "rgba(45,212,191,0.4)" }}
                  className="rounded-full bg-white/5 border border-white/10 px-6 py-3 text-white placeholder:text-slate-500 focus:outline-none w-full sm:w-[300px] transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                    boxShadow: "0 0 40px rgba(45,212,191,0.45)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full bg-teal-400 hover:bg-teal-300 text-[#04040A] font-semibold px-8 py-3 transition-colors whitespace-nowrap"
                >
                  Join waitlist →
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="inline-flex items-center gap-3 rounded-full bg-teal-400/15 border border-teal-400/40 px-7 py-3 text-teal-300"
              >
                <Check className="w-5 h-5" /> You're in! We'll be in touch.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

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
