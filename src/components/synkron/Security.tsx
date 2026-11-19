import { motion } from "framer-motion";
import { ShieldCheck, Lock, KeyRound, GitBranch, Database, Fingerprint } from "lucide-react";
import { Section, SectionHeader } from "./Section";
import { reveal } from "@/lib/motion";

const permissions = [
  { scope: "Metadata", access: "Read", why: "List the repositories you installed it on" },
  { scope: "Contents", access: "Write", why: "Read the diff and docs, commit to its own branch" },
  { scope: "Pull requests", access: "Write", why: "Open and update its documentation PR" },
];

const controls = [
  {
    Icon: Fingerprint,
    title: "Signed webhooks",
    desc: "Every delivery is verified with HMAC-SHA256 before it is queued.",
  },
  {
    Icon: Database,
    title: "Idempotent processing",
    desc: "Redelivered events are deduplicated by delivery ID, so a push never runs twice.",
  },
  {
    Icon: KeyRound,
    title: "Short-lived tokens",
    desc: "GitHub installation tokens expire within an hour and live only in memory. No personal access tokens, ever.",
  },
  {
    Icon: GitBranch,
    title: "Never pushes to main",
    desc: "All changes land on a separate branch as a pull request. You decide what merges.",
  },
];

export function Security() {
  return (
    <Section id="security" className="border-t border-white/[0.06] py-20 sm:py-28">
      <SectionHeader
        index="06"
        label="Security"
        title="Least privilege, by default."
        description="Synkron asks for the three permissions it needs and nothing else. Source code is read during a run and never stored. The only text it keeps is the documentation it wrote and your edits to it, which is how it learns your style."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start [&>*]:min-w-0">
        <motion.div
          {...reveal}
          className="overflow-hidden rounded-xl border border-white/[0.07] lg:col-span-7"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.02] px-5 py-3">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
              GitHub App permissions
            </span>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {permissions.map((p) => (
              <li
                key={p.scope}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[160px_80px_1fr]"
              >
                <span className="text-sm font-medium text-white">{p.scope}</span>
                <span
                  className={`justify-self-end rounded border px-2 py-0.5 font-mono text-[11px] sm:justify-self-start ${
                    p.access === "Read"
                      ? "border-white/10 text-slate-400"
                      : "border-teal-400/25 bg-teal-400/[0.06] text-teal-300"
                  }`}
                >
                  {p.access}
                </span>
                <span className="col-span-2 text-sm text-slate-500 sm:col-span-1">{p.why}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 border-t border-white/[0.07] px-5 py-3 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400/80" />
            No access to issues, actions, secrets, settings or members.
          </div>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {controls.map((c) => (
            <motion.div {...reveal} key={c.title} className="flex gap-4 bg-[#06060D] p-5">
              <c.Icon
                className="mt-0.5 h-[18px] w-[18px] shrink-0 text-teal-400"
                strokeWidth={1.75}
              />
              <div>
                <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
