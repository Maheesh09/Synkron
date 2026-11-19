import { useState, useEffect, type ReactNode } from "react";
import { onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Github, Loader2, ShieldCheck } from "lucide-react";
import { getFirebaseAuth, githubProvider } from "@/lib/firebase";
import { SyncIcon } from "./SyncIcon";

/** Shared frame for the full-screen auth and onboarding steps. */
export function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#04040A] px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-grid opacity-70" />
      <div className="relative w-full max-w-[400px]">
        <Link to="/" className="mx-auto mb-8 flex w-fit items-center gap-2">
          <SyncIcon className="h-5 w-5 text-teal-400" />
          <span className="font-display text-lg font-semibold tracking-tight text-[#F5F7F8]">
            Synkron
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}

/**
 * Gates the dashboard behind GitHub sign-in. Shows a sign-in screen until the
 * user authenticates with Firebase; then renders the dashboard, which the
 * backend automatically scopes to that user's own repositories.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signIn() {
    setError("");
    setBusy(true);
    try {
      await signInWithPopup(getFirebaseAuth(), githubProvider);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#04040A]" role="status">
        <Loader2 className="h-5 w-5 animate-spin text-[#6B7280]" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthFrame>
        <div className="rounded-xl border border-[#24272B] bg-[#111315] p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          <h1 className="font-display text-xl font-semibold tracking-tight text-[#F5F7F8]">
            Sign in to Synkron
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#9BA3AE]">
            Use your GitHub account to connect repositories and review every documentation update
            the agent makes.
          </p>
          <button
            onClick={signIn}
            disabled={busy}
            className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#F5F7F8] text-sm font-semibold text-[#111315] transition hover:bg-white disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
            {busy ? "Waiting for GitHub…" : "Continue with GitHub"}
          </button>
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}
          <p className="mt-6 flex items-start gap-2 border-t border-[#24272B] pt-5 text-xs leading-relaxed text-[#6B7280]">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-400/80" />
            Signing in only identifies you. Repository access is granted separately, per repository,
            when you install the GitHub App.
          </p>
        </div>
        <Link
          to="/"
          className="mx-auto mt-6 flex w-fit items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#9BA3AE]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to synkron.dev
        </Link>
      </AuthFrame>
    );
  }

  return <>{children}</>;
}
