import { useState, type FormEvent } from "react";
import type { ProxyResponse } from "@web-sandbox/shared";
import { api } from "../../api";
import { Field, Panel, SaveBar } from "../../components";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

export function HttpTool() {
  const [method, setMethod] = useState<(typeof METHODS)[number]>("GET");
  const [url, setUrl] = useState("https://httpbin.org/get");
  const [headers, setHeaders] = useState("Accept: application/json");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<ProxyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const parsedHeaders: Record<string, string> = {};
    for (const line of headers.split("\n")) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      parsedHeaders[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
    try {
      const data = await api.proxy({ method, url, headers: parsedHeaders, body });
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Panel title="HTTP Client" hint="Authenticated proxy to public http(s) URLs. Private hosts are blocked.">
      <form className="stack" onSubmit={(event) => void onSubmit(event)}>
        <div className="row">
          <Field label="Method">
            <select value={method} onChange={(event) => setMethod(event.target.value as typeof method)}>
              {METHODS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="URL">
            <input value={url} onChange={(event) => setUrl(event.target.value)} required />
          </Field>
        </div>
        <Field label="Headers (Name: value, one per line)">
          <textarea rows={4} value={headers} onChange={(event) => setHeaders(event.target.value)} />
        </Field>
        <Field label="Body">
          <textarea rows={6} value={body} onChange={(event) => setBody(event.target.value)} />
        </Field>
        <button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send request"}
        </button>
      </form>
      {error ? <p className="alert">{error}</p> : null}
      {result ? (
        <div className="result">
          <p>
            {result.status} {result.statusText} · {result.elapsedMs}ms
          </p>
          <pre>{Object.entries(result.headers)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")}
          </pre>
          <pre>{result.body}</pre>
          <SaveBar
            tool="http"
            defaultTitle={`${method} ${url}`}
            payload={JSON.stringify({ method, url, headers, body, result }, null, 2)}
          />
        </div>
      ) : null}
    </Panel>
  );
}
