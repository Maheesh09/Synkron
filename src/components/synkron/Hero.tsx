import { motion } from "framer-motion";
import { HeroCanvas } from "./HeroCanvas";

const ease = [0.22, 1, 0.36, 1] as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };

const logos = [
  { name: "GitLab", d: "M12 21l-3.5-10.5h7L12 21zM3 11h18l-2-6-2 6H7L5 5l-2 6z" },
  { name: "GitHub", d: "M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 0z" },
  { name: "Notion", d: "M4.5 4.5l3-1 12 1v15l-3 1-12-1V4.5zm3 1v14l12 1V5.5l-12 1z" },
  { name: "Confluence", d: "M2 18c4 4 9 0 13-4l5 6-3 2c-5 3-12 3-15-4zm20-12c-4-4-9 0-13 4L4 4l3-2c5-3 12-3 15 4z" },
  { name: "Slack", d: "M5 15a2 2 0 1 1 0-4h2v2a2 2 0 0 1-2 2zm5 0a2 2 0 0 1-2-2v-5a2 2 0 1 1 4 0v5a2 2 0 0 1-2 2zm0 5a2 2 0 0 1-2-2v-2h2a2 2 0 1 1 0 4z" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center pt-24 pb-16">
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 0%, #04040A 70%)" }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 pulse-dot" />
            <span className="relative rounded-full bg-emerald-400 h-2 w-2" />
          </span>
          <span className="text-teal-300 text-xs sm:text-sm font-mono">AI-powered · GitLab Native · Zero workflow change</span>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display font-extrabold mt-7 text-white"
          style={{ fontSize: "clamp(52px, 7vw, 96px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
        >
          <span className="block">Documentation</span>
          <span className="block text-gradient">That Writes Itself.</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-2xl text-slate-400 text-lg leading-relaxed">
          Synkron watches every commit, understands what changed, and opens a merge request — so your docs are never a lie again.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col sm:flex-row gap-4">
          <motion.a
            href="#waitlist"
            whileHover={{ scale: 1.04, y: -2, boxShadow: "0 0 30px rgba(45,212,191,0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-teal-400 hover:bg-teal-300 text-[#04040A] font-semibold px-7 py-3 transition-colors"
          >
            Start syncing free →
          </motion.a>
          <motion.a
            href="#how"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-white/10 hover:border-white/20 text-slate-300 px-7 py-3 backdrop-blur-sm bg-white/5 transition-colors"
          >
            See how it works ↓
          </motion.a>
        </motion.div>

        <motion.div variants={item} className="mt-16 flex flex-col items-center gap-4">
          <p className="text-slate-600 text-xs uppercase tracking-widest">Integrates with</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-90">
            {logos.map((l) => (
              <svg
                key={l.name}
                viewBox="0 0 24 24"
                aria-label={l.name}
                className="w-7 h-7 text-slate-400 opacity-40 hover:opacity-100 transition-opacity"
                fill="currentColor"
              >
                <path d={l.d} />
              </svg>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
