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
    let raf = 0; const t0 = performance.now();
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
  const t = useCountUp(18, inView);
  const docs = useCountUp(2, inView);
  const mrs = useCountUp(1, inView);
  return (
    <div ref={ref} className="mt-10 flex flex-wrap justify-center gap-3">
      {[`⚡ ${t}s average pipeline time`, `📄 ${docs} docs updated`, `✓ ${mrs} merge request opened`].map((c) => (
        <span key={c} className="rounded-full bg-white/5 border border-white/[0.08] px-5 py-2 text-slate-300 text-sm">{c}</span>
      ))}
    </div>
  );
}

export function LiveMockup() {
  return (
    <section className="py-[140px] px-6">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">Real output</p>
        <h2 className="font-display font-bold text-white mt-3" style={{ fontSize: "clamp(34px, 4.5vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Watch a real merge request get born.
        </h2>

        <motion.div
          initial={{ opacity: 0, rotateX: 12, y: 40 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200, transformOrigin: "center top" }}
          className="max-w-5xl mx-auto mt-14"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0A0A14] shadow-[0_40px_120px_-20px_rgba(45,212,191,0.15)] overflow-hidden">
            <div className="grid md:grid-cols-2 relative">
              {/* Left: code diff */}
              <div className="border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#06060F]">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <span className="w-3 h-3 rounded-full bg-green-400/70" />
                  <span className="ml-3 font-mono text-xs text-slate-500">auth/middleware.py</span>
                </div>
                <pre className="font-mono text-xs leading-6 p-4 overflow-x-auto">
                  {diff.map((l, i) => (
                    <div
                      key={i}
                      className={
                        l.type === "del"
                          ? "bg-red-400/10 text-red-300/90"
                          : l.type === "add"
                          ? "bg-teal-400/10 text-teal-200/90"
                          : "text-slate-500"
                      }
                    >
                      <span className="select-none mr-3 text-slate-600">{l.type === "del" ? "-" : l.type === "add" ? "+" : " "}</span>
                      {l.text || "\u00A0"}
                    </div>
                  ))}
                </pre>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center gap-2">
                <div className="rounded-full bg-[#04040A] border border-teal-400/40 p-3 shadow-[0_0_30px_rgba(45,212,191,0.4)]">
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </div>
                <span className="font-mono text-[10px] text-teal-400/80 uppercase tracking-widest">Synkron</span>
              </div>

              {/* Right: MR */}
              <div className="bg-[#0D0D1C]">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                  <span className="rounded bg-teal-400/15 text-teal-300 text-[10px] font-mono px-2 py-0.5">Merge Request !42</span>
                  <span className="text-white text-sm font-medium">Documentation update</span>
                </div>
                <div className="px-5 py-4 flex items-center gap-3 border-b border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-indigo-400 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#04040A]" />
                  </div>
                  <div>
                    <div className="text-white text-sm">synkron-bot</div>
                    <div className="text-slate-500 text-xs">opened a moment ago</div>
                  </div>
                </div>
                <div className="px-5 py-4 text-sm">
                  <div className="text-slate-300 font-medium mb-2">docs/auth.md</div>
                  <div className="text-slate-400 leading-relaxed space-y-2 font-mono text-xs">
                    <p><span className="text-teal-400">##</span> Token lifetimes</p>
                    <p>Access tokens now expire after <span className="text-teal-300">15 minutes</span> instead of 24 hours.</p>
                    <p>A new <span className="text-teal-300">refresh token</span> is issued at login and valid for 7 days.</p>
                    <p className="text-slate-500">— Synkron updated 2 sections referencing JWT expiry.</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex gap-2 border-t border-white/[0.06]">
                  <button className="rounded-md bg-teal-400 text-[#04040A] text-sm font-semibold px-4 py-1.5">Approve</button>
                  <button className="rounded-md border border-white/10 text-slate-300 text-sm px-4 py-1.5 hover:bg-white/5">Request changes</button>
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
