import { motion } from "framer-motion";
import { GitCommitHorizontal, ScanSearch, FileText, GitPullRequest } from "lucide-react";
import { Section, SectionHeader } from "./Section";
import { ease } from "@/lib/motion";

const steps = [
  {
    Icon: GitCommitHorizontal,
    title: "You push code",
    desc: "GitHub sends Synkron a signed webhook for every push. Nothing changes in your CI or your workflow.",
    artifact: "X-GitHub-Event: push",
  },
  {
    Icon: ScanSearch,
    title: "The diff is analysed",
    desc: "Synkron works out what the code now does differently. Formatting, tests and lockfiles are filtered out in under two seconds.",
    artifact: "diff → behaviour changes",
  },
  {
    Icon: FileText,
    title: "Affected docs are rewritten",
    desc: "Only the documents that describe the changed behaviour are touched, and only the sections that are now wrong.",
    artifact: "docs/auth.md · 2 sections",
  },
  {
    Icon: GitPullRequest,
    title: "A pull request opens",
    desc: "One atomic commit on its own branch, with a description that explains each change for the reviewer.",
    artifact: "PR #128 ready for review",
  },
];

export function HowItWorks() {
  return (
    <Section id="how" className="py-20 sm:py-28">
      <SectionHeader
        index="01"
        label="How it works"
        title="From commit to corrected docs, without anyone asking."
        description="Synkron sits between your repository and your documentation. It reacts to pushes you already make and hands back a change you can review in the place you already review code."
      />

      <ol className="mt-12 grid overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] gap-px sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease }}
            className="group flex flex-col bg-[#06060D] p-6 transition-colors hover:bg-[#0A0A14]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-teal-400">
                <s.Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="font-mono text-xs tabular-nums text-slate-600">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-6 text-[17px] font-semibold tracking-tight text-white">{s.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{s.desc}</p>
            <p className="mt-6 border-t border-dashed border-white/[0.08] pt-4 font-mono text-[11px] text-slate-500">
              {s.artifact}
            </p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
