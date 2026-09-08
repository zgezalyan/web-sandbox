import { useMemo, useState } from "react";
import { CopyButton, Field, Panel, SaveBar } from "../../components";

export function JsonTool() {
  const [input, setInput] = useState('{\n  "hello": "sandbox"\n}');
  const [indent, setIndent] = useState(2);

  const parsed = useMemo(() => {
    try {
      return { ok: true as const, value: JSON.parse(input) };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Invalid JSON" };
    }
  }, [input]);

  const pretty = parsed.ok ? JSON.stringify(parsed.value, null, indent) : "";
  const minified = parsed.ok ? JSON.stringify(parsed.value) : "";

  return (
    <Panel title="JSON Lab" hint="Parse, pretty-print, and minify without leaving the browser.">
      <div className="split">
        <Field label="Input">
          <textarea rows={16} value={input} onChange={(event) => setInput(event.target.value)} />
        </Field>
        <div className="stack">
          <Field label="Indent">
            <input
              type="number"
              min={0}
              max={8}
              value={indent}
              onChange={(event) => setIndent(Number(event.target.value))}
            />
          </Field>
          {parsed.ok ? (
            <>
              <div className="toolbar">
                <span>Valid JSON</span>
                <CopyButton value={pretty} />
              </div>
              <pre>{pretty}</pre>
              <p className="muted">Minified ({minified.length} chars)</p>
              <pre>{minified}</pre>
            </>
          ) : (
            <p className="alert">{parsed.error}</p>
          )}
        </div>
      </div>
      <SaveBar tool="json" defaultTitle="JSON snippet" payload={input} />
    </Panel>
  );
}
