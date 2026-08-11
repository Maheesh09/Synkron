import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "No Complicated Setup",
    description: "Connect your GitHub repository in seconds. Synkron runs in the background and gets to work immediately.",
  },
  {
    icon: ShieldCheck,
    title: "Always Accurate and Current",
    description: "Documentation updates happen in the same pull request as the code. They cannot fall out of sync with reality.",
  },
  {
    icon: Clock,
    title: "Free Up Your Team's Time",
    description: "Developers spend hours on documentation every week. Synkron reclaims that time so your team can build better features.",
  },
];

export function ValueProps() {
  return (
    <section className="relative py-12 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-6 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mb-5 sm:mb-6">
                <feature.icon className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
