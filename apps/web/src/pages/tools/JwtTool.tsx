import { useMemo, useState } from "react";
import { Field, Panel, SaveBar } from "../../components";

function decodeSegment(segment: string): unknown {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (segment.length % 4)) % 4);
  return JSON.parse(decodeURIComponent(escape(atob(padded))));
}

export function JwtTool() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwibmFtZSI6IkFkYSIsImlhdCI6MTUxNjIzOTAyMn0.dummy",
  );

  const decoded = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "A JWT needs at least header and payload." };
    try {
      return {
        header: decodeSegment(parts[0]),
        payload: decodeSegment(parts[1]),
        signature: parts[2] ?? "(none)",
      };
    } catch {
      return { error: "Could not decode this token. It is inspected locally and never sent to the API." };
    }
  }, [token]);

  return (
    <Panel title="JWT Inspector" hint="Decode only. Signatures are not verified here.">
      <Field label="Token">
        <textarea rows={6} value={token} onChange={(event) => setToken(event.target.value)} />
      </Field>
      {"error" in decoded ? (
        <p className="alert">{decoded.error}</p>
      ) : (
        <div className="split">
          <div>
            <h2>Header</h2>
            <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>
          <div>
            <h2>Payload</h2>
            <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
          </div>
        </div>
      )}
      <SaveBar tool="jwt" defaultTitle="JWT" payload={token} />
    </Panel>
  );
}
