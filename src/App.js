import { useEffect, useState } from 'react';
import {
  ChangePasswordPage,
  EditProfilePage,
  FaqPage,
  FavoritesPage,
  FeedbackFormPage,
  FeedbackPage,
  FollowedPage,
  HistoryPage,
  ProfilePage,
  SearchEmptyPage,
  SearchResultsPage,
  SideMenuPage
} from './pages/AnimeMockPages.js';
import LoginErrorPage from './pages/LoginErrorPage.js';
import LoginFilledPage from './pages/LoginFilledPage.js';
import LoginPage from './pages/LoginPage.js';
import LoginRequiredPage from './pages/LoginRequiredPage.js';
import MenuPage from './pages/MenuPage.js';
import NoWifiPage from './pages/NoWifiPage.js';
import RegisterErrorPage from './pages/RegisterErrorPage.js';
import RegisterFilledPage from './pages/RegisterFilledPage.js';
import RegisterPage from './pages/RegisterPage.js';
import { clearSessionUser, getSessionToken, setSessionUser } from './services/authSession.js';
import { checkCurrentSession } from './services/userApi.js';

const routes = [
  { path: '/home', label: 'Trang chu anime', element: <MenuPage />, protected: true },
  { path: '/menu', label: 'Menu', element: <SideMenuPage />, protected: true },
  { path: '/search', label: 'Search', element: <SearchResultsPage />, protected: true },
  { path: '/search-empty', label: 'Search empty', element: <SearchEmptyPage />, protected: true },
  { path: '/profile', label: 'Ca nhan', element: <ProfilePage />, protected: true },
  { path: '/profile-guest', label: 'Ca nhan chua dang nhap', element: <ProfilePage guest /> },
  { path: '/profile-language', label: 'Popup ngon ngu', element: <ProfilePage language />, protected: true },
  { path: '/profile-edit', label: 'Chinh sua ho so', element: <EditProfilePage />, protected: true },
  { path: '/history', label: 'Lich su xem', element: <HistoryPage />, protected: true },
  { path: '/history-actions', label: 'Lich su xem - menu', element: <HistoryPage actions />, protected: true },
  { path: '/change-password', label: 'Doi mat khau', element: <ChangePasswordPage />, protected: true },
  { path: '/change-password-filled', label: 'Doi mat khau filled', element: <ChangePasswordPage filled />, protected: true },
  { path: '/faq', label: 'Cau hoi thuong gap', element: <FaqPage /> },
  { path: '/feedback', label: 'Phan anh y kien', element: <FeedbackPage />, protected: true },
  { path: '/feedback-form', label: 'Form phan anh', element: <FeedbackFormPage />, protected: true },
  { path: '/favorites', label: 'Phim da thich', element: <FavoritesPage />, protected: true },
  { path: '/favorites-actions', label: 'Phim da thich - menu', element: <FavoritesPage actions />, protected: true },
  { path: '/favorites-delete', label: 'Popup xoa phim da thich', element: <FavoritesPage deleteDialog />, protected: true },
  { path: '/followed', label: 'Phim da theo doi', element: <FollowedPage />, protected: true },
  { path: '/followed-actions', label: 'Phim da theo doi - menu', element: <FollowedPage actions />, protected: true },
  { path: '/followed-delete', label: 'Popup xoa phim da theo doi', element: <FollowedPage deleteDialog />, protected: true },
  { path: '/login-required', label: 'Dang nhap de xem thong tin', element: <LoginRequiredPage /> },
  { path: '/no-login', label: 'Chua dang nhap', element: <LoginRequiredPage /> },
  { path: '/no-wifi', label: 'Mat ket noi', element: <NoWifiPage /> },
  { path: '/login', label: 'Login (1)', element: <LoginPage /> },
  { path: '/login-filled', label: 'Login (2)', element: <LoginFilledPage /> },
  { path: '/login-error', label: 'Login (3)', element: <LoginErrorPage /> },
  { path: '/register', label: 'Register (1)', element: <RegisterPage /> },
  { path: '/register-filled', label: 'Register (2)', element: <RegisterFilledPage /> },
  { path: '/register-error', label: 'Register (3)', element: <RegisterErrorPage /> }
];

function App() {
  const [authReady, setAuthReady] = useState(false);
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const route = routes.find((item) => item.path === currentPath);

  useEffect(() => {
    if (currentPath === '/') {
      window.location.replace('/login');
      return;
    }

    if (!route?.protected) {
      setAuthReady(true);
      return;
    }

    if (!getSessionToken()) {
      clearSessionUser();
      window.location.replace('/no-login');
      return;
    }

    let ignore = false;
    setAuthReady(false);

    checkCurrentSession()
      .then(({ user }) => {
        if (ignore) return;
        setSessionUser(user);
        setAuthReady(true);
      })
      .catch(() => {
        if (ignore) return;
        clearSessionUser();
        window.location.replace('/no-login');
      });

    return () => {
      ignore = true;
    };
  }, [currentPath, route?.path, route?.protected]);

  if (currentPath === '/') return null;

  if (route?.protected && !authReady) return null;

  return route?.element ?? <LoginPage />;
}

export default App;
