import { useMemo, useState } from "react";
import { Field, Panel, SaveBar } from "../../components";

const starterHtml = `<main>
  <h1>Sandbox</h1>
  <p>Edit HTML, CSS, and JS. The preview runs in a sandboxed iframe.</p>
  <button id="ping">Ping</button>
</main>`;

const starterCss = `body {
  font-family: Georgia, serif;
  background: #1b1410;
  color: #f3e6d8;
  padding: 2rem;
}
button {
  background: #c45c26;
  color: white;
  border: 0;
  padding: 0.5rem 0.9rem;
}`;

const starterJs = `document.getElementById("ping")?.addEventListener("click", () => {
  document.querySelector("p").textContent = "Hello from the playground.";
});`;

export function PlaygroundTool() {
  const [html, setHtml] = useState(starterHtml);
  const [css, setCss] = useState(starterCss);
  const [js, setJs] = useState(starterJs);

  const srcdoc = useMemo(
    () => `<!doctype html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`,
    [html, css, js],
  );

  return (
    <Panel title="Playground" hint="Sandboxed iframe with scripts disabled from talking to the parent page.">
      <div className="playground">
        <div className="stack">
          <Field label="HTML">
            <textarea rows={8} value={html} onChange={(event) => setHtml(event.target.value)} />
          </Field>
          <Field label="CSS">
            <textarea rows={8} value={css} onChange={(event) => setCss(event.target.value)} />
          </Field>
          <Field label="JavaScript">
            <textarea rows={8} value={js} onChange={(event) => setJs(event.target.value)} />
          </Field>
        </div>
        <iframe title="playground preview" sandbox="allow-scripts" srcDoc={srcdoc} />
      </div>
      <SaveBar tool="playground" defaultTitle="Playground" payload={JSON.stringify({ html, css, js })} />
    </Panel>
  );
}
