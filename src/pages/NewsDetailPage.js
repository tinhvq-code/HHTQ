import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { BottomNav } from './AnimeMockPages.js';

const selectedNewsKey = 'selectedNewsDetail';
const savedNewsKey = 'savedNewsItems';

const splitMeta = (meta = '') => {
  const [tag = 'Tin Anime', time = 'Mới cập nhật'] = meta.split('/').map((part) => part.trim());
  return { tag, time };
};

const normalizeTag = (tag = '') => {
  if (/anime|tin tức anime/i.test(tag)) return 'Tin Anime';
  if (/phim|donghua/i.test(tag)) return 'Tin Phim';
  return tag || 'Tin Anime';
};

const fallbackNews = {
  title: 'Dragon Ball Z tái hiện lại ca khúc CHA-LA HEAD CHA-LA sau 30 năm',
  tag: 'Tin Anime',
  time: '8:10 Hôm nay',
  views: 'Đang cập nhật',
  img: 'https://placehold.co/800x450/2a2a2a/FFF?text=Anime+News'
};

const toNewsDetail = (item = {}) => {
  const meta = splitMeta(item.meta || item[1]);

  return {
    title: item.title || item[0] || fallbackNews.title,
    tag: normalizeTag(item.tag || meta.tag),
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

const readSavedNews = () => {
  try {
    const items = JSON.parse(window.localStorage.getItem(savedNewsKey));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const writeSavedNews = (items) => {
  window.localStorage.setItem(savedNewsKey, JSON.stringify(Array.isArray(items) ? items : []));
};

const isNewsSaved = (title) => readSavedNews().some((item) => item?.title === title);

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [news, setNews] = useState(readSelectedNews);
  const [latestNews, setLatestNews] = useState([]);
  const [saved, setSaved] = useState(() => isNewsSaved(readSelectedNews().title));
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (ignore) return;
        setLatestNews((data.news || []).map(toNewsDetail).filter((item) => item.title !== news.title).slice(0, 8));
      })
      .catch(() => {
        if (!ignore) setLatestNews([]);
      });

    return () => {
      ignore = true;
    };
  }, [news.title]);

  useEffect(() => {
    setSaved(isNewsSaved(news.title));
  }, [news.title]);

  const showNotice = (text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 1400);
  };

  const openRelatedNews = (item) => {
    window.localStorage.setItem(selectedNewsKey, JSON.stringify(item));
    setNews(toNewsDetail(item));
    setNotice('');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const toggleSaveNews = () => {
    const items = readSavedNews();
    const exists = items.some((item) => item?.title === news.title);

    if (exists) {
      writeSavedNews(items.filter((item) => item?.title !== news.title));
      setSaved(false);
      showNotice('Đã bỏ lưu tin');
      return;
    }

    writeSavedNews([{ ...news, savedAt: new Date().toISOString() }, ...items].slice(0, 50));
    setSaved(true);
    showNotice('Đã lưu tin');
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
        showNotice('Đã mở chia sẻ tin');
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      showNotice('Đã copy link tin');
    } catch {
      showNotice('Chưa thể chia sẻ tin');
    }
  };

  return (
    <PageShell title="Chi tiết tin tức">
      <PhoneFrame>
        <Box sx={{ height: '100%', bgcolor: '#101010', position: 'relative', color: '#fff' }}>
          <Box ref={scrollRef} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 9, md: 12 } }}>
            <Box sx={{ position: 'relative', pt: { xs: 0, md: 1.6 }, px: { xs: 0, md: 3 } }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1.1, md: 3 }, py: { xs: 0.9, md: 1.4 }, background: 'linear-gradient(to bottom, rgba(0,0,0,0.82), transparent)' }}>
                <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate(-1)}>
                  <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
                </IconButton>
                <Box>
                  <IconButton size="small" sx={{ color: saved ? '#ff9800' : '#fff', mr: 0.5, p: 0.55 }} onClick={toggleSaveNews}>
                    {saved ? <BookmarkIcon sx={{ fontSize: { xs: 19, md: 24 } }} /> : <BookmarkBorderIcon sx={{ fontSize: { xs: 19, md: 24 } }} />}
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={shareNews}>
                    <ShareIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', md: '50%' },
                  mx: 'auto',
                  aspectRatio: '16/9',
                  position: 'relative',
                  bgcolor: '#222',
                  borderRadius: { xs: 0, md: 1 },
                  overflow: 'hidden',
                  border: { xs: 0, md: '1px solid #2b2b2b' }
                }}
              >
                <img src={news.img} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)' }} />
                <Box sx={{ position: 'absolute', left: 10, bottom: 10, bgcolor: '#ff9800', color: '#fff', px: 0.8, py: 0.25, borderRadius: 0.5, fontSize: { xs: 9, md: 11 }, fontWeight: 900 }}>
                  {news.tag}
                </Box>
              </Box>
            </Box>

            <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.3, md: 2.4 } }}>
              <Typography sx={{ color: '#888', fontSize: { xs: 9.5, md: 12.5 }, fontWeight: 700, mb: 0.7 }}>
                {news.time} - {news.views}
              </Typography>

              <Typography sx={{ fontWeight: 900, lineHeight: 1.25, mb: 1, fontSize: { xs: 16, md: 23 } }}>
                {news.title}
              </Typography>

              {notice && (
                <Typography sx={{ color: '#ff9800', fontSize: { xs: 10.5, md: 13 }, fontWeight: 800, mb: 1 }}>
                  {notice}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: { xs: 0.6, md: 1 }, mb: { xs: 1.5, md: 2.2 }, overflowX: 'auto', scrollbarWidth: 'none' }}>
                <Button onClick={toggleSaveNews} size="small" startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />} sx={{ color: saved ? '#ff9800' : '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.8, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                  {saved ? 'Đã lưu' : 'Lưu tin'}
                </Button>
                <Button onClick={shareNews} size="small" startIcon={<ShareIcon />} sx={{ color: '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.8, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                  Chia sẻ
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: { xs: 1.6, md: 2.4 }, bgcolor: '#171717', border: '1px solid #252525', p: { xs: 1, md: 1.2 }, borderRadius: 1 }}>
                <Avatar sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, bgcolor: '#ff9800', fontSize: { xs: 12, md: 15 }, fontWeight: 900 }}>H</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 11.5, md: 14 } }}>HHTQ News</Typography>
                  <Typography sx={{ color: '#888', fontSize: { xs: 9.5, md: 12 } }}>Tin anime và phim Trung Quốc</Typography>
                </Box>
              </Box>

              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6, mb: 1.2, fontSize: { xs: 11, md: 14 } }}>
                {news.title} là tin mới được đồng bộ từ danh sách tin tức của HHTQ. Nội dung, hình ảnh và lượt quan tâm sẽ thay đổi theo tin bạn chọn ở trang chủ hoặc mục Tin tức.
              </Typography>

              <Typography sx={{ color: '#c2c2c2', lineHeight: 1.6, mb: 1.2, fontSize: { xs: 11, md: 14 } }}>
                Bản tin này giúp người xem nắm nhanh các cập nhật nổi bật về lịch chiếu, teaser, poster nhân vật và những thông tin đáng chú ý quanh các bộ anime, donghua đang được theo dõi.
              </Typography>

              <Typography sx={{ color: '#aaa', lineHeight: 1.55, mb: { xs: 2.2, md: 3 }, fontSize: { xs: 10.5, md: 13 } }}>
                Khi API tin tức riêng được mở rộng, phần bài viết có thể hiển thị thêm đoạn nội dung, nguồn tin, tác giả và thời gian xuất bản chi tiết.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 1.6 } }}>
                <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 }, mr: 0.6 }}>Tin mới nhất</Typography>
                <ArticleOutlinedIcon sx={{ color: '#ff9800', fontSize: { xs: 17, md: 22 } }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.45 } }}>
                {latestNews.map((item) => (
                  <Box key={`${item.title}-${item.time}`} sx={{ display: 'flex', gap: { xs: 1, md: 1.4 }, cursor: 'pointer', '&:hover': { opacity: 0.82 } }} onClick={() => openRelatedNews(item)}>
                    <Box sx={{ width: { xs: 86, md: 126 }, flexShrink: 0, borderRadius: 0.8, overflow: 'hidden', aspectRatio: '16/9', bgcolor: '#222' }}>
                      <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
