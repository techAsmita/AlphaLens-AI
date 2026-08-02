import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Company } from "@/lib/companies";
import { getCompanyReport, type CompanyReport } from "@/services/intelligence";

interface CompanyContextValue {
  /** The company currently being analyzed, or null if none has been selected yet. */
  selectedCompany: Company | null;
  /** The resolved intelligence report for selectedCompany, or null while loading / before selection / after a failure. */
  report: CompanyReport | null;
  /** True while a report is being fetched for the most recently selected company. */
  isLoading: boolean;
  /** Error message from the most recent failed fetch, or null if the last attempt succeeded (or none has run yet). */
  error: string | null;
  /** Selects a company and kicks off fetching its report through the intelligence service. */
  selectCompany: (company: Company) => void;
  /** Re-fetches the report for the currently selected company (a no-op if none is selected). */
  retry: () => void;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

/**
 * App-wide source of truth for "which company is currently being
 * analyzed" and its resolved report. Wraps the whole app (see App.tsx)
 * so the selection survives navigating between the Analysis Workspace,
 * the cinematic processing page, and the Dashboard — no need to thread
 * it through router state.
 *
 * All data loading goes through the intelligence service
 * (src/services/intelligence.ts), which calls the real backend. This
 * context is where loading and failure states live — components read
 * isLoading/error and render accordingly (skeleton / error panel /
 * real content) rather than each managing their own request state.
 */
export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [report, setReport] = useState<CompanyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequestId = useRef(0);

  const selectCompany = useCallback((company: Company) => {
    const requestId = ++latestRequestId.current;

    setSelectedCompany(company);
    setReport(null);
    setError(null);
    setIsLoading(true);

    getCompanyReport(company)
      .then((result) => {
        // Ignore responses from a superseded request (e.g. the user
        // selected another company before this one finished loading).
        if (latestRequestId.current !== requestId) return;
        setReport(result);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (latestRequestId.current !== requestId) return;
        setError(err instanceof Error ? err.message : "Failed to load report.");
        setIsLoading(false);
      });
  }, []);

  const retry = useCallback(() => {
    setSelectedCompany((current) => {
      if (current) selectCompany(current);
      return current;
    });
  }, [selectCompany]);

  const value = useMemo<CompanyContextValue>(
    () => ({ selectedCompany, report, isLoading, error, selectCompany, retry }),
    [selectedCompany, report, isLoading, error, selectCompany, retry]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

/** Access the current company selection, its report, loading/error state, and the selectCompany/retry actions. */
export function useCompany(): CompanyContextValue {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
