import { SyncIcon } from "./SyncIcon";

export function Footer() {
  return (
    <footer className="bg-[#04040A] border-t border-white/[0.06] py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-2 group">
            <SyncIcon className="w-5 h-5 text-teal-400 spin-slow" />
            <span className="font-display font-semibold text-lg text-white group-hover:text-teal-300 transition-colors">
              Synkron
            </span>
          </a>

          <p className="text-slate-500 text-sm max-w-xs leading-relaxed hidden md:block">
            AI documentation that stays in sync with every commit. Built for
            teams that ship.
          </p>

          <ul className="flex items-center gap-7 text-sm">
            {["Privacy", "Terms", "GitHub", "Docs"].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="nav-link text-slate-500 hover:text-teal-400 transition-colors"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-slate-600 text-sm">
            © 2026 Synkron. Built for developers who ship.
          </p>
          <div className="flex items-center gap-3 text-slate-600 text-xs font-mono">
            <span>Powered by</span>
            <span className="text-slate-500">Gemini</span>
            <span className="text-white/10">·</span>
            <span className="text-slate-500">Google Cloud</span>
            <span className="text-white/10">·</span>
            <span className="text-slate-500">GitLab MCP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
