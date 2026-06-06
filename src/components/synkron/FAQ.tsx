import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Does Synkron touch my main branch?",
    a: "Never. Synkron opens a Merge Request against a staging or documentation branch — it never commits directly to main. You review, request changes, or close the MR exactly as you would any human-authored PR.",
  },
  {
    q: "What if I don't like the generated MR?",
    a: "Just close it. The MR is a proposal, not a forced update. You can also leave a review comment and Synkron will learn from it: accepted edits improve future suggestions for your repo.",
  },
  {
    q: "How does Synkron handle private repositories?",
    a: "Synkron connects via GitLab's native API using a scoped access token you generate — the minimum-scope token needed to read diffs and open MRs. No credentials are stored beyond the token; all processing happens in your own backend.",
  },
  {
    q: "Which doc formats are supported?",
    a: "Markdown (.md), MDX, and plain text files tracked in your repo are all supported out of the box. Confluence or Notion sync is on the roadmap — add your vote in our GitHub Discussions.",
  },
  {
    q: "Does this slow down my CI pipeline?",
    a: "No. Synkron runs asynchronously via webhook — your pipeline is already done by the time Synkron starts analyzing. The MR typically appears within 45–90 seconds of a push.",
  },
];

function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-white/[0.07] last:border-0"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex items-center justify-between gap-6 py-5 group"
        aria-expanded={open}
      >
        <span className="text-[#F1F5F9] font-semibold text-base leading-snug group-hover:text-teal-400 transition-colors duration-200">
          {q}
        </span>
        <span
          className={[
            "w-7 h-7 rounded-full border border-white/[0.12] bg-white/[0.04] flex items-center justify-center shrink-0 transition-all duration-300",
            open ? "rotate-45 border-teal-400/40 bg-teal-400/10" : "rotate-0 group-hover:border-teal-400/30",
          ].join(" ")}
        >
          <Plus className={`w-3.5 h-3.5 transition-colors duration-300 ${open ? "text-teal-400" : "text-slate-400"}`} strokeWidth={2.5} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-slate-400 text-[15px] leading-relaxed pb-5 pr-12">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section className="py-16 md:py-[120px] px-6 relative" id="faq">
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 500px 350px at 70% 50%, rgba(45,212,191,0.025) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p className="font-mono text-teal-400 text-sm uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2
            className="font-display font-bold text-white"
            style={{
              fontSize: "clamp(30px, 4vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Questions we actually get.
          </h2>
          <p className="text-slate-400 mt-4 text-lg leading-relaxed">
            Everything you need to know before connecting your first repo.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0D0D1C] px-8">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} delay={i * 0.06} />
          ))}
        </div>

        {/* Footer nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-slate-500 text-sm mt-8"
        >
          Still have a question?{" "}
          <a
            href="https://github.com/Maheesh09/Synkron"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline"
          >
            Open a discussion on GitHub →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
