import axios from 'axios';
import { App, Hero, Social } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7788/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  verifyTwoFactorLogin: (data: { tempToken: string; code: string }) => api.post('/auth/verify-2fa', data),
  me: () => api.get('/auth/me'),
  register: (data: { username: string; email: string; password: string }) => api.post('/auth/register', data),
};

export const appsApi = {
  getAll: (params?: Record<string, any>) => api.get('/apps', { params }),
  getBySlug: (slug: string) => api.get(`/apps/slug/${slug}`),
  getById: (id: string) => api.get(`/apps/${id}`),
  create: (data: Partial<App>) => api.post('/apps', data),
  update: (id: string, data: Partial<App>) => api.put(`/apps/${id}`, data),
  delete: (id: string) => api.delete(`/apps/${id}`),
  updateViews: (id: string) => api.patch(`/apps/${id}/views`),
};

export const heroApi = {
  getActive: () => api.get('/hero/active'),
  getAll: () => api.get('/hero'),
  getById: (id: string) => api.get(`/hero/${id}`),
  create: (data: Partial<Hero>) => api.post('/hero', data),
  update: (id: string, data: Partial<Hero>) => api.put(`/hero/${id}`, data),
  delete: (id: string) => api.delete(`/hero/${id}`),
};

export const socialApi = {
  getAll: (params?: Record<string, any>) => api.get('/social', { params }),
  getById: (id: string) => api.get(`/social/${id}`),
  create: (data: Partial<Social>) => api.post('/social', data),
  update: (id: string, data: Partial<Social>) => api.put(`/social/${id}`, data),
  delete: (id: string) => api.delete(`/social/${id}`),
  reorder: (items: Array<{ _id: string; order: number }>) => api.post('/social/reorder', { items }),
};

export const uploadApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (filename: string) => api.delete(`/upload/${filename}`),
};

export const profileApi = {
  get: () => api.get('/profile'),
  update: (data: { fullName?: string; username?: string; preferences?: any }) => api.patch('/profile', data),
  updateAvatar: (file: File) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return api.patch('/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteAvatar: () => api.delete('/profile/avatar'),
  changeEmail: (data: { newEmail: string; password: string }) => api.patch('/profile/email', data),
  verifyEmail: (token: string) => api.post(`/profile/email/verify?token=${token}`),
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => api.patch('/profile/password', data),
  validatePassword: (password: string) => api.post('/profile/password/validate', { password }),
  get2FAStatus: () => api.get('/profile/2fa/status'),
  enable2FA: () => api.post('/profile/2fa/enable'),
  verify2FA: (code: string) => api.post('/profile/2fa/verify', { code }),
  disable2FA: (data: { password: string; code: string }) => api.post('/profile/2fa/disable', data),
  getBackupCodes: () => api.get('/profile/2fa/backup-codes'),
  regenerateBackupCodes: (data: { password: string; code: string }) => api.post('/profile/2fa/regenerate-codes', data),
  getSessions: () => api.get('/profile/sessions'),
  terminateSession: (id: string) => api.delete(`/profile/sessions/${id}`),
  terminateAllSessions: (password: string) => api.delete('/profile/sessions', { data: { password } }),
  getActivities: (params?: { limit?: number; page?: number }) => api.get('/profile/activities', { params }),
  updatePreferences: (data: { theme?: string; notifications?: boolean; language?: string }) => api.patch('/profile/preferences', data),
};

export default api;
