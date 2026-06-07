import { useState, useEffect, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase";

/**
 * Gates the dashboard behind Google sign-in. Shows a sign-in screen until the
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
      await signInWithPopup(getFirebaseAuth(), googleProvider);
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
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
            </svg>
            {busy ? "Signing in…" : "Continue with Google"}
          </button>
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
