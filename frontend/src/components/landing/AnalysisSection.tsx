import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Database, BrainCircuit, ListFilter, Eye, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    icon: Database,
    title: "Ingest",
    description: "Pulls in earnings calls, filings, and news as they happen.",
  },
  {
    icon: BrainCircuit,
    title: "Extract",
    description: "Spots tone shifts using NLP and financial language analysis.",
  },
  {
    icon: ListFilter,
    title: "Prioritize",
    description: "Flags what's unusual versus the company's own history.",
  },
  {
    icon: Eye,
    title: "Explain",
    description: "Shows the exact phrase or line behind every signal.",
  },
];

/**
 * "Analysis" section of the landing page: the 4-step engine that turns
 * raw source material into a prioritized, explainable signal set. Ends
 * with a CTA into the real Analysis Workspace.
 */
export function AnalysisSection() {
  const navigate = useNavigate();

  return (
    <Section id="analysis" data-nav-section="analysis" className="scroll-mt-8 lg:pl-72">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-mono-tight text-xs tracking-widest text-primary">
            02 · ANALYSIS
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            From raw noise to actionable intelligence.
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted">
            Every analysis run moves through the same four-stage engine, so
            you always know where a signal came from and why it surfaced.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
              >
                <Card className="h-full">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Icon size={16} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-text">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-10"
        >
          <Button
            variant="primary"
            icon={<ArrowRight size={16} />}
            onClick={() => navigate("/analysis")}
          >
            Open Analysis Workspace
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
