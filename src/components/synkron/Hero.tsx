import { motion, useReducedMotion } from "framer-motion";
import { HeroCanvas } from "./HeroCanvas";
import { GitCommit, ScanSearch, BrainCircuit, GitPullRequest } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const logos = [
  {
    name: "GitLab",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "Notion",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
      </svg>
    ),
  },
  {
    name: "Confluence",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M.887 17.637c-.2.325-.432.75-.616 1.06-.234.4-.117.908.283 1.158l4.17 2.596c.4.25.92.133 1.175-.258.167-.267.383-.633.617-1.025 1.625-2.683 3.266-2.35 6.216-.858l4.125 2.058c.45.225.992.05 1.225-.391l2.1-4.025c.233-.441.066-.983-.375-1.225l-4.05-2.025C9.474 12.473 4.929 12.07.887 17.637zM23.113 6.363c.2-.325.433-.75.617-1.06.233-.4.116-.908-.284-1.158L19.276 1.55c-.4-.25-.92-.133-1.175.258-.167.267-.383.633-.617 1.025-1.625 2.683-3.266 2.35-6.216.858L7.143 1.633c-.45-.225-.992-.05-1.225.391L3.818 6.05c-.233.441-.066.983.375 1.225l4.05 2.025c6.283 3.229 10.828 3.63 14.87-1.937z" />
      </svg>
    ),
  },
  {
    name: "Slack",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
  },
];

const pipelineSteps = [
  { icon: GitCommit, label: "Push", color: "#2DD4BF" },
  { icon: ScanSearch, label: "Analyze", color: "#818CF8" },
  { icon: BrainCircuit, label: "Write", color: "#2DD4BF" },
  { icon: GitPullRequest, label: "MR open", color: "#818CF8" },
];

function PipelineWidget() {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease }}
      className="w-full max-w-2xl mx-auto mt-14"
    >
      <div className="rounded-2xl border border-white/[0.07] bg-[#0A0A14]/80 backdrop-blur-sm overflow-hidden shadow-[0_0_80px_-20px_rgba(45,212,191,0.12)]">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-2 font-mono text-xs text-slate-500">
            synkron · pipeline run #1,847
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={
                shouldReduce
                  ? {}
                  : { animation: "pulse-dot 1.8s ease-in-out infinite" }
              }
            />
            live
          </span>
        </div>

        {/* Pipeline steps */}
        <div className="px-6 py-5 grid grid-cols-4 gap-2">
          {pipelineSteps.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.9 + i * 0.12,
                ease,
              }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{
                  background: `${color}12`,
                  borderColor: `${color}30`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.75} />
              </div>
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Log line */}
        <div className="px-4 py-3 border-t border-white/[0.04] bg-[#06060F]/60">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="font-mono text-[11px] text-slate-500"
          >
            <span className="text-teal-400">✓</span> docs/auth.md · 2 sections
            rewritten ·{" "}
            <span className="text-indigo-400">MR !42 opened</span>{" "}
            <span className="text-slate-600">· 18s</span>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-28 pb-20">
      {/* Background canvas + radial vignette */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, #04040A 75%)",
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 pulse-dot" />
            <span className="relative rounded-full bg-emerald-400 h-2 w-2" />
          </span>
          <span className="text-teal-300 text-xs font-mono uppercase tracking-widest">
            AI-powered · GitLab Native · Zero workflow change
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="font-display font-extrabold tracking-tight leading-none mt-7 text-white"
          style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
        >
          Documentation
          <br />
          <span className="text-gradient">That Writes Itself.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-slate-400 text-lg leading-relaxed"
        >
          Synkron watches every commit, understands what changed, and opens a
          merge request — so your docs never lie again.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-9 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.a
            href="#waitlist"
            whileHover={{
              scale: 1.04,
              y: -2,
              boxShadow: "0 0 40px rgba(45,212,191,0.45)",
            }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-teal-400 text-[#04040A] font-semibold px-8 py-3.5 transition-colors hover:bg-teal-300"
          >
            Start syncing free →
          </motion.a>
          <motion.a
            href="#how"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-white/10 hover:border-white/20 text-slate-300 px-8 py-3.5 bg-white/5 backdrop-blur-sm transition-colors"
          >
            See how it works ↓
          </motion.a>
        </motion.div>

        {/* Integrates with */}
        <motion.div
          variants={item}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">
            Integrates with
          </p>
          <div className="flex items-center gap-7">
            {logos.map((l) => (
              <span
                key={l.name}
                title={l.name}
                className="text-slate-500 opacity-40 hover:opacity-100 hover:text-slate-300 transition-all duration-300 cursor-default"
              >
                {l.svg}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Pipeline widget below fold */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        <PipelineWidget />
      </div>
    </section>
  );
}
