import { formatDistanceToNow } from "date-fns";
import type { Health, Repo, Run } from "@/lib/api";

export function ago(iso?: string | null) {
  if (!iso) return "—";
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "—";
  }
}

export function isWithin24h(iso?: string) {
  return !!iso && Date.now() - new Date(iso).getTime() < 86_400_000;
}

/** Durations arrive as raw floats (e.g. 34.87544822); show one decimal. */
export function secs(n?: number | null) {
  if (n == null) return "—";
  return `${(Math.round(n * 10) / 10).toFixed(1)}s`;
}

export function usd(n?: number | null) {
  if (!n) return "$0";
  return n < 1 ? `$${n.toFixed(4)}` : `$${n.toFixed(2)}`;
}

function percentile(sorted: number[], pct: number) {
  if (!sorted.length) return null;
  const idx = Math.min(Math.floor((sorted.length * pct) / 100), sorted.length - 1);
  return Math.round(sorted[idx] * 10) / 10;
}

export function computeStats(runs: Run[]) {
  const total = runs.length;
  const completed = runs.filter((r) => r.status === "completed").length;
  const failed = runs.filter((r) => r.status === "failed").length;

  const durations = runs
    .filter((r) => r.status === "completed" && r.duration_seconds != null)
    .map((r) => r.duration_seconds)
    .sort((a, b) => a - b);

  const avgDuration = durations.length
    ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
    : null;
  const p50Duration = percentile(durations, 50);
  const p95Duration = percentile(durations, 95);

  const docsUpdated = runs.reduce((s, r) => s + (r.docs_updated?.length ?? 0), 0);

  // Only count completed vs failed: skipped runs are not meaningful for success rate.
  const decisiveRuns = completed + failed;
  const successRate = decisiveRuns > 0 ? Math.round((completed / decisiveRuns) * 1000) / 10 : 0;

  const totalCost = runs.reduce((s, r) => s + (r.cost_usd ?? 0), 0);
  const totalTokens = runs.reduce((s, r) => s + (r.tokens_total ?? 0), 0);
  const costPerRun = completed > 0 ? totalCost / completed : 0;

  return {
    total,
    completed,
    failed,
    successRate,
    avgDuration,
    p50Duration,
    p95Duration,
    docsUpdated,
    totalCost,
    totalTokens,
    costPerRun,
  };
}

export type Stats = ReturnType<typeof computeStats>;

/**
 * Stats over ALL runs from /api/health. Returns null (so callers fall back to
 * computeStats on the loaded page) until a backend that reports failed_runs
 * answers: older backends count skipped runs in success_rate and ignore the
 * repo_id filter, so their numbers would not match this dashboard.
 */
export function statsFromHealth(h: Health | undefined): Stats | null {
  if (!h || h.failed_runs === undefined) return null;
  return {
    total: h.total_runs,
    completed: h.completed_runs,
    failed: h.failed_runs,
    successRate: h.success_rate,
    avgDuration: h.completed_runs > 0 ? h.avg_duration : null,
    p50Duration: h.completed_runs > 0 ? (h.p50_duration ?? null) : null,
    p95Duration: h.completed_runs > 0 ? (h.p95_duration ?? null) : null,
    docsUpdated: h.docs_updated,
    totalCost: h.total_cost ?? 0,
    totalTokens: h.total_tokens ?? 0,
    costPerRun: h.completed_runs > 0 ? (h.total_cost ?? 0) / h.completed_runs : 0,
  };
}

export function repoLabel(name: string) {
  return name.split(" / ").pop() ?? name;
}

export function repoHref(repo: Repo) {
  if (repo.url) return { href: repo.url, text: repo.url.replace(/^https?:\/\//, "") };
  if (repo.full_name)
    return { href: `https://github.com/${repo.full_name}`, text: `github.com/${repo.full_name}` };
  return null;
}
