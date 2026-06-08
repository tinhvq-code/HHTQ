import { createElement, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlagIcon from '@mui/icons-material/Flag';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Box, Button, IconButton, Stack, TextareaAutosize, Typography } from '@mui/material';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchAnimeCatalog } from '../services/animeApi.js';
import { clearSessionUser, getSessionUser, setSessionUser } from '../services/authSession.js';
import { fetchUserProfile, sendUserFeedback, updateUserProfile } from '../services/userApi.js';

const orange = '#ff9800';
const bg = '#101010';
const line = '#252525';
const muted = '#8a8a8a';
const assetPosters = [
  '/assets/anime-01.jpg',
  '/assets/anime-02.jpg',
  '/assets/anime-03.jpg',
  '/assets/anime-04.jpg',
  '/assets/anime-05.jpg',
  '/assets/anime-06.jpg',
  '/assets/anime-07.jpg',
  '/assets/anime-08.jpg',
  '/assets/anime-09.jpg',
  '/assets/anime-10.jpg',
  '/assets/anime-11.jpg',
  '/assets/anime-12.jpg',
  '/assets/anime-13.jpg'
];
const poster = (image, w = 360, h = 220) => {
  if (image?.startsWith('/')) return image;
  if (/^https?:\/\//.test(image || '')) return image;

  const index = Math.abs(
    String(image || 'anime')
      .split('')
      .reduce((total, char) => total + char.charCodeAt(0), 0)
  ) % assetPosters.length;

  return assetPosters[index] || `/assets/anime-01.jpg?w=${w}&h=${h}`;
};
const go = (path) => {
  window.location.href = path;
};

const getCurrentUser = () => {
  return getSessionUser();
};

const getProfileInfo = () => {
  const user = getCurrentUser();

  return {
    userId: user?.id,
    updated: Boolean(user?.fullName),
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    birthday: '',
    gender: ''
  };
};

const languageOptions = [
  { code: 'vi', flag: 'VN', label: 'Tiếng Việt' },
  { code: 'en', flag: 'EN', label: 'English' },
  { code: 'th', flag: 'TH', label: 'ภาษาไทย' }
];

const languageText = {
  vi: {
    profileTitle: 'Cá nhân',
    guestProfileTitle: 'Cá nhân chưa đăng nhập',
    settings: 'Cài đặt',
    loginRegister: 'Đăng nhập / Đăng ký',
    edit: 'Chỉnh sửa',
    logout: 'Đăng xuất',
    notUpdated: 'Chưa cập nhật thông tin',
    emailEmpty: 'Chưa cập nhật email',
    history: 'Lịch sử xem',
    changePassword: 'Đổi mật khẩu',
    language: 'Ngôn ngữ',
    faq: 'Câu hỏi thường gặp',
    feedback: 'Phản ánh ý kiến',
    languageTitle: 'Thay đổi ngôn ngữ',
    close: 'Đóng',
    confirm: 'Xác nhận'
  },
  en: {
    profileTitle: 'Profile',
    guestProfileTitle: 'Guest profile',
    settings: 'Settings',
    loginRegister: 'Login / Register',
    edit: 'Edit',
    logout: 'Log out',
    notUpdated: 'Information not updated',
    emailEmpty: 'Email not updated',
    history: 'Watch history',
    changePassword: 'Change password',
    language: 'Language',
    faq: 'FAQ',
    feedback: 'Feedback',
    languageTitle: 'Change language',
    close: 'Close',
    confirm: 'Confirm'
  },
  th: {
    profileTitle: 'โปรไฟล์',
    guestProfileTitle: 'โปรไฟล์ผู้เยี่ยมชม',
    settings: 'การตั้งค่า',
    loginRegister: 'เข้าสู่ระบบ / สมัครสมาชิก',
    edit: 'แก้ไข',
    logout: 'ออกจากระบบ',
    notUpdated: 'ยังไม่ได้อัปเดตข้อมูล',
    emailEmpty: 'ยังไม่ได้อัปเดตอีเมล',
    history: 'ประวัติการรับชม',
    changePassword: 'เปลี่ยนรหัสผ่าน',
    language: 'ภาษา',
    faq: 'คำถามที่พบบ่อย',
    feedback: 'ข้อเสนอแนะ',
    languageTitle: 'เปลี่ยนภาษา',
    close: 'ปิด',
    confirm: 'ยืนยัน'
  }
};

const getStoredLanguage = () => {
  const code = window.localStorage.getItem('appLanguage') || 'vi';

  return languageText[code] ? code : 'vi';
};

const getLanguageCopy = () => languageText[getStoredLanguage()] || languageText.vi;

const STATIC_RANKING_ITEMS = [
  ['Tuyết Ưng Lĩnh Chủ', 'Tập 1', '432k lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', 'Tập 18', '756k lượt xem', '/assets/anime-06.jpg'],
  ['Thiên Đạo Huyền Sư', 'Tập 12', '612k lượt xem', '/assets/anime-07.jpg'],
  ['Long Tộc Trỗi Dậy', 'Tập mới', '723k lượt xem', '/assets/anime-08.jpg'],
  ['Ma Vực Phong Thần', 'Tập 09', '488k lượt xem', '/assets/anime-09.jpg'],
  ['Hỏa Phụng Liên Thành', 'Tập 22', '417k lượt xem', '/assets/anime-10.jpg'],
  ['Tinh Hà Chiến Kỷ', 'Tập 15', '365k lượt xem', '/assets/anime-11.jpg'],
  ['Thương Khung Bí Sử', 'Tập 06', '289k lượt xem', '/assets/anime-12.jpg'],
  ['Ngự Kiếm Sơn Hà', 'Tập 30', '842k lượt xem', '/assets/anime-13.jpg']
];

const STATIC_HISTORY_TODAY = [
  ['Tuyết Ưng Lĩnh Chủ', 'Tập 1', '432k lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', 'Tập 18', '756k lượt xem', '/assets/anime-06.jpg'],
  ['Long Tộc Trỗi Dậy', 'Tập mới', '723k lượt xem', '/assets/anime-08.jpg'],
  ['Tinh Hà Chiến Kỷ', 'Tập 15', '365k lượt xem', '/assets/anime-11.jpg']
];

const STATIC_HISTORY_SECOND = [
  ['Thiên Đạo Huyền Sư', 'Tập 12', '612k lượt xem', '/assets/anime-07.jpg'],
  ['Ma Vực Phong Thần', 'Tập 09', '488k lượt xem', '/assets/anime-09.jpg'],
  ['Hỏa Phụng Liên Thành', 'Tập 22', '417k lượt xem', '/assets/anime-10.jpg'],
  ['Ngự Kiếm Sơn Hà', 'Tập 30', '842k lượt xem', '/assets/anime-13.jpg']
];

const STATIC_FAVORITE_ITEMS = [
  ['Tuyết Ưng Lĩnh Chủ', 'Tập 1', '432k lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', 'Tập 18', '756k lượt xem', '/assets/anime-06.jpg'],
  ['Long Tộc Trỗi Dậy', 'Tập mới', '723k lượt xem', '/assets/anime-08.jpg'],
  ['Ma Vực Phong Thần', 'Tập 09', '488k lượt xem', '/assets/anime-09.jpg'],
  ['Ngự Kiếm Sơn Hà', 'Tập 30', '842k lượt xem', '/assets/anime-13.jpg']
];

const STATIC_FOLLOWED_ITEMS = STATIC_FAVORITE_ITEMS;

function EmptyListMessage({ title = 'Chưa có dữ liệu', message = 'Nội dung mới sẽ xuất hiện tại đây.' }) {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 240, px: 3, textAlign: 'center' }}>
      <SmartDisplayOutlinedIcon sx={{ fontSize: { xs: 74, md: 120 }, color: '#383838' }} />
      <Typography sx={{ color: '#fff', fontSize: { xs: 13, md: 20 }, fontWeight: 800, mt: 1.5 }}>{title}</Typography>
      <Typography sx={{ color: '#aaa', fontSize: { xs: 10.5, md: 15 }, fontWeight: 700, mt: 0.8 }}>{message}</Typography>
    </Stack>
  );
}

function ProfileAvatar({ profile, size = { xs: 66, md: 108 }, editable = false, onClick }) {
  const avatarUrl = profile?.updated ? profile.avatar || '/assets/anime-05.jpg' : '';

  return (
    <Box
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        position: 'relative',
        flexShrink: 0,
        borderRadius: 0.5,
        border: avatarUrl ? 0 : '1px solid #343434',
        bgcolor: avatarUrl ? 'transparent' : '#151515',
        background: avatarUrl ? `url(${poster(avatarUrl, 140, 140)}) center/cover` : 'none',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {editable && (
        <Box sx={{ position: 'absolute', right: -7, bottom: 7, width: 20, height: 20, borderRadius: '50%', bgcolor: orange, display: 'grid', placeItems: 'center', border: '2px solid #111' }}>
          <EditIcon sx={{ fontSize: 12, color: '#fff' }} />
        </Box>
      )}
    </Box>
  );
}

function FeedbackProfileSummary() {
  const user = getCurrentUser();
  const profile = getProfileInfo();
  const displayName = profile.updated && profile.fullName ? profile.fullName : 'Chưa cập nhật thông tin';
  const displayEmail = profile.email || user?.email || 'Chưa cập nhật email';

  return (
    <Stack direction="row" alignItems="center" spacing={1.2} sx={{ px: 1.5, py: 1.4, borderBottom: `1px solid ${line}` }}>
      <ProfileAvatar profile={profile} size={46} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 800 }} noWrap>{displayName}</Typography>
        <Typography sx={{ color: '#8c8c8c', fontSize: 10, mt: 0.4 }} noWrap>{displayEmail}</Typography>
      </Box>
    </Stack>
  );
}

function PhonePage({ title, children }) {
  return (
    <PageShell title={title}>
      <PhoneFrame>{children}</PhoneFrame>
    </PageShell>
  );
}

function TopBar({ title, search = false, searchValue = '', onSearchChange, onSearchSubmit, actionLabel, onAction }) {
  return (
    <Box sx={{ bgcolor: '#111', borderBottom: `1px solid ${line}` }}>
      <Stack direction="row" alignItems="center" sx={{ height: { xs: 48, md: 72 }, px: { xs: 1, md: 3 } }}>
        <IconButton size="small" onClick={() => window.history.back()} sx={{ color: '#d6d6d6', mr: search ? { xs: 0.4, md: 1.4 } : { xs: 2.4, md: 5 } }}>
          <ArrowBackIcon sx={{ fontSize: { xs: 18, md: 28 } }} />
        </IconButton>
        {search ? (
          <SearchBox value={searchValue} onChange={onSearchChange} onSubmit={onSearchSubmit} />
        ) : (
          <Typography sx={{ flex: 1, textAlign: 'center', mr: actionLabel ? 0 : { xs: 5, md: 9 }, color: '#eee', fontSize: { xs: 17, md: 26 }, fontWeight: 700 }}>{title}</Typography>
        )}
        {actionLabel && (
          <Typography onClick={onAction} sx={{ color: orange, fontSize: { xs: 12, md: 17 }, fontWeight: 800, px: { xs: 1, md: 2 }, cursor: 'pointer' }}>
            {actionLabel}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

function SearchBox({ placeholder = 'Anime, truyện tranh, nhân vật...', value = '', onChange, onSubmit, onClick }) {
  const isInput = Boolean(onChange);

  return (
    <Stack
      component={isInput ? 'form' : 'div'}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      onClick={onClick}
      direction="row"
      alignItems="center"
      spacing={{ xs: 0.7, md: 1.2 }}
      sx={{ flex: 1, height: { xs: 25, md: 42 }, px: { xs: 1.2, md: 2 }, bgcolor: '#1d1d1d', borderRadius: 4, color: '#686868', cursor: isInput ? 'text' : 'pointer' }}
    >
      <SearchIcon sx={{ fontSize: { xs: 14, md: 22 } }} />
      {isInput ? (
        <Box
          component="input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoFocus
          sx={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: 0,
            bgcolor: 'transparent',
            color: '#eee',
            fontSize: { xs: 9.5, md: 15 },
            fontFamily: 'Roboto, Arial, sans-serif',
            '&::placeholder': { color: '#686868' }
          }}
        />
      ) : (
        <Typography sx={{ fontSize: { xs: 9.5, md: 15 }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{placeholder}</Typography>
      )}
    </Stack>
  );
}
function BottomNav({ active = 'home' }) {
  const items = [
    [HomeIcon, 'Trang chủ', 'home', '/home'],
    [FavoriteIcon, 'Phim đã thích', 'like', '/favorites'],
    [NotificationsIcon, 'Phim đã theo dõi', 'follow', '/followed'],
    [SettingsIcon, 'Cài đặt', 'settings', getCurrentUser() ? '/profile' : '/login-required']
  ];

  return (
    <Stack direction="row" justifyContent="space-around" sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: { xs: 55, md: 76 }, bgcolor: '#151515', borderTop: `1px solid ${line}` }}>
      {items.map(([Icon, label, key, path]) => (
        <Stack key={key} onClick={() => go(path)} alignItems="center" justifyContent="center" spacing={0.25} sx={{ width: { xs: 66, md: 190 }, color: active === key ? orange : '#606060', cursor: 'pointer' }}>
          {createElement(Icon, { sx: { fontSize: { xs: 20, md: 30 } } })}
          <Typography sx={{ fontSize: { xs: 8.5, md: 14 }, fontWeight: 800 }} noWrap>{label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function PlayThumb({ seed, wide = false }) {
  return (
    <Box sx={{ width: wide ? { xs: 118, md: 220 } : { xs: 103, md: 180 }, height: wide ? { xs: 67, md: 124 } : { xs: 58, md: 104 }, flexShrink: 0, position: 'relative', borderRadius: 0.4, background: `url(${poster(seed)}) center/cover`, overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', bgcolor: 'rgba(0,0,0,0.08)' }}>
        <Box sx={{ width: { xs: 30, md: 46 }, height: { xs: 30, md: 46 }, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.75)', display: 'grid', placeItems: 'center', color: '#fff' }}>
          <PlayArrowIcon sx={{ fontSize: { xs: 20, md: 30 } }} />
        </Box>
      </Box>
    </Box>
  );
}

function VideoRow({ item, onMore }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => window.alert(`Mở phim: ${item[0]} ${item[1]}`)}>
      <PlayThumb seed={item[3]} wide />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ color: '#f2f2f2', fontSize: { xs: 11, md: 17 }, fontWeight: 800 }} noWrap>{item[0]}</Typography>
        <Typography sx={{ color: '#d8d8d8', fontSize: { xs: 10.5, md: 15 }, mt: 0.3 }}>{item[1]}</Typography>
        <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 14 }, mt: 0.25 }}>{item[2]}</Typography>
      </Box>
      <IconButton size="small" onClick={(event) => { event.stopPropagation(); onMore?.(); }} sx={{ color: '#777', p: 0.4 }}>
        <MoreVertIcon sx={{ fontSize: { xs: 17, md: 26 } }} />
      </IconButton>
    </Stack>
  );
}

function ApiOnlyState({ title, error }) {
  return (
    <PhonePage title={title}>
      <Box sx={{ height: '100%', bgcolor: bg, display: error ? 'grid' : 'block', placeItems: 'center', px: 3, textAlign: 'center' }}>
        {error && (
          <Typography sx={{ color: '#ffb74d', fontSize: { xs: 12, md: 18 }, fontWeight: 800 }}>
            Lỗi API: {error}
          </Typography>
        )}
      </Box>
    </PhonePage>
  );
}

function useApiVideoItems() {
  const [state, setState] = useState({ items: [], loading: true, error: '' });

  useEffect(() => {
    let ignore = false;

    setState({ items: [], loading: true, error: '' });

    fetchAnimeCatalog()
      .then((nextItems) => {
        if (!ignore) setState({ items: nextItems, loading: false, error: '' });
      })
      .catch((error) => {
        if (!ignore) setState({ items: [], loading: false, error: error?.message || 'Không thể tải dữ liệu API' });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}

export function SideMenuPage() {
  const menuItems = [
    [SportsEsportsOutlinedIcon, 'Anime', '/anime-menu'],
    [ArticleOutlinedIcon, 'Truyện tranh', '/manga-menu'],
    [CheckBoxOutlineBlankIcon, 'Tin tức', '/news-menu'],
    [LeaderboardOutlinedIcon, 'Bảng xếp hạng', '/ranking']
  ];

  return (
    <PhonePage title="Menu">
      <TopBar title="Menu" />
      <Stack spacing={{ xs: 2.2, md: 3.4 }} sx={{ px: { xs: 2.1, md: 4 }, pt: { xs: 2.6, md: 4 }, color: muted }}>
        {menuItems.map(([Icon, label, path]) => (
          <Stack 
            key={label} 
            onClick={() => go(path)} 
            direction="row" 
            alignItems="center" 
            spacing={{ xs: 1.4, md: 2 }} 
            sx={{ 
              cursor: 'pointer',
              transition: '0.2s',
              '&:hover': { color: '#ff9800' }, 
              '&:hover .menu-icon': { color: '#ff9800' }
            }}
          >
            {createElement(Icon, { className: 'menu-icon', sx: { fontSize: { xs: 16, md: 26 }, color: '#8b8b8b', transition: '0.2s' } })}
            <Typography sx={{ fontSize: { xs: 11.5, md: 18 }, fontWeight: 600 }}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </PhonePage>
  );
}

export function SearchResultsPage() {
  const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [chips, setChips] = useState(['Tuyết Ưng', 'Vạn Cổ Kiếm Tôn', 'Long Tộc', 'Ma Vực', 'Tinh Hà', 'Ngự Kiếm', 'Huyền Sư']);
  const { items: searchCatalog, loading: searchLoading, error: searchError } = useApiVideoItems();
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? searchCatalog.filter((item) => `${item[0]} ${item[1]} ${item[2]}`.toLowerCase().includes(normalizedQuery))
    : searchCatalog;

  const submitSearch = (nextQuery = query) => {
    const keyword = nextQuery.trim();
    if (!keyword) return;
    setQuery(keyword);
    setChips((current) => [keyword, ...current.filter((chip) => chip.toLowerCase() !== keyword.toLowerCase())].slice(0, 8));
    window.history.replaceState(null, '', `/search?q=${encodeURIComponent(keyword)}`);
  };

  if (searchLoading || searchError) {
    return <ApiOnlyState title="Search" error={searchError} />;
  }

  return (
    <PhonePage title="Search">
      <Box sx={{ height: '100%', bgcolor: bg, overflowY: 'auto', scrollbarWidth: 'none' }}>
        <TopBar search searchValue={query} onSearchChange={setQuery} onSearchSubmit={() => submitSearch()} />
        <Box sx={{ px: { xs: 1.6, md: 4 }, pt: { xs: 1.5, md: 3 }, pb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ color: muted, mb: 1.1 }}>
            <Typography sx={{ fontSize: { xs: 10.5, md: 16 }, fontWeight: 600 }}>Lịch sử tìm kiếm</Typography>
            <IconButton size="small" onClick={() => setChips([])} sx={{ color: muted, p: 0 }}>
              <DeleteOutlineIcon sx={{ fontSize: { xs: 15, md: 24 } }} />
            </IconButton>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={{ xs: 0.8, md: 1.2 }} sx={{ mb: { xs: 1.5, md: 3 } }}>
            {chips.map((chip) => (
              <Stack key={chip} onClick={() => submitSearch(chip)} direction="row" alignItems="center" spacing={0.5} sx={{ px: { xs: 0.8, md: 1.2 }, height: { xs: 20, md: 32 }, bgcolor: '#222', borderRadius: 0.5, color: '#cfcfcf', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: { xs: 9.5, md: 14 } }}>{chip}</Typography>
              </Stack>
            ))}
          </Stack>

          <Typography sx={{ color: '#dcdcdc', fontSize: { xs: 11.5, md: 18 }, fontWeight: 800, mb: { xs: 0.8, md: 1.6 } }}>
            {normalizedQuery ? `Kết quả cho "${query}"` : 'Tìm kiếm hot'}
          </Typography>

          {results.length > 0 ? (
            <Stack spacing={{ xs: 1, md: 2 }}>
              {results.map((item, index) => (
                <Stack key={`${item[3]}-${index}`} onClick={() => window.alert(`Mở: ${item[0]}`)} direction="row" spacing={{ xs: 0.9, md: 2 }} alignItems="center" sx={{ cursor: 'pointer' }}>
                  <Box sx={{ width: { xs: 16, md: 28 }, height: { xs: 16, md: 28 }, bgcolor: index < 3 ? '#fb9a00' : '#606060', color: '#fff', display: 'grid', placeItems: 'center', fontSize: { xs: 9, md: 14 }, fontWeight: 800 }}>{index + 1}</Box>
                  <PlayThumb seed={item[3]} wide />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: '#f3f3f3', fontSize: { xs: 11, md: 17 }, fontWeight: 800, lineHeight: 1.2 }} noWrap>{item[0]}</Typography>
                    <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 14 }, mt: 0.5 }}>{[item[1], item[2]].filter(Boolean).join(' - ') || 'Anime'}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Stack alignItems="center" sx={{ pt: { xs: 8, md: 12 }, textAlign: 'center' }}>
              <SmartDisplayOutlinedIcon sx={{ fontSize: { xs: 82, md: 130 }, color: '#383838' }} />
              <Typography sx={{ color: '#fff', fontSize: { xs: 13, md: 22 }, fontWeight: 800, mt: 2 }}>Không tìm thấy kết quả</Typography>
              <Typography sx={{ color: '#aaa', fontSize: { xs: 10.5, md: 16 }, fontWeight: 700, mt: 1 }}>Thử từ khóa khác ngắn hơn.</Typography>
            </Stack>
          )}
        </Box>
      </Box>
    </PhonePage>
  );
}
export function SearchEmptyPage() {
  return (
    <PhonePage title="Search">
      <Box sx={{ height: '100%', bgcolor: bg }}>
        <TopBar search />
        <Stack alignItems="center" sx={{ pt: 14, px: 3, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', width: 108, height: 96, color: '#5a5a5a' }}>
            <SmartDisplayOutlinedIcon sx={{ fontSize: 88, color: '#555' }} />
            <Box sx={{ position: 'absolute', right: 3, bottom: 10, width: 43, height: 43, borderRadius: '50%', border: `6px solid ${orange}` }} />
            <PlayArrowIcon sx={{ position: 'absolute', left: 41, top: 35, color: orange, fontSize: 29 }} />
          </Box>
          <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 800, mt: 2.2 }}>Không tìm thấy kết quả</Typography>
          <Typography sx={{ color: '#d7d7d7', fontSize: 10.5, fontWeight: 700, mt: 1.5, lineHeight: 1.35 }}>
            Hãy tìm kiếm thông tin anime, truyện tranh hoặc tin tức.
          </Typography>
        </Stack>
      </Box>
    </PhonePage>
  );
}

function ProfileMenu({ disabled = false }) {
  const color = disabled ? '#5f5f5f' : '#777';
  const copy = getLanguageCopy();
  const items = [
    [HistoryIcon, copy.history, '/history'],
    [WorkOutlineIcon, copy.changePassword, '/change-password'],
    [PersonOutlineIcon, copy.language, '/profile-language'],
    [HelpOutlineIcon, copy.faq, '/faq'],
    [EditOutlinedIcon, copy.feedback, '/feedback']
  ];

  return (
    <Stack spacing={{ xs: 2.15, md: 3.2 }} sx={{ px: { xs: 1.7, md: 4 }, pt: { xs: 2.2, md: 3.4 }, color }}>
      {items.map(([Icon, label, path]) => (
        <Stack key={label} onClick={() => !disabled && go(path)} direction="row" alignItems="center" spacing={{ xs: 1.4, md: 2 }} sx={{ cursor: disabled ? 'default' : 'pointer' }}>
          {createElement(Icon, { sx: { fontSize: { xs: 17, md: 26 } } })}
          <Typography sx={{ fontSize: { xs: 11.2, md: 17 }, fontWeight: 600 }}>{label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export function ProfilePage({ guest = false, language = false }) {
  const user = getCurrentUser();
  const [profile, setProfile] = useState(getProfileInfo());
  const copy = getLanguageCopy();
  const displayName = profile.updated && profile.fullName ? profile.fullName : copy.notUpdated;
  const displayEmail = profile.email || user?.email || copy.emailEmpty;

  useEffect(() => {
    if (guest || !user?.id) {
      return undefined;
    }

    let ignore = false;
    fetchUserProfile(user.id)
      .then(({ profile: nextProfile }) => {
        if (ignore) return;
        setProfile(nextProfile);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [guest, user?.id]);

  return (
    <PhonePage title={guest ? copy.guestProfileTitle : copy.profileTitle}>
      <Box sx={{ height: '100%', bgcolor: bg, position: 'relative' }}>
        <TopBar title={copy.settings} />
        <Stack direction="row" alignItems="center" sx={{ px: { xs: 1.7, md: 4 }, pt: { xs: 2.8, md: 4 } }}>
          {guest ? (
            <Box onClick={() => go('/login')} sx={{ width: { xs: 64, md: 108 }, height: { xs: 64, md: 108 }, borderRadius: 0.5, bgcolor: '#e7e7e7', display: 'grid', placeItems: 'center', color: '#aaa', cursor: 'pointer' }}>
              <ImageOutlinedIcon sx={{ fontSize: { xs: 39, md: 64 } }} />
            </Box>
          ) : (
            <ProfileAvatar profile={profile} />
          )}
          <Box onClick={() => guest && go('/login')} sx={{ ml: { xs: 1.4, md: 2.4 }, minWidth: 0, flex: 1, cursor: guest ? 'pointer' : 'default' }}>
            <Typography sx={{ color: '#fff', fontSize: 11.5, fontWeight: 800 }}>{guest ? copy.loginRegister : displayName}</Typography>
            {!guest && <Typography sx={{ color: '#8c8c8c', fontSize: 10, mt: 0.7 }}>{displayEmail}</Typography>}
          </Box>
          {!guest && (
            <Stack onClick={() => go('/profile-edit')} direction="row" alignItems="center" spacing={0.5} sx={{ color: orange, cursor: 'pointer' }}>
              <EditIcon sx={{ fontSize: 15 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{copy.edit}</Typography>
            </Stack>
          )}
        </Stack>
        <ProfileMenu disabled={guest} />
        {!guest && (
          <Button
            onClick={() => {
              clearSessionUser();
              go('/login');
            }}
            variant="outlined"
            fullWidth
            sx={{ position: 'absolute', left: 10, right: 10, bottom: 75, width: 'calc(100% - 20px)', height: 35, borderColor: '#343434', color: '#ff2f2f', borderRadius: 0.5, fontSize: 10.5, fontWeight: 800 }}
          >
            {copy.logout}
          </Button>
        )}
        {language && <LanguageDialog />}
        <BottomNav active="settings" />
      </Box>
    </PhonePage>
  );
}

function LanguageDialog() {
  const [language, setLanguage] = useState(getStoredLanguage());
  const copy = languageText[language] || languageText.vi;
  const confirmLanguage = () => {
    window.localStorage.setItem('appLanguage', language);
    go('/profile');
  };

  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(16,16,16,0.62)', display: 'grid', placeItems: 'center', px: 3 }}>
      <Box sx={{ width: '100%', bgcolor: '#111', borderRadius: 0.6, p: 1.7 }}>
        <Typography align="center" sx={{ color: '#fff', fontSize: 13, fontWeight: 800, mb: 1.2 }}>{copy.languageTitle}</Typography>
        <Stack spacing={1.1}>
          {languageOptions.map(({ code, flag, label }) => (
            <Stack key={code} onClick={() => setLanguage(code)} direction="row" alignItems="center" sx={{ color: '#eee', cursor: 'pointer' }}>
              <Typography sx={{ width: 22, color: '#aaa', fontSize: 12, fontWeight: 900, mr: 1 }}>{flag}</Typography>
              <Typography sx={{ flex: 1, fontSize: 11.2, fontWeight: 700 }}>{label}</Typography>
              <Box sx={{ width: 15, height: 15, borderRadius: '50%', border: `2px solid ${orange}`, display: 'grid', placeItems: 'center' }}>
                {language === code && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: orange }} />}
              </Box>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" spacing={1.2} sx={{ mt: 1.7 }}>
          <Button onClick={() => go('/profile')} fullWidth variant="contained" sx={{ bgcolor: '#666', boxShadow: 'none', height: 32, fontSize: 11, '&:hover': { bgcolor: '#666', boxShadow: 'none' } }}>{copy.close}</Button>
          <Button onClick={confirmLanguage} fullWidth variant="contained" sx={{ bgcolor: orange, boxShadow: 'none', height: 32, fontSize: 11, '&:hover': { bgcolor: orange, boxShadow: 'none' } }}>{copy.confirm}</Button>
        </Stack>
      </Box>
    </Box>
  );
}

export function EditProfilePage() {
  const user = getCurrentUser();
  const profile = getProfileInfo();
  const [saveError, setSaveError] = useState('');
  const [values, setValues] = useState({
    fullName: profile.updated && profile.fullName ? profile.fullName : '',
    email: profile.email || user?.email || '',
    phone: profile.updated && profile.phone ? profile.phone : '',
    birthday: profile.updated && profile.birthday ? profile.birthday : '',
    gender: profile.updated && profile.gender ? profile.gender : '',
    avatar: profile.updated && profile.avatar ? profile.avatar : ''
  });
  const fields = [
    ['fullName', 'Họ và Tên', PersonOutlineIcon, 'text', 'Nhập họ và tên'],
    ['email', 'Email', MailOutlineIcon, 'email', 'Email', true],
    ['phone', 'Số điện thoại', PhoneOutlinedIcon, 'tel', 'Nhập số điện thoại'],
    ['birthday', 'Ngày sinh', CakeOutlinedIcon, 'date', ''],
    ['gender', 'Giới tính', PersonOutlineIcon, 'select', 'Chọn giới tính'],
    ['avatar', 'Ảnh đại diện', ImageOutlinedIcon, 'text', 'Dán đường dẫn ảnh đại diện']
  ];
  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    let ignore = false;
    fetchUserProfile(user.id)
      .then(({ profile: nextProfile }) => {
        if (ignore) return;
        setValues({
          fullName: nextProfile.updated && nextProfile.fullName ? nextProfile.fullName : '',
          email: nextProfile.email || user?.email || '',
          phone: nextProfile.updated && nextProfile.phone ? nextProfile.phone : '',
          birthday: nextProfile.updated && nextProfile.birthday ? nextProfile.birthday : '',
          gender: nextProfile.updated && nextProfile.gender ? nextProfile.gender : '',
          avatar: nextProfile.updated && nextProfile.avatar ? nextProfile.avatar : ''
        });
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [user?.id, user?.email]);

  const setFieldValue = (name, value) => {
    setSaveError('');
    setValues((current) => ({ ...current, [name]: value }));
  };
  const saveProfile = async () => {
    if (!user?.id) {
      setSaveError('Vui long dang nhap truoc khi cap nhat ho so.');
      return;
    }

    const nextProfile = {
      userId: user?.id,
      updated: Boolean(values.fullName.trim() || values.phone.trim() || values.birthday || values.gender || values.avatar.trim()),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      birthday: values.birthday,
      gender: values.gender,
      avatar: values.avatar.trim()
    };

    try {
      const { user: updatedUser } = await updateUserProfile(user.id, nextProfile);
      setSessionUser(updatedUser);
      go('/profile');
    } catch (error) {
      setSaveError(error?.message || 'Khong the luu ho so.');
    }
  };

  return (
    <PhonePage title="Chỉnh Sửa Hồ Sơ">
      <Box sx={{ height: '100%', bgcolor: bg }}>
        <TopBar title="Hồ sơ" />
        <Stack alignItems="center" sx={{ pt: 2.5 }}>
          <ProfileAvatar profile={{ ...profile, updated: Boolean(values.avatar), avatar: values.avatar }} size={70} editable />
        </Stack>
        <Stack spacing={1.15} sx={{ px: 1.8, mt: 2.6 }}>
          {fields.map(([name, label, Icon, type, placeholder, disabled]) => (
            <Box key={name}>
              <Typography sx={{ color: '#8b8b8b', fontSize: 10.5, fontWeight: 600, mb: 0.55 }}>{label}</Typography>
              <Stack direction="row" alignItems="center" sx={{ minHeight: 34, px: 1, border: `1px solid ${disabled ? '#343434' : '#3a3a3a'}`, bgcolor: disabled ? '#292929' : 'transparent', borderRadius: 0.5, color: disabled ? '#777' : '#e4e4e4' }}>
                {createElement(Icon, { sx: { fontSize: 16, color: '#898989', mr: 1 } })}
                {type === 'select' ? (
                  <>
                    <Box
                      component="select"
                      value={values[name]}
                      onChange={(event) => setFieldValue(name, event.target.value)}
                      sx={{ flex: 1, minWidth: 0, border: 0, outline: 0, bgcolor: 'transparent', color: values[name] ? '#eee' : '#777', fontSize: 10.5, fontWeight: 700, fontFamily: 'Roboto, Arial, sans-serif', appearance: 'none' }}
                    >
                      <Box component="option" value="" sx={{ color: '#111' }}>{placeholder}</Box>
                      <Box component="option" value="Nam" sx={{ color: '#111' }}>Nam</Box>
                      <Box component="option" value="Nữ" sx={{ color: '#111' }}>Nữ</Box>
                      <Box component="option" value="Khác" sx={{ color: '#111' }}>Khác</Box>
                    </Box>
                    <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#999' }} />
                  </>
                ) : (
                  <Box
                    component="input"
                    type={type}
                    disabled={disabled}
                    value={values[name]}
                    placeholder={placeholder || 'Chưa cập nhật'}
                    onChange={(event) => setFieldValue(name, event.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      border: 0,
                      outline: 0,
                      bgcolor: 'transparent',
                      color: disabled ? '#777' : '#eee',
                      fontSize: 10.5,
                      fontWeight: 700,
                      fontFamily: 'Roboto, Arial, sans-serif',
                      '&::placeholder': { color: '#666' },
                      '&::-webkit-calendar-picker-indicator': { filter: 'invert(1)', opacity: 0.65 }
                    }}
                  />
                )}
              </Stack>
            </Box>
          ))}
          {saveError ? <Typography sx={{ color: '#ff8a80', fontSize: 10.5, fontWeight: 800 }}>{saveError}</Typography> : null}
          <Button onClick={saveProfile} fullWidth variant="contained" sx={{ mt: 1.9, height: 36, bgcolor: orange, boxShadow: 'none', borderRadius: 0.5, fontSize: 11, fontWeight: 800, '&:hover': { bgcolor: orange, boxShadow: 'none' } }}>
            Lưu
          </Button>
        </Stack>
      </Box>
    </PhonePage>
  );
}

export function HistoryPage({ actions = false }) {
  const { items: watchedItems, loading: historyLoading, error: historyError } = useApiVideoItems();
  const todayItems = watchedItems.slice(0, Math.ceil(watchedItems.length / 2));
  const olderItems = watchedItems.slice(todayItems.length);

  if (historyLoading || historyError) {
    return <ApiOnlyState title="Lá»‹ch sá»­ xem" error={historyError} />;
  }

  return (
    <PhonePage title="Lịch sử xem">
      <Box sx={{ height: '100%', bgcolor: bg, position: 'relative' }}>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: 8 }}>
          <TopBar title="Lịch sử xem" />
          <Box sx={{ px: 1.3, pt: 1.4 }}>
            <SearchBox placeholder="Tìm kiếm video đã xem..." onClick={() => window.alert('Tìm trong lịch sử xem')} />
            {watchedItems.length > 0 ? (
              <>
                <Typography sx={{ color: '#bdbdbd', fontSize: 11.3, fontWeight: 800, mt: 1.4, mb: 0.9 }}>Hôm nay</Typography>
                <Stack spacing={1.15}>{todayItems.map((item) => <VideoRow key={`${item[0]}-${item[1]}`} item={item} onMore={() => go('/history-actions')} />)}</Stack>
                {olderItems.length > 0 && (
                  <>
                    <Typography sx={{ color: '#bdbdbd', fontSize: 11.3, fontWeight: 800, mt: 1.7, mb: 0.9 }}>Trước đó</Typography>
                    <Stack spacing={1.15}>{olderItems.map((item) => <VideoRow key={`${item[0]}-${item[1]}`} item={item} onMore={() => go('/history-actions')} />)}</Stack>
                  </>
                )}
              </>
            ) : (
              <EmptyListMessage title="Chưa có phim đã xem" message="Phim bạn xem sẽ được lưu vào lịch sử tại đây." />
            )}
          </Box>
        </Box>
        {actions && (
          <Box onClick={() => go('/history')} sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(16,16,16,0.62)' }}>
            <Box onClick={(event) => event.stopPropagation()} sx={{ position: 'absolute', left: 20, right: 20, bottom: 84, bgcolor: '#151515', borderRadius: 0.8, overflow: 'hidden' }}>
              <Stack onClick={() => window.alert('Đã xóa video khỏi lịch sử')} direction="row" alignItems="center" spacing={1.2} sx={{ px: 1.4, height: 38, color: '#fff', cursor: 'pointer' }}>
                <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Xóa video đã xem</Typography>
              </Stack>
              <Stack onClick={() => window.alert('Đã mở chia sẻ phim')} direction="row" alignItems="center" spacing={1.2} sx={{ px: 1.4, height: 38, color: '#fff', borderTop: `1px solid ${line}`, cursor: 'pointer' }}>
                <ArticleOutlinedIcon sx={{ fontSize: 17 }} />
                <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Chia sẻ phim</Typography>
              </Stack>
            </Box>
          </Box>
        )}
        <BottomNav active="home" />
      </Box>
    </PhonePage>
  );
}

export function ChangePasswordPage({ filled = false }) {
  const [values, setValues] = useState({
    current: filled ? '************' : '',
    next: filled ? '************' : '',
    confirm: filled ? '************' : ''
  });
  const fields = [
    ['current', 'Mật khẩu hiện tại', 'Nhập mật khẩu hiện tại'],
    ['next', 'Mật khẩu mới', 'Nhập mật khẩu mới'],
    ['confirm', 'Xác nhận mật khẩu mới', 'Xác nhận lại mật khẩu mới']
  ];
  const canSubmit = values.current && values.next && values.confirm;

  return (
    <PhonePage title="Đổi Mật Khẩu">
      <Box sx={{ height: '100%', bgcolor: bg, position: 'relative' }}>
        <TopBar title="Đổi mật khẩu" />
        <Stack spacing={1.7} sx={{ px: 1.7, pt: 2.2 }}>
          {fields.map(([name, label, placeholder]) => (
            <Box key={name}>
              <Typography sx={{ color: '#777', fontSize: 10.5, fontWeight: 700, mb: 0.7 }}>{label}</Typography>
              <Stack direction="row" alignItems="center" sx={{ height: 34, px: 1, border: '1px solid #343434', color: values[name] ? '#fff' : '#555' }}>
                <LockOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
                <Box
                  component="input"
                  type="password"
                  value={values[name]}
                  placeholder={placeholder}
                  onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))}
                  sx={{ flex: 1, bgcolor: 'transparent', border: 0, outline: 0, color: '#eee', fontSize: 11, '&::placeholder': { color: '#555' } }}
                />
              </Stack>
            </Box>
          ))}
        </Stack>
        <Button onClick={() => window.alert(canSubmit ? 'Đã đổi mật khẩu' : 'Vui lòng nhập đủ thông tin')} fullWidth variant="contained" sx={{ position: 'absolute', left: 18, right: 18, bottom: 25, width: 'calc(100% - 36px)', height: 36, bgcolor: canSubmit ? orange : '#ad6d08', boxShadow: 'none', borderRadius: 0.5, fontSize: 11, fontWeight: 800, '&:hover': { bgcolor: canSubmit ? orange : '#ad6d08', boxShadow: 'none' } }}>
          Thay đổi mật khẩu
        </Button>
      </Box>
    </PhonePage>
  );
}

export function FaqPage() {
  const questions = [
    'Cảnh báo giả mạo "App xem hoạt hình .V"?',
    'Cách sửa đúng "App xem hoạt hình .V"?',
    'Hướng dẫn xem anime',
    'Làm thế nào để xem phim không lag',
    'Làm thế nào để tải phim từ app',
    'Làm thế nào để xem phim miễn phí?'
  ];

  return (
    <PhonePage title="Câu hỏi thường gặp">
      <Box sx={{ height: '100%', bgcolor: bg }}>
        <TopBar title="Câu hỏi thường gặp" />
        <Stack sx={{ pt: 1.2 }}>
          {questions.map((question) => (
            <Stack key={question} onClick={() => window.alert(question)} direction="row" alignItems="center" sx={{ height: 39, px: 1.7, borderBottom: `1px solid ${line}`, cursor: 'pointer' }}>
              <Typography sx={{ flex: 1, color: '#e5e5e5', fontSize: 11.3, fontWeight: 600 }}>{question}</Typography>
              <ChevronRightIcon sx={{ color: orange, fontSize: 19 }} />
            </Stack>
          ))}
        </Stack>
      </Box>
    </PhonePage>
  );
}

export function FeedbackPage() {
  const items = [
    [ChatOutlinedIcon, 'Chat với "App xem hoạt hình .V"', 'chat'],
    [DescriptionOutlinedIcon, 'Báo cáo lỗi trang', 'report'],
    [GppMaybeOutlinedIcon, 'Báo cáo hành vi giả mạo', 'fake'],
    [LightbulbOutlinedIcon, 'Gửi góp ý', 'suggest']
  ];

  return (
    <PhonePage title="Phản ánh ý kiến">
      <Box sx={{ height: '100%', bgcolor: bg }}>
        <TopBar title="Phản ánh ý kiến" />
        <FeedbackProfileSummary />
        <Stack sx={{ pt: 1 }}>
          {items.map(([Icon, label, type]) => (
            <Stack key={type} onClick={() => go(`/feedback-form?type=${type}`)} direction="row" alignItems="center" sx={{ px: 1.5, py: 1.05, cursor: 'pointer' }}>
              {createElement(Icon, { sx: { color: orange, fontSize: 29, mr: 1.1 } })}
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{label}</Typography>
                <Typography sx={{ color: '#727272', fontSize: 9.5, mt: 0.25 }}>Chia sẻ vấn đề cho chúng tôi để cải thiện dịch vụ.</Typography>
              </Box>
              <ChevronRightIcon sx={{ color: orange, fontSize: 20 }} />
            </Stack>
          ))}
        </Stack>
      </Box>
    </PhonePage>
  );
}

export function FeedbackFormPage() {
  const user = getCurrentUser();
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const feedbackType = new URLSearchParams(window.location.search).get('type') || 'general';

  const submitFeedback = async () => {
    if (!text.trim()) {
      setMessage('Vui long nhap noi dung phan hoi.');
      return;
    }

    try {
      await sendUserFeedback({
        userId: user?.id || null,
        type: feedbackType,
        content: text.trim()
      });
      setText('');
      setMessage('Da gui phan hoi.');
    } catch (error) {
      setMessage(error?.message || 'Khong the gui phan hoi.');
    }
  };

  return (
    <PhonePage title="Phản ánh ý kiến">
      <Box sx={{ height: '100%', bgcolor: bg, position: 'relative' }}>
        <TopBar title="Phản ánh ý kiến" actionLabel="Gửi" onAction={submitFeedback} />
        <FeedbackProfileSummary />
        <Box sx={{ px: 1.5, pt: 1.6 }}>
          <TextareaAutosize
            minRows={9}
            maxLength={1000}
            value={text}
            placeholder="Gửi Nội dung tại đây"
            onChange={(event) => setText(event.target.value)}
            style={{ width: '100%', resize: 'none', background: 'transparent', color: '#eee', border: 0, outline: 0, fontSize: 12, fontFamily: 'Roboto, Arial, sans-serif' }}
          />
          {message ? <Typography sx={{ color: message.startsWith('Da') ? orange : '#ff8a80', fontSize: 10.5, fontWeight: 800 }}>{message}</Typography> : null}
          <Typography align="right" sx={{ color: orange, fontSize: 10, mt: 9 }}>{text.length}/1000</Typography>
          <Stack onClick={() => window.alert('Đính kèm ảnh')} alignItems="center" justifyContent="center" sx={{ width: 72, height: 72, mt: 2, border: '1px dashed #777', color: '#aaa', cursor: 'pointer' }}>
            <ImageOutlinedIcon sx={{ fontSize: 24 }} />
            <Typography sx={{ fontSize: 8, mt: 0.5 }}>Đăng tải hình ảnh</Typography>
          </Stack>
        </Box>
      </Box>
    </PhonePage>
  );
}

function VideoActionSheet({ kind, closePath, deletePath }) {
  return (
    <Box onClick={() => go(closePath)} sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(16,16,16,0.62)' }}>
      <Box onClick={(event) => event.stopPropagation()} sx={{ position: 'absolute', left: 20, right: 20, bottom: 30, bgcolor: '#0f0f0f', borderRadius: 0.8, overflow: 'hidden' }}>
        <Stack onClick={() => go(deletePath)} direction="row" alignItems="center" spacing={1.2} sx={{ px: 1.4, height: 38, color: '#fff', cursor: 'pointer' }}>
          <DeleteOutlineIcon sx={{ fontSize: 17 }} />
          <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>{kind === 'favorite' ? 'Xóa phim đã thích' : 'Xóa phim đã theo dõi'}</Typography>
        </Stack>
        <Stack onClick={() => window.alert('Đã mở chia sẻ phim')} direction="row" alignItems="center" spacing={1.2} sx={{ px: 1.4, height: 38, color: '#fff', borderTop: `1px solid ${line}`, cursor: 'pointer' }}>
          <ArticleOutlinedIcon sx={{ fontSize: 17 }} />
          <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Chia sẻ phim</Typography>
        </Stack>
      </Box>
    </Box>
  );
}

function DeleteConfirmDialog({ title, message, closePath, confirmText = 'Xóa' }) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(16,16,16,0.68)', display: 'grid', placeItems: 'center', px: 3 }}>
      <Box sx={{ width: '100%', bgcolor: '#0c0c0c', borderRadius: 0.8, p: 1.6 }}>
        <Typography align="center" sx={{ color: '#fff', fontSize: 13, fontWeight: 800, mb: 1.5 }}>{title}</Typography>
        <Box sx={{ height: 108, display: 'grid', placeItems: 'center', position: 'relative' }}>
          <SmartDisplayOutlinedIcon sx={{ fontSize: 82, color: '#383838' }} />
          <PlayArrowIcon sx={{ position: 'absolute', color: orange, fontSize: 30 }} />
          <Box sx={{ position: 'absolute', right: 76, bottom: 21, width: 36, height: 36, borderRadius: '50%', bgcolor: '#f22635', display: 'grid', placeItems: 'center', color: '#fff' }}>
            <DeleteOutlineIcon sx={{ fontSize: 22 }} />
          </Box>
        </Box>
        <Typography align="center" sx={{ color: '#d5d5d5', fontSize: 10.5, mt: 0.5, mb: 1.6 }}>{message}</Typography>
        <Stack direction="row" spacing={1.2}>
          <Button onClick={() => go(closePath)} fullWidth variant="contained" sx={{ bgcolor: '#777', boxShadow: 'none', height: 34, borderRadius: 0.5, fontSize: 11, '&:hover': { bgcolor: '#777', boxShadow: 'none' } }}>
            Đóng
          </Button>
          <Button onClick={() => { window.alert('Đã xóa'); go(closePath); }} fullWidth variant="contained" sx={{ bgcolor: orange, boxShadow: 'none', height: 34, borderRadius: 0.5, fontSize: 11, '&:hover': { bgcolor: orange, boxShadow: 'none' } }}>
            {confirmText}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function VideoListPage({ title, items, active, actionPath, actions = false, deleteDialog = false, deleteTitle, deleteMessage, closePath }) {
  return (
    <PhonePage title={title}>
      <Box sx={{ height: '100%', bgcolor: bg, position: 'relative' }}>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: 2 }}>
          <TopBar title={title} />
          {items.length > 0 ? (
            <Stack spacing={1.25} sx={{ px: 1.6, pt: 1.6 }}>
              {items.map((item) => (
                <VideoRow key={`${item[0]}-${item[1]}`} item={item} onMore={() => go(actionPath)} />
              ))}
            </Stack>
          ) : (
            <EmptyListMessage title={active === 'like' ? 'Chưa có phim đã thích' : 'Chưa có phim theo dõi'} message={active === 'like' ? 'Những phim bạn thích sẽ xuất hiện tại đây.' : 'Những phim bạn theo dõi sẽ xuất hiện tại đây.'} />
          )}
        </Box>
        {active && <BottomNav active={active} />}
        {actions && <VideoActionSheet kind={active === 'like' ? 'favorite' : 'follow'} closePath={closePath} deletePath={`${closePath}-delete`} />}
        {deleteDialog && <DeleteConfirmDialog title={deleteTitle} message={deleteMessage} closePath={closePath} />}
      </Box>
    </PhonePage>
  );
}

export function FavoritesPage({ actions = false, deleteDialog = false }) {
  const { items, loading, error } = useApiVideoItems();

  if (loading || error) {
    return <ApiOnlyState title="Phim Ä‘Ă£ thĂ­ch" error={error} />;
  }

  return (
    <VideoListPage
      title="Phim đã thích"
      items={items}
      active="like"
      actionPath="/favorites-actions"
      actions={actions}
      deleteDialog={deleteDialog}
      closePath="/favorites"
      deleteTitle="Xóa phim đã thích"
      deleteMessage="Bạn muốn xóa video này khỏi danh sách đã thích?"
    />
  );
}

export function FollowedPage({ actions = false, deleteDialog = false }) {
  const { items, loading, error } = useApiVideoItems();

  if (loading || error) {
    return <ApiOnlyState title="Phim Ä‘Ă£ theo dĂµi" error={error} />;
  }

  return (
    <VideoListPage
      title="Phim đã theo dõi"
      items={items}
      active="follow"
      actionPath="/followed-actions"
      actions={actions}
      deleteDialog={deleteDialog}
      closePath="/followed"
      deleteTitle="Xóa video theo dõi"
      deleteMessage="Bạn muốn xóa video này khỏi danh sách theo dõi?"
    />
  );
}
