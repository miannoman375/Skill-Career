const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000/api';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ============ ADMIN SESSION (localStorage) ============
// Token yahan localStorage mein set/get hota hai, taake page refresh ke
// baad bhi admin logged-in rahe aur baar-baar password na mangwana pade.
const TOKEN_KEY = 'adminToken';
const EMAIL_KEY = 'adminEmail';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

export function storeSession(token: string, email: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
}

export function clearStoredSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function getAuthHeader(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function verifyAdminToken(): Promise<'valid' | 'invalid' | 'network'> {
  const token = getStoredToken();
  if (!token) return 'invalid';
  try {
    const res = await fetch(`${API_URL}/admin/verify`, {
      headers: getAuthHeader(),
    });
    if (res.ok) return 'valid';
    if (res.status === 401) return 'invalid';
    return 'network';
  } catch {
    return 'network';
  }
}

// ============ UPLOADS ============
// Chhoti files (images/thumbnails/avatars) — single request hota hai (no progress)
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return (data as { url: string }).url;
}

// Badi videos — 2MB ke chunks mein upload hota hai. Ye hosting ke
// request-size limit ko bypass karta hai aur onProgress ke through
// asli progress % deta hai. (No external library needed — native fetch.)
export async function uploadVideo(
  file: File,
  options?: { onProgress?: (percent: number) => void }
): Promise<string> {
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk
  const total = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
  const uploadId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const headers = getAuthHeader();

  for (let i = 0; i < total; i++) {
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const formData = new FormData();
    formData.append('file', chunk, 'chunk');
    formData.append('uploadId', uploadId);
    formData.append('index', String(i));
    formData.append('total', String(total));
    formData.append('originalname', file.name);

    const res = await fetch(`${API_URL}/upload/video`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Upload failed at chunk ${i + 1}/${total}`);
    }
    options?.onProgress?.(Math.round(((i + 1) / total) * 100));

    if (i + 1 === total) {
      return (data as { url: string }).url;
    }
  }
  throw new Error('Upload failed');
}

export { API_URL };