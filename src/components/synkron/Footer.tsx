import { Link } from "@tanstack/react-router";
import { SyncIcon } from "./SyncIcon";

const navLinks = [
  { label: "Privacy", to: "/privacy" as const, external: false },
  { label: "Terms", to: "/terms" as const, external: false },
  { label: "GitHub", href: "#", external: true },
  { label: "Docs", href: "#", external: true },
];

export function Footer() {
  return (
    <footer className="bg-[#04040A] border-t border-white/[0.06] py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <SyncIcon className="w-5 h-5 text-teal-400 spin-slow" />
            <span className="font-display font-semibold text-lg text-white group-hover:text-teal-300 transition-colors">
              Synkron
            </span>
          </Link>

          <p className="text-slate-500 text-sm max-w-xs leading-relaxed hidden md:block">
            Documentation that stays in sync with your code. Built by developers, for developers.
          </p>

          <ul className="flex items-center gap-7 text-sm">
            {navLinks.map((l) => (
              <li key={l.label}>
                {l.external ? (
                  <a
                    href={(l as any).href}
                    className="nav-link text-slate-500 hover:text-teal-400 transition-colors"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={(l as any).to}
                    className="nav-link text-slate-500 hover:text-teal-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-slate-600 text-sm">
            © 2026 Synkron. Built by <a href="https://maheesh.me" className="text-teal-400 hover:text-teal-300 transition-colors">Maheesh</a>.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-slate-600 text-xs font-mono">
            <span>Powered by</span>
            <span className="text-slate-500">Gemini</span>
            <span className="text-white/10">·</span>
            <span className="text-slate-500">Google Cloud</span>
            <span className="text-white/10">·</span>
            <span className="text-slate-500">GitHub API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
