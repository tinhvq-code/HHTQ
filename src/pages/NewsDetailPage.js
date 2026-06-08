import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { BottomNav } from './AnimeMockPages.js';

const selectedNewsKey = 'selectedNewsDetail';

const splitMeta = (meta = '') => {
  const [tag = 'Tin Anime', time = 'Mới cập nhật'] = meta.split('/').map((part) => part.trim());
  return { tag, time };
};

const fallbackNews = {
  title: 'Sau 30 năm, ca khúc CHA-LA HEAD CHA-LA của Dragon Ball Z được tái hiện trở lại!',
  tag: 'Tin Anime',
  time: '8:10 Hôm nay',
  views: 'Đang cập nhật',
  img: 'https://placehold.co/800x450/2a2a2a/FFF?text=Dragon+Ball+Cover'
};

const toNewsDetail = (item = {}) => {
  const meta = splitMeta(item.meta || item[1]);

  return {
    title: item.title || item[0] || fallbackNews.title,
    tag: item.tag || meta.tag,
    time: item.time || meta.time,
    views: item.views || item[2] || fallbackNews.views,
    img: item.img || item[3] || fallbackNews.img
  };
};

const readSelectedNews = () => {
  try {
    return toNewsDetail(JSON.parse(window.localStorage.getItem(selectedNewsKey)));
  } catch {
    return fallbackNews;
  }
};

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [news, setNews] = useState(readSelectedNews);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (ignore) return;
        setLatestNews((data.news || []).map(toNewsDetail).filter((item) => item.title !== news.title).slice(0, 6));
      })
      .catch(() => {
        if (!ignore) setLatestNews([]);
      });

    return () => {
      ignore = true;
    };
  }, [news.title]);

  const openRelatedNews = (item) => {
    window.localStorage.setItem(selectedNewsKey, JSON.stringify(item));
    setNews(toNewsDetail(item));
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const shareNews = async () => {
    const shareData = {
      title: news.title,
      text: news.title,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
    } catch {
      // Sharing is optional; keep the detail page stable if the browser blocks it.
    }
  };

  return (
    <PageShell title="Chi tiết Tin tức">
      <PhoneFrame>
        <Box sx={{ height: '100%', bgcolor: '#101010', position: 'relative', color: '#fff' }}>
          <Box ref={scrollRef} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 9, md: 12 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, md: 2.2 }, py: { xs: 0.8, md: 1.2 }, position: 'sticky', top: 0, bgcolor: 'rgba(16,16,16,0.96)', zIndex: 10, borderBottom: '1px solid #202020' }}>
              <IconButton size="small" sx={{ color: '#fff' }} onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
              </IconButton>
              <Box>
                <IconButton size="small" sx={{ color: '#fff', mr: 0.6 }}>
                  <BookmarkBorderIcon sx={{ fontSize: { xs: 19, md: 23 } }} />
                </IconButton>
                <IconButton size="small" sx={{ color: '#fff' }} onClick={shareNews}>
                  <ShareIcon sx={{ fontSize: { xs: 19, md: 23 } }} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ px: { xs: 1.2, md: 2.5 }, pt: { xs: 1.2, md: 2 }, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ backgroundColor: '#ff9800', px: 0.8, py: 0.2, borderRadius: 0.5 }}>
                  <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: 9, md: 11 } }}>{news.tag}</Typography>
                </Box>
                <Typography sx={{ color: '#888', fontSize: { xs: 9.5, md: 12 } }}>{news.time}</Typography>
              </Box>

              <Typography sx={{ fontWeight: 900, lineHeight: 1.28, mb: 1.2, fontSize: { xs: 15, md: 21 } }}>
                {news.title}
              </Typography>

              <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '58%' }, mx: 'auto', aspectRatio: '16/9', borderRadius: 1, overflow: 'hidden', mb: { xs: 1.4, md: 2 }, border: '1px solid #2a2a2a' }}>
                <img src={news.img} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>

              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.55, mb: 1.1, fontSize: { xs: 11, md: 14 } }}>
                {news.title} là tin mới được đồng bộ từ danh sách tin anime. Nội dung hiển thị theo tin bạn vừa chọn và sẽ cập nhật khi nguồn API có dữ liệu mới.
              </Typography>

              <Typography sx={{ color: '#b8b8b8', lineHeight: 1.5, mb: 2, fontSize: { xs: 10.5, md: 13 } }}>
                Lượt quan tâm: {news.views}. Các chi tiết bổ sung có thể được mở rộng khi API tin tức riêng sẵn sàng.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.2, backgroundColor: '#1d1d1d', p: { xs: 1, md: 1.2 }, borderRadius: 1 }}>
                <Avatar src="https://i.pravatar.cc/150?img=11" sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 11.5, md: 14 } }}>Phóng viên Wibu</Typography>
                  <Typography sx={{ color: '#888', fontSize: { xs: 9.5, md: 12 } }}>Chuyên gia săn tin Anime</Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: '#303030', mb: 1.8 }} />

              <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 1.2, fontSize: { xs: 12.5, md: 15 } }}>
                Tin mới nhất
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.25 } }}>
                {latestNews.map((item) => (
                  <Box key={`${item.title}-${item.time}`} sx={{ display: 'flex', gap: { xs: 1, md: 1.4 }, cursor: 'pointer', '&:hover': { opacity: 0.82 } }} onClick={() => openRelatedNews(item)}>
                    <Box sx={{ width: { xs: 82, md: 118 }, flexShrink: 0, borderRadius: 0.8, overflow: 'hidden', aspectRatio: '16/9', bgcolor: '#222' }}>
                      <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ color: '#ff9800', fontSize: { xs: 9, md: 11 }, mb: 0.25, fontWeight: 800 }}>{item.time}</Typography>
                      <Typography sx={{ fontWeight: 800, lineHeight: 1.28, mb: 0.45, fontSize: { xs: 10.5, md: 13.5 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: '#9a9a9a', fontSize: { xs: 9, md: 11 } }}>{item.tag}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <BottomNav active="home" />
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}
