import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { AlertCircle, Menu, Plus, RefreshCw, ExternalLink, ChevronRight } from "lucide-react";
import { AuthGate } from "@/components/synkron/AuthGate";
import { ConnectRepository } from "@/components/synkron/ConnectRepository";
import { getFirebaseAuth } from "@/lib/firebase";
import { getRepos, getRuns, getHealth } from "@/lib/api";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { RunsTable } from "@/components/dashboard/runs";
import {
  SidebarContent,
  KpiPanel,
  SuccessHint,
  ReposTable,
  DisconnectButton,
  type Kpi,
} from "@/components/dashboard/shell";
import {
  ago,
  computeStats,
  statsFromHealth,
  secs,
  usd,
  isWithin24h,
  repoHref,
} from "@/components/dashboard/stats";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: "Dashboard | Synkron" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AuthGate>
      <AppPage />
    </AuthGate>
  ),
});

function SectionTitle({ title, meta }: { title: string; meta?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <h2 className="text-sm font-semibold text-[#F5F7F8]">{title}</h2>
      {meta && <div className="text-xs text-[#6B7280]">{meta}</div>}
    </div>
  );
}

function AppPage() {
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [isConnectingInitial, setIsConnectingInitial] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  // null = overview of all repos; number = one repository is focused
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
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["runs"],
    queryFn: () => getRuns(100),
    refetchInterval: 15_000,
  });

  // Aggregate stats over ALL runs come from the backend; runs[] above is only
  // the latest page and is used for the run list itself.
  const { data: health, refetch: refetchHealth } = useQuery({
    queryKey: ["health"],
    queryFn: () => getHealth(),
    refetchInterval: 15_000,
  });

  const { data: repoHealth, refetch: refetchRepoHealth } = useQuery({
    queryKey: ["health", selectedRepoId],
    queryFn: () => getHealth(selectedRepoId),
    enabled: selectedRepoId != null,
    refetchInterval: 15_000,
  });

  function refetchAll() {
    refetchRepos();
    refetchRuns();
    refetchHealth();
    if (selectedRepoId != null) refetchRepoHealth();
  }

  const handleDeleteRepo = async (_id: number) => {
    // Repos are managed on GitHub: the App keeps receiving webhooks until the
    // repo is removed there, so send the user to GitHub to remove it.
    window.open("https://github.com/settings/installations", "_blank", "noopener,noreferrer");
  };

  // ── Derived data ──
  const selectedRepo = useMemo(
    () => (selectedRepoId ? (repos.find((r) => r.repo_id === selectedRepoId) ?? null) : null),
    [repos, selectedRepoId],
  );

  const filteredRuns = useMemo(
    () => (selectedRepoId ? runs.filter((r) => r.repo_id === selectedRepoId) : runs),
    [runs, selectedRepoId],
  );

  const repoStats = useMemo(
    () => statsFromHealth(repoHealth) ?? computeStats(filteredRuns),
    [repoHealth, filteredRuns],
  );

  // Global stats from /api/health (all runs), same formula as per-repo.
  // Skipped runs are excluded from the success-rate denominator everywhere.
  const globalStats = useMemo(() => statsFromHealth(health) ?? computeStats(runs), [health, runs]);

  const runCountByRepo = useMemo(() => {
    const m: Record<number, number> = {};
    runs.forEach((r) => {
      m[r.repo_id] = (m[r.repo_id] ?? 0) + 1;
    });
    return m;
  }, [runs]);

  const repoNames = useMemo(
    () => Object.fromEntries(repos.map((r) => [r.repo_id, r.name])) as Record<number, string>,
    [repos],
  );

  const initialLoading = reposLoading || runsLoading;

  // With zero repos after loading, start the first-time connect flow.
  useEffect(() => {
    if (!initialLoading && !reposLoading && repos.length === 0 && !isConnectingInitial) {
      setIsConnectingInitial(true);
    }
  }, [initialLoading, reposLoading, repos.length, isConnectingInitial]);

  // ── Full-screen states ──
  if (reposError && !reposLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#04040A] px-4">
        <div className="w-full max-w-sm rounded-xl border border-[#24272B] bg-[#111315] p-7 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-400/10">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <h1 className="mt-4 font-display text-lg font-semibold text-[#F5F7F8]">
            Can't reach the Synkron API
          </h1>
          <p className="mt-2 break-words text-sm text-[#9BA3AE]">
            {(reposErrorDetail as Error)?.message ?? "Could not connect to the Synkron API."}
          </p>
          <button
            onClick={() => refetchAll()}
            className="mt-6 inline-flex h-9 items-center gap-2 rounded-md bg-teal-400 px-4 text-sm font-semibold text-[#04040A] transition hover:bg-teal-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (isConnectingInitial) {
    return (
      <ConnectRepository
        onConnected={async () => {
          await refetchAll();
          setIsConnectingInitial(false);
        }}
        onCancel={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  if (showAddRepo) {
    return (
      <ConnectRepository
        onConnected={async () => {
          await refetchAll();
          setShowAddRepo(false);
        }}
        onCancel={() => setShowAddRepo(false)}
      />
    );
  }

  const user = getFirebaseAuth().currentUser;
  const sidebarProps = {
    repos,
    reposLoading,
    runCountByRepo,
    totalRuns: runs.length,
    selectedRepoId,
    onSelect: (id: number | null) => {
      setSelectedRepoId(id);
      setNavOpen(false);
    },
    onAddRepo: () => {
      setNavOpen(false);
      setShowAddRepo(true);
    },
    onSignOut: () => signOut(getFirebaseAuth()),
    user: {
      name: user?.displayName ?? user?.email ?? "Signed in",
      photo: user?.photoURL,
    },
  };

  const stats = selectedRepo ? repoStats : globalStats;
  const kpis: Kpi[] = [
    { label: "Total runs", value: stats.total, hint: `${stats.completed} opened a PR` },
    {
      label: "Success rate",
      value: `${stats.successRate}%`,
      hint: <SuccessHint stats={stats} />,
      accent: true,
    },
    selectedRepo
      ? {
          label: "Median duration",
          value: secs(stats.p50Duration),
          hint: `p95 ${secs(stats.p95Duration)}`,
        }
      : { label: "Avg duration", value: secs(stats.avgDuration), hint: "completed runs" },
    { label: "Docs updated", value: stats.docsUpdated, hint: "files across all PRs" },
    {
      label: "Model spend",
      value: usd(stats.totalCost),
      hint: stats.costPerRun ? `${usd(stats.costPerRun)} per PR` : "no completed runs",
    },
  ];

  const link = selectedRepo ? repoHref(selectedRepo) : null;

  return (
    <div className="min-h-screen bg-[#04040A] text-[#F5F7F8] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-[#1C1E21] bg-[#08090A] lg:block">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile / tablet drawer */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-[#1C1E21] bg-[#08090A] p-0 text-[#F5F7F8] [&>button]:top-4 [&>button]:text-[#9BA3AE]"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent {...sidebarProps} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-[#1C1E21] bg-[#04040A]/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              className="-ml-1 flex h-9 w-9 items-center justify-center rounded-md text-[#9BA3AE] hover:bg-white/[0.05] hover:text-[#F5F7F8] lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>

            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
              <button
                onClick={() => setSelectedRepoId(null)}
                className={`shrink-0 ${selectedRepo ? "text-[#9BA3AE] hover:text-[#F5F7F8]" : "font-medium text-[#F5F7F8]"}`}
              >
                Overview
              </button>
              {selectedRepo && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#4B5563]" />
                  <span className="truncate font-medium text-[#F5F7F8]">{selectedRepo.name}</span>
                </>
              )}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-2 text-xs text-[#6B7280] md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
                Live
                {dataUpdatedAt > 0 && (
                  <span className="tabular-nums">
                    · updated{" "}
                    {new Date(dataUpdatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                )}
              </span>
              <button
                onClick={() => refetchAll()}
                aria-label="Refresh"
                title="Refresh"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#24272B] text-[#9BA3AE] transition-colors hover:border-[#3A3D42] hover:text-[#F5F7F8]"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${runsRefetching ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setShowAddRepo(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-teal-400 px-3 text-sm font-semibold text-[#04040A] transition hover:bg-teal-300"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add repository</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1280px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Page header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-bold tracking-tight text-[#F5F7F8]">
                {selectedRepo ? selectedRepo.name : "Overview"}
              </h1>
              {selectedRepo ? (
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#9BA3AE]">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isWithin24h(selectedRepo.last_seen) ? "bg-emerald-400" : "bg-amber-400/80"}`}
                    />
                    Last push {ago(selectedRepo.last_seen)}
                  </span>
                  {link && (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-center gap-1 font-mono text-xs text-[#6B7280] hover:text-teal-300"
                    >
                      <span className="truncate">{link.text}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  )}
                </p>
              ) : (
                <p className="mt-1.5 text-[13px] text-[#9BA3AE]">
                  {repos.length} connected {repos.length === 1 ? "repository" : "repositories"} ·
                  every push is analysed for documentation drift
                </p>
              )}
            </div>
            {selectedRepo && <DisconnectButton repo={selectedRepo} onDelete={handleDeleteRepo} />}
          </div>

          <KpiPanel items={kpis} loading={selectedRepo ? runsLoading : initialLoading} />

          {!selectedRepo && (
            <section>
              <SectionTitle title="Repositories" meta={`${repos.length} connected`} />
              <ReposTable
                repos={repos}
                runs={runs}
                loading={reposLoading}
                onSelect={setSelectedRepoId}
                onDelete={handleDeleteRepo}
                onAddRepo={() => setShowAddRepo(true)}
              />
            </section>
          )}

          <section>
            <SectionTitle
              title={selectedRepo ? "Pipeline runs" : "Recent pipeline runs"}
              meta="Auto-refreshes every 15s"
            />
            <RunsTable
              key={selectedRepoId ?? "all"}
              runs={filteredRuns}
              loading={runsLoading}
              repoNames={repoNames}
              showRepo={!selectedRepo && repos.length > 1}
              emptyHint={
                selectedRepo
                  ? "Push a commit to this repository to trigger the first run."
                  : "Push a commit to a connected repository to trigger one."
              }
            />
          </section>
        </main>
      </div>
    </div>
  );
}
