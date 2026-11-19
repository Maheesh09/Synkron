import { motion } from "framer-motion";
import { Github, Scissors, Repeat, Workflow, Filter, Sparkles } from "lucide-react";
import { Section, SectionHeader } from "./Section";
import { ease } from "@/lib/motion";

const features = [
  {
    Icon: Github,
    title: "Native GitHub App",
    desc: "Install it on the repositories you choose. No tokens to paste, no webhooks to configure, no CI step to add.",
  },
  {
    Icon: Scissors,
    title: "Section-level edits",
    desc: "Only the sections that describe changed code are rewritten. The rest of the file stays exactly as your team wrote it.",
  },
  {
    Icon: Repeat,
    title: "Learns from your edits",
    desc: "When you edit a Synkron PR before merging, the correction is recorded and applied to later updates of that document type.",
  },
  {
    Icon: Workflow,
    title: "No workflow changes",
    desc: "Pull requests are already how your team reviews change, so that is how Synkron delivers its work too.",
  },
  {
    Icon: Filter,
    title: "Cheap by design",
    desc: "Commits that cannot affect documentation are rejected from the diff alone, usually in under a second, before any model call.",
  },
  {
    Icon: Sparkles,
    title: "Powered by Gemini",
    desc: "Google's Gemini models handle analysis and writing, with retries, truncation detection and per-run token accounting.",
  },
];

export function Features() {
  return (
    <Section className="border-t border-white/[0.06] py-20 sm:py-28">
      <SectionHeader index="05" label="Features" title="Built the way you already work." />

      <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease }}
            className="bg-[#06060D] p-6 transition-colors hover:bg-[#0A0A14] sm:p-7"
          >
            <f.Icon className="h-5 w-5 text-teal-400" strokeWidth={1.75} />
            <h3 className="mt-5 text-[15px] font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
