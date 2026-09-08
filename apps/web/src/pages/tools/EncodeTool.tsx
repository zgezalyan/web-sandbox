import { useMemo, useState } from "react";
import { CopyButton, Field, Panel, SaveBar } from "../../components";

type Mode = "base64" | "url" | "html";

function encode(mode: Mode, value: string): string {
  if (mode === "base64") return btoa(unescape(encodeURIComponent(value)));
  if (mode === "url") return encodeURIComponent(value);
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function decode(mode: Mode, value: string): string {
  if (mode === "base64") return decodeURIComponent(escape(atob(value)));
  if (mode === "url") return decodeURIComponent(value);
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

export function EncodeTool() {
  const [mode, setMode] = useState<Mode>("base64");
  const [input, setInput] = useState("hello, sandbox");
  const [error, setError] = useState<string | null>(null);

  const encoded = useMemo(() => {
    try {
      return { value: encode(mode, input), error: null };
    } catch (err) {
      return { value: "", error: err instanceof Error ? err.message : "Encode failed" };
    }
  }, [mode, input]);

  return (
    <Panel title="Encode / Decode" hint="Base64, URL, and HTML entity transforms run locally.">
      <div className="row">
        {(["base64", "url", "html"] as const).map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : "ghost"} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </div>
      <Field label="Input">
        <textarea rows={8} value={input} onChange={(event) => setInput(event.target.value)} />
      </Field>
      {error || encoded.error ? <p className="alert">{error ?? encoded.error}</p> : null}
      <div className="toolbar">
        <span>Output</span>
        <CopyButton value={encoded.value} />
        <button
          type="button"
          className="ghost"
          onClick={() => {
            try {
              setInput(decode(mode, input));
              setError(null);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Decode failed");
            }
          }}
        >
          Decode in place
        </button>
      </div>
      <pre>{encoded.value}</pre>
      <SaveBar tool="encode" defaultTitle={`${mode} snippet`} payload={JSON.stringify({ mode, input, encoded: encoded.value })} />
    </Panel>
  );
}
