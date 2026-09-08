import type { AuthResponse, ProxyRequest, ProxyResponse, PublicUser, SavedItem } from "@web-sandbox/shared";

const API = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  health: () => request<{ ok: boolean }>("/api/health"),
  me: () => request<AuthResponse>("/api/auth/me"),
  register: (body: { email: string; username: string; password: string }) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  items: () => request<{ items: SavedItem[] }>("/api/items"),
  saveItem: (body: { tool: SavedItem["tool"]; title: string; payload: string }) =>
    request<{ item: SavedItem }>("/api/items", { method: "POST", body: JSON.stringify(body) }),
  deleteItem: (id: number) => request<{ ok: true }>(`/api/items/${id}`, { method: "DELETE" }),
  proxy: (body: ProxyRequest) =>
    request<ProxyResponse>("/api/proxy", { method: "POST", body: JSON.stringify(body) }),
};

export type { PublicUser, SavedItem };
