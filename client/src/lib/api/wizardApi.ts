const API_BASE = import.meta.env.VITE_WIZARD_API ?? "http://localhost:3000";

export type Entity = {
  id: string;
  basic?: any;
  contact?: any;
  prefs?: any;
  [k: string]: any;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const createEntity = (payload: object) =>
  api<Entity>("/entities", { method: "POST", body: JSON.stringify(payload) });

export const getEntity = (id: string) => api<Entity>(`/entities/${id}`);

export const patchEntity = (id: string, payload: object) =>
  api<Entity>(`/entities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
