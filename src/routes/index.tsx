import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LenisProvider } from "@/components/synkron/LenisProvider";
import { Navbar } from "@/components/synkron/Navbar";
import { Hero } from "@/components/synkron/Hero";
import { Metrics } from "@/components/synkron/Metrics";
import { HowItWorks } from "@/components/synkron/HowItWorks";
import { AgentPipeline } from "@/components/synkron/AgentPipeline";
import { LiveMockup } from "@/components/synkron/LiveMockup";
import { DashboardPreview } from "@/components/synkron/DashboardPreview";
import { Features } from "@/components/synkron/Features";
import { Security } from "@/components/synkron/Security";
import { FAQ } from "@/components/synkron/FAQ";
import { FinalCTA } from "@/components/synkron/FinalCTA";
import { Footer } from "@/components/synkron/Footer";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <LenisProvider>
      <div className="noise min-h-screen bg-[#04040A] text-[#F1F5F9]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-teal-400 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#04040A]"
        >
          Skip to content
        </a>
        <Navbar scrolled={scrolled} />
        <main id="main">
          <Hero />
          <Metrics />
          <HowItWorks />
          <AgentPipeline />
          <LiveMockup />
          <DashboardPreview />
          <Features />
          <Security />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
