import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? '';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('loban_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function problemDetailMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data as { detail?: string } | undefined;
    if (d?.detail && typeof d.detail === 'string') return d.detail;
    if (typeof err.response?.data === 'string') return err.response.data;
  }
  return 'Une erreur est survenue.';
}
