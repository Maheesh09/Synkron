import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Section, SectionHeader } from "./Section";
import { reveal } from "@/lib/motion";
import { REPO_URL } from "@/lib/site";
import { FAQS } from "@/lib/faqs";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <h3>
        <button
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full items-center justify-between gap-6 py-5 text-left"
          aria-expanded={open}
          aria-controls={id}
        >
          <span className="text-[15px] font-medium leading-snug text-slate-100 transition-colors group-hover:text-white sm:text-base">
            {q}
          </span>
          <Plus
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${
              open ? "rotate-45 text-teal-400" : ""
            }`}
            strokeWidth={2}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-5 pr-8 text-[15px] leading-relaxed text-slate-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <Section id="faq" className="border-t border-white/[0.06] py-20 sm:py-28">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="lg:col-span-4">
          <SectionHeader
            index="07"
            label="FAQ"
            title="Questions teams ask before installing."
            stacked
          />
          <motion.p {...reveal} className="mt-5 text-sm text-slate-500">
            Something else?{" "}
            <a
              href={`${REPO_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 underline decoration-white/20 underline-offset-2 hover:text-teal-300"
            >
              Ask on GitHub
            </a>
          </motion.p>
        </div>
        <motion.div
          {...reveal}
          className="border-t border-white/[0.07] lg:col-span-8 lg:border-t-0"
        >
          {FAQS.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
