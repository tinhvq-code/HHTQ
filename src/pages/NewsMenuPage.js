import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { BottomNav } from './AnimeMockPages.js';

const selectedNewsKey = 'selectedNewsDetail';

const categories = ['Tất cả', 'Tin Anime', 'Tin Phim', 'Sự kiện', 'Đánh giá'];

const extraNewsItems = [
  {
    id: 'event-donghua-night',
    title: 'HHTQ tổ chức đêm xem chung các tập donghua mới trong tuần',
    time: 'Tối nay',
    tag: 'Sự kiện',
    views: '128k lượt quan tâm',
    img: '/assets/anime-08.jpg'
  },
  {
    id: 'event-ranking-vote',
    title: 'Mở bình chọn nhân vật được yêu thích nhất tháng này',
    time: '2 giờ trước',
    tag: 'Sự kiện',
    views: '204k lượt quan tâm',
    img: '/assets/anime-11.jpg'
  },
  {
    id: 'event-new-season',
    title: 'Sự kiện cập nhật lịch chiếu mùa mới cho các bộ đang hot',
    time: '1 ngày trước',
    tag: 'Sự kiện',
    views: '318k lượt quan tâm',
    img: '/assets/phim-anime-trung-quoc-14.jpg'
  },
  {
    id: 'review-muc-than-ky',
    title: 'Đánh giá nhanh Mục Thần Ký: nhịp phim chắc tay, hình ảnh nổi bật',
    time: '3 giờ trước',
    tag: 'Đánh giá',
    views: '276k lượt xem',
    img: '/assets/Muc-Than-Ky-12-hh3d.jpg'
  },
  {
    id: 'review-than-mo',
    title: 'Thần Mộ có đáng theo dõi sau các tập mới nhất?',
    time: '6 giờ trước',
    tag: 'Đánh giá',
    views: '193k lượt xem',
    img: '/assets/than-mo-800x1200.jpg'
  },
  {
    id: 'movie-special',
    title: 'Phim đặc biệt của Đấu La Đại Lục hé lộ thêm cảnh chiến đấu mới',
    time: '5 giờ trước',
    tag: 'Tin Phim',
    views: '421k lượt xem',
    img: '/assets/hq720.jpg'
  }
];

const splitMeta = (meta = '') => {
  const [tag = 'Tin Anime', time = 'Mới cập nhật'] = meta.split('/').map((part) => part.trim());
  return { tag, time };
};

const normalizeTag = (tag = '') => {
  if (/anime|tin tức anime/i.test(tag)) return 'Tin Anime';
  if (/phim|donghua/i.test(tag)) return 'Tin Phim';
  if (/sự kiện|event/i.test(tag)) return 'Sự kiện';
  if (/đánh giá|review/i.test(tag)) return 'Đánh giá';
  return tag || 'Tin Anime';
};

const toNewsItem = (item, index) => {
  const meta = splitMeta(item[1]);

  return {
    id: `${item[0]}-${index}`,
    title: item[0],
    time: meta.time,
    tag: normalizeTag(meta.tag),
    views: item[2],
    img: item[3]
  };
};

export default function NewsMenuPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [state, setState] = useState({ items: extraNewsItems, loading: true, error: '' });

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (!ignore) setState({ items: [...(data.news || []).map(toNewsItem), ...extraNewsItems], loading: false, error: '' });
      })
      .catch(() => {
        if (!ignore) setState({ items: extraNewsItems, loading: false, error: '' });
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    const itemsByCategory = activeCategory === 'Tất cả'
      ? state.items
      : state.items.filter((item) => item.tag === activeCategory);

    if (!keyword) return itemsByCategory;

    return itemsByCategory.filter((item) => `${item.title} ${item.tag}`.toLowerCase().includes(keyword));
  }, [activeCategory, searchText, state.items]);

  const featuredItem = filteredItems[0];
  const listItems = featuredItem ? filteredItems.slice(1) : filteredItems;

  const openNewsDetail = (item) => {
    window.localStorage.setItem(selectedNewsKey, JSON.stringify(item));
    navigate('/news-detail');
  };

  return (
    <PageShell title="Tin tức">
      <PhoneFrame>
        <Box sx={{ height: '100%', bgcolor: '#101010', color: '#fff', position: 'relative' }}>
          <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 9, md: 12 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1.1, md: 3 }, py: { xs: 0.9, md: 1.4 }, position: 'sticky', top: 0, bgcolor: 'rgba(16,16,16,0.97)', zIndex: 10, borderBottom: '1px solid #202020' }}>
              <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate('/home')}>
                <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
              </IconButton>
              <Typography sx={{ ml: 0.9, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>Tin tức</Typography>
            </Box>

            <Box sx={{ px: { xs: 1.4, md: 3 }, pt: { xs: 1.3, md: 2.2 }, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#1d1d1d', border: '1px solid #2a2a2a', borderRadius: 1, px: 1.2, height: { xs: 34, md: 44 }, mb: { xs: 1.2, md: 1.8 } }}>
                <SearchIcon sx={{ color: '#777', mr: 1, fontSize: { xs: 17, md: 22 } }} />
                <InputBase
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Tìm tin tức"
                  sx={{ color: '#fff', flex: 1, fontSize: { xs: 10.5, md: 14 }, fontWeight: 700 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 0.7, overflowX: 'auto', scrollbarWidth: 'none', mb: { xs: 1.5, md: 2.3 } }}>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    sx={{
                      bgcolor: activeCategory === cat ? '#ff9800' : '#222',
                      color: activeCategory === cat ? '#fff' : '#aaa',
                      border: `1px solid ${activeCategory === cat ? '#ff9800' : '#303030'}`,
                      borderRadius: 1,
                      textTransform: 'none',
                      minHeight: '28px !important',
                      minWidth: 'auto',
                      px: 1.2,
                      py: 0.35,
                      fontSize: { xs: 10, md: 13 },
                      whiteSpace: 'nowrap',
                      '&:hover': { bgcolor: activeCategory === cat ? '#e68a00' : '#2a2a2a' }
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 1.5 } }}>
                <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 } }}>Tin nổi bật</Typography>
                <ChevronRightIcon sx={{ fontSize: { xs: 18, md: 22 }, color: '#ff9800' }} />
              </Box>

              {state.loading ? (
                <Typography sx={{ color: '#aaa', fontSize: { xs: 10.5, md: 14 }, fontWeight: 800 }}>
                  Đang tải tin tức...
                </Typography>
              ) : filteredItems.length === 0 ? (
                <Box sx={{ minHeight: 220, display: 'grid', placeItems: 'center', textAlign: 'center', color: '#777' }}>
                  <Box>
                    <ArticleOutlinedIcon sx={{ fontSize: { xs: 64, md: 96 }, color: '#333', mb: 1 }} />
                    <Typography sx={{ color: '#ddd', fontSize: { xs: 12, md: 16 }, fontWeight: 800 }}>Không tìm thấy tin phù hợp</Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  {featuredItem && (
                    <Box onClick={() => openNewsDetail(featuredItem)} sx={{ cursor: 'pointer', mb: { xs: 1.7, md: 2.6 } }}>
                      <Box sx={{ position: 'relative', aspectRatio: '16/9', borderRadius: 1, overflow: 'hidden', bgcolor: '#222', mb: 0.8 }}>
                        <img src={featuredItem.img} alt={featuredItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72), transparent 55%)' }} />
                        <Box sx={{ position: 'absolute', left: 8, bottom: 8, bgcolor: '#ff9800', color: '#fff', px: 0.8, py: 0.2, borderRadius: 0.5, fontSize: { xs: 9, md: 11 }, fontWeight: 900 }}>
                          {featuredItem.tag}
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 900, fontSize: { xs: 14, md: 20 }, lineHeight: 1.25, mb: 0.45 }}>{featuredItem.title}</Typography>
                      <Typography sx={{ color: '#888', fontSize: { xs: 9.5, md: 12.5 }, fontWeight: 700 }}>{featuredItem.time} - {featuredItem.views}</Typography>
                    </Box>
                  )}

                  <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 }, mb: { xs: 1, md: 1.5 } }}>
                    Tin mới nhất
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.1, md: 1.7 } }}>
                    {listItems.map((item) => (
                      <Box key={item.id} onClick={() => openNewsDetail(item)} sx={{ display: 'flex', gap: { xs: 1, md: 1.5 }, cursor: 'pointer', '&:hover': { opacity: 0.82 } }}>
                        <Box sx={{ width: { xs: 94, md: 142 }, flexShrink: 0, borderRadius: 0.8, overflow: 'hidden', aspectRatio: '16/9', bgcolor: '#222' }}>
                          <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ color: '#ff9800', fontSize: { xs: 9, md: 11 }, mb: 0.25, fontWeight: 800 }}>{item.time}</Typography>
                          <Typography sx={{ fontWeight: 800, lineHeight: 1.28, mb: 0.45, fontSize: { xs: 10.5, md: 14 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.title}
                          </Typography>
                          <Typography sx={{ color: '#888', fontSize: { xs: 9, md: 11 } }}>{item.tag} - {item.views}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Box>
          <BottomNav active="home" />
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}
