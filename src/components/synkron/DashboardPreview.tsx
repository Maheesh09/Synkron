import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "./Section";
import { reveal } from "@/lib/motion";

const captions = [
  {
    title: "Every run, explained",
    desc: "Status, commit, documents touched, duration and cost for each push. Skipped runs say which agent stopped them and why.",
  },
  {
    title: "Per-stage timing",
    desc: "Open any run to see how long each agent took, so slow stages are obvious instead of guessed.",
  },
  {
    title: "One view per repository",
    desc: "Switch between repositories to compare success rate, median and p95 latency, and documents updated.",
  },
];

export function DashboardPreview() {
  return (
    <Section id="dashboard" className="border-t border-white/[0.06] py-20 sm:py-28">
      <SectionHeader
        index="04"
        label="Dashboard"
        title="See what the agent did, and why."
        description="The pull request is where you review. The dashboard is where you audit: every run is recorded with its outcome, timings and cost."
        aside={
          <Link
            to="/app"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-400 transition-colors hover:text-teal-300"
          >
            Open the dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <motion.figure
        {...reveal}
        className="mt-12 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0A14] p-1.5 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 hidden rounded bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-slate-500 sm:inline">
            synkron.dev/app
          </span>
        </div>
        <img
          src="/ss.png"
          alt="Synkron dashboard showing pipeline run statistics and a table of recent runs"
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-lg border border-white/[0.06]"
        />
      </motion.figure>

      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {captions.map((c) => (
          <motion.div {...reveal} key={c.title} className="border-l border-white/10 pl-4">
            <h3 className="text-[15px] font-semibold text-white">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
