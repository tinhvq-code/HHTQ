import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { getT } from '../services/i18n.js';

const selectedAnimeKey = 'selectedAnimeDetail';

const getRatingScore = (seed = '', index = 0) => {
  const total = String(seed || 'anime').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Number((4.1 + ((total + index * 7) % 9) / 10).toFixed(1));
};

const categoriesVi = [
  'Tất Cả Anime', 'Hành Động', 'Viễn Tưởng', 'Lãng Mạn', 'Kinh Dị', 'Võ Thuật', 'Hài Hước',
  'Trường Học', 'Trinh Thám', 'Âm Nhạc', 'Phiêu Lưu', 'Siêu Nhiên', 'Đời Thường'
];

const categoryGenres = {
  'Hành Động': ['Action'],
  'Viễn Tưởng': ['Fantasy', 'Sci-Fi'],
  'Lãng Mạn': ['Romance'],
  'Kinh Dị': ['Horror', 'Thriller'],
  'Võ Thuật': ['Action', 'Sports'],
  'Hài Hước': ['Comedy'],
  'Trường Học': ['Slice of Life', 'Drama'],
  'Trinh Thám': ['Mystery'],
  'Âm Nhạc': ['Music'],
  'Phiêu Lưu': ['Adventure'],
  'Siêu Nhiên': ['Supernatural'],
  'Đời Thường': ['Slice of Life']
};

const toAnimeItem = (item, index) => ({
  id: `${item[0]}-${index}`,
  title: item[0],
  views: item[1],
  eps: item[2],
  img: item[3],
  trailer: item[4] || null,
  genres: item[5] || [],
  rating: typeof item?.[6] === 'number' ? item[6] : getRatingScore(item[0], index),
  isNew: index < 3
});

const PAGE_SIZE = 20;

const getPageNumbers = (current, total) => {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 1, total - 3));
  return [start, start + 1, start + 2, start + 3];
};

export default function AnimeMenuPage() {
  const navigate = useNavigate();
  const t = getT();
  const categories = [
    t.allAnime, t.catAction, t.catFantasy, t.catRomance, t.catHorror, t.catMartialArts, t.catComedy,
    t.catSchool, t.catDetective, t.catMusic, t.catAdventure, t.catSupernatural, t.catEveryday
  ];
  const [activeCategory, setActiveCategory] = useState(t.allAnime);
  const [searchText, setSearchText] = useState('');
  const [state, setState] = useState({ items: [], loading: true, error: '' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (!ignore) setState({ items: data.latestAnime.map(toAnimeItem), loading: false, error: '' });
      })
      .catch((error) => {
        if (!ignore) setState({ items: [], loading: false, error: error?.message || t.cannotLoadAnime });
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    const catIndex = categories.indexOf(activeCategory);
    const acceptedGenres = catIndex > 0 ? categoryGenres[categoriesVi[catIndex]] || [] : [];
    const itemsByCategory = acceptedGenres.length
      ? state.items.filter((item) => item.genres.some((genre) => acceptedGenres.includes(genre)))
      : state.items;

    if (!keyword) return itemsByCategory;

    return itemsByCategory.filter((item) => `${item.title} ${item.eps} ${item.views} ${item.genres.join(' ')}`.toLowerCase().includes(keyword));
  }, [activeCategory, searchText, state.items]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pageItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchText]);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAnimeDetail = (item) => {
    window.localStorage.setItem(selectedAnimeKey, JSON.stringify(item));
    navigate('/anime-detail');
  };

  return (
    <PageShell title="Danh sách Anime">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1.2, md: 3 }, py: { xs: 1, md: 1.6 }, position: 'sticky', top: 0, bgcolor: '#101010', zIndex: 10 }}>
            <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate('/home')}>
              <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
            </IconButton>
            <Typography sx={{ ml: 1, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>{t.anime}</Typography>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, mb: { xs: 1.2, md: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: { xs: 30, md: 38 }, backgroundColor: '#222', borderRadius: 8, px: { xs: 1.2, md: 2 }, py: 0.25 }}>
              <SearchIcon sx={{ color: '#888', mr: 0.8, fontSize: { xs: 17, md: 22 } }} />
              <InputBase value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder={t.searchAnime} sx={{ color: '#fff', flex: 1, fontSize: { xs: 11, md: 14 } }} />
            </Box>
          </Box>

          <Box sx={{ px: { xs: 1.4, md: 3 }, mb: { xs: 1.6, md: 2.4 }, display: 'flex', gap: 0.7, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  backgroundColor: activeCategory === cat ? '#ff9800' : '#222',
                  color: activeCategory === cat ? '#fff' : '#aaa',
                  borderRadius: 0.6, textTransform: 'none', minWidth: 'max-content', minHeight: '28px !important', px: 1.1, py: 0.35, fontSize: { xs: 10.5, md: 13 }
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          <Typography sx={{ px: { xs: 1.4, md: 3 }, mb: { xs: 1.1, md: 2 }, fontWeight: 800, color: '#dcdcdc', fontSize: { xs: 13, md: 18 } }}>
            {t.todayWatch}
          </Typography>

          {state.loading || state.error ? (
            <Typography sx={{ px: { xs: 1.4, md: 3 }, color: state.error ? '#ffb74d' : '#aaa', fontSize: { xs: 11, md: 14 }, fontWeight: 700 }}>
              {state.error || t.loadingAnime}
            </Typography>
          ) : (
            <>
              <Box sx={{ px: { xs: 1.4, md: 3 }, display: 'grid', gridTemplateColumns: { xs: 'repeat(4, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '16px 10px', md: '24px 16px' } }}>
                {pageItems.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => openAnimeDetail(item)}>
                    <Box sx={{ position: 'relative', borderRadius: 0.9, overflow: 'hidden', aspectRatio: '2/3', mb: 0.6, '&:hover': { opacity: 0.82 } }}>
                      <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

                      {item.isNew && (
                        <Box sx={{ position: 'absolute', top: 3, left: 3, backgroundColor: '#e53935', px: 0.45, py: 0.1, borderRadius: '3px' }}>
                          <Typography sx={{ color: '#fff', fontSize: { xs: 7, md: 9.5 }, fontWeight: 'bold' }}>{t.newBadge}</Typography>
                        </Box>
                      )}

                      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 20, md: 30 }, color: 'rgba(255,255,255,0.85)' }} />
                      </Box>
                      <Box sx={{ position: 'absolute', right: 3, bottom: 3, display: 'flex', alignItems: 'center', gap: 0.2, px: 0.4, py: 0.12, borderRadius: 0.45, bgcolor: 'rgba(0,0,0,0.72)' }}>
                        <StarIcon sx={{ fontSize: { xs: 8.5, md: 11 }, color: '#ffb300' }} />
                        <Typography sx={{ color: '#fff', fontSize: { xs: 7.5, md: 10 }, fontWeight: 900 }}>{Number(item.rating).toFixed(1)}</Typography>
                      </Box>
                    </Box>

                    <Typography sx={{ fontWeight: 700, lineHeight: 1.25, fontSize: { xs: 9, md: 13 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: { xs: 7.5, md: 11 }, mt: 0.2 }} noWrap>{item.eps}</Typography>
                  </Box>
                ))}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 0.6, md: 1 }, pt: { xs: 2.5, md: 3.5 }, pb: { xs: 1, md: 2 }, px: 2 }}>
                  <Box
                    onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                    sx={{
                      px: { xs: 1.2, md: 2 }, height: { xs: 30, md: 38 }, display: 'flex', alignItems: 'center',
                      borderRadius: 1, border: '1px solid #333', bgcolor: '#1a1a1a',
                      color: currentPage === 1 ? '#444' : '#ccc', fontSize: { xs: 10.5, md: 13 }, fontWeight: 700,
                      cursor: currentPage === 1 ? 'default' : 'pointer',
                      '&:hover': currentPage > 1 ? { bgcolor: '#2a2a2a', borderColor: '#555' } : {}
                    }}
                  >
                    {t.prev}
                  </Box>

                  {getPageNumbers(currentPage, totalPages).map((n) => (
                    <Box
                      key={n}
                      onClick={() => goToPage(n)}
                      sx={{
                        width: { xs: 30, md: 38 }, height: { xs: 30, md: 38 }, display: 'grid', placeItems: 'center',
                        borderRadius: 1, border: `1px solid ${n === currentPage ? '#ff9800' : '#333'}`,
                        bgcolor: n === currentPage ? '#ff9800' : '#1a1a1a',
                        color: n === currentPage ? '#fff' : '#ccc',
                        fontSize: { xs: 11, md: 14 }, fontWeight: 800, cursor: 'pointer',
                        '&:hover': n !== currentPage ? { bgcolor: '#2a2a2a', borderColor: '#555' } : {}
                      }}
                    >
                      {n}
                    </Box>
                  ))}

                  <Box
                    onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                    sx={{
                      px: { xs: 1.2, md: 2 }, height: { xs: 30, md: 38 }, display: 'flex', alignItems: 'center',
                      borderRadius: 1, border: '1px solid #333', bgcolor: '#1a1a1a',
                      color: currentPage === totalPages ? '#444' : '#ccc', fontSize: { xs: 10.5, md: 13 }, fontWeight: 700,
                      cursor: currentPage === totalPages ? 'default' : 'pointer',
                      '&:hover': currentPage < totalPages ? { bgcolor: '#2a2a2a', borderColor: '#555' } : {}
                    }}
                  >
                    {t.next}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}
