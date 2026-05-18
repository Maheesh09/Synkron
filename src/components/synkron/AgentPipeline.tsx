import { motion } from "framer-motion";
import { Binary, Network, PenTool, GitMerge } from "lucide-react";
import { useMouseTilt } from "@/hooks/useMouseTilt";

const agents = [
  { n: "01", Icon: Binary, name: "Code Analyzer", role: "semantic analysis", desc: "Reads the raw git diff and asks Gemini what the change means — not just what lines changed, but what behavior changed.", tools: ["get_commit_diff"] },
  { n: "02", Icon: Network, name: "Impact Mapper", role: "dependency mapping", desc: "Traverses your entire doc tree and scores each file for relevance. Only docs that genuinely need updating get touched.", tools: ["list_repository_tree", "get_file_content"] },
  { n: "03", Icon: PenTool, name: "Doc Writer", role: "content generation", desc: "Rewrites only the affected sections — never the whole file. Learns from how your team edits its drafts over time.", tools: ["get_file_content", "Gemini 2.0 Pro"] },
  { n: "04", Icon: GitMerge, name: "PR Creator", role: "git automation", desc: "Creates a branch, commits the changes, and opens a merge request with a full human-readable explanation attached.", tools: ["create_branch", "commit_file", "create_merge_request"] },
];

function AgentCard({ a, i }: { a: typeof agents[number]; i: number }) {
  const { ref, tilt, onMouseMove, onMouseLeave } = useMouseTilt(8);
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ boxShadow: "0 20px 60px rgba(45,212,191,0.1), inset 0 1px 0 rgba(255,255,255,0.1)" }}
        style={{ transformStyle: "preserve-3d", background: "rgba(13,13,28,0.8)" }}
        className="group rounded-3xl border border-white/[0.08] hover:border-teal-400/30 backdrop-blur-sm p-8 h-full transition-colors"
      >
        <div className="font-mono text-xs text-teal-400/60">{a.n}</div>
        <div style={{ transform: "translateZ(20px)" }} className="mt-3">
          <a.Icon className="w-9 h-9 text-teal-400" strokeWidth={1.5} />
        </div>
        <h3 className="font-display font-semibold text-white text-xl mt-3">{a.name}</h3>
        <p className="font-mono text-xs text-indigo-400 mt-1">{a.role}</p>
        <p className="text-slate-400 text-sm leading-relaxed mt-4">{a.desc}</p>
        <div className="flex flex-wrap gap-1.5 mt-5">
          {a.tools.map((t) => (
            <span key={t} className="font-mono text-[10px] text-indigo-300 bg-indigo-400/10 rounded px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const labels = ["Analyze", "Map", "Write", "Ship"];

export function AgentPipeline() {
  return (
    <section
      className="py-[140px] px-6 relative"
      style={{ background: "radial-gradient(ellipse 800px 600px at 50% 50%, rgba(45,212,191,0.04) 0%, transparent 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">The pipeline</p>
        <h2 className="font-display font-extrabold text-white mt-3" style={{ fontSize: "clamp(40px, 5.5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Four agents.<br />One mission.
        </h2>

        <div className="mt-10 flex items-end gap-3 sm:gap-6">
          {labels.map((l, i) => (
            <div key={l} className="flex items-center gap-3 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <div className="absolute inset-0 rounded-full border border-teal-400 ripple-ring" style={{ animationDelay: `${i * 0.4}s` }} />
                </div>
                <span className="font-mono text-xs text-slate-500 mt-3">{l}</span>
              </div>
              {i < labels.length - 1 && <div className="w-10 sm:w-16 h-px bg-teal-400/30" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {agents.map((a, i) => <AgentCard key={a.n} a={a} i={i} />)}
        </div>
      </div>
    </section>
  );
}
