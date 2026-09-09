const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000/api';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export { API_URL };