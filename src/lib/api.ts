export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: 'include', headers: { Accept: 'application/json' } });
  const data = await res.json();
  if (!res.ok || data?.ok === false) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data as T;
}
let csrfCache: string | null = null;
async function getCsrfToken(): Promise<string> {
  if (csrfCache) return csrfCache;
  const data = await apiGet<{ ok: true; csrf_token: string }>('/api/csrf.php');
  csrfCache = data.csrf_token;
  return csrfCache;
}
export async function apiPost<T>(path: string, payload: unknown = {}): Promise<T> {
  const token = await getCsrfToken();
  const res = await fetch(path, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-Token': token }, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  if (res.status === 403 && data?.error?.toLowerCase?.().includes('csrf')) { csrfCache = null; return apiPost<T>(path, payload); }
  if (!res.ok || data?.ok === false) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data as T;
}
