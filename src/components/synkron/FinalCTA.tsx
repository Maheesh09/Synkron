import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section
      id="waitlist"
      className="py-[160px] px-6 relative"
      style={{ background: "radial-gradient(ellipse 1000px 500px at 50% 50%, rgba(45,212,191,0.07) 0%, transparent 100%)" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold text-white"
          style={{ fontSize: "clamp(48px, 7vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
        >
          Stop lying in your docs.
        </motion.h2>
        <p className="text-slate-400 mt-5 text-lg">Synkron is in early access. Join the waitlist.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="rounded-full bg-white/5 border border-white/10 px-6 py-3 text-white placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none w-full sm:w-[320px]"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(45,212,191,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full bg-teal-400 hover:bg-teal-300 text-[#04040A] font-semibold px-7 py-3 transition-colors"
                >
                  Join waitlist
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 rounded-full bg-teal-400/15 border border-teal-400/40 px-7 py-3 text-teal-300"
              >
                <Check className="w-5 h-5" /> You're in! We'll be in touch.
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="mt-8 text-slate-600 text-sm">Already syncing: 847 repositories</p>
      </div>
    </section>
  );
}
