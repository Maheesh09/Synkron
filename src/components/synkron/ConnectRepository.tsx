import { Github, ArrowLeft, ExternalLink, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { AuthFrame } from "./AuthGate";

const APP_SLUG = "synkron-docs";
const INSTALL_URL = `https://github.com/apps/${APP_SLUG}/installations/new`;

const steps = [
  "Install the Synkron GitHub App",
  "Choose the repositories to keep in sync",
  "Come back here and refresh",
];

export function ConnectRepository({
  onConnected,
  onCancel,
}: {
  onConnected: () => void | Promise<void>;
  onCancel: () => void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onConnected();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AuthFrame>
      <div className="rounded-xl border border-[#24272B] bg-[#111315] p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
        <h1 className="font-display text-xl font-semibold tracking-tight text-[#F5F7F8]">
          Connect a repository
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#9BA3AE]">
          Synkron opens a documentation pull request whenever your code changes. There are no
          webhooks or tokens to configure.
        </p>

        <ol className="mt-6 space-y-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3 text-sm text-[#C9CFD6]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#24272B] font-mono text-[11px] text-[#9BA3AE]">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>

        <a
          href={INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-400 text-sm font-semibold text-[#04040A] transition hover:bg-teal-300"
        >
          <Github className="h-4 w-4" />
          Install on GitHub
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-2.5 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#24272B] text-sm text-[#C9CFD6] transition hover:bg-white/[0.04] hover:text-[#F5F7F8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking…
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              I've installed it, refresh
            </>
          )}
        </button>
      </div>

      <button
        onClick={onCancel}
        className="mx-auto mt-6 flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#9BA3AE]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>
    </AuthFrame>
  );
}
