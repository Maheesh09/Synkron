import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { GitPullRequest, FileCode2, FileText, Bot } from "lucide-react";
import { Section, SectionHeader } from "./Section";
import { reveal } from "@/lib/motion";

type Line = { type: "ctx" | "del" | "add"; text: string };

const codeDiff: Line[] = [
  { type: "ctx", text: "class AuthMiddleware:" },
  { type: "ctx", text: "    def __init__(self, secret: str):" },
  { type: "ctx", text: "        self.secret = secret" },
  { type: "del", text: "        self.token_ttl = timedelta(hours=24)" },
  { type: "add", text: "        self.token_ttl = timedelta(minutes=15)" },
  { type: "add", text: "        self.refresh_ttl = timedelta(days=7)" },
  { type: "ctx", text: "" },
  { type: "ctx", text: "    def verify(self, token: str) -> dict:" },
  { type: "del", text: "        return jwt.decode(token, self.secret)" },
  { type: "add", text: "        payload = jwt.decode(token, self.secret)" },
  { type: "add", text: "        self._check_expiry(payload)" },
  { type: "add", text: "        return payload" },
];

const docDiff: Line[] = [
  { type: "ctx", text: "## Token lifetimes" },
  { type: "ctx", text: "" },
  { type: "del", text: "Access tokens are valid for 24 hours." },
  { type: "add", text: "Access tokens are valid for 15 minutes." },
  { type: "add", text: "A refresh token, valid for 7 days, is issued" },
  { type: "add", text: "at login. Use it to request a new access token." },
  { type: "ctx", text: "" },
  { type: "ctx", text: "## Verifying a token" },
  { type: "ctx", text: "" },
  { type: "add", text: "Expired tokens are rejected before the payload" },
  { type: "add", text: "is returned to your handler." },
];

function Diff({ lines, start, play }: { lines: Line[]; start: number; play: boolean }) {
  const reduce = useReducedMotion();
  return (
    <pre className="overflow-x-auto py-2 font-mono text-[11.5px] leading-6 sm:text-xs">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0 }}
          animate={play ? { opacity: 1 } : undefined}
          transition={{ duration: 0.25, delay: 0.15 + i * 0.04 }}
          className={[
            "flex min-w-max pr-4",
            l.type === "del" && "bg-red-500/[0.08] text-red-200/80",
            l.type === "add" && "bg-teal-400/[0.08] text-teal-100/90",
            l.type === "ctx" && "text-slate-500",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="w-10 shrink-0 select-none pr-3 text-right tabular-nums text-slate-700">
            {start + i}
          </span>
          <span
            className={`w-4 shrink-0 select-none ${
              l.type === "del" ? "text-red-400/70" : l.type === "add" ? "text-teal-400/80" : ""
            }`}
          >
            {l.type === "del" ? "-" : l.type === "add" ? "+" : " "}
          </span>
          <span>{l.text || " "}</span>
        </motion.div>
      ))}
    </pre>
  );
}

function FileHeader({
  icon: Icon,
  path,
  stat,
  tag,
}: {
  icon: typeof FileText;
  path: string;
  stat: string;
  tag: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
      <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-slate-300">
        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        <span className="truncate">{path}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="hidden font-mono text-[11px] text-slate-500 sm:inline">{stat}</span>
        <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
          {tag}
        </span>
      </span>
    </div>
  );
}

export function LiveMockup() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <Section id="example" className="border-t border-white/[0.06] py-20 sm:py-28">
      <SectionHeader
        index="03"
        label="Real output"
        title="A pull request your reviewers already understand."
        description="Left: the commit you pushed. Right: the documentation change Synkron proposed for it. No new tool, no dashboard to check, just a diff."
      />

      <motion.div
        {...reveal}
        ref={ref}
        className="mt-12 overflow-hidden rounded-xl border border-white/[0.08] bg-[#08080F]"
      >
        {/* PR header */}
        <div className="border-b border-white/[0.07] px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              docs: update token lifetimes in auth.md{" "}
              <span className="font-normal text-slate-500">#128</span>
            </h3>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/15 px-2.5 py-1 text-xs font-medium text-teal-300">
              <GitPullRequest className="h-3.5 w-3.5" />
              Open
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400/15">
                <Bot className="h-3 w-3 text-teal-300" />
              </span>
              <span className="font-medium text-slate-200">synkron-docs[bot]</span>
            </span>
            <span>
              wants to merge 1 commit from{" "}
              <code className="rounded bg-indigo-400/10 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                synkron/docs-a3f9c21e
              </code>
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="min-w-0 border-b border-white/[0.07] lg:border-b-0 lg:border-r">
            <FileHeader icon={FileCode2} path="auth/middleware.py" stat="+5 −2" tag="your commit" />
            <Diff lines={codeDiff} start={12} play={inView} />
          </div>
          <div className="min-w-0">
            <FileHeader icon={FileText} path="docs/auth.md" stat="+5 −1" tag="synkron" />
            <Diff lines={docDiff} start={41} play={inView} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-white/[0.015] px-5 py-3 sm:px-6">
          <p className="font-mono text-[11px] text-slate-500">
            2 sections changed · 0 files rewritten · README.md checked, still accurate
          </p>
          <div className="flex gap-2">
            <span className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-400">
              Request changes
            </span>
            <span className="rounded-md bg-teal-400 px-3 py-1.5 text-xs font-semibold text-[#04040A]">
              Approve
            </span>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
