import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, GitCommitHorizontal, GitPullRequest } from "lucide-react";
import { ease } from "@/lib/motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const trust = ["Free to start", "One click setup", "Open source"];

/** Stage timings are the per-agent medians from the 30-commit benchmark. */
const stages = [
  { agent: "Code Analyzer", detail: "2 behaviour changes in auth/middleware.py", t: "1.8s" },
  { agent: "Impact Mapper", detail: "docs/auth.md, README.md", t: "2.2s" },
  { agent: "Doc Writer", detail: "2 sections rewritten, 0 files replaced", t: "18.7s" },
  { agent: "PR Creator", detail: "#128 docs: update token lifetimes", t: "8.5s" },
];

function RunLog() {
  const reduce = useReducedMotion();
  const d = (i: number) => (reduce ? 0 : 0.7 + i * 0.45);

  return (
    <div className="relative rounded-xl border border-white/[0.08] bg-[#0A0A14] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          run_7f3a91c2
        </div>
        <span className="font-mono text-[11px] text-slate-600">acme/payments-api</span>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.4, duration: 0.4 }}
          className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
        >
          <GitCommitHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-slate-200">
              feat(auth): shorten access token ttl
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-slate-500">push · main · a3f9c21</p>
          </div>
        </motion.div>

        <ol className="relative mt-3 space-y-px">
          <span
            aria-hidden
            className="absolute bottom-3 left-[19px] top-3 w-px bg-gradient-to-b from-white/10 to-white/[0.03]"
          />
          {stages.map((s, i) => (
            <motion.li
              key={s.agent}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: d(i), duration: 0.35, ease }}
              className="relative flex items-center gap-3 rounded-md px-1.5 py-2"
            >
              <span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-400/40 bg-[#0A0A14]">
                <Check className="h-3 w-3 text-teal-400" strokeWidth={3} />
              </span>
              <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-3">
                <span className="block w-28 shrink-0 text-[13px] font-medium text-slate-200">
                  {s.agent}
                </span>
                <span className="block truncate font-mono text-[11px] text-slate-500">
                  {s.detail}
                </span>
              </div>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-500">
                {s.t}
              </span>
            </motion.li>
          ))}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(stages.length), duration: 0.4, ease }}
          className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-teal-400/20 bg-teal-400/[0.06] px-3 py-2.5"
        >
          <span className="flex items-center gap-2 text-[13px] text-teal-200">
            <GitPullRequest className="h-4 w-4 text-teal-400" />
            Pull request opened for review
          </span>
          <span className="font-mono text-[11px] tabular-nums text-teal-300/80">
            31.2s · $0.0017
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36"
    >
      {/* Engineering-paper grid, faded at the edges. One soft light source at the top. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-grid" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(60% 70% at 30% 0%, rgba(45,212,191,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10 [&>*]:min-w-0">
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-6">
          <motion.a
            variants={item}
            href="#pipeline"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 text-xs text-slate-300 transition-colors hover:border-white/20"
          >
            <span className="rounded-full bg-teal-400/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-teal-300">
              GitHub App
            </span>
            Four agents, one pull request
            <ArrowRight className="h-3 w-3 text-slate-500 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[44px] font-extrabold leading-[1] tracking-[-0.03em] text-white sm:text-[64px] lg:text-[72px]"
          >
            Code changes.
            <br />
            <span className="text-teal-400">Docs update.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-[34rem] text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            Synkron reads every push, finds the documentation it makes wrong, and opens a pull
            request that fixes only those sections. You review it like any other PR.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/app"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-400 px-5 text-sm font-semibold text-[#04040A] transition hover:bg-teal-300"
            >
              Start free today
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/[0.12] px-5 text-sm font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/[0.03]"
            >
              See how it works
            </a>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500"
          >
            {trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-teal-400/80" strokeWidth={2.5} />
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="lg:col-span-6"
        >
          <RunLog />
        </motion.div>
      </div>
    </section>
  );
}
