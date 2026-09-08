import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type SavedItem } from "../api";
import { Panel } from "../components";

export function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const data = await api.items();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load items");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <Panel title="Saved snippets" hint="Anything you pin from a tool lands here, scoped to your account.">
      {error ? <p className="alert">{error}</p> : null}
      {items.length === 0 ? <p className="empty">No saved work yet.</p> : null}
      <ul className="saved-list">
        {items.map((item) => (
          <li key={item.id}>
            <div>
              <Link to={`/tools/${item.tool}`}>{item.title}</Link>
              <small>
                {item.tool} · {item.createdAt}
              </small>
              <pre>{item.payload}</pre>
            </div>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                void api.deleteItem(item.id).then(refresh);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
