import { useState, useEffect, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { Github } from "lucide-react";
import { getFirebaseAuth, githubProvider } from "@/lib/firebase";

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
      <div className="min-h-screen grid place-items-center bg-[#04040A] text-[#9BA3AE]">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#04040A] px-4">
        <div className="w-full max-w-sm rounded-xl border border-[#24272B] bg-[#111315] p-7 text-center">
          <h1 className="text-lg font-semibold text-[#F5F7F8] mb-1">
            Synkron <span className="text-teal-400">Dashboard</span>
          </h1>
          <p className="text-sm text-[#9BA3AE] mb-6">
            Sign in to connect your repositories and watch the agent keep your
            docs in sync.
          </p>
          <button
            onClick={signIn}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-[#1f1f1f] font-medium px-4 py-2.5 hover:bg-gray-100 transition disabled:opacity-60"
          >
            <Github className="w-5 h-5" />
            {busy ? "Signing in…" : "Continue with GitHub"}
          </button>
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
