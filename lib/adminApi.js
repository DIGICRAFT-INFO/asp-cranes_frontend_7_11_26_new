'use client';
import axios from 'axios';

// Single source of truth — set NEXT_PUBLIC_API_URL in Vercel dashboard or .env.local
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ── Attach Bearer Token ──────────────────────────────────────────────────────
adminApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('asp-auth');
        if (stored) {
          const { accessToken } = JSON.parse(stored);
          if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (e) { /* silent */ }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auto Refresh Token on 401 ────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Account revoked — immediate logout + redirect
    if (error.response?.data?.code === 'ACCOUNT_REVOKED') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('asp-auth');
        window.location.href = '/admin/login?reason=revoked';
      }
      return Promise.reject(error);
    }

    // Token expired — try refresh
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return adminApi(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const stored = localStorage.getItem('asp-auth');
        const { refreshToken } = stored ? JSON.parse(stored) : {};
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        const current = JSON.parse(localStorage.getItem('asp-auth') || '{}');
        localStorage.setItem('asp-auth', JSON.stringify({ ...current, accessToken, refreshToken: newRefreshToken }));

        adminApi.defaults.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('asp-auth');
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
