import { SyncIcon } from "./SyncIcon";

export function Footer() {
  return (
    <footer className="bg-[#04040A] border-t border-white/[0.06] py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-2">
            <SyncIcon className="w-5 h-5 text-teal-400 spin-slow" />
            <span className="font-display font-semibold text-lg text-white">Synkron</span>
          </a>
          <ul className="flex items-center gap-7 text-sm">
            {["Privacy", "Terms", "GitHub", "Docs"].map((l) => (
              <li key={l}><a href="#" className="nav-link text-slate-400 hover:text-teal-400">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="mt-10 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-600 text-sm">
          <p>© 2026 Synkron. Built for developers who ship.</p>
          <p className="font-mono text-xs">Powered by Gemini · Google Cloud · GitLab MCP</p>
        </div>
      </div>
    </footer>
  );
}
