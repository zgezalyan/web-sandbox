import { Link } from "react-router-dom";
import { TOOL_CATALOG } from "@web-sandbox/shared";
import { useAuth } from "../auth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="dash">
      <header className="hero">
        <p className="eyebrow">Signed in as {user?.username}</p>
        <h1>A bench for web tools</h1>
        <p>
          Pick a station. Client-side labs stay in the browser. The HTTP client goes through the Express
          proxy so you can reach public APIs without CORS friction.
        </p>
      </header>
      <div className="tool-grid">
        {TOOL_CATALOG.map((tool) => (
          <Link key={tool.id} className="tool-card" to={`/tools/${tool.id}`}>
            <span className="tool-id">{tool.id}</span>
            <strong>{tool.name}</strong>
            <p>{tool.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
