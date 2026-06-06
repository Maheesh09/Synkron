import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LenisProvider } from "@/components/synkron/LenisProvider";
import { Navbar } from "@/components/synkron/Navbar";
import { Hero } from "@/components/synkron/Hero";
import { ValueProps } from "@/components/synkron/ValueProps";
import { HowItWorks } from "@/components/synkron/HowItWorks";
import { AgentPipeline } from "@/components/synkron/AgentPipeline";
import { LiveMockup } from "@/components/synkron/LiveMockup";
import { DashboardPreview } from "@/components/synkron/DashboardPreview";
import { BentoFeatures } from "@/components/synkron/BentoFeatures";
import { FinalCTA } from "@/components/synkron/FinalCTA";
import { Footer } from "@/components/synkron/Footer";
import { FAQ } from "@/components/synkron/FAQ";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <LenisProvider>
      <div className="bg-[#04040A] text-[#F1F5F9] min-h-screen noise">
        <Navbar scrolled={scrolled} />
        <main>
          <Hero />
          <ValueProps />
          <HowItWorks />
          <AgentPipeline />
          <LiveMockup />
          <DashboardPreview />
          <BentoFeatures />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
