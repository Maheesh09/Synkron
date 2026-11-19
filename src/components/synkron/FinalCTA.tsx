import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Github } from "lucide-react";
import { reveal } from "@/lib/motion";
import { REPO_URL } from "@/lib/site";

const setup = [
  { n: "1", text: "Sign in with GitHub" },
  { n: "2", text: "Install the App on your repositories" },
  { n: "3", text: "Push code as usual" },
];

export function FinalCTA() {
  return (
    <section id="get-started" className="px-5 pb-20 pt-4 sm:px-8 sm:pb-28">
      <motion.div
        {...reveal}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08080F]"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-grid opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 80% at 100% 0%, rgba(45,212,191,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="relative grid grid-cols-1 gap-10 p-7 [&>*]:min-w-0 sm:p-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[52px]">
              Get started today
              <br />
              <span className="text-teal-400">for free.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
              Connect a repository in about a minute. Your next push that changes documented
              behaviour comes back as a pull request.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/app"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-400 px-5 text-sm font-semibold text-[#04040A] transition hover:bg-teal-300"
              >
                Connect GitHub
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/[0.12] px-5 text-sm font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/[0.03]"
              >
                <Github className="h-4 w-4" />
                View source
              </a>
            </div>
          </div>

          <ol className="space-y-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] lg:col-span-5">
            {setup.map((s) => (
              <li key={s.n} className="flex items-center gap-4 bg-[#0A0A14]/90 px-5 py-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-xs text-slate-400">
                  {s.n}
                </span>
                <span className="text-sm text-slate-200">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}
