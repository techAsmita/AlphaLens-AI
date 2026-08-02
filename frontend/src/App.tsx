import { Routes, Route } from "react-router-dom";
import { GridBackground } from "@/components/layout/GridBackground";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { CompanyProvider } from "@/context/CompanyContext";
import { Landing } from "@/pages/Landing";
import { Analysis } from "@/pages/Analysis";
import { AnalysisProcess } from "@/pages/AnalysisProcess";
import { Dashboard } from "@/pages/Dashboard";

function App() {
  return (
    <CompanyProvider>
      <div className="relative min-h-screen">
        <GridBackground />
        <CursorGlow />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/process" element={<AnalysisProcess />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </CompanyProvider>
  );
}

export default App;
