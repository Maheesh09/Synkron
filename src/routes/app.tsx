import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { getHealth, getRepos, getRuns, type Repo, type Run } from "@/lib/api";
import { ConnectRepository } from "@/components/synkron/ConnectRepository";
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
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/app")({ component: AppPage });

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

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { pill: string; dot: string }> = {
  completed: {
    pill: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
    dot: "bg-emerald-400",
  },
  running: {
    pill: "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/25",
    dot: "bg-[#22D3EE] animate-pulse",
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
  // How many steps completed based on status
  const steps =
    run.status === "completed" ? 4 :
    run.status === "running"   ? 2 :
    run.status === "failed"    ? 1 :
    0; // skipped

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
                  done
                    ? "bg-[#22D3EE]/15 border-[#22D3EE]/40"
                    : "bg-white/[0.03] border-[#24272B]",
                  active ? "shadow-[0_0_12px_rgba(34,211,238,0.4)]" : "",
                ].join(" ")}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${done ? "text-[#22D3EE]" : "text-[#4B5563]"}`}
                  strokeWidth={1.5}
                />
              </motion.div>
              <span
                className={`text-[10px] font-mono text-center leading-tight ${
                  done ? "text-[#9BA3AE]" : "text-[#4B5563]"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < AGENTS.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < steps - 1 ? 1 : 0 }}
                transition={{ delay: i * 0.08 + 0.12, duration: 0.3, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
                className="flex-1 h-px bg-[#22D3EE]/30 mx-1 mb-5"
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
        {/* Agent progress */}
        <div className="mb-5">
          <p className="text-[#9BA3AE] text-xs font-mono mb-4 uppercase tracking-wider">
            Pipeline stages
          </p>
          <AgentProgress run={run} />
        </div>

        {/* Status messages */}
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

        {/* MR button */}
        {run.mr_url && (
          <a
            href={run.mr_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#22D3EE] text-[#03242a] font-semibold text-sm px-4 py-2 hover:brightness-110 transition"
          >
            Open MR in GitLab
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Meta row */}
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

function RunRow({ run, repoName }: { run: Run; repoName?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${CARD} mb-2 overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2 px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <StatusBadge status={run.status} />

        {/* Repo name / id */}
        <span className="text-[#F5F7F8] text-sm font-medium truncate flex-1 min-w-0">
          {repoName ?? `repo #${run.repo_id}`}
        </span>

        {/* SHA */}
        <span className="font-mono text-xs text-[#9BA3AE] shrink-0 hidden sm:block">
          {run.commit_sha?.slice(0, 8) ?? "—"}
        </span>

        {/* Docs updated */}
        <span className="flex items-center gap-1 text-xs text-[#9BA3AE] shrink-0">
          <FileText className="w-3 h-3" />
          {run.docs_updated ?? 0}&nbsp;docs
        </span>

        {/* Duration */}
        {run.duration_seconds != null && (
          <span className="flex items-center gap-1 text-xs text-[#9BA3AE] shrink-0 hidden md:flex">
            <Clock className="w-3 h-3" />
            {run.duration_seconds}s
          </span>
        )}

        {/* MR link — stop propagation so the row doesn't toggle */}
        {run.mr_url ? (
          <a
            href={run.mr_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[#22D3EE] hover:underline text-xs font-mono shrink-0 hidden sm:block"
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

        {/* Expand chevron */}
        <ChevronDown
          className={`w-4 h-4 text-[#4B5563] shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && <RunDetail run={run} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Repo card ────────────────────────────────────────────────────────────────

function RepoCard({ repo }: { repo: Repo }) {
  const fresh = isWithin24h(repo.last_seen);
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
              fresh ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          <div className="min-w-0">
            <p className="text-[#F5F7F8] font-semibold text-sm truncate">{repo.name}</p>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9BA3AE] font-mono text-xs truncate block hover:text-[#22D3EE] transition-colors"
            >
              {repo.url}
            </a>
            <p className="text-[#4B5563] text-xs font-mono mt-1">
              Last seen {ago(repo.last_seen)}
            </p>
          </div>
        </div>
      </div>
      <button className="mt-4 text-[#22D3EE] text-xs font-medium hover:underline">
        View runs →
      </button>
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
        className={`font-display font-bold text-3xl leading-none ${
          accent ? "text-[#22D3EE]" : "text-[#F5F7F8]"
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
  const [onboardingDone, setOnboardingDone] = useState(false);

  const {
    data: health,
    isLoading: healthLoading,
  } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 30_000,
  });

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
    queryFn: () => getRuns(20),
    refetchInterval: 15_000,
  });

  function refetchAll() {
    refetchRepos();
    refetchRuns();
  }

  const repoMap = Object.fromEntries(repos.map((r) => [r.repo_id, r.name]));
  const initialLoading = healthLoading || reposLoading || runsLoading;

  // ── Backend error ──
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
          className="mt-1 rounded-full bg-[#22D3EE] text-[#03242a] font-semibold px-6 py-2.5 text-sm hover:brightness-110 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Onboarding gate ──
  if (!initialLoading && repos.length === 0 && !onboardingDone) {
    return (
      <ConnectRepository
        onConnected={() => {
          setOnboardingDone(true);
          refetchAll();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#04040A] text-[#F5F7F8]">
      {/* ── Sticky top bar ── */}
      <header className="sticky top-0 z-30 border-b border-[#24272B] bg-[#04040A]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[#9BA3AE] hover:text-[#22D3EE] text-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to site
            </Link>
            <span className="text-[#24272B]">|</span>
            <span className="text-[#F5F7F8] font-semibold text-sm tracking-tight">
              Signal&nbsp;
              <span className="text-[#22D3EE] font-display">Dashboard</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetchAll()}
              className="flex items-center gap-1.5 text-[#9BA3AE] hover:text-[#22D3EE] text-xs font-mono transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${runsRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => setOnboardingDone(false)}
              className="flex items-center gap-1.5 rounded-lg bg-[#22D3EE] text-[#03242a] font-semibold text-sm px-3 py-1.5 hover:brightness-110 transition"
            >
              <Plus className="w-4 h-4" />
              Add repo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Metrics bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {initialLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <StatCard icon={Activity} label="Total runs" value={health?.total_runs ?? 0} delay={0} />
              <StatCard
                icon={CheckCircle2}
                label="Success rate"
                value={`${health?.success_rate ?? 0}%`}
                accent
                delay={0.06}
              />
              <StatCard
                icon={Clock}
                label="Avg pipeline"
                value={health?.avg_duration != null ? `${health.avg_duration}s` : "—"}
                delay={0.12}
              />
              <StatCard
                icon={FileText}
                label="Docs updated"
                value={health?.docs_updated ?? runs.reduce((s, r) => s + (r.docs_updated ?? 0), 0)}
                delay={0.18}
              />
            </>
          )}
        </div>

        {/* ── Repos grid ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#F5F7F8] font-display font-semibold text-base">
              Connected repositories
            </h2>
            <span className="text-[#4B5563] text-xs font-mono">{repos.length} repo{repos.length !== 1 ? "s" : ""}</span>
          </div>

          {reposLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          ) : repos.length === 0 ? (
            <ConnectRepository onConnected={() => { setOnboardingDone(true); refetchAll(); }} />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {repos.map((r) => <RepoCard key={r.repo_id} repo={r} />)}
            </div>
          )}
        </section>

        {/* ── Pipeline runs feed ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[#F5F7F8] font-display font-semibold text-base">
              Recent pipeline runs
            </h2>
            {/* Live-pulse dot */}
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="ml-auto text-[#4B5563] text-xs font-mono">
              {runs.length} entries · auto-refresh 15s
            </span>
          </div>

          {runsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
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
                <RunRow key={run.run_id} run={run} repoName={repoMap[run.repo_id]} />
              ))}
            </div>
          )}
        </section>

      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
