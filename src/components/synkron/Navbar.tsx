import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRepos } from "@/lib/api";
import { SyncIcon } from "./SyncIcon";

const links = [
  { label: "How it works", href: "#how" },
  { label: "Agents", href: "#agents" },
  { label: "Dashboard", href: "/app" },
  { label: "Docs", href: "#" },
];

export function Navbar({ scrolled }: { scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const isOnApp = pathname === "/app";

  const { data: repos = [] } = useQuery({
    queryKey: ["repos"],
    queryFn: getRepos,
    staleTime: 60000,
    retry: false, // Don't keep retrying if API is unreachable for a new visitor
  });

  const hasRepos = repos.length > 0;
  const visibleLinks = links.filter((l) => l.label !== "Dashboard" || hasRepos);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled || isOpen ? "rgba(4,4,10,0.85)" : "transparent",
        backdropFilter: scrolled || isOpen ? "blur(16px)" : "none",
        borderBottom: scrolled || isOpen ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex flex-1 items-center justify-start">
          <a href="#" className="flex items-center gap-2 z-50" onClick={() => setIsOpen(false)}>
            <SyncIcon className="w-5 h-5 text-teal-400 spin-slow" />
            <span className="font-display font-semibold text-lg tracking-tight text-white">Synkron</span>
          </a>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex flex-none items-center gap-8 text-sm">
          {visibleLinks.map((l) => (
            <li key={l.label}>
              {l.href.startsWith("/") ? (
                <Link to={l.href} className="text-slate-400 hover:text-teal-400 transition-colors">
                  {l.label}
                </Link>
              ) : (
                <a href={l.href} className="text-slate-400 hover:text-teal-400 transition-colors">
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Right: CTAs & Mobile Menu */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {!isOnApp && hasRepos && (
              <Link
                to="/app"
                className="rounded-lg bg-teal-400 text-[#03242a] font-medium text-sm px-4 py-2 hover:brightness-110 transition whitespace-nowrap"
              >
                Open dashboard →
              </Link>
            )}
            <motion.a
              href="/app"
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(45,212,191,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300 text-sm font-medium px-5 py-2 hover:bg-teal-400/20 transition-colors"
            >
              Connect GitLab →
            </motion.a>
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center p-2 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-teal-400 hover:border-teal-400/30 transition-all z-50 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-white/[0.06] bg-[#04040A]/95 overflow-hidden backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6 px-8 py-8">
              <ul className="flex flex-col gap-5">
                {visibleLinks.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-slate-300 hover:text-teal-400 font-medium text-lg transition-colors py-1"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: visibleLinks.length * 0.05 + 0.05, duration: 0.3 }}
                className="pt-4 border-t border-white/[0.04]"
              >
                <a
                  href="/app"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-full bg-teal-400 text-[#04040A] font-semibold text-sm py-3.5 hover:bg-teal-300 transition-colors shadow-[0_0_24px_rgba(45,212,191,0.2)]"
                >
                  Connect GitLab →
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
