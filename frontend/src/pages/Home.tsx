import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Radar } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Landing page hero. Content and copy per the Step 2 brief; layout leaves
 * room on desktop for the fixed LeftNav (left) and floating SystemPanel
 * (right), both rendered at the App level. Left padding is sized to
 * clear the LeftNav's fixed footprint (32px offset + 176px width) with
 * a comfortable safety margin, so hero text never sits underneath it.
 */
export function Home() {
  const navigate = useNavigate();

  const scrollToPrototype = () => {
    document.getElementById("intelligence")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section
      id="signal"
      data-nav-section="signal"
      className="flex min-h-screen scroll-mt-8 items-center pt-16 lg:pl-72 xl:pr-[340px]"
      noPadding
    >
      <Container className="flex flex-col items-start text-left">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5"
        >
          <Radar size={13} className="text-primary" />
          <span className="font-mono-tight text-[11px] tracking-widest text-primary">
            STOXRAHACK 2026 · FINTECH TRACK
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl"
        >
          Markets don&apos;t move on headlines.
          <br />
          They move on <span className="text-primary">hidden signals</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          AlphaLens AI analyzes earnings calls, SEC filings, and financial
          news, and detects market-moving intelligence before it becomes
          obvious.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.34 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button
            variant="primary"
            icon={<ArrowRight size={16} />}
            onClick={() => navigate("/analysis")}
          >
            Start Analysis
          </Button>
          <Button variant="secondary" onClick={scrollToPrototype}>
            View Prototype
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
