import { Box, Button, Stack, Typography } from '@mui/material';
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

const routes = [
  { path: '/home', label: 'Trang chủ anime', element: <MenuPage /> },
  { path: '/menu', label: 'Menu', element: <SideMenuPage /> },
  { path: '/search', label: 'Search', element: <SearchResultsPage /> },
  { path: '/search-empty', label: 'Search empty', element: <SearchEmptyPage /> },
  { path: '/profile', label: 'Cá nhân', element: <ProfilePage /> },
  { path: '/profile-guest', label: 'Cá nhân chưa đăng nhập', element: <ProfilePage guest /> },
  { path: '/profile-language', label: 'Popup ngôn ngữ', element: <ProfilePage language /> },
  { path: '/profile-edit', label: 'Chỉnh sửa hồ sơ', element: <EditProfilePage /> },
  { path: '/history', label: 'Lịch sử xem', element: <HistoryPage /> },
  { path: '/history-actions', label: 'Lịch sử xem - menu', element: <HistoryPage actions /> },
  { path: '/change-password', label: 'Đổi mật khẩu', element: <ChangePasswordPage /> },
  { path: '/change-password-filled', label: 'Đổi mật khẩu filled', element: <ChangePasswordPage filled /> },
  { path: '/faq', label: 'Câu hỏi thường gặp', element: <FaqPage /> },
  { path: '/feedback', label: 'Phản ánh ý kiến', element: <FeedbackPage /> },
  { path: '/feedback-form', label: 'Form phản ánh', element: <FeedbackFormPage /> },
  { path: '/favorites', label: 'Phim đã thích', element: <FavoritesPage /> },
  { path: '/favorites-actions', label: 'Phim đã thích - menu', element: <FavoritesPage actions /> },
  { path: '/favorites-delete', label: 'Popup xóa phim đã thích', element: <FavoritesPage deleteDialog /> },
  { path: '/followed', label: 'Phim đã theo dõi', element: <FollowedPage /> },
  { path: '/followed-actions', label: 'Phim đã theo dõi - menu', element: <FollowedPage actions /> },
  { path: '/followed-delete', label: 'Popup xóa phim đã theo dõi', element: <FollowedPage deleteDialog /> },
  { path: '/login-required', label: 'Đăng nhập để xem thông tin', element: <LoginRequiredPage /> },
  { path: '/no-wifi', label: 'Mất kết nối', element: <NoWifiPage /> },
  { path: '/login', label: 'Login (1)', element: <LoginPage /> },
  { path: '/login-filled', label: 'Login (2)', element: <LoginFilledPage /> },
  { path: '/login-error', label: 'Login (3)', element: <LoginErrorPage /> },
  { path: '/register', label: 'Register (1)', element: <RegisterPage /> },
  { path: '/register-filled', label: 'Register (2)', element: <RegisterFilledPage /> },
  { path: '/register-error', label: 'Register (3)', element: <RegisterErrorPage /> }
];

function AppIndex() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#e5e5e5', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Danh sách trang
      </Typography>
      <Stack spacing={1.5} alignItems="flex-start">
        {routes.map((route) => (
          <Button key={route.path} href={route.path} variant="contained">
            {route.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

function App() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const route = routes.find((item) => item.path === currentPath);

  return route?.element ?? <AppIndex />;
}

export default App;
