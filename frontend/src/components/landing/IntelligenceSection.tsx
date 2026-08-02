import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SignalCard } from "@/components/dashboard/SignalCard";
import { SIGNALS } from "@/lib/signals";

/**
 * "Intelligence" section of the landing page: a preview of the real
 * Intelligence Dashboard, built from the exact SignalCard component the
 * dashboard itself uses. This is also where the hero's "View Prototype"
 * button scrolls to.
 */
export function IntelligenceSection() {
  const navigate = useNavigate();

  return (
    <Section id="intelligence" data-nav-section="intelligence" className="scroll-mt-8 lg:pl-72">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-mono-tight text-xs tracking-widest text-primary">
            03 · INTELLIGENCE
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            A live look at the Intelligence Dashboard.
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted">
            Every signal is prioritized, explained, and traceable back to
            the exact line it came from — nothing is a black box.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {SIGNALS.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              isSelected={signal.id === SIGNALS[0].id}
              onSelect={() => undefined}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
          className="mt-10"
        >
          <Button
            variant="primary"
            icon={<ArrowRight size={16} />}
            onClick={() => navigate("/analysis")}
          >
            Try It On a Real Company
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
