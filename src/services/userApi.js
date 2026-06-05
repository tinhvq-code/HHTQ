const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
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
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const registerWithSql = (payload) =>
  requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
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
