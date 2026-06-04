import { createElement, useState } from 'react';
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

const rankingItems = [
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

const historyToday = [
  ['Tuyết Ưng Lĩnh Chủ', 'Tập 1', '432k lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', 'Tập 18', '756k lượt xem', '/assets/anime-06.jpg'],
  ['Long Tộc Trỗi Dậy', 'Tập mới', '723k lượt xem', '/assets/anime-08.jpg'],
  ['Tinh Hà Chiến Kỷ', 'Tập 15', '365k lượt xem', '/assets/anime-11.jpg']
];

const historySecond = [
  ['Thiên Đạo Huyền Sư', 'Tập 12', '612k lượt xem', '/assets/anime-07.jpg'],
  ['Ma Vực Phong Thần', 'Tập 09', '488k lượt xem', '/assets/anime-09.jpg'],
  ['Hỏa Phụng Liên Thành', 'Tập 22', '417k lượt xem', '/assets/anime-10.jpg'],
  ['Ngự Kiếm Sơn Hà', 'Tập 30', '842k lượt xem', '/assets/anime-13.jpg']
];

const favoriteItems = [
  ['Tuyết Ưng Lĩnh Chủ', 'Tập 1', '432k lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', 'Tập 18', '756k lượt xem', '/assets/anime-06.jpg'],
  ['Long Tộc Trỗi Dậy', 'Tập mới', '723k lượt xem', '/assets/anime-08.jpg'],
  ['Ma Vực Phong Thần', 'Tập 09', '488k lượt xem', '/assets/anime-09.jpg'],
  ['Ngự Kiếm Sơn Hà', 'Tập 30', '842k lượt xem', '/assets/anime-13.jpg']
];

const followedItems = favoriteItems;

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
    [SettingsIcon, 'Cài đặt', 'settings', '/profile']
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

export function SideMenuPage() {
  const menuItems = [
    [SportsEsportsOutlinedIcon, 'Anime', '/home'],
    [ArticleOutlinedIcon, 'Truyện tranh', '/home'],
    [CheckBoxOutlineBlankIcon, 'Tin tức', '/home'],
    [LeaderboardOutlinedIcon, 'Bảng xếp hạng', '/search']
  ];

  return (
    <PhonePage title="Menu">
      <TopBar title="Menu" />
      <Stack spacing={{ xs: 2.2, md: 3.4 }} sx={{ px: { xs: 2.1, md: 4 }, pt: { xs: 2.6, md: 4 }, color: muted }}>
        {menuItems.map(([Icon, label, path]) => (
          <Stack key={label} onClick={() => go(path)} direction="row" alignItems="center" spacing={{ xs: 1.4, md: 2 }} sx={{ cursor: 'pointer' }}>
            {createElement(Icon, { sx: { fontSize: { xs: 16, md: 26 }, color: '#8b8b8b' } })}
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
  const searchCatalog = [...rankingItems, ...historyToday, ...historySecond, ...favoriteItems].filter(
    (item, index, list) => list.findIndex((current) => current[0] === item[0] && current[3] === item[3]) === index
  );
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
  const items = [
    [HistoryIcon, 'Lịch sử xem', '/history'],
    [WorkOutlineIcon, 'Đổi mật khẩu', '/change-password'],
    [PersonOutlineIcon, 'Ngôn ngữ', '/profile-language'],
    [HelpOutlineIcon, 'Câu hỏi thường gặp', '/faq'],
    [EditOutlinedIcon, 'Phản ánh ý kiến', '/feedback']
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
  return (
    <PhonePage title={guest ? 'Cá nhân chưa đăng nhập' : 'Cá nhân'}>
      <Box sx={{ height: '100%', bgcolor: bg, position: 'relative' }}>
        <TopBar title="Cài đặt" />
        <Stack direction="row" alignItems="center" sx={{ px: { xs: 1.7, md: 4 }, pt: { xs: 2.8, md: 4 } }}>
          {guest ? (
            <Box onClick={() => go('/login')} sx={{ width: { xs: 64, md: 108 }, height: { xs: 64, md: 108 }, borderRadius: 0.5, bgcolor: '#e7e7e7', display: 'grid', placeItems: 'center', color: '#aaa', cursor: 'pointer' }}>
              <ImageOutlinedIcon sx={{ fontSize: { xs: 39, md: 64 } }} />
            </Box>
          ) : (
            <Box sx={{ width: { xs: 66, md: 108 }, height: { xs: 66, md: 108 }, background: `url(${poster('/assets/anime-05.jpg', 140, 140)}) center/cover`, borderRadius: 0.5 }} />
          )}
          <Box onClick={() => guest && go('/login')} sx={{ ml: { xs: 1.4, md: 2.4 }, minWidth: 0, flex: 1, cursor: guest ? 'pointer' : 'default' }}>
            <Typography sx={{ color: '#fff', fontSize: 11.5, fontWeight: 800 }}>{guest ? 'Đăng nhập / Đăng ký' : 'A Nguyen Van'}</Typography>
            {!guest && <Typography sx={{ color: '#8c8c8c', fontSize: 10, mt: 0.7 }}>nguyenvana@gmail.com</Typography>}
          </Box>
          {!guest && (
            <Stack onClick={() => go('/profile-edit')} direction="row" alignItems="center" spacing={0.5} sx={{ color: orange, cursor: 'pointer' }}>
              <EditIcon sx={{ fontSize: 15 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700 }}>Chỉnh sửa</Typography>
            </Stack>
          )}
        </Stack>
        <ProfileMenu disabled={guest} />
        {!guest && (
          <Button onClick={() => go('/login')} variant="outlined" fullWidth sx={{ position: 'absolute', left: 10, right: 10, bottom: 75, width: 'calc(100% - 20px)', height: 35, borderColor: '#343434', color: '#ff2f2f', borderRadius: 0.5, fontSize: 10.5, fontWeight: 800 }}>
            Đăng xuất
          </Button>
        )}
        {language && <LanguageDialog />}
        <BottomNav active="settings" />
      </Box>
    </PhonePage>
  );
}

function LanguageDialog() {
  const [language, setLanguage] = useState('Tiếng Việt');
  const languages = [
    ['🇻🇳', 'Tiếng Việt'],
    ['🇬🇧', 'Tiếng Anh'],
    ['🇹🇭', 'Tiếng Thái']
  ];

  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(16,16,16,0.62)', display: 'grid', placeItems: 'center', px: 3 }}>
      <Box sx={{ width: '100%', bgcolor: '#111', borderRadius: 0.6, p: 1.7 }}>
        <Typography align="center" sx={{ color: '#fff', fontSize: 13, fontWeight: 800, mb: 1.2 }}>Thay đổi ngôn ngữ</Typography>
        <Stack spacing={1.1}>
          {languages.map(([flag, label]) => (
            <Stack key={label} onClick={() => setLanguage(label)} direction="row" alignItems="center" sx={{ color: '#eee', cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 17, mr: 1 }}>{flag}</Typography>
              <Typography sx={{ flex: 1, fontSize: 11.2, fontWeight: 700 }}>{label}</Typography>
              <Box sx={{ width: 15, height: 15, borderRadius: '50%', border: `2px solid ${orange}`, display: 'grid', placeItems: 'center' }}>
                {language === label && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: orange }} />}
              </Box>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" spacing={1.2} sx={{ mt: 1.7 }}>
          <Button onClick={() => go('/profile')} fullWidth variant="contained" sx={{ bgcolor: '#666', boxShadow: 'none', height: 32, fontSize: 11, '&:hover': { bgcolor: '#666', boxShadow: 'none' } }}>Đóng</Button>
          <Button onClick={() => window.alert(`Đã chọn ${language}`)} fullWidth variant="contained" sx={{ bgcolor: orange, boxShadow: 'none', height: 32, fontSize: 11, '&:hover': { bgcolor: orange, boxShadow: 'none' } }}>Xác nhận</Button>
        </Stack>
      </Box>
    </Box>
  );
}

export function EditProfilePage() {
  const fields = [
    ['Họ và Tên', 'Nguyễn Văn A', PersonOutlineIcon, false],
    ['Email', 'nguyenvana@gmail.com', MailOutlineIcon, true],
    ['Số điện thoại', '0908152508', PhoneOutlinedIcon, false],
    ['Ngày sinh', '02/10/2000', CakeOutlinedIcon, false],
    ['Giới tính', 'Nam', PersonOutlineIcon, false, KeyboardArrowDownIcon]
  ];

  return (
    <PhonePage title="Chỉnh Sửa Hồ Sơ">
      <Box sx={{ height: '100%', bgcolor: bg }}>
        <TopBar title="Hồ sơ" />
        <Stack alignItems="center" sx={{ pt: 2.5 }}>
          <Box onClick={() => window.alert('Chọn ảnh đại diện')} sx={{ width: 70, height: 70, position: 'relative', background: `url(${poster('/assets/anime-05.jpg', 140, 140)}) center/cover`, borderRadius: 0.5, cursor: 'pointer' }}>
            <Box sx={{ position: 'absolute', right: -7, bottom: 7, width: 20, height: 20, borderRadius: '50%', bgcolor: orange, display: 'grid', placeItems: 'center', border: '2px solid #111' }}>
              <EditIcon sx={{ fontSize: 12, color: '#fff' }} />
            </Box>
          </Box>
        </Stack>
        <Stack spacing={1.15} sx={{ px: 1.8, mt: 2.6 }}>
          {fields.map(([label, value, Icon, disabled, EndIcon]) => (
            <Box key={label}>
              <Typography sx={{ color: '#8b8b8b', fontSize: 10.5, fontWeight: 600, mb: 0.55 }}>{label}</Typography>
              <Stack onClick={() => !disabled && window.alert(`Sửa ${label}`)} direction="row" alignItems="center" sx={{ height: 34, px: 1, border: `1px solid ${disabled ? '#343434' : '#3a3a3a'}`, bgcolor: disabled ? '#292929' : 'transparent', borderRadius: 0.5, color: disabled ? '#777' : '#e4e4e4', cursor: disabled ? 'default' : 'pointer' }}>
                {createElement(Icon, { sx: { fontSize: 16, color: '#898989', mr: 1 } })}
                <Typography sx={{ flex: 1, fontSize: 10.5, fontWeight: 700 }}>{value}</Typography>
                {EndIcon && createElement(EndIcon, { sx: { fontSize: 16, color: '#999' } })}
              </Stack>
            </Box>
          ))}
          <Button onClick={() => window.alert('Đã lưu hồ sơ')} fullWidth variant="contained" sx={{ mt: 1.9, height: 36, bgcolor: orange, boxShadow: 'none', borderRadius: 0.5, fontSize: 11, fontWeight: 800, '&:hover': { bgcolor: orange, boxShadow: 'none' } }}>
            Lưu
          </Button>
        </Stack>
      </Box>
    </PhonePage>
  );
}

export function HistoryPage({ actions = false }) {
  return (
    <PhonePage title="Lịch sử xem">
      <Box sx={{ height: '100%', bgcolor: bg, position: 'relative' }}>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: 8 }}>
          <TopBar title="Lịch sử xem" />
          <Box sx={{ px: 1.3, pt: 1.4 }}>
            <SearchBox placeholder="Tìm kiếm video đã xem..." onClick={() => window.alert('Tìm trong lịch sử xem')} />
            <Typography sx={{ color: '#bdbdbd', fontSize: 11.3, fontWeight: 800, mt: 1.4, mb: 0.9 }}>Hôm nay</Typography>
            <Stack spacing={1.15}>{historyToday.map((item) => <VideoRow key={`${item[1]}-${item[2]}`} item={item} onMore={() => go('/history-actions')} />)}</Stack>
            <Typography sx={{ color: '#bdbdbd', fontSize: 11.3, fontWeight: 800, mt: 1.7, mb: 0.9 }}>Thứ 2</Typography>
            <Stack spacing={1.15}>{historySecond.map((item) => <VideoRow key={`${item[1]}-${item[2]}`} item={item} onMore={() => go('/history-actions')} />)}</Stack>
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
        <Stack sx={{ pt: 2 }}>
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
  const [text, setText] = useState('');

  return (
    <PhonePage title="Phản ánh ý kiến">
      <Box sx={{ height: '100%', bgcolor: bg, position: 'relative' }}>
        <TopBar title="Phản ánh ý kiến" actionLabel="Gửi" onAction={() => window.alert(text ? 'Đã gửi phản ánh' : 'Vui lòng nhập nội dung')} />
        <Box sx={{ px: 1.5, pt: 1.6 }}>
          <TextareaAutosize
            minRows={9}
            maxLength={1000}
            value={text}
            placeholder="Gửi Nội dung tại đây"
            onChange={(event) => setText(event.target.value)}
            style={{ width: '100%', resize: 'none', background: 'transparent', color: '#eee', border: 0, outline: 0, fontSize: 12, fontFamily: 'Roboto, Arial, sans-serif' }}
          />
          <Typography align="right" sx={{ color: orange, fontSize: 10, mt: 9 }}>{text.length}/1000</Typography>
          <Stack onClick={() => window.alert('Đính kèm ảnh')} alignItems="center" justifyContent="center" sx={{ width: 72, height: 72, mt: 2, border: '1px dashed #777', color: '#aaa', cursor: 'pointer' }}>
            <ImageOutlinedIcon sx={{ fontSize: 24 }} />
            <Typography sx={{ fontSize: 8, mt: 0.5 }}>Đăng tải hình ảnh</Typography>
          </Stack>
        </Box>
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 155, bgcolor: '#777', color: '#fff', px: 0.6, py: 0.8 }}>
          {['Q W E R T Y U I O P', 'A S D F G H J K L', 'Z X C V B N M'].map((row) => (
            <Stack key={row} direction="row" justifyContent="center" spacing={0.45} sx={{ mb: 0.55 }}>
              {row.split(' ').map((key) => <Box key={key} sx={{ width: 24, height: 24, bgcolor: '#555', borderRadius: 0.3, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800 }}>{key}</Box>)}
            </Stack>
          ))}
          <Stack direction="row" justifyContent="center" spacing={0.5}>
            <Box sx={{ width: 42, height: 25, bgcolor: '#555', borderRadius: 0.3, display: 'grid', placeItems: 'center', fontSize: 10 }}>123</Box>
            <Box sx={{ width: 116, height: 25, bgcolor: '#555', borderRadius: 0.3, display: 'grid', placeItems: 'center', fontSize: 10 }}>space</Box>
            <Box sx={{ width: 58, height: 25, bgcolor: '#555', borderRadius: 0.3, display: 'grid', placeItems: 'center', fontSize: 10 }}>return</Box>
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
          <Stack spacing={1.25} sx={{ px: 1.6, pt: 1.6 }}>
            {items.map((item) => (
              <VideoRow key={`${item[0]}-${item[1]}`} item={item} onMore={() => go(actionPath)} />
            ))}
          </Stack>
        </Box>
        {active && <BottomNav active={active} />}
        {actions && <VideoActionSheet kind={active === 'like' ? 'favorite' : 'follow'} closePath={closePath} deletePath={`${closePath}-delete`} />}
        {deleteDialog && <DeleteConfirmDialog title={deleteTitle} message={deleteMessage} closePath={closePath} />}
      </Box>
    </PhonePage>
  );
}

export function FavoritesPage({ actions = false, deleteDialog = false }) {
  return (
    <VideoListPage
      title="Phim đã thích"
      items={favoriteItems}
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
  return (
    <VideoListPage
      title="Phim đã theo dõi"
      items={followedItems}
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


