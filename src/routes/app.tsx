import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGate } from "@/components/synkron/AuthGate";
import { getFirebaseAuth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState, useMemo, useEffect } from "react";
import { rotateToken } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { getRepos, getRuns, deleteRepo, type Repo, type Run } from "@/lib/api";
import { ConnectRepository } from "@/components/synkron/ConnectRepository";
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
import {
  Activity,
  GitMerge,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowLeft,
  FileText,
  ExternalLink,
  ChevronDown,
  Binary,
  Network,
  PenTool,
  CheckCircle2,
  XCircle,
  Trash2,
  GitBranch,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  component: () => (
    <AuthGate>
      <AppPage />
    </AuthGate>
  ),
});

// ─── Design tokens ────────────────────────────────────────────────────────────

const CARD = "rounded-xl border border-[#24272B] bg-[#111315]";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ago(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "—";
  }
}

function isWithin24h(iso: string) {
  return Date.now() - new Date(iso).getTime() < 86_400_000;
}

// ─── Per-repo stats helper ────────────────────────────────────────────────────

function computeStats(runs: Run[]) {
  const total = runs.length;
  const completed = runs.filter((r) => r.status === "completed").length;
  const failed = runs.filter((r) => r.status === "failed").length;
  const durations = runs
    .filter((r) => r.status === "completed" && r.duration_seconds != null)
    .map((r) => r.duration_seconds);
  const avgDuration =
    durations.length
      ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
      : null;
  const docsUpdated = runs.reduce((s, r) => s + (r.docs_updated?.length ?? 0), 0);
  // Only count completed vs failed — skipped runs are not meaningful for success rate
  const decisiveRuns = completed + failed;
  const successRate = decisiveRuns > 0 ? Math.round((completed / decisiveRuns) * 1000) / 10 : 0;
  return { total, completed, failed, successRate, avgDuration, docsUpdated };
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { pill: string; dot: string }> = {
  completed: {
    pill: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
    dot: "bg-emerald-400",
  },
  running: {
    pill: "text-teal-400 bg-teal-400/10 border-teal-400/25",
    dot: "bg-teal-400 animate-pulse",
  },
  failed: {
    pill: "text-red-400 bg-red-400/10 border-red-400/25",
    dot: "bg-red-400",
  },
  skipped: {
    pill: "text-[#9BA3AE] bg-white/[0.04] border-white/10",
    dot: "bg-[#4B5563]",
  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.skipped;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono shrink-0 ${s.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── Agent progress bar ───────────────────────────────────────────────────────

const AGENTS = [
  { icon: Binary, label: "Code Analyzer" },
  { icon: Network, label: "Impact Mapper" },
  { icon: PenTool, label: "Doc Writer" },
  { icon: GitMerge, label: "PR Creator" },
] as const;

function AgentProgress({ run }: { run: Run }) {
  const steps =
    run.status === "completed" ? 4 :
      run.status === "running" ? 2 :
        run.status === "failed" ? 1 :
          0;

  return (
    <div className="flex items-center gap-0 w-full">
      {AGENTS.map(({ icon: Icon, label }, i) => {
        const done = i < steps;
        const active = i === steps - 1 && run.status === "running";
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
                className={[
                  "w-8 h-8 rounded-full border flex items-center justify-center",
                  done ? "bg-teal-400/15 border-teal-400/40" : "bg-white/[0.03] border-[#24272B]",
                  active ? "shadow-[0_0_12px_rgba(45,212,191,0.4)]" : "",
                ].join(" ")}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${done ? "text-teal-400" : "text-[#4B5563]"}`}
                  strokeWidth={1.5}
                />
              </motion.div>
              <span
                className={`text-[10px] font-mono text-center leading-tight ${done ? "text-[#9BA3AE]" : "text-[#4B5563]"
                  }`}
              >
                {label}
              </span>
            </div>
            {i < AGENTS.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < steps - 1 ? 1 : 0 }}
                transition={{ delay: i * 0.08 + 0.12, duration: 0.3, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
                className="flex-1 h-px bg-teal-400/30 mx-1 mb-5"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Run detail panel ─────────────────────────────────────────────────────────

function RunDetail({ run }: { run: Run }) {
  return (
    <motion.div
      key="detail"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="px-5 py-4 border-t border-[#24272B] bg-[#0D0F11]">
        <div className="mb-5">
          <p className="text-[#9BA3AE] text-xs font-mono mb-4 uppercase tracking-wider">
            Pipeline stages
          </p>
          <AgentProgress run={run} />
        </div>

        {run.status === "skipped" && (
          <p className="italic text-[#9BA3AE] text-sm">
            No docs needed updating — the diff didn't touch documented sections.
          </p>
        )}
        {run.status === "failed" && (
          <p className="text-red-400 text-sm flex items-center gap-1.5">
            <XCircle className="w-4 h-4 shrink-0" />
            Pipeline failed — check backend logs for details.
          </p>
        )}

        {run.mr_url && (
          <a
            href={run.mr_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-400 text-[#03242a] font-semibold text-sm px-4 py-2 hover:brightness-110 transition"
          >
            Open MR in GitLab
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono text-[#4B5563]">
          <span>run&nbsp;{run.run_id.slice(0, 12)}</span>
          {run.commit_sha && <span>commit&nbsp;{run.commit_sha.slice(0, 8)}</span>}
          {run.duration_seconds != null && <span>{run.duration_seconds}s total</span>}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Run row ──────────────────────────────────────────────────────────────────

function RunRow({
  run,
  repoName,
  showRepoBadge = false,
}: {
  run: Run;
  repoName?: string;
  showRepoBadge?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${CARD} mb-2 overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2 px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <StatusBadge status={run.status} />

        {/* Commit SHA */}
        <span className="font-mono text-xs text-[#9BA3AE] shrink-0">
          {run.commit_sha?.slice(0, 8) ?? "—"}
        </span>

        {/* Repo badge — only shown in "All" view */}
        {showRepoBadge && (
          <span className="inline-flex items-center gap-1 rounded-md border border-[#24272B] bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono text-[#9BA3AE] shrink-0 hidden sm:flex">
            <GitBranch className="w-2.5 h-2.5" />
            {repoName ?? `#${run.repo_id}`}
          </span>
        )}

        <span className="flex-1" />

        {/* Docs updated */}
        <span className="flex items-center gap-1 text-xs text-[#9BA3AE] shrink-0">
          <FileText className="w-3 h-3" />
          {run.docs_updated?.length ?? 0}&nbsp;docs
        </span>

        {/* Duration */}
        {run.duration_seconds != null && (
          <span className="flex items-center gap-1 text-xs text-[#9BA3AE] shrink-0 hidden md:flex">
            <Clock className="w-3 h-3" />
            {run.duration_seconds}s
          </span>
        )}

        {/* MR link */}
        {run.mr_url ? (
          <a
            href={run.mr_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-teal-400 hover:underline text-xs font-mono shrink-0 hidden sm:block"
          >
            View MR →
          </a>
        ) : (
          <span className="w-16 shrink-0 hidden sm:block" />
        )}

        {/* Timestamp */}
        <span className="text-[#4B5563] text-xs shrink-0 hidden md:block">
          {ago(run.created_at)}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-[#4B5563] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && <RunDetail run={run} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Repo selector tab ────────────────────────────────────────────────────────

function RepoTab({
  label,
  isSelected,
  runCount,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  runCount?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
        isSelected
          ? "bg-teal-400 text-[#03242a] font-semibold shadow-[0_0_14px_rgba(45,212,191,0.25)]"
          : "bg-white/[0.04] text-[#9BA3AE] border border-[#24272B] hover:border-teal-400/30 hover:text-[#F5F7F8] hover:bg-white/[0.06]",
      ].join(" ")}
    >
      {label}
      {runCount !== undefined && (
        <span
          className={[
            "px-1.5 py-0.5 rounded text-[10px] font-mono",
            isSelected ? "bg-[#03242a]/30 text-[#03242a]" : "bg-white/[0.06] text-[#4B5563]",
          ].join(" ")}
        >
          {runCount}
        </span>
      )}
    </button>
  );
}

// ─── Repo summary card (used in "All" view) ───────────────────────────────────

function RepoSummaryCard({
  repo,
  runs,
  isSelected,
  onSelect,
  onDelete,
}: {
  repo: Repo;
  runs: Run[];
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: number) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const fresh = isWithin24h(repo.last_seen);
  const repoRuns = runs.filter((r) => r.repo_id === repo.repo_id);
  const lastRun = repoRuns[0];
  const stats = computeStats(repoRuns);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(repo.repo_id);
    setIsDeleting(false);
  };

  return (
    <motion.div
      layout
      className={[
        CARD,
        "p-5 cursor-pointer transition-all duration-200",
        isSelected
          ? "border-teal-400/40 shadow-[0_0_20px_rgba(45,212,191,0.08)]"
          : "hover:border-[#3A3D42]",
      ].join(" ")}
      onClick={onSelect}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span
            className={`mt-1 w-2 h-2 rounded-full shrink-0 ${fresh ? "bg-emerald-400" : "bg-amber-400"
              }`}
          />
          <div className="min-w-0">
            <p className="text-[#F5F7F8] font-semibold text-sm truncate">{repo.name}</p>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#4B5563] font-mono text-xs truncate block hover:text-teal-400 transition-colors"
            >
              {repo.url}
            </a>
          </div>
        </div>

        {/* Delete button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isDeleting}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-600 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Disconnect repository"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#111315] border border-[#24272B] text-[#F5F7F8]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">Remove this repository?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#9BA3AE]">
                "{repo.name}" will be disconnected from Synkron. Existing pipeline runs are
                kept. You can reconnect at any time.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#24272B] text-[#9BA3AE] hover:bg-white/5 hover:text-[#F5F7F8]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500/80 hover:bg-red-500 text-white border-0"
              >
                {isDeleting ? "Removing…" : "Yes, remove"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            const result = await rotateToken(repo.repo_id);
            // Show the new token in a one-time modal
            alert(`New webhook secret (copy now):\n\n${result.webhook_secret}\n\nUpdate this in GitLab → Settings → Webhooks.`);
          }}
          className="flex items-center gap-1.5 text-slate-500 hover:text-amber-400 border border-[#24272B] hover:border-amber-400/30 hover:bg-amber-400/5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rotate token</span>
        </button>
      </div>

      {/* Mini stats row */}
      <div className="mt-4 flex items-center gap-4">
        <span className="text-[#4B5563] text-[11px] font-mono">
          {stats.total} run{stats.total !== 1 ? "s" : ""}
        </span>
        {stats.total > 0 && (
          <span className="text-[#4B5563] text-[11px] font-mono">
            {stats.successRate}% success
          </span>
        )}
        {lastRun && (
          <span className="ml-auto flex items-center gap-1">
            <StatusBadge status={lastRun.status} />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[#4B5563] text-[11px] font-mono">
          Last seen {ago(repo.last_seen)}
        </span>
        <span className="text-teal-400 text-[11px] font-mono">
          View details →
        </span>
      </div>
    </motion.div>
  );
}

// ─── Repo detail panel (used when a repo is selected) ────────────────────────

function RepoDetailBanner({
  repo,
  onDelete,
}: {
  repo: Repo;
  onDelete: (id: number) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const fresh = isWithin24h(repo.last_seen);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(repo.repo_id);
    setIsDeleting(false);
  };

  return (
    <div className={`${CARD} p-5 border-teal-400/20`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0">
            <GitBranch className="w-4 h-4 text-teal-400" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[#F5F7F8] font-semibold text-sm truncate">{repo.name}</p>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${fresh ? "bg-emerald-400" : "bg-amber-400"}`}
                title={fresh ? "Active in last 24h" : "No recent activity"}
              />
            </div>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9BA3AE] font-mono text-xs hover:text-teal-400 transition-colors truncate block"
            >
              {repo.url} ↗
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[#4B5563] text-xs font-mono hidden sm:block">
            Last seen {ago(repo.last_seen)}
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isDeleting}
                className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 border border-[#24272B] hover:border-red-400/30 hover:bg-red-400/5 px-2.5 py-1.5 rounded-lg text-xs transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#111315] border border-[#24272B] text-[#F5F7F8]">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display">Remove this repository?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#9BA3AE]">
                  "{repo.name}" will be disconnected from Synkron. Existing pipeline runs are
                  kept. You can reconnect at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-[#24272B] text-[#9BA3AE] hover:bg-white/5 hover:text-[#F5F7F8]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500/80 hover:bg-red-500 text-white border-0"
                >
                  {isDeleting ? "Removing…" : "Yes, remove"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const result = await rotateToken(repo.repo_id);
              // Show the new token in a one-time modal
              alert(`New webhook secret (copy now):\n\n${result.webhook_secret}\n\nUpdate this in GitLab → Settings → Webhooks.`);
            }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-amber-400 border border-[#24272B] hover:border-amber-400/30 hover:bg-amber-400/5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rotate token</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent = false,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  icon: LucideIcon;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`${CARD} p-4`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#9BA3AE] text-xs font-mono uppercase tracking-wider">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#9BA3AE]" strokeWidth={1.5} />
        </div>
      </div>
      <div
        className={`font-display font-bold text-3xl leading-none ${accent ? "text-teal-400" : "text-[#F5F7F8]"
          }`}
      >
        {value}
      </div>
    </motion.div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-white/[0.05] ${className}`} />
  );
}

// ─── App page ─────────────────────────────────────────────────────────────────

function AppPage() {
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [isConnectingInitial, setIsConnectingInitial] = useState(false);
  // null = "All repos" view; number = a specific repo is focused
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);


  const {
    data: repos = [],
    isLoading: reposLoading,
    refetch: refetchRepos,
    isError: reposError,
    error: reposErrorDetail,
  } = useQuery({
    queryKey: ["repos"],
    queryFn: getRepos,
    refetchInterval: 30_000,
  });

  const {
    data: runs = [],
    isLoading: runsLoading,
    refetch: refetchRuns,
    isRefetching: runsRefetching,
  } = useQuery({
    queryKey: ["runs"],
    queryFn: () => getRuns(100),
    refetchInterval: 15_000,
  });

  function refetchAll() {
    refetchRepos();
    refetchRuns();
  }

  const handleDeleteRepo = async (id: number) => {
    try {
      await deleteRepo(id);
      // If the deleted repo was selected, go back to "All"
      if (selectedRepoId === id) setSelectedRepoId(null);
      refetchAll();
    } catch (e) {
      console.error("Failed to delete repository:", e);
    }
  };

  // ── Derived data ──
  const selectedRepo = useMemo(
    () => (selectedRepoId ? repos.find((r) => r.repo_id === selectedRepoId) ?? null : null),
    [repos, selectedRepoId]
  );

  const filteredRuns = useMemo(
    () => (selectedRepoId ? runs.filter((r) => r.repo_id === selectedRepoId) : runs),
    [runs, selectedRepoId]
  );

  const repoStats = useMemo(() => computeStats(filteredRuns), [filteredRuns]);

  const runCountByRepo = useMemo(() => {
    const m: Record<number, number> = {};
    runs.forEach((r) => { m[r.repo_id] = (m[r.repo_id] ?? 0) + 1; });
    return m;
  }, [runs]);

  // ── Global stats — same formula as per-repo, applied to all runs ──
  // This guarantees consistent numbers across every view: skipped runs are
  // excluded from the success-rate denominator everywhere.
  const globalStats = useMemo(() => computeStats(runs), [runs]);

  const initialLoading = reposLoading || runsLoading;

  // If we have 0 repos and we're not loading, trigger the initial connect flow
  useEffect(() => {
    if (!initialLoading && repos.length === 0 && !isConnectingInitial) {
      setIsConnectingInitial(true);
    }
  }, [initialLoading, repos.length, isConnectingInitial]);

  // ── Full-screen guards ──
  if (reposError && !reposLoading) {
    return (
      <div className="min-h-screen bg-[#04040A] flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-[#F5F7F8] font-display font-semibold">Backend unreachable</h2>
        <p className="text-[#9BA3AE] text-sm text-center max-w-xs">
          {(reposErrorDetail as Error)?.message ?? "Could not connect to the Synkron API."}
        </p>
        <button
          onClick={() => refetchAll()}
          className="mt-1 rounded-full bg-teal-400 text-[#03242a] font-semibold px-6 py-2.5 text-sm hover:brightness-110 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isConnectingInitial) {
    return (
      <ConnectRepository
        onConnected={() => { setIsConnectingInitial(false); refetchAll(); }}
        onCancel={() => { window.location.href = "/"; }}
      />
    );
  }

  if (showAddRepo) {
    return (
      <ConnectRepository
        onConnected={() => { setShowAddRepo(false); refetchAll(); }}
        onCancel={() => setShowAddRepo(false)}
      />
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-[#04040A] text-[#F5F7F8]">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 border-b border-[#24272B] bg-[#04040A]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[#9BA3AE] hover:text-teal-400 text-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to site
            </Link>
            <span className="text-[#24272B]">|</span>
            <span className="text-[#F5F7F8] font-semibold text-sm tracking-tight">
              Synkron&nbsp;
              <span className="text-teal-400 font-display">Dashboard</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[#9BA3AE] text-xs font-mono max-w-[180px] truncate">
              {getFirebaseAuth().currentUser?.email}
            </span>
            <button
              onClick={() => signOut(getFirebaseAuth())}
              className="text-[#9BA3AE] hover:text-red-400 text-xs font-mono transition-colors"
            >
              Sign out
            </button>
            <button
              onClick={() => refetchAll()}
              className="flex items-center gap-1.5 text-[#9BA3AE] hover:text-teal-400 text-xs font-mono transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runsRefetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddRepo(true)}
              className="flex items-center gap-1.5 rounded-lg bg-teal-400 text-[#03242a] font-semibold text-sm px-3 py-1.5 hover:brightness-110 transition"
            >
              <Plus className="w-4 h-4" />
              Add repo
            </button>
          </div>
        </div>

        {/* ── Repo selector tab bar ── */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <RepoTab
            label="All repos"
            isSelected={selectedRepoId === null}
            runCount={runs.length}
            onClick={() => setSelectedRepoId(null)}
          />
          <span className="text-[#24272B] text-xs shrink-0">|</span>
          {reposLoading ? (
            <>
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-7 w-20 rounded-lg" />
            </>
          ) : (
            repos.map((r) => (
              <RepoTab
                key={r.repo_id}
                label={r.name.split(" / ").pop() ?? r.name}
                isSelected={selectedRepoId === r.repo_id}
                runCount={runCountByRepo[r.repo_id] ?? 0}
                onClick={() => setSelectedRepoId(r.repo_id)}
              />
            ))
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <AnimatePresence mode="wait">
          {selectedRepo ? (
            /* ═══════════════════════════════════════════════════════
               SINGLE REPO VIEW
            ═══════════════════════════════════════════════════════ */
            <motion.div
              key={`repo-${selectedRepo.repo_id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Repo context banner */}
              <RepoDetailBanner repo={selectedRepo} onDelete={handleDeleteRepo} />

              {/* Per-repo stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {runsLoading ? (
                  [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
                ) : (
                  <>
                    <StatCard icon={Activity} label="Total runs" value={repoStats.total} delay={0} />
                    <StatCard
                      icon={CheckCircle2}
                      label="Success rate"
                      value={`${repoStats.successRate}%`}
                      accent
                      delay={0.06}
                    />
                    <StatCard
                      icon={Clock}
                      label="Avg pipeline"
                      value={repoStats.avgDuration != null ? `${repoStats.avgDuration}s` : "—"}
                      delay={0.12}
                    />
                    <StatCard
                      icon={FileText}
                      label="Docs updated"
                      value={repoStats.docsUpdated}
                      delay={0.18}
                    />
                  </>
                )}
              </div>

              {/* Pipeline runs for this repo */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[#F5F7F8] font-display font-semibold text-base">
                    Pipeline runs
                  </h2>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="ml-auto text-[#4B5563] text-xs font-mono">
                    {filteredRuns.length} entries · auto-refresh 15s
                  </span>
                </div>

                {runsLoading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
                  </div>
                ) : filteredRuns.length === 0 ? (
                  <div className={`${CARD} flex flex-col items-center justify-center py-16 gap-3`}>
                    <Activity className="w-8 h-8 text-[#24272B]" />
                    <p className="text-[#9BA3AE] text-sm">No pipeline runs for this repo yet.</p>
                    <p className="text-[#4B5563] text-xs">Push a commit to trigger the first one.</p>
                  </div>
                ) : (
                  <div>
                    {filteredRuns.map((run) => (
                      <RunRow key={run.run_id} run={run} />
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          ) : (
            /* ═══════════════════════════════════════════════════════
               ALL REPOS VIEW
            ═══════════════════════════════════════════════════════ */
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Global stats — computed from runs[], same formula as per-repo view */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {initialLoading ? (
                  [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
                ) : (
                  <>
                    <StatCard icon={Activity} label="Total runs" value={globalStats.total} delay={0} />
                    <StatCard
                      icon={CheckCircle2}
                      label="Success rate"
                      value={`${globalStats.successRate}%`}
                      accent
                      delay={0.06}
                    />
                    <StatCard
                      icon={Clock}
                      label="Avg pipeline"
                      value={globalStats.avgDuration != null ? `${globalStats.avgDuration}s` : "—"}
                      delay={0.12}
                    />
                    <StatCard
                      icon={FileText}
                      label="Docs updated"
                      value={globalStats.docsUpdated}
                      delay={0.18}
                    />
                  </>
                )}
              </div>

              {/* Repos grid */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#F5F7F8] font-display font-semibold text-base">
                    Connected repositories
                  </h2>
                  <span className="text-[#4B5563] text-xs font-mono">
                    {repos.length} repo{repos.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {reposLoading ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {repos.map((r) => (
                      <RepoSummaryCard
                        key={r.repo_id}
                        repo={r}
                        runs={runs}
                        isSelected={false}
                        onSelect={() => setSelectedRepoId(r.repo_id)}
                        onDelete={handleDeleteRepo}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* All recent runs */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[#F5F7F8] font-display font-semibold text-base">
                    Recent pipeline runs
                  </h2>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="ml-auto text-[#4B5563] text-xs font-mono">
                    {runs.length} entries · auto-refresh 15s
                  </span>
                </div>

                {runsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
                  </div>
                ) : runs.length === 0 ? (
                  <div className={`${CARD} flex flex-col items-center justify-center py-16 gap-3`}>
                    <Activity className="w-8 h-8 text-[#24272B]" />
                    <p className="text-[#9BA3AE] text-sm">No pipeline runs yet.</p>
                    <p className="text-[#4B5563] text-xs">
                      Push a commit to a connected repo to trigger one.
                    </p>
                  </div>
                ) : (
                  <div>
                    {runs.map((run) => (
                      <RunRow
                        key={run.run_id}
                        run={run}
                        repoName={repos.find((r) => r.repo_id === run.repo_id)?.name}
                        showRepoBadge={repos.length > 1}
                      />
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
