import { motion } from "framer-motion";
import { GitCommitHorizontal, ScanSearch, BrainCircuit, GitPullRequest } from "lucide-react";
import { useMouseTilt } from "@/hooks/useMouseTilt";

const steps = [
  {
    n: "01",
    Icon: GitCommitHorizontal,
    title: "Code gets pushed",
    desc: "A developer commits code to any branch. Synkron receives the webhook instantly via GitLab.",
  },
  {
    n: "02",
    Icon: ScanSearch,
    title: "Synkron reads the diff",
    desc: "The Code Analyzer agent reads the raw diff and uses Gemini to understand what actually changed semantically.",
  },
  {
    n: "03",
    Icon: BrainCircuit,
    title: "4 agents go to work",
    desc: "A sequential pipeline maps affected docs, rewrites impacted sections, and prepares the changes.",
  },
  {
    n: "04",
    Icon: GitPullRequest,
    title: "A merge request appears",
    desc: "Synkron opens a real GitLab MR with updated docs, full context, and an explanation for the reviewer.",
  },
];

function StepCard({ s, i }: { s: (typeof steps)[number]; i: number }) {
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
      style={{ perspective: 1000 }}
      className="relative"
    >
      <motion.div
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="group relative rounded-2xl border border-white/[0.07] bg-[#0D0D1C] p-7 h-full overflow-hidden hover:border-teal-400/20 transition-colors"
      >
        {/* Big background step number */}
        <div
          className="absolute -bottom-3 right-3 font-display font-extrabold leading-none select-none pointer-events-none"
          style={{
            fontSize: 96,
            color: "rgba(45,212,191,0.04)",
            lineHeight: 1,
          }}
        >
          {s.n}
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(45,212,191,0.04), transparent)" }}
        />

        <div className="relative">
          {/* Step number badge */}
          <span className="font-mono text-[11px] text-teal-400/50 uppercase tracking-widest">
            step {s.n}
          </span>

          {/* Icon */}
          <div className="mt-3 w-12 h-12 rounded-xl bg-teal-400/10 flex items-center justify-center group-hover:bg-teal-400/20 group-hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all duration-300">
            <s.Icon className="w-5 h-5 text-teal-400" strokeWidth={1.75} />
          </div>

          <h3 className="text-white font-semibold text-lg mt-4 font-display leading-snug">
            {s.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mt-2">{s.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-[140px] px-6 relative">
      {/* Subtle section bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 700px 400px at 50% 50%, rgba(129,140,248,0.03) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Label + heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">
            How it works
          </p>
          <h2
            className="font-display font-bold text-white mt-3"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            From commit to docs{" "}
            <span className="text-gradient">in seconds.</span>
          </h2>
        </motion.div>

        <div className="relative mt-16">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[88px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px pointer-events-none">
            <div className="w-full h-full border-t border-dashed border-teal-400/20" />
            <div className="absolute -top-[3px] w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2DD4BF] traverse-dot" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {steps.map((s, i) => (
              <StepCard key={s.n} s={s} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
