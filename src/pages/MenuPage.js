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

const poster = (seed, w = 360, h = 520) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

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
  ['Hori san to Miyamura kun', 'hori'],
  ['Mushoku Tensei', 'mushoku'],
  ['Shaman King 2', 'shaman-king'],
  ['How not to summon a...', 'summon']
];

const latestAnime = [
  ['Ryakuyakko shimai shita', '432k view', 'Tap 10', 'ryakuyakko'],
  ['Super Cub', '322k view', 'Tap 107', 'super-cub'],
  ['Detective Conan', '723k view', 'Tap moi', 'conan'],
  ['Bakuten!!', '75k view', 'Tap 09', 'bakuten'],
  ['Blue Reflection Ray', '110k view', 'Tap 09', 'blue-reflection'],
  ['Fumetsu no Anata e', '119k view', 'Tap 09', 'fumetsu'],
  ['Shadow House', '205k view', 'Tap 03', 'shadow-house'],
  ['Monster Strike', '600k view', 'Tap 10', 'monster-strike'],
  ['SSSS.DYNAZENON', '853k view', 'Tap 10', 'dynazenon']
];

const ranking = [
  ['Naruto Shippuden', '500/500 tap', '62,925,535 view', 'naruto'],
  ['Nanatsu no Taizai', '98/100 tap', '17,616,136 view', 'taizai'],
  ['One Piece', '1088/1100 tap', '22,320,110 view', 'one-piece-rank']
];

const news = [
  ['Anime Bokutachi no Remake tung trailer moi cung ngay ra mat chinh thuc', 'Tin tuc Anime / 8 gio truoc', '512k view', 'news-remake'],
  ['He lo dan dien vien moi cho anime Shuumatsu No Harem', 'Tin tuc Anime / 1 ngay truoc', '203k view', 'news-harem'],
  ['Shaman King cong bo cac dien vien vao vai BoZ Brothers', 'Tin tuc Anime / 1 ngay truoc', '609k view', 'news-shaman'],
  ['Dau An Rong Thieng cong bo dan dien vien moi', 'Tin tuc Anime / 2 ngay truoc', '434k view', 'news-dragon'],
  ['Manga Maouessou! Opening Act chinh thuc khep loi', 'Tin tuc Anime / 3 ngay truoc', '417k view', 'news-maou']
];

const manga = [
  ['One piece', 'one-piece'],
  ['Dr Stone', 'dr-stone'],
  ['One Punch Man', 'opm'],
  ['Black Clover', 'black-clover'],
  ['Boruto', 'boruto'],
  ['Release that Witch!', 'witch'],
  ['Spy X Family', 'spy-family'],
  ['Rougo Ni Sonaete...', 'rougo'],
  ['Blue Lock', 'blue-lock']
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
      <Typography sx={{ fontSize: { xs: 16, md: 24 }, fontWeight: 800, color: isLight ? '#1c1c1c' : '#dedede' }}>Logo</Typography>
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
            ['dark', 'Nen den'],
            ['light', 'Nen trang']
          ].map(([mode, label]) => (
            <Typography
              key={mode}
              onClick={() => {
                setBackgroundMode(mode);
                setOpenBackgroundMenu(false);
                onNotice(`Da chon ${label}`);
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
      <Typography sx={{ fontSize: { xs: 11, md: 14 }, fontWeight: 700 }}>Xem them</Typography>
      <ArrowForwardIcon sx={{ fontSize: { xs: 16, md: 20 }, color: '#777' }} />
    </Stack>
  );
}

function PosterTile({ item, compact = false, onSelect }) {
  const [title, views, episode, seed] = item;

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
      {views && (
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
    notify(`Dang mo ${title}`);
  };

  return (
    <PageShell title="Menu">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 8, md: 10 }, bgcolor: '#101010' }}>
          <Header onNotice={notify} />
          <Toast text={toast} />

          <Box sx={{ px: { xs: 1.4, md: 3 }, pt: { xs: 1, md: 3 } }}>
            <Typography align="center" sx={{ color: '#f1f1f1', fontSize: { xs: 13, md: 20 }, fontWeight: 800, mb: { xs: 1.4, md: 2.4 } }}>
              Sap ra mat
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
            <SectionTitle>Tap moi nhat</SectionTitle>
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
                <Stack key={item[3]} direction="row" spacing={{ xs: 1.1, md: 2 }} onClick={() => notify(`Dang mo tin: ${item[0]}`)} sx={{ cursor: 'pointer' }}>
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
            <SectionTitle>Truyen tranh</SectionTitle>
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
            [HomeIcon, 'Trang chu', true],
            [FavoriteIcon, 'Phim da thich'],
            [NotificationsIcon, 'Phim da theo doi'],
            [SettingsIcon, 'Cai dat']
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
