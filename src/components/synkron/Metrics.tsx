import { motion } from "framer-motion";
import { reveal } from "@/lib/motion";
import { BENCHMARK_URL } from "@/lib/site";

/** Numbers from docs/SYNKRON_METRICS.md (30 scripted commits, outcomes recorded before each push). */
const metrics = [
  { value: "100%", label: "Precision", note: "0 unnecessary PRs across 14 non-doc commits" },
  { value: "31.5s", label: "Median push to PR", note: "p95 49.6s over 12 completed runs" },
  {
    value: "$0.0017",
    label: "Model cost per PR",
    note: "Most noise filtered before any model call",
  },
  { value: "87%", label: "Line similarity", note: "Median, generated text vs merged text" },
];

export function Metrics() {
  return (
    <section className="relative px-5 sm:px-8">
      <motion.div {...reveal} className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-[#06060D] p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
                {m.label}
              </p>
              <p className="mt-3 font-display text-[30px] font-bold leading-none tracking-tight text-white tabular-nums sm:text-[36px]">
                {m.value}
              </p>
              <p className="mt-3 text-[13px] leading-snug text-slate-500">{m.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Measured on a 30-commit benchmark with expected outcomes recorded before each push.{" "}
          <a
            href={BENCHMARK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 underline decoration-white/20 underline-offset-2 hover:text-teal-300"
          >
            Read the method
          </a>
        </p>
      </motion.div>
    </section>
  );
}
