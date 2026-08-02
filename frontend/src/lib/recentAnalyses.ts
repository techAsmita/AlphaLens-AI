export interface RecentAnalysis {
  ticker: string;
  status: "Completed" | "Today";
  time?: string;
  confidence: number;
}

export const RECENT_ANALYSES: RecentAnalysis[] = [
  { ticker: "INFY", status: "Completed", time: "2 min ago", confidence: 98 },
  { ticker: "TCS", status: "Completed", time: "10 min ago", confidence: 95 },
  { ticker: "NVDA", status: "Today", confidence: 99 },
];
