import { useState } from "react";
import { CopyButton, Field, Panel, SaveBar } from "../../components";

function randomPassword(length: number, symbols: boolean): string {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + (symbols ? "!@#$%^&*_-+=?" : "");
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => alphabet[value % alphabet.length]).join("");
}

export function GenerateTool() {
  const [uuids, setUuids] = useState(() => Array.from({ length: 5 }, () => crypto.randomUUID()));
  const [length, setLength] = useState(20);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState(() => randomPassword(20, true));

  return (
    <Panel title="Generators" hint="UUIDs and passwords from the Web Crypto RNG.">
      <div className="toolbar">
        <h2>UUIDs</h2>
        <button type="button" className="ghost" onClick={() => setUuids(Array.from({ length: 5 }, () => crypto.randomUUID()))}>
          Refresh
        </button>
      </div>
      <ul className="plain-list">
        {uuids.map((id) => (
          <li key={id}>
            <code>{id}</code>
            <CopyButton value={id} />
          </li>
        ))}
      </ul>
      <Field label={`Password length (${length})`}>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(event) => {
            const next = Number(event.target.value);
            setLength(next);
            setPassword(randomPassword(next, symbols));
          }}
        />
      </Field>
      <label className="check">
        <input
          type="checkbox"
          checked={symbols}
          onChange={(event) => {
            setSymbols(event.target.checked);
            setPassword(randomPassword(length, event.target.checked));
          }}
        />
        Include symbols
      </label>
      <div className="toolbar">
        <code>{password}</code>
        <CopyButton value={password} />
        <button type="button" className="ghost" onClick={() => setPassword(randomPassword(length, symbols))}>
          New password
        </button>
      </div>
      <SaveBar tool="generate" defaultTitle="Generators" payload={JSON.stringify({ uuids, password })} />
    </Panel>
  );
}
