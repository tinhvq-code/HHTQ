const SESSION_USER_KEY = 'sessionUser';
const SESSION_TOKEN_KEY = 'sessionToken';
const LEGACY_LOCAL_KEYS = ['currentUser', 'profileInfo', 'watchedMovies', 'favoriteMovies', 'followedMovies', 'registeredUsers'];

export const clearLegacyLocalUserData = () => {
  for (const key of LEGACY_LOCAL_KEYS) {
    window.localStorage.removeItem(key);
  }
};

export const getSessionUser = () => {
  clearLegacyLocalUserData();

  try {
    return JSON.parse(window.sessionStorage.getItem(SESSION_USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const getSessionToken = () => {
  clearLegacyLocalUserData();
  return window.sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
};

export const setSessionUser = (user, token) => {
  clearLegacyLocalUserData();

  if (!user) {
    window.sessionStorage.removeItem(SESSION_USER_KEY);
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));

  if (token) {
    window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }
};

export const clearSessionUser = () => {
  clearLegacyLocalUserData();
  window.sessionStorage.removeItem(SESSION_USER_KEY);
  window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
};
