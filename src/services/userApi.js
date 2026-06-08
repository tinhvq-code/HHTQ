import { getSessionToken } from './authSession.js';

const configuredApiBase = import.meta.env.VITE_API_BASE;
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = configuredApiBase || (isLocalHost ? 'http://localhost:3001' : '');

const requestJson = async (path, options = {}) => {
  if (!API_BASE) {
    throw new Error('Chua cau hinh VITE_API_BASE tren Vercel nen frontend khong tim thay backend SQL.');
  }

  const { auth = true, ...fetchOptions } = options;
  const token = auth ? getSessionToken() : '';

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(fetchOptions.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Không thể kết nối máy chủ.');
  }

  return data;
};

export const loginWithSql = (payload) =>
  requestJson('/api/auth/login', {
    auth: false,
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const registerWithSql = (payload) =>
  requestJson('/api/auth/register', {
    auth: false,
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const socialLoginWithSql = (payload) =>
  requestJson('/api/auth/social', {
    auth: false,
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const checkCurrentSession = () => requestJson('/api/auth/me');

export const logoutSqlSession = () =>
  requestJson('/api/auth/logout', {
    method: 'POST'
  });

export const fetchSqlProfile = (userId) => requestJson(`/api/users/${userId}/profile`);

export const updateSqlProfile = (userId, payload) =>
  requestJson(`/api/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

export const sendSqlFeedback = (payload) =>
  requestJson('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const fetchUserVideoItems = (kind) => requestJson(`/api/users/me/videos/${kind}`);

export const saveUserVideoItem = (kind, payload) =>
  requestJson(`/api/users/me/videos/${kind}`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const deleteUserVideoItems = (kind, payload = {}) =>
  requestJson(`/api/users/me/videos/${kind}`, {
    method: 'DELETE',
    body: JSON.stringify(payload)
  });
