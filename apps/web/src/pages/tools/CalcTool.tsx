import { useMemo, useState } from "react";
import { Field, Panel, SaveBar } from "../../components";
import { evaluate } from "../../lib/evaluate";

export function CalcTool() {
  const [expr, setExpr] = useState("2 + 3 * 4");
  const result = useMemo(() => evaluate(expr), [expr]);

  return (
    <Panel
      title="Calculator"
      hint="Numbers, + - * /, and parentheses. Evaluated in the browser, not as JavaScript."
    >
      <Field label="Expression">
        <input value={expr} onChange={(event) => setExpr(event.target.value)} />
      </Field>
      {result.ok ? (
        <div className="result">
          <p>{result.value}</p>
        </div>
      ) : (
        <p className="alert">{result.error}</p>
      )}
      {result.ok ? (
        <SaveBar
          tool="calc"
          defaultTitle="Calculation"
          payload={JSON.stringify({ expr, result: result.value })}
        />
      ) : null}
    </Panel>
  );
}
