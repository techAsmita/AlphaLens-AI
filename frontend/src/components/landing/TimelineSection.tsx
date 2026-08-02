import { motion } from "framer-motion";
import { Radar, Rocket } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

/**
 * "Timeline" section of the landing page: a two-stage product roadmap
 * (what AlphaLens does today vs. where it's headed next).
 */
export function TimelineSection() {
  return (
    <Section id="timeline" data-nav-section="timeline" className="scroll-mt-8 lg:pl-72">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-mono-tight text-xs tracking-widest text-primary">
            05 · TIMELINE
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            The signal was always inside the noise.
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted">
            AlphaLens just learned to hear it — and this is only the first
            step.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card accent="primary" className="h-full">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Radar size={16} />
              </span>
              <div className="mt-4 font-mono-tight text-xs tracking-widest text-primary">
                NOW
              </div>
              <h3 className="mt-1 text-lg font-semibold text-text">
                Signal Detection
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Earnings calls, SEC filings, and financial news — ingested,
                scored, and explained.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <Card className="h-full">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-muted">
                <Rocket size={16} />
              </span>
              <div className="mt-4 font-mono-tight text-xs tracking-widest text-muted">
                FUTURE
              </div>
              <h3 className="mt-1 text-lg font-semibold text-text">
                Institutional Intelligence Layer
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Signal detection, brokerage integrations, and financial
                research tools in one workspace.
              </p>
            </Card>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
