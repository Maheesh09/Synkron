import { Github, ArrowLeft, ExternalLink } from "lucide-react";

const APP_SLUG = "synkron-docs";
const INSTALL_URL = `https://github.com/apps/${APP_SLUG}/installations/new`;

export function ConnectRepository({
  onConnected,
  onCancel,
}: {
  onConnected: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-[#04040A] px-4">
      <div className="w-full max-w-md rounded-xl border border-[#24272B] bg-[#111315] p-8 text-center">
        <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-teal-400/10 grid place-items-center">
          <Github className="w-6 h-6 text-teal-400" />
        </div>
        <h1 className="text-lg font-semibold text-[#F5F7F8] mb-2">
          Install Synkron on GitHub
        </h1>
        <p className="text-sm text-[#9BA3AE] mb-6">
          Pick the repositories you want Synkron to keep in sync. It opens a
          documentation pull request whenever your code changes — no webhooks or
          tokens to configure.
        </p>

        <a
          href={INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f2328] text-white font-medium px-4 py-2.5 hover:bg-[#2c333a] transition"
        >
          <Github className="w-4 h-4" />
          Install on GitHub
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>

        <button
          onClick={onConnected}
          className="mt-3 w-full rounded-lg border border-[#24272B] text-[#9BA3AE] hover:text-[#F5F7F8] hover:bg-white/5 px-4 py-2.5 text-sm transition"
        >
          I’ve installed it — refresh
        </button>

        <button
          onClick={onCancel}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#4B5563] hover:text-[#9BA3AE] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>
    </div>
  );
}