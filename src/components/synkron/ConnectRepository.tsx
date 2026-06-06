import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { connectRepo, type ConnectedRepo } from "@/lib/api";
import {
  Loader2,
  Clipboard,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  GitMerge,
  ArrowRight,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────

const card =
  "rounded-2xl border border-[#24272B] bg-[#111315] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const schema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .regex(
      /^https:\/\/gitlab\.com\/.+\/.+/,
      'Must be a full GitLab project URL — e.g. https://gitlab.com/your-group/your-project'
    ),
});
type FormValues = z.infer<typeof schema>;

// ─── CopyPill ─────────────────────────────────────────────────────────────────

function CopyPill({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-[#9BA3AE] text-xs font-mono shrink-0">{label}</span>
      <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border border-[#24272B] bg-[#0A0C0E] px-3 py-2">
        <span className="flex-1 font-mono text-xs text-[#F5F7F8] truncate">{value}</span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 text-[#9BA3AE] hover:text-teal-400 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Clipboard className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 1 — URL form ───────────────────────────────────────────────────────

function StepVerify({ onVerified, }:
  {
    onVerified: () => void;
  }) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit({ url }: FormValues) {
    setApiError(null);
    try {
      await connectRepo(url.trim());  // ← don't need the return value anymore
      onVerified();
    } catch (e: any) {
      setApiError(e.message ?? "Failed to connect — check the URL and try again.");
    }
  }

  return (
    <div className={card}>
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mb-5">
        <GitMerge className="w-5 h-5 text-teal-400" strokeWidth={1.75} />
      </div>

      <h2 className="text-[#F5F7F8] font-display font-semibold text-xl leading-snug">
        Connect your GitLab repository
      </h2>
      <p className="text-[#9BA3AE] text-sm leading-relaxed mt-2">
        Paste your project URL. Synkron will verify access and give you the
        exact webhook settings to configure in GitLab.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <div className="space-y-1.5">
          <Input
            {...register("url")}
            placeholder="https://gitlab.com/your-group/your-project"
            className={[
              "h-10 bg-[#0A0C0E] border-[#24272B] text-[#F5F7F8] placeholder:text-[#4B5563]",
              "focus-visible:ring-teal-400/40 focus-visible:border-teal-400/40 font-mono text-sm",
              errors.url ? "border-red-500/60 focus-visible:ring-red-500/30" : "",
            ].join(" ")}
            disabled={isSubmitting}
          />
          {errors.url && (
            <p className="flex items-center gap-1.5 text-red-400 text-xs font-mono">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.url.message}
            </p>
          )}
          {apiError && (
            <p className="flex items-center gap-1.5 text-red-400 text-xs font-mono">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {apiError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 bg-teal-400 hover:brightness-110 text-[#03242a] font-semibold text-sm rounded-lg transition"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Verify access
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}



// ─── Step 3 — Success ────────────────────────────────────────────────────────

function StepSuccess({ onConnected }: { onConnected: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`${card} flex flex-col items-center text-center`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </motion.div>

      <h2 className="text-[#F5F7F8] font-display font-semibold text-xl">
        You're synced.
      </h2>
      <p className="text-[#9BA3AE] text-sm mt-2 max-w-xs leading-relaxed">
        Webhook configured automatically. Push a commit to trigger
        your first doc MR — Synkron will watch every push from here.
      </p>

      <Button
        onClick={onConnected}
        className="mt-8 h-10 px-6 bg-teal-400 hover:brightness-110 text-[#03242a] font-semibold text-sm rounded-lg transition"
      >
        View dashboard
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {([1, 2] as const).map((n) => (
        <div
          key={n}
          className={[
            "h-1.5 rounded-full transition-all duration-300",
            n === step
              ? "w-6 bg-teal-400"
              : n < step
                ? "w-3 bg-emerald-400"
                : "w-3 bg-[#24272B]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────

export function ConnectRepository({
  onConnected,
  onCancel,
}: {
  onConnected: () => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);   // ← back to 1 | 2

  return (
    <div className="min-h-screen bg-[#04040A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-teal-400 font-display font-semibold text-sm">Synkron</span>
          <span className="text-[#24272B]">·</span>
          <span className="text-[#9BA3AE] text-xs font-mono">Connect repository</span>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-[#9BA3AE] text-xs font-mono flex items-center gap-1 hover:text-teal-400 transition-colors mb-4"
          >
            ← Back to dashboard
          </button>
        )}

        <StepDots step={step} />

        {step === 1 && (
          <StepVerify
            onVerified={() => setStep(2)}   // ← no longer passes data, just advances
          />
        )}

        {step === 2 && (
          <StepSuccess onConnected={onConnected} />
        )}
      </div>
    </div>
  );
}
