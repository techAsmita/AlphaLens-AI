import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Mic,
  FileText,
  Newspaper,
  BrainCircuit,
  Radar,
  ShieldCheck,
  Gauge,
  FileBarChart2,
  CircleCheckBig,
} from "lucide-react";

export interface ProcessStepDefinition {
  id: number;
  label: string;
  icon: LucideIcon;
}

/**
 * The fixed 10-step cinematic sequence shown on the Analysis Process page.
 * Order and copy match the Step 4 brief exactly.
 */
export const PROCESS_STEPS: ProcessStepDefinition[] = [
  { id: 1, label: "Initializing AlphaLens...", icon: Sparkles },
  { id: 2, label: "Loading earnings call transcript...", icon: Mic },
  { id: 3, label: "Reading SEC filings...", icon: FileText },
  { id: 4, label: "Collecting financial news...", icon: Newspaper },
  { id: 5, label: "Running NLP engine...", icon: BrainCircuit },
  { id: 6, label: "Detecting hidden signals...", icon: Radar },
  { id: 7, label: "Cross-validating evidence...", icon: ShieldCheck },
  { id: 8, label: "Computing confidence score...", icon: Gauge },
  { id: 9, label: "Generating intelligence report...", icon: FileBarChart2 },
  { id: 10, label: "Analysis Complete.", icon: CircleCheckBig },
];
