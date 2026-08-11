import { motion, useReducedMotion } from "framer-motion";
import { HeroCanvas } from "./HeroCanvas";
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
    name: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.263.82-.583 0-.287-.01-1.046-.015-2.053-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.757-1.332-1.757-1.088-.744.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.494.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.333-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.124-.304-.535-1.525.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.399 3-.405 1.02.006 2.043.139 3 .405 2.29-1.552 3.296-1.23 3.296-1.23.653 1.651.242 2.872.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.625-5.475 5.92.43.372.813 1.102.813 2.222 0 1.605-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "Gemini",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
      </svg>
    ),
  },
];

const trust = ["Free to start", "One click setup", "Open source"];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-28 pb-20">
      {/* Background canvas + aurora bloom + radial vignette */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />

        {/* Aurora bloom behind the headline (teal + indigo) */}
        <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[680px] h-[440px] max-w-[90vw] rounded-full aurora-teal blur-[130px] opacity-70 pointer-events-none" />
        <div className="absolute left-[57%] top-[52%] -translate-x-1/2 -translate-y-1/2 w-[540px] h-[380px] max-w-[80vw] rounded-full aurora-indigo blur-[140px] opacity-60 pointer-events-none" />

        {/* Radial vignette to fade edges into the background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, #04040A 75%)",
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
          className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/[0.07] px-4 py-1.5 backdrop-blur-sm shadow-[0_0_24px_rgba(45,212,191,0.10)] max-w-full"
        >
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inset-0 rounded-full bg-emerald-400 pulse-dot" />
            <span className="relative rounded-full bg-emerald-400 h-2 w-2" />
          </span>
          <span className="text-teal-300 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-center">
            <span className="inline sm:hidden">Intelligent · GitHub Native</span>
            <span className="hidden sm:inline">
              Intelligent · GitHub Native · No workflow changes
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="font-display font-extrabold tracking-tight leading-[1.05] sm:leading-[0.98] mt-7 text-white"
          style={{ fontSize: "clamp(36px, 8vw, 92px)", letterSpacing: "-0.02em" }}
        >
          Code changes.
          <br />
          <span className={`${reduce ? "text-gradient" : "text-gradient-animated"} headline-glow`}>
            Docs update.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed px-4 sm:px-0"
        >
          Your documentation stays perfectly in sync with every commit. No manual updates. No
          confusion. Just code and docs working together as they should.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0 justify-center"
        >
          <motion.a
            href="#waitlist"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-teal-400 to-teal-300 text-[#04040A] font-semibold px-8 py-3.5 shadow-[0_0_30px_rgba(45,212,191,0.35)] transition-shadow duration-300 hover:shadow-[0_0_46px_rgba(45,212,191,0.55)]"
          >
            <span className="inline-flex items-center justify-center gap-2">
              Start free today
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </motion.a>
          <motion.a
            href="#how"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto text-center rounded-full border border-white/[0.12] hover:border-teal-400/30 text-slate-300 hover:text-white px-8 py-3.5 bg-white/[0.04] backdrop-blur-sm transition-colors duration-300"
          >
            See how it works ↓
          </motion.a>
        </motion.div>

        {/* Trust line */}
        <motion.div
          variants={item}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-slate-500 text-xs sm:text-sm"
        >
          {trust.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 text-teal-400/80 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {t}
            </span>
          ))}
        </motion.div>

        {/* Integrates with */}
        <motion.div variants={item} className="mt-12 flex flex-col items-center gap-4 w-full">
          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">
            Integrates with
          </p>
          <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-7 px-4">
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
    </section>
  );
}
