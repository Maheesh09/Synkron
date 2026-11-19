import { Link } from "@tanstack/react-router";
import { SyncIcon } from "./SyncIcon";
import { REPO_URL, BACKEND_REPO_URL, BENCHMARK_URL } from "@/lib/site";

type FooterLink = { label: string; href?: string; to?: "/privacy" | "/terms" | "/app" };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Pipeline", href: "/#pipeline" },
      { label: "Security", href: "/#security" },
      { label: "Dashboard", to: "/app" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Frontend source", href: REPO_URL },
      { label: "Backend source", href: BACKEND_REPO_URL },
      { label: "Benchmark report", href: BENCHMARK_URL },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

const linkClass = "text-sm text-slate-500 transition-colors hover:text-slate-200";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-5 pb-10 pt-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2">
              <SyncIcon className="h-[18px] w-[18px] text-teal-400" />
              <span className="font-display text-[17px] font-semibold text-white">Synkron</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Documentation that stays in sync with your code. Built by developers, for developers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.to ? (
                        <Link to={l.to} className={linkClass}>
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className={linkClass}
                          {...(l.href?.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.05] pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            © 2026 Synkron. Built by{" "}
            <a
              href="https://maheesh.me"
              className="text-slate-400 transition-colors hover:text-teal-300"
            >
              Maheesh
            </a>
            .
          </p>
          <p className="font-mono text-xs text-slate-600">Gemini · Google Cloud · GitHub API</p>
        </div>
      </div>
    </footer>
  );
}
