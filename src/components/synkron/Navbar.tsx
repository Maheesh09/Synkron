import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRepos } from "@/lib/api";
import { getFirebaseAuth } from "@/lib/firebase";
import { SyncIcon } from "./SyncIcon";
import { REPO_URL } from "@/lib/site";

const links = [
  { label: "How it works", href: "#how" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar({ scrolled }: { scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    return getFirebaseAuth().onAuthStateChanged((user) => setIsAuthenticated(!!user));
  }, []);

  // Close the mobile menu when the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setIsOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const { data: repos = [] } = useQuery({
    queryKey: ["repos", isAuthenticated],
    queryFn: getRepos,
    staleTime: 60000,
    retry: false,
    enabled: isAuthenticated,
  });

  const hasRepos = repos.length > 0;
  const solid = scrolled || isOpen;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        solid ? "border-white/[0.07] bg-[#04040A]/85 backdrop-blur-md" : "border-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <SyncIcon className="h-[18px] w-[18px] text-teal-400" />
          <span className="font-display text-[17px] font-semibold tracking-tight text-white">
            Synkron
          </span>
        </a>

        <ul className="hidden items-center gap-1 text-sm md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-slate-400 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Synkron on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white md:flex"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          {isAuthenticated && hasRepos ? (
            <Link
              to="/app"
              className="hidden h-9 items-center gap-1.5 rounded-md bg-teal-400 px-3.5 text-sm font-semibold text-[#04040A] transition hover:bg-teal-300 md:inline-flex"
            >
              Open dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/app"
                className="hidden h-9 items-center rounded-md px-3 text-sm text-slate-300 transition-colors hover:text-white md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/app"
                className="hidden h-9 items-center gap-1.5 rounded-md bg-teal-400 px-3.5 text-sm font-semibold text-[#04040A] transition hover:bg-teal-300 md:inline-flex"
              >
                Connect GitHub
              </Link>
            </>
          )}

          <button
            onClick={() => setIsOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-slate-300 transition-colors hover:text-white md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.06] md:hidden"
          >
            <div className="px-5 pb-6 pt-2">
              <ul className="divide-y divide-white/[0.06]">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-3.5 text-[15px] text-slate-200"
                    >
                      {l.label}
                      <ArrowRight className="h-4 w-4 text-slate-600" />
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-3.5 text-[15px] text-slate-200"
                  >
                    GitHub
                    <Github className="h-4 w-4 text-slate-600" />
                  </a>
                </li>
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to="/app"
                  onClick={() => setIsOpen(false)}
                  className="flex h-11 items-center justify-center rounded-md border border-white/10 text-sm font-medium text-slate-200"
                >
                  {hasRepos ? "Dashboard" : "Sign in"}
                </Link>
                <Link
                  to="/app"
                  onClick={() => setIsOpen(false)}
                  className="flex h-11 items-center justify-center rounded-md bg-teal-400 text-sm font-semibold text-[#04040A]"
                >
                  Connect GitHub
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
