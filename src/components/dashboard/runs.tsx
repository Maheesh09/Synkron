import { Fragment, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Binary,
  Network,
  PenTool,
  GitMerge,
  ChevronRight,
  ExternalLink,
  FileText,
  Search,
  XCircle,
  Activity,
  MinusCircle,
} from "lucide-react";
import type { Run } from "@/lib/api";
import { ago, secs, usd } from "./stats";

// ─── Status ───────────────────────────────────────────────────────────────────

const STATUS: Record<string, { label: string; pill: string; dot: string }> = {
  completed: {
    label: "Completed",
    pill: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/20",
    dot: "bg-emerald-400",
  },
  running: {
    label: "Running",
    pill: "text-teal-300 bg-teal-400/10 ring-teal-400/25",
    dot: "bg-teal-400 pulse-dot",
  },
  failed: {
    label: "Failed",
    pill: "text-red-300 bg-red-400/10 ring-red-400/25",
    dot: "bg-red-400",
  },
  skipped: {
    label: "Skipped",
    pill: "text-[#9BA3AE] bg-white/[0.04] ring-white/10",
    dot: "bg-[#6B7280]",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { ...STATUS.skipped, label: status };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Run detail ───────────────────────────────────────────────────────────────

const AGENTS = [
  { key: "code_analyzer", icon: Binary, label: "Code Analyzer" },
  { key: "impact_mapper", icon: Network, label: "Impact Mapper" },
  { key: "doc_writer", icon: PenTool, label: "Doc Writer" },
  { key: "pr_creator", icon: GitMerge, label: "PR Creator" },
] as const;

const SKIP_COPY: Record<string, string> = {
  no_doc_hints: "Filtered before any model call. The diff touched no documented behaviour.",
  no_affected_docs: "Analysed, but no existing document covers the changed code.",
  no_doc_updates: "Documents were reviewed and are still accurate. Nothing to rewrite.",
};

/** How far a run got, from the status alone (the API does not record the failing stage). */
function stepsReached(run: Run) {
  if (run.status === "completed") return 4;
  if (run.status === "running") return 2;
  if (run.status === "failed") return 1;
  if (run.status === "skipped") {
    if (run.skip_reason === "no_doc_hints") return 1;
    if (run.skip_reason === "no_affected_docs") return 2;
    if (run.skip_reason === "no_doc_updates") return 3;
  }
  return 0;
}

function AgentProgress({ run }: { run: Run }) {
  const steps = stepsReached(run);
  const stages = (run.stage_ms ?? {}) as Record<string, number | undefined>;
  const total = Object.values(stages).reduce<number>((s, v) => s + (v ?? 0), 0) || 1;

  return (
    <ol className="grid gap-px overflow-hidden rounded-lg border border-[#24272B] bg-[#24272B] sm:grid-cols-4">
      {AGENTS.map(({ key, icon: Icon, label }, i) => {
        const done = i < steps;
        const active = run.status === "running" && i === steps - 1;
        const stoppedHere =
          (run.status === "failed" || run.status === "skipped") && i === steps - 1;
        const ms = stages[key];
        return (
          <li key={key} className="bg-[#0C0D0F] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Icon
                  className={`h-3.5 w-3.5 ${done ? "text-teal-400" : "text-[#4B5563]"}`}
                  strokeWidth={1.75}
                />
                <span className={`text-xs ${done ? "text-[#F5F7F8]" : "text-[#6B7280]"}`}>
                  {label}
                </span>
              </span>
              {stoppedHere && (
                <span
                  className={`font-mono text-[10px] uppercase ${run.status === "failed" ? "text-red-300" : "text-[#9BA3AE]"}`}
                >
                  {run.status === "failed" ? "failed" : "stopped"}
                </span>
              )}
              {active && (
                <span className="font-mono text-[10px] uppercase text-teal-300">running</span>
              )}
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: done ? `${ms ? Math.max(8, (ms / total) * 100) : 100}%` : "0%" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${
                  stoppedHere && run.status === "failed" ? "bg-red-400/70" : "bg-teal-400/70"
                }`}
              />
            </div>
            <p className="mt-2 font-mono text-[11px] tabular-nums text-[#6B7280]">
              {ms != null
                ? `${(ms / 1000).toFixed(1)}s · ${((ms / total) * 100).toFixed(0)}%`
                : done
                  ? "done"
                  : "not reached"}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-[#6B7280]">{label}</dt>
      <dd className="mt-1 font-mono text-xs text-[#C9CFD6]">{value}</dd>
    </div>
  );
}

export function RunDetail({ run }: { run: Run }) {
  return (
    <div className="space-y-5 border-t border-[#24272B] bg-[#0A0B0D] px-4 py-5 sm:px-5">
      {run.status === "skipped" && (
        <p className="flex items-start gap-2 text-sm text-[#9BA3AE]">
          <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7280]" />
          {SKIP_COPY[run.skip_reason ?? ""] ??
            "No docs needed updating. The diff didn't touch documented sections."}
        </p>
      )}
      {run.status === "failed" && (
        <p className="flex items-start gap-2 text-sm text-red-300">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {run.error_type ?? "Pipeline failed"}
            {run.error_message ? (
              <span className="block font-mono text-xs text-red-300/70">{run.error_message}</span>
            ) : (
              <span className="text-red-300/70"> · check backend logs for details.</span>
            )}
          </span>
        </p>
      )}

      <AgentProgress run={run} />

      {run.docs_updated?.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#6B7280]">Documents updated</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {run.docs_updated.map((d) => (
              <li
                key={d}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#24272B] bg-white/[0.02] px-2 py-1 font-mono text-[11px] text-[#C9CFD6]"
              >
                <FileText className="h-3 w-3 text-[#6B7280]" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
          <Meta label="Run" value={run.run_id?.slice(0, 12) ?? "—"} />
          <Meta label="Commit" value={run.commit_sha?.slice(0, 8) ?? "—"} />
          <Meta label="Duration" value={secs(run.duration_seconds)} />
          <Meta label="Tokens" value={run.tokens_total ? run.tokens_total.toLocaleString() : "—"} />
          <Meta label="Cost" value={run.cost_usd ? `$${run.cost_usd.toFixed(5)}` : "—"} />
          <Meta label="Model calls" value={run.gemini_calls ?? "—"} />
        </dl>
        {run.mr_url && (
          <a
            href={run.mr_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-teal-400 px-3.5 text-sm font-semibold text-[#04040A] transition hover:bg-teal-300"
          >
            Open pull request
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

const FILTERS = ["all", "completed", "skipped", "failed", "running"] as const;
export type RunFilter = (typeof FILTERS)[number];

function Toolbar({
  filter,
  setFilter,
  query,
  setQuery,
  counts,
}: {
  filter: RunFilter;
  setFilter: (f: RunFilter) => void;
  query: string;
  setQuery: (q: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#24272B] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <div
        role="tablist"
        aria-label="Filter runs by status"
        className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto px-1"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={[
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium capitalize transition-colors",
              filter === f
                ? "bg-white/[0.08] text-[#F5F7F8]"
                : "text-[#9BA3AE] hover:bg-white/[0.04] hover:text-[#F5F7F8]",
            ].join(" ")}
          >
            {f}
            <span className="font-mono text-[10px] tabular-nums text-[#6B7280]">
              {f === "all" ? counts.all : (counts[f] ?? 0)}
            </span>
          </button>
        ))}
      </div>
      <label className="relative block sm:w-64">
        <span className="sr-only">Search runs by commit or document</span>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B7280]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Commit SHA or doc path"
          className="h-8 w-full rounded-md border border-[#24272B] bg-[#0A0B0D] pl-8 pr-3 text-xs text-[#F5F7F8] placeholder:text-[#6B7280] focus:border-teal-400/50 focus:outline-none"
        />
      </label>
    </div>
  );
}

// ─── Runs table ───────────────────────────────────────────────────────────────

const PAGE = 20;

export function RunsTable({
  runs,
  loading,
  repoNames,
  showRepo,
  emptyHint,
}: {
  runs: Run[];
  loading: boolean;
  repoNames: Record<number, string>;
  showRepo: boolean;
  emptyHint: string;
}) {
  const [filter, setFilter] = useState<RunFilter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: runs.length };
    runs.forEach((r) => (c[r.status] = (c[r.status] ?? 0) + 1));
    return c;
  }, [runs]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return runs.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!q ||
          r.commit_sha?.toLowerCase().startsWith(q) ||
          r.docs_updated?.some((d) => d.toLowerCase().includes(q))),
    );
  }, [runs, filter, query]);

  const shown = visible.slice(0, limit);
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));

  return (
    <div className="overflow-hidden rounded-xl border border-[#24272B] bg-[#111315]">
      <Toolbar
        filter={filter}
        setFilter={(f) => {
          setFilter(f);
          setLimit(PAGE);
        }}
        query={query}
        setQuery={setQuery}
        counts={counts}
      />

      {loading ? (
        <div className="divide-y divide-[#24272B]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
              <div className="h-5 w-24 animate-pulse rounded bg-white/[0.05]" />
              <div className="h-4 w-16 animate-pulse rounded bg-white/[0.05]" />
              <div className="ml-auto h-4 w-20 animate-pulse rounded bg-white/[0.05]" />
            </div>
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <Activity className="h-6 w-6 text-[#4B5563]" />
          <p className="text-sm text-[#C9CFD6]">
            {runs.length === 0 ? "No pipeline runs yet" : "No runs match these filters"}
          </p>
          <p className="text-xs text-[#6B7280]">
            {runs.length === 0 ? emptyHint : "Try another status or clear the search."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop / tablet: table */}
          <table className="hidden w-full text-left text-sm md:table">
            <thead>
              <tr className="border-b border-[#24272B] text-[11px] uppercase tracking-wider text-[#6B7280]">
                <th className="w-8 py-2.5 pl-4 font-medium">
                  <span className="sr-only">Expand</span>
                </th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
                <th className="py-2.5 pr-4 font-medium">Commit</th>
                {showRepo && <th className="py-2.5 pr-4 font-medium">Repository</th>}
                <th className="py-2.5 pr-4 text-right font-medium">Docs</th>
                <th className="py-2.5 pr-4 text-right font-medium">Duration</th>
                <th className="hidden py-2.5 pr-4 text-right font-medium lg:table-cell">Cost</th>
                <th className="py-2.5 pr-4 font-medium">Started</th>
                <th className="py-2.5 pr-4 text-right font-medium">
                  <span className="sr-only">Pull request</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((run) => {
                const isOpen = open === run.run_id;
                return (
                  <Fragment key={run.run_id}>
                    <tr
                      onClick={() => toggle(run.run_id)}
                      className={`cursor-pointer border-b border-[#24272B] transition-colors last:border-0 hover:bg-white/[0.02] ${
                        isOpen ? "bg-white/[0.02]" : ""
                      }`}
                    >
                      <td className="py-3 pl-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(run.run_id);
                          }}
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? "Hide" : "Show"} details for commit ${run.commit_sha?.slice(0, 8)}`}
                          className="flex h-6 w-6 items-center justify-center rounded text-[#6B7280] hover:text-[#F5F7F8]"
                        >
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                          />
                        </button>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-[#C9CFD6]">
                        {run.commit_sha?.slice(0, 8) ?? "—"}
                      </td>
                      {showRepo && (
                        <td className="max-w-[180px] truncate py-3 pr-4 text-[13px] text-[#9BA3AE]">
                          {repoNames[run.repo_id] ?? `#${run.repo_id}`}
                        </td>
                      )}
                      <td className="py-3 pr-4 text-right font-mono text-xs tabular-nums text-[#C9CFD6]">
                        {run.docs_updated?.length ?? 0}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-xs tabular-nums text-[#C9CFD6]">
                        {secs(run.duration_seconds)}
                      </td>
                      <td className="hidden py-3 pr-4 text-right font-mono text-xs tabular-nums text-[#9BA3AE] lg:table-cell">
                        {run.cost_usd ? usd(run.cost_usd) : "—"}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-[13px] text-[#9BA3AE]">
                        <time
                          dateTime={run.created_at}
                          title={new Date(run.created_at).toLocaleString()}
                        >
                          {ago(run.created_at)}
                        </time>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        {run.mr_url ? (
                          <a
                            href={run.mr_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium text-teal-400 hover:text-teal-300"
                          >
                            View PR
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-[#4B5563]">—</span>
                        )}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-[#24272B] last:border-0">
                        <td colSpan={showRepo ? 9 : 8} className="p-0">
                          <RunDetail run={run} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Mobile: stacked list */}
          <ul className="divide-y divide-[#24272B] md:hidden">
            {shown.map((run) => {
              const isOpen = open === run.run_id;
              return (
                <li key={run.run_id}>
                  <button
                    onClick={() => toggle(run.run_id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={run.status} />
                        <span className="font-mono text-xs text-[#C9CFD6]">
                          {run.commit_sha?.slice(0, 8) ?? "—"}
                        </span>
                      </div>
                      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#9BA3AE]">
                        {showRepo && (
                          <span className="truncate">
                            {repoNames[run.repo_id] ?? `#${run.repo_id}`}
                          </span>
                        )}
                        <span>{run.docs_updated?.length ?? 0} docs</span>
                        <span className="font-mono">{secs(run.duration_seconds)}</span>
                        <span>{ago(run.created_at)}</span>
                      </p>
                    </div>
                    <ChevronRight
                      className={`mt-1 h-4 w-4 shrink-0 text-[#6B7280] transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <RunDetail run={run} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between border-t border-[#24272B] px-4 py-2.5 text-xs text-[#6B7280]">
            <span>
              Showing {shown.length} of {visible.length}
            </span>
            {visible.length > shown.length && (
              <button
                onClick={() => setLimit((l) => l + PAGE)}
                className="font-medium text-[#C9CFD6] hover:text-[#F5F7F8]"
              >
                Show more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
