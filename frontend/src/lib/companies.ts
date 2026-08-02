export interface Company {
  ticker: string;
  name: string;
  sector: string;
  lastUpdated: string;
}

export const COMPANIES: Company[] = [
  { ticker: "INFY", name: "Infosys", sector: "IT Services", lastUpdated: "2m ago" },
  { ticker: "TCS", name: "Tata Consultancy Services", sector: "IT Services", lastUpdated: "5m ago" },
  { ticker: "RELIANCE", name: "Reliance Industries", sector: "Conglomerate", lastUpdated: "8m ago" },
  { ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", lastUpdated: "12m ago" },
  { ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", lastUpdated: "15m ago" },
  { ticker: "NVDA", name: "NVIDIA", sector: "Semiconductors", lastUpdated: "1m ago" },
  { ticker: "AAPL", name: "Apple", sector: "Consumer Technology", lastUpdated: "3m ago" },
  { ticker: "MSFT", name: "Microsoft", sector: "Enterprise Software", lastUpdated: "6m ago" },
];
