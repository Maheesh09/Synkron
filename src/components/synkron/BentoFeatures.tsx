import { motion } from "framer-motion";
import { Scissors, CheckCircle2, Sparkles } from "lucide-react";

function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        borderColor: "rgba(255,255,255,0.14)",
        boxShadow: "0 0 48px rgba(0,0,0,0.6)",
      }}
      className={`rounded-3xl border border-white/[0.07] bg-[#0D0D1C] overflow-hidden cursor-pointer transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function BentoFeatures() {
  return (
    <section className="py-16 md:py-[140px] px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 30% 60%, rgba(129,140,248,0.03) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">
            Why Synkron
          </p>
          <h2
            className="font-display font-bold text-white mt-3"
            style={{
              fontSize: "clamp(34px, 4.5vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Everything your team needs.
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Row 1 */}
          <Card className="lg:col-span-7 p-8 relative" delay={0}>
            <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
            <div className="relative">
              {/* GitLab icon */}
              <div className="w-14 h-14 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-teal-400">
                  <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
                </svg>
              </div>
              <h3 className="font-display text-white text-2xl mt-5 font-semibold">
                GitLab MCP Native
              </h3>
              <p className="text-slate-400 mt-2 max-w-md leading-relaxed">
                Synkron speaks GitLab fluently through the Model Context Protocol
                — no glue code, no brittle scraping.
              </p>
              <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#06060F] p-4 font-mono text-[11px] overflow-x-auto">
                <span className="text-slate-500">POST </span>
                <span className="text-teal-300">/webhook/gitlab</span>
                {"\n"}
                <span className="text-slate-600">{"{"}</span>
                <br />
                <span className="text-slate-600">{"  "}</span>
                <span className="text-indigo-300">"event"</span>
                <span className="text-slate-600">: </span>
                <span className="text-teal-300">"push"</span>
                <span className="text-slate-600">,</span>
                <br />
                <span className="text-slate-600">{"  "}</span>
                <span className="text-indigo-300">"project_id"</span>
                <span className="text-slate-600">: </span>
                <span className="text-yellow-300">8472</span>
                <span className="text-slate-600">,</span>
                <br />
                <span className="text-slate-600">{"  "}</span>
                <span className="text-indigo-300">"commits"</span>
                <span className="text-slate-600">
                  : [<span className="text-slate-500">/* … */</span>]
                </span>
                <br />
                <span className="text-slate-600">{"}"}</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-8" delay={0.08}>
            <h3 className="font-display text-white text-2xl font-semibold">
              Learns from your team
            </h3>
            <p className="text-slate-400 mt-2 leading-relaxed">
              Every accepted, edited, or rejected MR trains the next one.
              Synkron's writing voice converges on yours.
            </p>
            <div className="relative mt-8 aspect-square max-w-[260px] mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <marker
                    id="arr"
                    viewBox="0 0 6 6"
                    refX="3"
                    refY="3"
                    markerWidth="4"
                    markerHeight="4"
                    orient="auto"
                  >
                    <path d="M0,0 L6,3 L0,6 z" fill="#2DD4BF" />
                  </marker>
                </defs>
                {[
                  { x: 100, y: 28, label: "Human" },
                  { x: 172, y: 152, label: "AI" },
                  { x: 28, y: 152, label: "Docs" },
                ].map((n) => (
                  <g key={n.label}>
                    <rect
                      x={n.x - 30}
                      y={n.y - 16}
                      width="60"
                      height="30"
                      rx="8"
                      fill="#0A0A14"
                      stroke="rgba(45,212,191,0.35)"
                    />
                    <text
                      x={n.x}
                      y={n.y + 5}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="11"
                      fontFamily="DM Sans"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
                {[
                  ["M100,44 Q152,80 170,136", "0"],
                  ["M158,162 Q100,182 42,162", "1"],
                  ["M38,136 Q58,80 90,44", "2"],
                ].map(([d, k]) => (
                  <path
                    key={k}
                    d={d}
                    fill="none"
                    stroke="#2DD4BF"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    markerEnd="url(#arr)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-20"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                ))}
              </svg>
            </div>
          </Card>

          {/* Row 2 */}
          <Card className="lg:col-span-4 p-7" delay={0.04}>
            <div className="w-11 h-11 rounded-xl bg-teal-400/10 border border-teal-400/15 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-teal-400" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-white text-xl mt-4 font-semibold">
              Section-level precision
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Only the exact sections that reference changed code get rewritten.
              Not a word more.
            </p>
          </Card>

          <Card className="lg:col-span-4 p-7" delay={0.1}>
            <div className="w-11 h-11 rounded-xl bg-teal-400/10 border border-teal-400/15 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-teal-400" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-white text-xl mt-4 font-semibold">
              Zero new workflow
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              No new tool to learn. The merge request is how your team already
              reviews everything.
            </p>
          </Card>

          <Card className="lg:col-span-4 p-7 relative shimmer" delay={0.16}>
            <div className="w-11 h-11 rounded-xl bg-indigo-400/10 border border-indigo-400/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-300" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-white text-xl mt-4 font-semibold">
              Powered by Gemini 2.0
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Google's frontier model handles the reasoning behind every
              rewrite.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
