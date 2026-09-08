import { useEffect, useState } from "react";
import { CopyButton, Field, Panel, SaveBar } from "../../components";

const ALGOS = ["SHA-256", "SHA-384", "SHA-512"] as const;

async function digest(algo: (typeof ALGOS)[number], value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest(algo, bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function HashTool() {
  const [input, setInput] = useState("web-sandbox");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    void Promise.all(ALGOS.map(async (algo) => [algo, await digest(algo, input)] as const)).then((pairs) => {
      if (!cancelled) setHashes(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <Panel title="Hash Lab" hint="Web Crypto hashes, computed in the browser.">
      <Field label="Input">
        <textarea rows={6} value={input} onChange={(event) => setInput(event.target.value)} />
      </Field>
      {ALGOS.map((algo) => (
        <div key={algo} className="hash-row">
          <strong>{algo}</strong>
          <code>{hashes[algo] ?? "…"}</code>
          <CopyButton value={hashes[algo] ?? ""} />
        </div>
      ))}
      <SaveBar tool="hash" defaultTitle="Hash input" payload={input} />
    </Panel>
  );
}
