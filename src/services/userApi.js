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


export const loginUser = (payload) =>
  requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const registerUser = (payload) =>
  requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const fetchUserProfile = (userId) => requestJson(`/api/users/${userId}/profile`);

export const updateUserProfile = (userId, payload) =>
  requestJson(`/api/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

export const sendUserFeedback = (payload) =>
  requestJson('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(payload)
  });