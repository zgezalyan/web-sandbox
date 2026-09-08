import { NavLink, Outlet } from "react-router-dom";
import { TOOL_CATALOG } from "@web-sandbox/shared";
import { useAuth } from "./auth";

export function Shell() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="rail">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <strong>Web Sandbox</strong>
            <small>tool bench</small>
          </div>
        </div>
        <nav>
          <NavLink to="/" end>
            Bench
          </NavLink>
          <NavLink to="/saved">Saved</NavLink>
          <p className="nav-label">Tools</p>
          {TOOL_CATALOG.map((tool) => (
            <NavLink key={tool.id} to={`/tools/${tool.id}`}>
              {tool.name}
            </NavLink>
          ))}
        </nav>
        <div className="rail-user">
          <span>{user?.username}</span>
          <button type="button" className="ghost" onClick={() => void logout()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="stage">
        <Outlet />
      </main>
    </div>
  );
}
