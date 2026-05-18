import { motion } from "framer-motion";
import { GitCommit, SearchCode, Cpu, GitPullRequest } from "lucide-react";
import { useMouseTilt } from "@/hooks/useMouseTilt";

const steps = [
  { n: "01", Icon: GitCommit, title: "Code gets pushed", desc: "A developer commits code to any branch. Synkron receives the webhook instantly via GitLab." },
  { n: "02", Icon: SearchCode, title: "Synkron reads the diff", desc: "The Code Analyzer agent reads the raw diff and uses Gemini to understand what actually changed semantically." },
  { n: "03", Icon: Cpu, title: "4 agents go to work", desc: "A sequential pipeline of AI agents maps affected docs, rewrites impacted sections, and prepares the changes." },
  { n: "04", Icon: GitPullRequest, title: "A merge request appears", desc: "Synkron opens a real GitLab MR with updated docs, full context, and an explanation for the reviewer." },
];

function StepCard({ s, i }: { s: typeof steps[number]; i: number }) {
  const { ref, tilt, onMouseMove, onMouseLeave } = useMouseTilt(8);
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="relative"
    >
      <motion.div
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="group relative rounded-2xl border border-white/[0.07] bg-[#0D0D1C] p-7 h-full overflow-hidden"
      >
        <div className="absolute top-4 right-5 font-display font-extrabold text-teal-400/10 leading-none" style={{ fontSize: 72 }}>
          {s.n}
        </div>
        <div className="relative w-12 h-12 rounded-xl bg-teal-400/10 flex items-center justify-center group-hover:bg-teal-400/20 transition-all group-hover:shadow-[0_0_20px_rgba(45,212,191,0.25)]">
          <s.Icon className="w-5 h-5 text-teal-400" strokeWidth={1.75} />
        </div>
        <h3 className="text-white font-semibold text-lg mt-4 font-display">{s.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mt-2">{s.desc}</p>
      </motion.div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="py-[140px] px-6 relative">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-teal-400 text-sm uppercase tracking-widest">How it works</p>
        <h2 className="font-display font-bold text-white mt-3" style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          From commit to docs in seconds.
        </h2>

        <div className="relative mt-16">
          <div className="hidden lg:block absolute top-[88px] left-[12%] right-[12%] h-px border-t border-dashed border-teal-400/20 pointer-events-none">
            <div className="absolute -top-[3px] w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_#2DD4BF] traverse-dot" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((s, i) => <StepCard key={s.n} s={s} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
