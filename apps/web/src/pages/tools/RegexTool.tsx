import { useMemo, useState } from "react";
import { Field, Panel, SaveBar } from "../../components";

export function RegexTool() {
  const [pattern, setPattern] = useState("sandbox|bench");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("The sandbox bench is a place to try web tools.");

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...text.matchAll(regex)].map((match) => ({
        value: match[0],
        index: match.index ?? 0,
      }));
      return { ok: true as const, matches };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Invalid regular expression" };
    }
  }, [pattern, flags, text]);

  return (
    <Panel title="Regex Lab" hint="JavaScript regular expressions, highlighted against your sample.">
      <div className="row">
        <Field label="Pattern">
          <input value={pattern} onChange={(event) => setPattern(event.target.value)} />
        </Field>
        <Field label="Flags">
          <input value={flags} onChange={(event) => setFlags(event.target.value)} />
        </Field>
      </div>
      <Field label="Sample">
        <textarea rows={8} value={text} onChange={(event) => setText(event.target.value)} />
      </Field>
      {result.ok ? (
        <>
          <p className="muted">{result.matches.length} match{result.matches.length === 1 ? "" : "es"}</p>
          <pre>
            {highlight(text, result.matches)}
          </pre>
          <ul className="match-list">
            {result.matches.map((match, index) => (
              <li key={`${match.index}-${index}`}>
                {match.value} <small>@ {match.index}</small>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="alert">{result.error}</p>
      )}
      <SaveBar tool="regex" defaultTitle="Regex" payload={JSON.stringify({ pattern, flags, text })} />
    </Panel>
  );
}

function highlight(text: string, matches: { value: string; index: number }[]): string {
  if (matches.length === 0) return text;
  const parts: string[] = [];
  let cursor = 0;
  for (const match of matches) {
    parts.push(text.slice(cursor, match.index));
    parts.push(`⟦${match.value}⟧`);
    cursor = match.index + match.value.length;
  }
  parts.push(text.slice(cursor));
  return parts.join("");
}
