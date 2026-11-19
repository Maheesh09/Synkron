import { motion } from "framer-motion";
import { Binary, Network, PenTool, GitMerge } from "lucide-react";
import { Section, SectionHeader } from "./Section";
import { reveal } from "@/lib/motion";

/** p50 and share of time come from the per-agent breakdown in docs/SYNKRON_METRICS.md. */
const agents = [
  {
    Icon: Binary,
    name: "Code Analyzer",
    reads: "Git diff of the push",
    does: "Ranks changed files by how likely they are to change documented behaviour, then summarises what the code now does. Pure noise is rejected here, before any model call.",
    emits: "Change summary",
    p50: "1.8s",
    share: 10.7,
    color: "#5eead4",
  },
  {
    Icon: Network,
    name: "Impact Mapper",
    reads: "Change summary, docs tree",
    does: "Scores every documentation file for relevance to the change. Only files above the threshold move on.",
    emits: "Ranked doc list",
    p50: "2.2s",
    share: 7.2,
    color: "#2dd4bf",
  },
  {
    Icon: PenTool,
    name: "Doc Writer",
    reads: "Affected docs, your past edits",
    does: "Rewrites only the sections that are now wrong, using correction patterns learned from how your team edited earlier PRs.",
    emits: "Section patches",
    p50: "18.7s",
    share: 55.6,
    color: "#818cf8",
  },
  {
    Icon: GitMerge,
    name: "PR Creator",
    reads: "Section patches",
    does: "Writes one atomic commit through the Git Data API on a dedicated branch and opens or updates a single pull request.",
    emits: "Pull request",
    p50: "8.5s",
    share: 26.5,
    color: "#a5b4fc",
  },
];

function TimeShare() {
  return (
    <motion.div {...reveal} className="mt-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
          Where pipeline time goes
        </p>
        <p className="font-mono text-[11px] text-slate-600">median 31.5s end to end</p>
      </div>
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-white/[0.04]">
        {agents.map((a, i) => (
          <motion.span
            key={a.name}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: `${a.share}%`, background: a.color, transformOrigin: "left" }}
            className="h-full border-r border-[#04040A] last:border-r-0"
            title={`${a.name}: ${a.share}%`}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {agents.map((a) => (
          <li key={a.name} className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-sm" style={{ background: a.color }} />
            {a.name}
            <span className="font-mono tabular-nums text-slate-600">{a.share}%</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function AgentPipeline() {
  return (
    <Section id="pipeline" className="border-t border-white/[0.06] py-20 sm:py-28">
      <SectionHeader
        index="02"
        label="Pipeline"
        title="Four agents, each with one job."
        description="Every stage has a typed input and output, its own timing, and its own reason for stopping. When a run is skipped, the dashboard tells you which agent stopped it and why."
      />

      {/* Desktop: spec table */}
      <motion.div
        {...reveal}
        className="mt-12 hidden overflow-hidden rounded-xl border border-white/[0.07] md:block"
      >
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
            <tr>
              <th className="w-[26%] px-5 py-3 font-normal">Agent</th>
              <th className="px-5 py-3 font-normal">What it does</th>
              <th className="w-[16%] px-5 py-3 font-normal">Emits</th>
              <th className="w-[10%] px-5 py-3 text-right font-normal">p50</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {agents.map((a, i) => (
              <tr key={a.name} className="align-top transition-colors hover:bg-white/[0.015]">
                <td className="px-5 py-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03]">
                      <a.Icon className="h-4 w-4 text-teal-400" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-medium text-white">
                        <span className="mr-2 font-mono text-xs text-slate-600">0{i + 1}</span>
                        {a.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Reads: {a.reads}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 leading-relaxed text-slate-400">{a.does}</td>
                <td className="px-5 py-5">
                  <span className="inline-flex rounded border border-indigo-400/20 bg-indigo-400/[0.08] px-2 py-0.5 font-mono text-[11px] text-indigo-300">
                    {a.emits}
                  </span>
                </td>
                <td className="px-5 py-5 text-right font-mono text-[13px] tabular-nums text-slate-300">
                  {a.p50}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile: stacked rows */}
      <ol className="mt-10 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.07] md:hidden">
        {agents.map((a, i) => (
          <li key={a.name} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03]">
                  <a.Icon className="h-4 w-4 text-teal-400" strokeWidth={1.75} />
                </span>
                <p className="font-medium text-white">
                  <span className="mr-1.5 font-mono text-xs text-slate-600">0{i + 1}</span>
                  {a.name}
                </p>
              </div>
              <span className="font-mono text-xs tabular-nums text-slate-400">{a.p50}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{a.does}</p>
            <p className="mt-3 font-mono text-[11px] text-slate-500">
              {a.reads} <span className="text-slate-700">→</span>{" "}
              <span className="text-indigo-300">{a.emits}</span>
            </p>
          </li>
        ))}
      </ol>

      <TimeShare />
    </Section>
  );
}
