import { motion } from "framer-motion";
import { HeroCanvas } from "./HeroCanvas";
import RobotModel from "./RobotModel";

const ease = [0.22, 1, 0.36, 1] as const;
const container = { show: { transition: { staggerChildren: 0.1 } } };
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
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center pt-24 pb-16 lg:py-0">
      {/* Background canvas and mask */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 0%, #04040A 70%)" }}
        />
      </div>

      {/* Grid Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-screen">
        {/* Left Side: Texts */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-6 flex flex-col items-start text-left mt-8 lg:mt-0"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 pulse-dot" />
              <span className="relative rounded-full bg-emerald-400 h-2 w-2" />
            </span>
            <span className="text-teal-300 text-xs sm:text-sm font-mono">
              AI-powered · GitLab Native · Zero workflow change
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display font-extrabold mt-6 text-white leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(42px, 5.5vw, 76px)" }}
          >
            Documentation <br className="hidden sm:inline" />
            <span className="text-gradient">That Writes Itself.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-slate-400 text-lg leading-relaxed"
          >
            Synkron watches every commit, understands what changed, and opens a merge request — so your docs are never a lie again.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <motion.a
              href="#waitlist"
              whileHover={{ scale: 1.04, y: -2, boxShadow: "0 0 30px rgba(45,212,191,0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-teal-400 hover:bg-teal-300 text-[#04040A] font-semibold px-7 py-3 transition-colors text-center"
            >
              Start syncing free →
            </motion.a>
            <motion.a
              href="#how"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/10 hover:border-white/20 text-slate-300 px-7 py-3 backdrop-blur-sm bg-white/5 transition-colors text-center"
            >
              See how it works ↓
            </motion.a>
          </motion.div>

          <motion.div variants={item} className="mt-12 flex flex-col items-start gap-4">
            <p className="text-slate-600 text-xs uppercase tracking-widest">Integrates with</p>
            <div className="flex flex-wrap items-center justify-start gap-6 opacity-90">
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

        {/* Right Side: Spline 3D Robot Model with smooth float animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: ease, delay: 0.2 }}
          className="lg:col-span-6 w-full h-[450px] lg:h-[650px] flex items-center justify-center relative z-20"
        >
          {/* Glowing aura behind the robot */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-[80px] pointer-events-none z-0" />

          <motion.div
            animate={{ 
              y: [-12, 12, -12],
            }}
            transition={{ 
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="w-full h-full relative z-10"
          >
            <RobotModel />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

