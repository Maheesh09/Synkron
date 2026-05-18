import { motion } from "framer-motion";
import { Scissors, CheckCircle2, Sparkles } from "lucide-react";

function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ borderColor: "rgba(255,255,255,0.15)", boxShadow: "0 0 40px rgba(0,0,0,0.4)" }}
      className={`rounded-3xl border border-white/[0.07] bg-[#0D0D1C] overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function BentoFeatures() {
  return (
    <section className="py-[140px] px-6">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">Why Synkron</p>
        <h2 className="font-display font-bold text-white mt-3" style={{ fontSize: "clamp(34px, 4.5vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Everything your team needs.
        </h2>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Card 1 — wide */}
          <Card className="lg:col-span-3 p-8 relative" delay={0}>
            <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />
            <div className="relative">
              <svg viewBox="0 0 64 64" className="w-16 h-16 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
                <path d="M32 6 L58 22 L48 56 L16 56 L6 22 Z" />
                <path d="M22 28 L42 28 L36 46 L28 46 Z" />
              </svg>
              <h3 className="font-display text-white text-2xl mt-5">GitLab MCP Native</h3>
              <p className="text-slate-400 mt-2 max-w-md">Synkron speaks GitLab fluently through the Model Context Protocol — no glue code, no brittle scraping.</p>
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#06060F] p-4 font-mono text-[11px] overflow-x-auto">
                <span className="text-slate-500">POST </span><span className="text-teal-300">/webhook/gitlab</span>{"\n"}
                {"{"}<br />
                {"  "}<span className="text-indigo-300">"event"</span>: <span className="text-teal-300">"push"</span>,<br />
                {"  "}<span className="text-indigo-300">"project_id"</span>: <span className="text-yellow-300">8472</span>,<br />
                {"  "}<span className="text-indigo-300">"commits"</span>: [<span className="text-slate-500">/* … */</span>]<br />
                {"}"}
              </div>
            </div>
          </Card>

          {/* Card 2 — tall */}
          <Card className="lg:col-span-2 p-8" delay={0.08}>
            <h3 className="font-display text-white text-2xl">Learns from your team</h3>
            <p className="text-slate-400 mt-2">Every accepted, edited, or rejected MR trains the next one. Synkron's writing voice converges on yours.</p>
            <div className="relative mt-8 aspect-square max-w-[300px] mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <marker id="arr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="#2DD4BF" />
                  </marker>
                </defs>
                {[
                  { x: 100, y: 30, label: "Human" },
                  { x: 170, y: 150, label: "AI" },
                  { x: 30, y: 150, label: "Docs" },
                ].map((n) => (
                  <g key={n.label}>
                    <rect x={n.x - 28} y={n.y - 16} width="56" height="32" rx="8" fill="#0A0A14" stroke="rgba(45,212,191,0.4)" />
                    <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="DM Sans">{n.label}</text>
                  </g>
                ))}
                {[
                  ["M100,46 Q150,80 168,134", "0"],
                  ["M158,160 Q100,180 42,160", "1"],
                  ["M40,134 Q60,80 92,46", "2"],
                ].map(([d, k]) => (
                  <path key={k} d={d} fill="none" stroke="#2DD4BF" strokeOpacity="0.5" strokeWidth="1.5"
                    strokeDasharray="4 6" markerEnd="url(#arr)">
                    <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
                  </path>
                ))}
              </svg>
            </div>
          </Card>

          {/* Card 3, 4, 5 — small */}
          <Card className="lg:col-span-2 p-7" delay={0}>
            <div className="w-11 h-11 rounded-lg bg-teal-400/10 flex items-center justify-center"><Scissors className="w-5 h-5 text-teal-400" strokeWidth={1.75} /></div>
            <h3 className="font-display text-white text-lg mt-4">Section-level precision</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">Only the exact sections that reference changed code get rewritten. Not a word more.</p>
          </Card>

          <Card className="lg:col-span-2 p-7" delay={0.08}>
            <div className="w-11 h-11 rounded-lg bg-teal-400/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-teal-400" strokeWidth={1.75} /></div>
            <h3 className="font-display text-white text-lg mt-4">Zero new workflow</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">No new tool to learn. The merge request is how your team already reviews everything.</p>
          </Card>

          <Card className="lg:col-span-1 p-7 relative shimmer" delay={0.16}>
            <div className="w-11 h-11 rounded-lg bg-indigo-400/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-indigo-300" strokeWidth={1.75} /></div>
            <h3 className="font-display text-white text-lg mt-4">Powered by Gemini 2.0</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">Google's frontier model handles the reasoning behind every rewrite.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
