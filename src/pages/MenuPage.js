import { createElement, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';

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

const poster = (image, w = 360, h = 520) => {
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

const getCurrentUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem('currentUser') || 'null');
  } catch {
    return null;
  }
};

const comingSoon = [
  ['Kiếm Vực Trường Sinh', '/assets/anime-02.jpg'],
  ['Long Huyết Chiến Thần', '/assets/anime-03.jpg'],
  ['Băng Thành Dị Giới', '/assets/anime-04.jpg'],
  ['Thần Ấn Lưu Ly', '/assets/anime-05.jpg']
];

const latestAnime = [
  ['Tuyết Ưng Lĩnh Chủ: Huyết Chiến Băng Thành', '982k lượt xem', 'Tập 01', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', '756k lượt xem', 'Tập 18', '/assets/anime-06.jpg'],
  ['Thiên Đạo Huyền Sư', '612k lượt xem', 'Tập 12', '/assets/anime-07.jpg'],
  ['Long Tộc Trỗi Dậy', '723k lượt xem', 'Tập mới', '/assets/anime-08.jpg'],
  ['Ma Vực Phong Thần', '488k lượt xem', 'Tập 09', '/assets/anime-09.jpg'],
  ['Hỏa Phụng Liên Thành', '417k lượt xem', 'Tập 22', '/assets/anime-10.jpg'],
  ['Tinh Hà Chiến Kỷ', '365k lượt xem', 'Tập 15', '/assets/anime-11.jpg'],
  ['Thương Khung Bí Sử', '289k lượt xem', 'Tập 06', '/assets/anime-12.jpg'],
  ['Ngự Kiếm Sơn Hà', '842k lượt xem', 'Tập 30', '/assets/anime-13.jpg']
];

const ranking = [
  ['Tuyết Ưng Lĩnh Chủ', '60/60 tập', '62,925,535 lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn', '42/48 tập', '17,616,136 lượt xem', '/assets/anime-06.jpg'],
  ['Long Tộc Trỗi Dậy', '35/40 tập', '22,320,110 lượt xem', '/assets/anime-08.jpg']
];

const news = [
  ['Tuyết Ưng Lĩnh Chủ hé lộ trận chiến cuối tại Băng Thành', 'Tin tức Anime / 8 giờ trước', '512k lượt xem', '/assets/anime-01.jpg'],
  ['Vạn Cổ Kiếm Tôn công bố teaser mùa mới', 'Tin tức Anime / 1 ngày trước', '203k lượt xem', '/assets/anime-06.jpg'],
  ['Long Tộc Trỗi Dậy xác nhận lịch chiếu tập đặc biệt', 'Tin tức Anime / 1 ngày trước', '609k lượt xem', '/assets/anime-08.jpg'],
  ['Ma Vực Phong Thần giới thiệu nhân vật phản diện mới', 'Tin tức Anime / 2 ngày trước', '434k lượt xem', '/assets/anime-09.jpg'],
  ['Tinh Hà Chiến Kỷ mở sự kiện xem trước tập 15', 'Tin tức Anime / 3 ngày trước', '417k lượt xem', '/assets/anime-11.jpg']
];

const manga = [
  ['Kiếm Ảnh Huyền Môn', '/assets/anime-02.jpg'],
  ['Bí Lục Long Thành', '/assets/anime-03.jpg'],
  ['Thần Hỏa Lưu Ly', '/assets/anime-04.jpg'],
  ['Phong Vân Cửu Châu', '/assets/anime-05.jpg'],
  ['Đế Tôn Tái Sinh', '/assets/anime-07.jpg'],
  ['Huyết Nguyệt Sơn Hải', '/assets/anime-09.jpg'],
  ['Linh Vực Ký', '/assets/anime-10.jpg'],
  ['Tinh Hà Truyền Thuyết', '/assets/anime-11.jpg'],
  ['Ngự Kiếm Vấn Đạo', '/assets/anime-13.jpg']
];

function Header({ onNotice }) {
  const [backgroundMode, setBackgroundMode] = useState('dark');
  const [openBackgroundMenu, setOpenBackgroundMenu] = useState(false);
  const isLight = backgroundMode === 'light';

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', px: { xs: 1.4, md: 3 }, py: { xs: 1.1, md: 1.6 }, bgcolor: isLight ? '#fff' : '#101010' }}>
      <IconButton size="small" onClick={() => go('/menu')} sx={{ color: isLight ? '#242424' : '#d8d8d8' }}>
        <MenuIcon sx={{ fontSize: { xs: 20, md: 26 } }} />
      </IconButton>
      <Typography sx={{ fontSize: { xs: 16, md: 24 }, fontWeight: 800, color: isLight ? '#1c1c1c' : '#dedede' }}>HHTQ Anime</Typography>
      <Stack direction="row" spacing={{ xs: 0.2, md: 1 }}>
        {[
          [PublicIcon, 'region'],
          [SearchIcon, 'search'],
          [PersonIcon, 'profile']
        ].map(([Icon, key]) => (
          <IconButton
            key={key}
            size="small"
            onClick={() => {
              if (key === 'region') {
                setOpenBackgroundMenu((current) => !current);
                return;
              }
              if (key === 'search') go('/search');
              if (key === 'profile') go(getCurrentUser() ? '/profile' : '/login-required');
            }}
            sx={{ color: isLight ? '#555' : '#777', p: { xs: 0.65, md: 1 } }}
          >
            {createElement(Icon, { sx: { fontSize: { xs: 18, md: 24 } } })}
          </IconButton>
        ))}
      </Stack>
      {openBackgroundMenu && (
        <Stack sx={{ position: 'absolute', top: { xs: 38, md: 58 }, right: { xs: 52, md: 82 }, zIndex: 5, width: { xs: 98, md: 132 }, bgcolor: '#0d0d0d', border: '1px solid #333', borderRadius: 0.6, overflow: 'hidden' }}>
          {[
            ['dark', 'Nền đen'],
            ['light', 'Nền trắng']
          ].map(([mode, label]) => (
            <Typography
              key={mode}
              onClick={() => {
                setBackgroundMode(mode);
                setOpenBackgroundMenu(false);
                onNotice(`Đã chọn ${label}`);
              }}
              sx={{ px: 1.2, py: 0.85, color: mode === backgroundMode ? '#ff9800' : '#f0f0f0', fontSize: { xs: 11, md: 13 }, fontWeight: 800, cursor: 'pointer', '&:hover': { bgcolor: '#1d1d1d' } }}
            >
              {label}
            </Typography>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function SectionTitle({ children }) {
  return (
    <Typography sx={{ color: '#dcdcdc', fontSize: { xs: 13, md: 18 }, fontWeight: 800, textTransform: 'uppercase', mb: { xs: 1, md: 2 } }}>
      {children}
    </Typography>
  );
}

function ShowMore({ path = '/search' }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={5}
      onClick={() => go(path)}
      sx={{ height: { xs: 39, md: 46 }, border: '1px solid #3b3b3b', borderRadius: 0.5, color: '#d9d9d9', mt: { xs: 1.4, md: 2.4 }, cursor: 'pointer' }}
    >
      <Typography sx={{ fontSize: { xs: 11, md: 14 }, fontWeight: 700 }}>Xem thêm</Typography>
      <ArrowForwardIcon sx={{ fontSize: { xs: 16, md: 20 }, color: '#777' }} />
    </Stack>
  );
}

function PosterTile({ item, compact = false, onSelect }) {
  const [title, views, episode, imageSeed] = item;
  const seed = compact ? views : imageSeed;

  return (
    <Box onClick={() => onSelect(title)} sx={{ minWidth: 0, cursor: 'pointer' }}>
      <Box
        sx={{
          position: 'relative',
          aspectRatio: compact ? '1 / 1.35' : '1 / 1.42',
          background: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.3)), url(${poster(seed)}) center/cover`,
          borderRadius: 0.4,
          overflow: 'hidden'
        }}
      >
        {!compact && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ width: { xs: 34, md: 46 }, height: { xs: 34, md: 46 }, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.7)', display: 'grid', placeItems: 'center' }}>
              <PlayArrowIcon sx={{ fontSize: { xs: 22, md: 30 } }} />
            </Box>
          </Box>
        )}
      </Box>
      <Typography sx={{ color: '#f2f2f2', fontSize: { xs: 11, md: 15 }, fontWeight: 700, lineHeight: 1.15, mt: { xs: 0.65, md: 1 } }} noWrap>
        {title}
      </Typography>
      {!compact && views && (
        <Stack direction="row" spacing={0.8} sx={{ color: '#aaa', mt: 0.35 }}>
          <Typography sx={{ fontSize: { xs: 9.5, md: 12 } }}>{episode}</Typography>
          <Typography sx={{ fontSize: { xs: 9.5, md: 12 } }}>{views}</Typography>
        </Stack>
      )}
    </Box>
  );
}

function Toast({ text }) {
  if (!text) return null;

  return (
    <Typography sx={{ position: 'absolute', top: { xs: 48, md: 72 }, left: { xs: 16, md: 32 }, right: { xs: 16, md: 32 }, zIndex: 8, px: 1.2, py: 0.8, borderRadius: 0.5, bgcolor: '#202020', color: '#f5f5f5', fontSize: { xs: 11, md: 14 }, fontWeight: 800, textAlign: 'center' }}>
      {text}
    </Typography>
  );
}

function MenuPage() {
  const [toast, setToast] = useState('');

  const notify = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 1400);
  };

  const openAnime = (title) => {
    notify(`Đang mở ${title}`);
  };

  return (
    <PageShell title="Menu">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 8, md: 10 }, bgcolor: '#101010' }}>
          <Header onNotice={notify} />
          <Toast text={toast} />

          <Box sx={{ px: { xs: 1.4, md: 3 }, pt: { xs: 1, md: 3 } }}>
            <Typography align="center" sx={{ color: '#f1f1f1', fontSize: { xs: 13, md: 20 }, fontWeight: 800, mb: { xs: 1.4, md: 2.4 } }}>
              Sắp ra mắt
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }, gap: { xs: 1.1, md: 2 } }}>
              {comingSoon.map((item) => (
                <PosterTile key={item[1]} item={item} compact onSelect={openAnime} />
              ))}
            </Box>
            <Stack direction="row" justifyContent="center" spacing={0.55} sx={{ mt: 1.5, mb: { xs: 2.4, md: 3 } }}>
              {[0, 1, 2, 3, 4].map((dot) => (
                <Box key={dot} onClick={() => notify(`Slide ${dot + 1}`)} sx={{ width: dot === 0 ? 6 : 4, height: dot === 0 ? 6 : 4, borderRadius: '50%', bgcolor: dot === 0 ? '#e7e7e7' : '#3b3b3b', cursor: 'pointer' }} />
              ))}
            </Stack>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.5, md: 3 }, borderTop: '1px solid #242424' }}>
            <SectionTitle>Tập mới nhất</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '13px 10px', md: '24px 18px' } }}>
              {latestAnime.map((item) => (
                <PosterTile key={item[3]} item={item} onSelect={openAnime} />
              ))}
            </Box>
            <ShowMore />
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.4, md: 3 }, borderTop: '1px solid #242424' }}>
            <SectionTitle>BXH</SectionTitle>
            <Stack direction="row" spacing={{ xs: 1, md: 2 }} sx={{ overflowX: 'auto', pb: 0.5, scrollbarWidth: 'none' }}>
              {ranking.map((item, index) => (
                <Box key={item[3]} onClick={() => openAnime(item[0])} sx={{ minWidth: { xs: 126, md: 240 }, cursor: 'pointer' }}>
                  <Typography sx={{ color: '#f3f3f3', fontSize: { xs: 11, md: 15 }, fontWeight: 800 }}>#Top {index + 1}</Typography>
                  <Box sx={{ height: { xs: 73, md: 138 }, mt: 0.5, borderRadius: 0.4, background: `url(${poster(item[3], 360, 220)}) center/cover` }} />
                  <Typography sx={{ color: '#fff', fontSize: { xs: 11, md: 15 }, fontWeight: 800, mt: 0.55 }} noWrap>{item[0]}</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: { xs: 9.5, md: 12 } }}>{item[1]} - {item[2]}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.4, md: 3 }, borderTop: '1px solid #242424' }}>
            <SectionTitle>Tin anime</SectionTitle>
            <Stack spacing={{ xs: 1.2, md: 2 }}>
              {news.map((item) => (
                <Stack key={item[3]} direction="row" spacing={{ xs: 1.1, md: 2 }} onClick={() => notify(`Đang mở tin: ${item[0]}`)} sx={{ cursor: 'pointer' }}>
                  <Box sx={{ width: { xs: 86, md: 180 }, height: { xs: 58, md: 112 }, flexShrink: 0, borderRadius: 0.4, background: `url(${poster(item[3], 240, 160)}) center/cover` }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: '#fff', fontSize: { xs: 11.5, md: 16 }, fontWeight: 800, lineHeight: 1.2 }}>{item[0]}</Typography>
                    <Typography sx={{ color: '#f59a23', fontSize: { xs: 9.5, md: 13 }, fontWeight: 700, mt: 0.45 }}>{item[1]}</Typography>
                    <Typography sx={{ color: '#aaa', fontSize: { xs: 9.5, md: 13 }, mt: 0.35 }}>{item[2]}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <ShowMore />
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.4, md: 3 }, borderTop: '1px solid #242424' }}>
            <SectionTitle>Truyện tranh</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '13px 10px', md: '24px 18px' } }}>
              {manga.map((item) => (
                <PosterTile key={item[1]} item={item} compact onSelect={openAnime} />
              ))}
            </Box>
            <ShowMore />
          </Box>
        </Box>

        <Stack
          direction="row"
          justifyContent="space-around"
          sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: { xs: 55, md: 70 }, bgcolor: '#151515', borderTop: '1px solid #282828' }}
        >
          {[
            [HomeIcon, 'Trang chủ', true],
            [FavoriteIcon, 'Phim đã thích'],
            [NotificationsIcon, 'Phim đã theo dõi'],
            [SettingsIcon, 'Cài đặt']
          ].map(([Icon, label, active], index) => (
            <Stack
              key={label}
              onClick={() => {
                const path = ['/home', '/favorites', '/followed', getCurrentUser() ? '/profile' : '/login-required'][index];
                go(path);
              }}
              alignItems="center"
              justifyContent="center"
              spacing={0.25}
              sx={{ width: { xs: 64, md: 180 }, color: active ? '#ff9800' : '#606060', cursor: 'pointer' }}
            >
              {createElement(Icon, { sx: { fontSize: { xs: 20, md: 26 } } })}
              <Typography sx={{ fontSize: { xs: 8.5, md: 13 }, fontWeight: 800 }} noWrap>{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </PhoneFrame>
    </PageShell>
  );
}

export default MenuPage;
