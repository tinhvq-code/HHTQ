import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Stack, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { BottomNav } from './AnimeMockPages.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { buildFromAPI, loadNotifications, saveNotifications } from '../services/notifications.js';

const selectedAnimeKey = 'selectedAnimeDetail';

const TYPE_CONFIG = {
  new_anime:   { Icon: NewReleasesIcon,       color: '#e53935', label: 'Phim mới'  },
  new_episode: { Icon: PlayCircleOutlineIcon, color: '#ff9800', label: 'Tập mới'   },
  followed:    { Icon: BookmarkIcon,          color: '#1e88e5', label: 'Theo dõi'  },
  system:      { Icon: InfoOutlinedIcon,      color: '#607d8b', label: 'Hệ thống'  },
};

const FILTERS = [
  { key: 'all',         label: 'Tất cả'   },
  { key: 'new_anime',   label: 'Phim mới' },
  { key: 'new_episode', label: 'Tập mới'  },
  { key: 'followed',    label: 'Theo dõi' },
  { key: 'system',      label: 'Hệ thống' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(loadNotifications);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // ── Load from API on mount ──
  useEffect(() => {
    let cancelled = false;
    fetchHomeAnime()
      .then(homeData => {
        if (cancelled) return;
        setNotifications(prev => {
          const merged = buildFromAPI(homeData, prev);
          saveNotifications(merged);
          return merged;
        });
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const unread = notifications.filter(n => !n.read).length;
  const visible = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  const update = (next) => { setNotifications(next); saveNotifications(next); };

  const markRead = (id) => update(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => update(notifications.map(n => ({ ...n, read: true })));

  const openAnime = (notif) => {
    markRead(notif.id);
    if (notif.anime) {
      localStorage.setItem(selectedAnimeKey, JSON.stringify(notif.anime));
      window.location.href = '/anime-detail';
    }
  };

  return (
    <PageShell title="Thông báo">
      <PhoneFrame>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#101010', color: '#fff' }}>

          {/* ── Header ── */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: { xs: 1.2, md: 3 }, py: { xs: 0.9, md: 1.4 },
            bgcolor: '#101010', borderBottom: '1px solid #1e1e1e',
            position: 'sticky', top: 0, zIndex: 10, flexShrink: 0
          }}>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <IconButton size="small" sx={{ color: '#fff', p: 0.5 }} onClick={() => window.history.back()}>
                <ArrowBackIcon sx={{ fontSize: { xs: 20, md: 26 } }} />
              </IconButton>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: 14, md: 19 } }}>
                Thông báo
              </Typography>
              {unread > 0 && (
                <Box sx={{
                  px: { xs: 0.7, md: 1 }, py: 0.05, bgcolor: '#e53935', borderRadius: 10,
                  fontSize: { xs: 9, md: 11 }, fontWeight: 900, color: '#fff',
                  lineHeight: '18px', minWidth: 18, textAlign: 'center'
                }}>
                  {unread}
                </Box>
              )}
            </Stack>
            {unread > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5} onClick={markAllRead}
                sx={{ cursor: 'pointer', color: '#ff9800', userSelect: 'none' }}>
                <DoneAllIcon sx={{ fontSize: { xs: 15, md: 19 } }} />
                <Typography sx={{ fontSize: { xs: 10, md: 13 }, fontWeight: 800 }}>Đọc tất cả</Typography>
              </Stack>
            )}
          </Box>

          {/* ── Filter chips ── */}
          <Box sx={{
            display: 'flex', gap: 0.7,
            px: { xs: 1.2, md: 3 }, py: { xs: 0.8, md: 1.1 },
            overflowX: 'auto', scrollbarWidth: 'none',
            borderBottom: '1px solid #191919', flexShrink: 0
          }}>
            {FILTERS.map(({ key, label }) => (
              <Box
                key={key}
                onClick={() => setFilter(key)}
                sx={{
                  px: { xs: 1.1, md: 1.6 }, py: { xs: 0.3, md: 0.55 },
                  borderRadius: 5, whiteSpace: 'nowrap', cursor: 'pointer',
                  bgcolor: filter === key ? '#ff9800' : '#1c1c1c',
                  color: filter === key ? '#fff' : '#777',
                  fontSize: { xs: 10, md: 13 }, fontWeight: 800,
                  border: `1px solid ${filter === key ? '#ff9800' : '#2a2a2a'}`,
                  transition: 'all 140ms'
                }}
              >
                {label}
              </Box>
            ))}
          </Box>

          {/* ── List ── */}
          <Box sx={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 7, md: 10 } }}>

            {/* Loading skeleton */}
            {loading && notifications.length === 0 && (
              <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ mt: 8, color: '#444' }}>
                <CircularProgress size={28} sx={{ color: '#ff9800' }} />
                <Typography sx={{ fontSize: { xs: 11, md: 14 }, color: '#555' }}>Đang tải thông báo...</Typography>
              </Stack>
            )}

            {/* Empty state */}
            {!loading && visible.length === 0 && (
              <Stack alignItems="center" justifyContent="center" spacing={1.2} sx={{ mt: 8, color: '#444' }}>
                <NotificationsNoneIcon sx={{ fontSize: { xs: 44, md: 56 } }} />
                <Typography sx={{ fontSize: { xs: 12, md: 15 }, fontWeight: 700 }}>Không có thông báo</Typography>
              </Stack>
            )}

            {/* Notification rows */}
            {visible.map((notif) => {
              const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
              const { Icon } = cfg;
              return (
                <Box
                  key={notif.id}
                  onClick={() => openAnime(notif)}
                  sx={{
                    display: 'flex', alignItems: 'flex-start',
                    gap: { xs: 1.1, md: 1.8 },
                    px: { xs: 1.2, md: 3 }, py: { xs: 1.1, md: 1.5 },
                    bgcolor: notif.read ? 'transparent' : 'rgba(255,152,0,0.055)',
                    borderBottom: '1px solid #181818',
                    cursor: notif.anime ? 'pointer' : 'default',
                    '&:active': { bgcolor: 'rgba(255,255,255,0.05)' },
                    transition: 'background 100ms'
                  }}
                >
                  {/* Circle icon */}
                  <Box sx={{
                    width: { xs: 38, md: 48 }, height: { xs: 38, md: 48 }, mt: 0.2,
                    borderRadius: '50%', flexShrink: 0,
                    bgcolor: `${cfg.color}1a`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon sx={{ fontSize: { xs: 19, md: 25 }, color: cfg.color }} />
                  </Box>

                  {/* Text content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mb: 0.25 }}>
                      <Typography sx={{
                        fontSize: { xs: 10.5, md: 13.5 }, fontWeight: 900,
                        color: notif.read ? '#b0b0b0' : '#f0f0f0'
                      }}>
                        {notif.title}
                      </Typography>
                      {!notif.read && (
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ff9800', flexShrink: 0 }} />
                      )}
                    </Stack>
                    <Typography sx={{
                      fontSize: { xs: 9.5, md: 12 }, lineHeight: 1.5, mb: 0.6,
                      color: notif.read ? '#555' : '#aaa'
                    }}>
                      {notif.message}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.8}>
                      <Box sx={{ px: 0.65, py: 0.1, borderRadius: 0.6, bgcolor: `${cfg.color}22` }}>
                        <Typography sx={{ fontSize: { xs: 8, md: 10.5 }, fontWeight: 900, color: cfg.color }}>
                          {cfg.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: { xs: 8.5, md: 11 }, color: '#444' }}>
                        {notif.time}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Anime poster */}
                  {notif.anime && (
                    <Box sx={{
                      width: { xs: 40, md: 54 }, height: { xs: 54, md: 72 }, mt: 0.2,
                      borderRadius: 0.8, overflow: 'hidden', flexShrink: 0,
                      border: '1px solid #282828'
                    }}>
                      <img
                        src={notif.anime.img}
                        alt={notif.anime.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          <BottomNav active="home" />
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}
