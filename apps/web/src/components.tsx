import { useState, type FormEvent, type ReactNode } from "react";
import type { ToolId } from "@web-sandbox/shared";
import { api } from "./api";

export function Panel({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="panel">
      <header className="panel-head">
        <h1>{title}</h1>
        {hint ? <p>{hint}</p> : null}
      </header>
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function SaveBar({ tool, payload, defaultTitle }: { tool: ToolId; payload: string; defaultTitle: string }) {
  const [title, setTitle] = useState(defaultTitle);
  const [status, setStatus] = useState<string | null>(null);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setStatus(null);
    try {
      await api.saveItem({ tool, title, payload });
      setStatus("Saved to your bench.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save");
    }
  }

  return (
    <form className="save-bar" onSubmit={(event) => void onSave(event)}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} />
      <button type="submit">Save snippet</button>
      {status ? <small>{status}</small> : null}
    </form>
  );
}

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="ghost"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
