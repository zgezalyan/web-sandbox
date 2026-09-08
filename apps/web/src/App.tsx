import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth";
import { Shell } from "./layout";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { DashboardPage } from "./pages/Dashboard";
import { SavedPage } from "./pages/Saved";
import { HttpTool } from "./pages/tools/HttpTool";
import { JsonTool } from "./pages/tools/JsonTool";
import { EncodeTool } from "./pages/tools/EncodeTool";
import { JwtTool } from "./pages/tools/JwtTool";
import { RegexTool } from "./pages/tools/RegexTool";
import { HashTool } from "./pages/tools/HashTool";
import { GenerateTool } from "./pages/tools/GenerateTool";
import { TimeTool } from "./pages/tools/TimeTool";
import { ColorTool } from "./pages/tools/ColorTool";
import { PlaygroundTool } from "./pages/tools/PlaygroundTool";

function Guard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="boot">Loading bench…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function Guest({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="boot">Loading bench…</div>;
  }
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Guest>
            <LoginPage />
          </Guest>
        }
      />
      <Route
        path="/register"
        element={
          <Guest>
            <RegisterPage />
          </Guest>
        }
      />
      <Route
        element={
          <Guard>
            <Shell />
          </Guard>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="tools/http" element={<HttpTool />} />
        <Route path="tools/json" element={<JsonTool />} />
        <Route path="tools/encode" element={<EncodeTool />} />
        <Route path="tools/jwt" element={<JwtTool />} />
        <Route path="tools/regex" element={<RegexTool />} />
        <Route path="tools/hash" element={<HashTool />} />
        <Route path="tools/generate" element={<GenerateTool />} />
        <Route path="tools/time" element={<TimeTool />} />
        <Route path="tools/color" element={<ColorTool />} />
        <Route path="tools/playground" element={<PlaygroundTool />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
