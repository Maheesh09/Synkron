const row1 = ["FastAPI", "Python", "Go", "GitLab", "Gemini 2.0", "Google Cloud", "MongoDB"];
const row2 = ["React", "TypeScript", "Docker", "Kubernetes", "GitHub Actions", "PostgreSQL", "Redis"];

const colors = ["#2DD4BF", "#818CF8", "#5eead4", "#a78bfa", "#34d399", "#f472b6", "#fbbf24"];

function Pill({ label, i }: { label: string; i: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-400 text-sm font-mono whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors[i % colors.length] }} />
      {label}
    </div>
  );
}

function Row({ items, dir }: { items: string[]; dir: "left" | "right" }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className={`marquee-track ${dir === "left" ? "marquee-left" : "marquee-right"} gap-3`}>
        {doubled.map((t, i) => <Pill key={`${t}-${i}`} label={t} i={i} />)}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section className="bg-[#04040A] py-6 relative edge-fade-x">
      <div className="flex flex-col gap-3">
        <Row items={row1} dir="left" />
        <Row items={row2} dir="right" />
      </div>
    </section>
  );
}
