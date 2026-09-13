export const TOOL_IDS = [
  "http",
  "json",
  "encode",
  "jwt",
  "regex",
  "hash",
  "generate",
  "time",
  "color",
  "playground",
  "calc",
] as const;

export type ToolId = (typeof TOOL_IDS)[number];

export type PublicUser = {
  id: number;
  email: string;
  username: string;
  createdAt: string;
};

export type AuthResponse = {
  user: PublicUser;
};

export type SavedItem = {
  id: number;
  tool: ToolId;
  title: string;
  payload: string;
  createdAt: string;
};

export type HealthResponse = {
  ok: true;
  service: string;
  time: string;
};

export type ProxyRequest = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
};

export type ProxyResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  elapsedMs: number;
};

export const TOOL_CATALOG: {
  id: ToolId;
  name: string;
  blurb: string;
}[] = [
  { id: "http", name: "HTTP Client", blurb: "Send requests through a guarded proxy" },
  { id: "json", name: "JSON Lab", blurb: "Validate, format, and minify JSON" },
  { id: "encode", name: "Encode / Decode", blurb: "Base64, URL, and HTML entities" },
  { id: "jwt", name: "JWT Inspector", blurb: "Decode header and payload locally" },
  { id: "regex", name: "Regex Lab", blurb: "Test patterns against sample text" },
  { id: "hash", name: "Hash Lab", blurb: "SHA-256, SHA-384, and SHA-512" },
  { id: "generate", name: "Generators", blurb: "UUIDs and passwords in the browser" },
  { id: "time", name: "Time Lab", blurb: "Unix timestamps and ISO dates" },
  { id: "color", name: "Color Lab", blurb: "Convert hex, RGB, and HSL" },
  { id: "playground", name: "Playground", blurb: "Sandboxed HTML, CSS, and JS" },
  { id: "calc", name: "Calculator", blurb: "Evaluate arithmetic in the browser" },
];
