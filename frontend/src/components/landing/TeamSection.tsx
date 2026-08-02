import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

const TEAM = [
  {
    name: "Asmita Roy",
    role: "Team Lead",
    focus: "AI Systems · Agentic Workflows · Full-Stack Development",
  },
  {
    name: "Akshita",
    role: "Research",
    focus: "Data Analysis · Research · Solution Design",
  },
  {
    name: "Anushka Gupta",
    role: "Product & UX",
    focus: "UI/UX Design · Product Development · Presentation",
  },
];

/**
 * "Team" section of the landing page: the people behind AlphaLens AI.
 */
export function TeamSection() {
  return (
    <Section id="team" data-nav-section="team" className="scroll-mt-8 lg:pl-72">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-mono-tight text-xs tracking-widest text-primary">
            06 · TEAM
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Why this team.
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted">
            Team Insight Engines — combining AI, research, and product
            thinking to build investor intelligence.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TEAM.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
            >
              <Card className="h-full">
                <div className="text-base font-semibold text-text">{member.name}</div>
                <div className="mt-1 font-mono-tight text-[11px] tracking-widest text-primary">
                  {member.role.toUpperCase()}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{member.focus}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
