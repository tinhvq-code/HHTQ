import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Các trang cũ của hệ thống
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

// Các trang giao diện mới thêm vào
import AnimeRankingPage from './pages/AnimeRankingPage.js';
import AnimeMenuPage from './pages/AnimeMenuPage.js';
import AnimeDetailPage from './pages/AnimeDetailPage.js';
import MangaMenuPage from './pages/MangaMenuPage.js';
import MangaDetailPage from './pages/MangaDetailPage.js';
import NewsMenuPage from './pages/NewsMenuPage.js';
import NewsDetailPage from './pages/NewsDetailPage.js';

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
  { path: '/register-error', label: 'Register (3)', element: <RegisterErrorPage /> },

  // Danh sách đường dẫn cho các trang mới
  { path: '/ranking', label: 'Bảng Xếp Hạng', element: <AnimeRankingPage /> },
  { path: '/anime-menu', label: 'Menu Anime', element: <AnimeMenuPage /> },
  { path: '/anime-detail', label: 'Chi Tiết Anime', element: <AnimeDetailPage /> },
  { path: '/manga-menu', label: 'Menu Manga', element: <MangaMenuPage /> },
  { path: '/manga-detail', label: 'Chi Tiết Manga', element: <MangaDetailPage /> },
  { path: '/news-menu', label: 'Menu Tin Tức', element: <NewsMenuPage /> },
  { path: '/news-detail', label: 'Chi Tiết Tin Tức', element: <NewsDetailPage /> }
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tự động chuyển hướng trang chủ về login nếu chưa đăng nhập */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Lặp qua danh sách để tạo ra các Route */}
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        
        {/* Nếu gõ sai đường dẫn thì mặc định về trang Login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;