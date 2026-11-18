// ─── Base URL ────────────────────────────────────────────────────────────────
export const BASE_URL = import.meta.env.VITE_API_URL as string;

// ─── Auth (Firebase ID token) ────────────────────────────────────────────────
import { getFirebaseAuth } from "@/lib/firebase";

async function authHeaders(): Promise<Record<string, string>> {
  const user = getFirebaseAuth().currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;

  // Try to surface the JSON error body; fall back to status text
  let message: string;
  try {
    const body = await res.json();
    message =
      body?.detail ?? body?.message ?? JSON.stringify(body);
  } catch {
    message = res.statusText;
  }
  throw new Error(message);
}

// ─── Types ────────────────────────────────────────────────────────────────────


export interface Repo {
  repo_id: number;
  name: string;
  full_name?: string;
  owner?: string;
  url?: string;
  last_seen?: string;
}

export interface StageTimings {
  code_analyzer?: number;
  impact_mapper?: number;
  doc_writer?: number;
  pr_creator?: number;
}

export interface Run {
  run_id: string;
  repo_id: number;
  status: string;
  commit_sha: string;
  mr_url: string | null;
  docs_updated: string[];
  created_at: string;
  duration_seconds: number;
  skip_reason?: string | null;
  error_type?: string | null;
  error_message?: string | null;
  stage_ms?: StageTimings;
  tokens_total?: number;
  cost_usd?: number;
  gemini_calls?: number;
  merged_at?: string | null;
}

export interface Health {
  total_runs: number;
  completed_runs: number;
  skipped_runs: number;
  /** Present on backends that compute success_rate as completed / (completed + failed). */
  failed_runs?: number;
  success_rate: number;
  avg_duration: number;
  docs_updated: number;
  p50_duration?: number;
  p95_duration?: number;
  total_cost?: number;
  total_tokens?: number;
}


/** GET /api/repos — list all connected repositories */
export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(`${BASE_URL}/api/repos`, { headers: { ...(await authHeaders()) } });
  return handleResponse<Repo[]>(res);
}

/** GET /api/runs?limit={limit} — list recent pipeline runs */
export async function getRuns(limit = 20): Promise<Run[]> {
  const res = await fetch(`${BASE_URL}/api/runs?limit=${limit}`, { headers: { ...(await authHeaders()) } });
  return handleResponse<Run[]>(res);
}

/** GET /api/health — aggregate stats over all runs, optionally for one repo */
export async function getHealth(repoId?: number | null): Promise<Health> {
  const qs = repoId != null ? `?repo_id=${repoId}` : "";
  const res = await fetch(`${BASE_URL}/api/health${qs}`, { headers: { ...(await authHeaders()) } });
  return handleResponse<Health>(res);
}

