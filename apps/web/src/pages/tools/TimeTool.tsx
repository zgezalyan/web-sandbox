import { useEffect, useState } from "react";
import { CopyButton, Field, Panel, SaveBar } from "../../components";

export function TimeTool() {
  const [now, setNow] = useState(() => Date.now());
  const [input, setInput] = useState(() => String(Math.floor(Date.now() / 1000)));

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const numeric = Number(input);
  const fromUnix = Number.isFinite(numeric)
    ? new Date(numeric > 1e12 ? numeric : numeric * 1000)
    : new Date(input);
  const valid = !Number.isNaN(fromUnix.getTime());

  return (
    <Panel title="Time Lab" hint="Unix seconds, milliseconds, and ISO 8601.">
      <div className="stat-row">
        <div>
          <small>Now (ms)</small>
          <strong>{now}</strong>
          <CopyButton value={String(now)} />
        </div>
        <div>
          <small>Now (ISO)</small>
          <strong>{new Date(now).toISOString()}</strong>
          <CopyButton value={new Date(now).toISOString()} />
        </div>
      </div>
      <Field label="Unix timestamp or date string">
        <input value={input} onChange={(event) => setInput(event.target.value)} />
      </Field>
      {valid ? (
        <div className="result">
          <p>{fromUnix.toString()}</p>
          <p>UTC {fromUnix.toISOString()}</p>
          <p>Unix {Math.floor(fromUnix.getTime() / 1000)}</p>
        </div>
      ) : (
        <p className="alert">Could not parse that value.</p>
      )}
      <SaveBar tool="time" defaultTitle="Timestamp" payload={input} />
    </Panel>
  );
}
