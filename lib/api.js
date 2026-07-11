// Centralized backend API configuration for the public frontend.
// Priority: NEXT_PUBLIC_API_URL env var (set in Vercel dashboard / .env.local)
// Fallback: localhost for dev, empty string guard for production

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export { API_URL };

/**
 * Small fetch wrapper that always talks to the backend API.
 * @param {string} path  e.g. "/homepage", "/cranes/tower-crane"
 * @param {RequestInit} options
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let json = null;
  try { json = await res.json(); } catch { /* no JSON body */ }

  if (!res.ok || (json && json.success === false)) {
    const message = json?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json;
}

export default apiFetch;
