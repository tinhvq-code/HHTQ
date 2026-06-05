const SESSION_USER_KEY = 'sessionUser';
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

export const setSessionUser = (user) => {
  clearLegacyLocalUserData();

  if (!user) {
    window.sessionStorage.removeItem(SESSION_USER_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
};

export const clearSessionUser = () => {
  clearLegacyLocalUserData();
  window.sessionStorage.removeItem(SESSION_USER_KEY);
};
