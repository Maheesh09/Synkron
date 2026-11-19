import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { reveal } from "@/lib/motion";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 px-5 sm:px-8", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/**
 * Section heading with a numbered mono label, e.g. "02 / Pipeline".
 * The index gives the page a document-like structure instead of floating eyebrows.
 */
export function SectionHeader({
  index,
  label,
  title,
  description,
  aside,
  className,
  stacked = false,
}: {
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  className?: string;
  /** Stack title and description instead of the two-column desktop layout. */
  stacked?: boolean;
}) {
  return (
    <motion.div
      {...reveal}
      className={cn(
        "grid grid-cols-1 gap-6 [&>*]:min-w-0",
        !stacked && "lg:grid-cols-12 lg:items-end",
        className,
      )}
    >
      <div className={stacked ? undefined : "lg:col-span-7"}>
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
          <span className="text-teal-400">{index}</span>
          <span className="h-px w-6 bg-white/15" aria-hidden />
          {label}
        </p>
        <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[44px]">
          {title}
        </h2>
      </div>
      {(description || aside) && (
        <div className={stacked ? undefined : "lg:col-span-5"}>
          {description && (
            <p className="text-[15px] leading-relaxed text-slate-400 sm:text-base">{description}</p>
          )}
          {aside}
        </div>
      )}
    </motion.div>
  );
}
