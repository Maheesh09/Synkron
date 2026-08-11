import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, ArrowRight } from "lucide-react";

const diff: { type: "ctx" | "del" | "add"; text: string }[] = [
  { type: "ctx", text: "from datetime import timedelta" },
  { type: "ctx", text: "from jose import jwt, JWTError" },
  { type: "ctx", text: "" },
  { type: "ctx", text: "class AuthMiddleware:" },
  { type: "ctx", text: "    def __init__(self, secret: str):" },
  { type: "ctx", text: "        self.secret = secret" },
  { type: "del", text: "        self.token_ttl = timedelta(hours=24)" },
  { type: "add", text: "        self.token_ttl = timedelta(minutes=15)" },
  { type: "add", text: "        self.refresh_ttl = timedelta(days=7)" },
  { type: "ctx", text: "" },
  { type: "ctx", text: "    def verify(self, token: str) -> dict:" },
  { type: "del", text: "        return jwt.decode(token, self.secret)" },
  { type: "add", text: "        payload = jwt.decode(token, self.secret)" },
  { type: "add", text: "        self._check_expiry(payload)" },
  { type: "add", text: "        return payload" },
];

function useCountUp(end: number, start: boolean, dur = 1.2) {
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

function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="mt-10 flex flex-wrap justify-center gap-3">
      {[
        `⚡ 18 second average`,
        `📄 2 docs updated`,
        `✓ PR opened`,
      ].map((c) => (
        <motion.span
          key={c}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-full bg-white/5 border border-white/[0.08] px-5 py-2 text-slate-300 text-sm"
        >
          {c}
        </motion.span>
      ))}
    </div>
  );
}

export function LiveMockup() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-[140px] px-6" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">
            Real output
          </p>
          <h2
            className="font-display font-bold text-white mt-3"
            style={{
              fontSize: "clamp(34px, 4.5vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            See a pull request{" "}
            <span className="text-gradient">in action.</span>
          </h2>
        </motion.div>

        {/* Mockup card */}
        <motion.div
          initial={{ opacity: 0, rotateX: 14, y: 40 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1400, transformOrigin: "center top" }}
          className="max-w-5xl mx-auto mt-14"
        >
          <div className="rounded-2xl border border-white/[0.09] bg-[#0A0A14] shadow-[0_40px_120px_-20px_rgba(45,212,191,0.12)] overflow-hidden">
            <div className="grid md:grid-cols-2 relative">
              {/* Left: diff editor */}
              <div className="border-b md:border-b-0 md:border-r border-white/[0.07] bg-[#06060F]">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#06060F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 font-mono text-xs text-slate-500">
                    auth/middleware.py
                  </span>
                </div>
                <pre className="font-mono text-[10px] sm:text-xs leading-5 sm:leading-6 p-3 sm:p-4 overflow-x-auto">
                  {diff.map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={
                        l.type === "del"
                          ? "bg-red-400/10 text-red-300/90 border-l-2 border-red-500/50 pl-2"
                          : l.type === "add"
                          ? "bg-teal-400/10 text-teal-200/90 border-l-2 border-teal-500/50 pl-2"
                          : "text-slate-500 pl-2 border-l-2 border-transparent"
                      }
                    >
                      <span className="select-none mr-3 text-slate-600 w-3 inline-block">
                        {l.type === "del" ? "−" : l.type === "add" ? "+" : " "}
                      </span>
                      {l.text || " "}
                    </motion.div>
                  ))}
                </pre>
              </div>

              {/* Center arrow */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center gap-1.5">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-full bg-[#04040A] border border-teal-400/40 p-3 shadow-[0_0_24px_rgba(45,212,191,0.35)]"
                >
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </motion.div>
                <span className="font-mono text-[10px] text-teal-400/80 uppercase tracking-widest">
                  synkron
                </span>
              </div>

              {/* Right: MR preview */}
              <div className="bg-[#0D0D1C]">
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
                  <span className="rounded bg-green-500/20 text-green-400 text-[10px] font-mono px-2 py-0.5 border border-green-500/30">
                    !42
                  </span>
                  <span className="text-white text-sm font-medium">
                    Documentation update
                  </span>
                </div>

                <div className="px-5 py-4 flex items-center gap-3 border-b border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-[#04040A]" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">synkron-bot</div>
                    <div className="text-slate-500 text-xs">2 minutes ago</div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="rounded-xl border border-white/[0.07] bg-[#0A0A18] p-4">
                    <p className="text-slate-400 text-xs font-mono leading-relaxed space-y-1.5">
                      <span className="block">
                        <span className="text-teal-400">##</span> Token lifetimes
                      </span>
                      <span className="block">
                        Access tokens now expire after{" "}
                        <span className="text-teal-300">15 minutes</span> instead
                        of 24 hours.
                      </span>
                      <span className="block">
                        A new{" "}
                        <span className="text-teal-300">refresh token</span> is
                        issued at login, valid for 7 days.
                      </span>
                      <span className="block text-slate-600 mt-2">
                        — Synkron updated 2 sections referencing JWT expiry.
                      </span>
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 flex flex-wrap gap-2">
                  <button className="flex-1 sm:flex-none rounded-lg bg-teal-400/15 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-medium px-4 py-2 sm:py-1.5 hover:bg-teal-400/25 transition-colors whitespace-nowrap">
                    Approve
                  </button>
                  <button className="flex-1 sm:flex-none rounded-lg border border-white/10 text-slate-400 text-xs sm:text-sm px-4 py-2 sm:py-1.5 hover:bg-white/5 transition-colors whitespace-nowrap">
                    Request changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <Stats />
      </div>
    </section>
  );
}
