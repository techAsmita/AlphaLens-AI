import { LeftNav } from "@/components/layout/LeftNav";
import { SystemPanel } from "@/components/layout/SystemPanel";
import { Ticker } from "@/components/layout/Ticker";
import { Home } from "@/pages/Home";
import { AnalysisSection } from "@/components/landing/AnalysisSection";
import { IntelligenceSection } from "@/components/landing/IntelligenceSection";
import { EvidenceSection } from "@/components/landing/EvidenceSection";
import { TimelineSection } from "@/components/landing/TimelineSection";
import { TeamSection } from "@/components/landing/TeamSection";

/**
 * The "/" route: the section index nav, the floating system panel (hero
 * only), the full scrollable narrative (Signal → Analysis → Intelligence
 * → Evidence → Timeline → Team), and the bottom ticker. GridBackground
 * and CursorGlow stay mounted one level up in App so they persist across
 * route changes.
 */
export function Landing() {
  return (
    <>
      <LeftNav />
      <SystemPanel />
      <main className="pb-11">
        <Home />
        <AnalysisSection />
        <IntelligenceSection />
        <EvidenceSection />
        <TimelineSection />
        <TeamSection />
      </main>
      <Ticker />
    </>
  );
}
