import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutGrid,
  Plus,
  LogOut,
  ArrowUpRight,
  Trash2,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import type { Repo, Run } from "@/lib/api";
import { SyncIcon } from "@/components/synkron/SyncIcon";
import { REPO_URL } from "@/lib/site";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "./runs";
import { ago, computeStats, isWithin24h, repoHref, repoLabel, type Stats } from "./stats";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function SidebarContent({
  repos,
  reposLoading,
  runCountByRepo,
  totalRuns,
  selectedRepoId,
  onSelect,
  onAddRepo,
  onSignOut,
  user,
}: {
  repos: Repo[];
  reposLoading: boolean;
  runCountByRepo: Record<number, number>;
  totalRuns: number;
  selectedRepoId: number | null;
  onSelect: (id: number | null) => void;
  onAddRepo: () => void;
  onSignOut: () => void;
  user: { name: string; photo?: string | null };
}) {
  const item = (active: boolean) =>
    [
      "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors",
      active
        ? "bg-white/[0.07] text-[#F5F7F8]"
        : "text-[#9BA3AE] hover:bg-white/[0.04] hover:text-[#F5F7F8]",
    ].join(" ");

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-[#1C1E21] px-4">
        <Link to="/" className="flex items-center gap-2">
          <SyncIcon className="h-[18px] w-[18px] text-teal-400" />
          <span className="font-display text-[15px] font-semibold tracking-tight text-[#F5F7F8]">
            Synkron
          </span>
        </Link>
        <span className="ml-1 rounded border border-[#24272B] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#6B7280]">
          Docs
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
        <button
          onClick={() => onSelect(null)}
          className={item(selectedRepoId === null)}
          aria-current={selectedRepoId === null ? "page" : undefined}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Overview
          <span className="ml-auto font-mono text-[11px] tabular-nums text-[#6B7280]">
            {totalRuns}
          </span>
        </button>

        <div className="mb-1.5 mt-6 flex items-center justify-between px-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
            Repositories
          </p>
          <button
            onClick={onAddRepo}
            aria-label="Add repository"
            className="flex h-5 w-5 items-center justify-center rounded text-[#6B7280] hover:bg-white/[0.06] hover:text-[#F5F7F8]"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {reposLoading ? (
          <div className="space-y-1.5 px-2.5 py-1">
            <div className="h-6 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-white/[0.05]" />
          </div>
        ) : (
          <ul className="space-y-0.5">
            {repos.map((r) => {
              const active = selectedRepoId === r.repo_id;
              return (
                <li key={r.repo_id}>
                  <button
                    onClick={() => onSelect(r.repo_id)}
                    className={item(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        isWithin24h(r.last_seen) ? "bg-emerald-400" : "bg-amber-400/80"
                      }`}
                      title={
                        isWithin24h(r.last_seen) ? "Active in the last 24h" : "No recent activity"
                      }
                    />
                    <span className="truncate">{repoLabel(r.name)}</span>
                    <span className="ml-auto font-mono text-[11px] tabular-nums text-[#6B7280]">
                      {runCountByRepo[r.repo_id] ?? 0}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6 space-y-0.5 border-t border-[#1C1E21] pt-4">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={item(false)}>
            <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Documentation
            <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-[#6B7280]" />
          </a>
        </div>
      </nav>

      <div className="border-t border-[#1C1E21] p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          {user.photo ? (
            <img
              src={user.photo}
              alt=""
              className="h-7 w-7 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-400/15 text-xs font-semibold text-teal-300">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-[13px] text-[#C9CFD6]">{user.name}</span>
          <button
            onClick={onSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] hover:bg-white/[0.06] hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── KPI panel ────────────────────────────────────────────────────────────────

export type Kpi = { label: string; value: ReactNode; hint?: ReactNode; accent?: boolean };

export function KpiPanel({ items, loading }: { items: Kpi[]; loading: boolean }) {
  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#24272B] bg-[#24272B] ${
        items.length === 5 ? "md:grid-cols-6 xl:grid-cols-5" : "md:grid-cols-4"
      }`}
    >
      {items.map((k, i) => (
        <div
          key={k.label}
          className={`bg-[#111315] p-4 sm:p-5 ${
            items.length === 5
              ? // 2 + 2 + 1 on phones, 3 + 2 on tablets, one row on wide screens
                `${i === 4 ? "col-span-2" : ""} ${i < 3 ? "md:col-span-2" : "md:col-span-3"} xl:col-span-1`
              : ""
          }`}
        >
          <p className="text-xs text-[#9BA3AE]">{k.label}</p>
          {loading ? (
            <div className="mt-3 h-7 w-20 animate-pulse rounded bg-white/[0.05]" />
          ) : (
            <p
              className={`mt-2 font-display text-[26px] font-bold leading-none tracking-tight tabular-nums ${
                k.accent ? "text-teal-400" : "text-[#F5F7F8]"
              }`}
            >
              {k.value}
            </p>
          )}
          {k.hint && <p className="mt-2 text-xs text-[#6B7280]">{k.hint}</p>}
        </div>
      ))}
    </div>
  );
}

export function SuccessHint({ stats }: { stats: Stats }) {
  const decisive = stats.completed + stats.failed;
  return (
    <>{decisive ? `${stats.completed} of ${decisive} decisive runs` : "No decisive runs yet"}</>
  );
}

// ─── Disconnect dialog ────────────────────────────────────────────────────────

export function DisconnectButton({
  repo,
  onDelete,
  compact = false,
}: {
  repo: Repo;
  onDelete: (id: number) => void | Promise<void>;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={busy}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Disconnect ${repo.name}`}
          title="Disconnect repository"
          className={
            compact
              ? "flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
              : "inline-flex h-8 items-center gap-1.5 rounded-md border border-[#24272B] px-2.5 text-xs text-[#9BA3AE] transition-colors hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-300 disabled:opacity-50"
          }
        >
          <Trash2 className="h-3.5 w-3.5" />
          {!compact && <span className="hidden sm:inline">Disconnect</span>}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-[#24272B] bg-[#111315] text-[#F5F7F8]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">Remove this repository?</AlertDialogTitle>
          <AlertDialogDescription className="text-[#9BA3AE]">
            This opens your GitHub App settings, where you can remove "{repo.name}" from Synkron.
            Existing pipeline runs are kept, and you can reconnect at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#24272B] bg-transparent text-[#9BA3AE] hover:bg-white/5 hover:text-[#F5F7F8]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setBusy(true);
              await onDelete(repo.repo_id);
              setBusy(false);
            }}
            className="border-0 bg-red-500/80 text-white hover:bg-red-500"
          >
            Open GitHub settings
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Repositories table (overview) ────────────────────────────────────────────

export function ReposTable({
  repos,
  runs,
  loading,
  onSelect,
  onDelete,
  onAddRepo,
}: {
  repos: Repo[];
  runs: Run[];
  loading: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void | Promise<void>;
  onAddRepo: () => void;
}) {
  if (loading) {
    return <div className="h-32 animate-pulse rounded-xl border border-[#24272B] bg-[#111315]" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#24272B] bg-[#111315]">
      <ul className="divide-y divide-[#24272B]">
        {repos.map((repo) => {
          const repoRuns = runs.filter((r) => r.repo_id === repo.repo_id);
          const stats = computeStats(repoRuns);
          const last = repoRuns[0];
          const link = repoHref(repo);
          return (
            <li key={repo.repo_id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelect(repo.repo_id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(repo.repo_id)}
                className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors hover:bg-white/[0.02] md:grid-cols-[minmax(0,1fr)_64px_76px_112px_72px] lg:grid-cols-[minmax(0,2fr)_80px_90px_120px_150px_72px]"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-[#F5F7F8]">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        isWithin24h(repo.last_seen) ? "bg-emerald-400" : "bg-amber-400/80"
                      }`}
                    />
                    <span className="truncate">{repo.name}</span>
                  </p>
                  {link ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate pl-3.5 font-mono text-[11px] text-[#6B7280] hover:text-teal-300"
                    >
                      <span className="truncate">{link.text}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <p className="mt-0.5 pl-3.5 font-mono text-[11px] text-[#6B7280]">
                      #{repo.repo_id}
                    </p>
                  )}
                </div>

                <div className="hidden text-right md:block">
                  <p className="font-mono text-[13px] tabular-nums text-[#C9CFD6]">{stats.total}</p>
                  <p className="text-[11px] text-[#6B7280]">runs</p>
                </div>
                <div className="hidden text-right md:block">
                  <p className="font-mono text-[13px] tabular-nums text-[#C9CFD6]">
                    {stats.completed + stats.failed ? `${stats.successRate}%` : "—"}
                  </p>
                  <p className="text-[11px] text-[#6B7280]">success</p>
                </div>
                <div className="hidden md:block">
                  {last ? <StatusBadge status={last.status} /> : null}
                </div>
                <p className="hidden text-[13px] text-[#9BA3AE] lg:block">{ago(repo.last_seen)}</p>

                <div className="flex items-center justify-end gap-1">
                  <DisconnectButton repo={repo} onDelete={onDelete} compact />
                  <ChevronRight className="h-4 w-4 text-[#4B5563]" />
                </div>

                {/* Compact stats for small screens */}
                <p className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-3.5 text-xs text-[#9BA3AE] md:hidden">
                  {last && <StatusBadge status={last.status} />}
                  <span>{stats.total} runs</span>
                  {stats.completed + stats.failed > 0 && <span>{stats.successRate}% success</span>}
                  <span>seen {ago(repo.last_seen)}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <button
        onClick={onAddRepo}
        className="flex w-full items-center gap-2 border-t border-[#24272B] px-4 py-3 text-left text-[13px] text-[#9BA3AE] transition-colors hover:bg-white/[0.02] hover:text-[#F5F7F8]"
      >
        <Plus className="h-4 w-4" />
        Add repository
      </button>
    </div>
  );
}
