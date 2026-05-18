import { motion } from "framer-motion";
import { SyncIcon } from "./SyncIcon";

const links = ["How it works", "Agents", "Dashboard", "Docs"];

export function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(4,4,10,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <SyncIcon className="w-5 h-5 text-teal-400 spin-slow" />
          <span className="font-display font-semibold text-lg tracking-tight text-white">Synkron</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <li key={l}>
              <a href="#" className="nav-link text-slate-400 hover:text-teal-400 transition-colors">{l}</a>
            </li>
          ))}
        </ul>
        <motion.a
          href="#waitlist"
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(45,212,191,0.3)" }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300 text-sm font-medium px-5 py-2 hover:bg-teal-400/20 transition-colors"
        >
          Get early access →
        </motion.a>
      </nav>
    </header>
  );
}
