// ─── Base URL ────────────────────────────────────────────────────────────────
export const BASE_URL = import.meta.env.VITE_API_URL as string;

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
  url: string;
  last_seen: string;
}

export interface Run {
  run_id: string;
  repo_id: number;
  status: string;
  commit_sha: string;
  mr_url: string | null;
  docs_updated: number;
  created_at: string;
  duration_seconds: number;
}

export interface Health {
  total_runs: number;
  completed_runs: number;
  skipped_runs: number;
  success_rate: number;
  avg_duration: number;
  docs_updated: number;
}

export interface ConnectedRepo {
  project_id: number;
  name: string;
  default_branch: string;
  webhook_url: string;
  webhook_secret: string;
  status: string;
}

// ─── API functions ───────────────────────────────────────────────────────────

/** GET /api/repos — list all connected repositories */
export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(`${BASE_URL}/api/repos`);
  return handleResponse<Repo[]>(res);
}

/** GET /api/runs?limit={limit} — list recent pipeline runs */
export async function getRuns(limit = 20): Promise<Run[]> {
  const res = await fetch(`${BASE_URL}/api/runs?limit=${limit}`);
  return handleResponse<Run[]>(res);
}

/** GET /api/health — aggregate health stats */
export async function getHealth(): Promise<Health> {
  const res = await fetch(`${BASE_URL}/api/health`);
  return handleResponse<Health>(res);
}

/** POST /api/repos/connect — connect a new GitLab repository */
export async function connectRepo(gitlabUrl: string): Promise<ConnectedRepo> {
  const res = await fetch(`${BASE_URL}/api/repos/connect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gitlab_url: gitlabUrl }),
  });
  return handleResponse<ConnectedRepo>(res);
}
