import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, IconButton, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';
import { fetchHomeAnime } from '../services/animeApi.js';
import { getSessionUser, readUserList, writeUserList } from '../services/authSession.js';
import { BottomNav } from './AnimeMockPages.js';

const selectedMangaKey = 'selectedMangaDetail';
const favoriteMangaKey = 'favoriteMangaItems';
const followedMangaKey = 'followedMangaItems';
const MANGA_PAGE_SIZE = 10;

const fallbackManga = {
  title: 'Kingdom - Vương Giả Thiên Hạ',
  chap: 'Chap 01',
  views: '153.017 lượt đọc',
  img: 'https://placehold.co/400x600/2a2a2a/FFF?text=Kingdom'
};

const toMangaDetail = (item) => ({
  title: item?.title || item?.[0] || fallbackManga.title,
  chap: item?.chap || item?.[1] || fallbackManga.chap,
  views: item?.views || item?.[2] || fallbackManga.views,
  img: item?.img || item?.[3] || item?.[1] || fallbackManga.img
});

const readSelectedManga = () => {
  try {
    return toMangaDetail(JSON.parse(window.localStorage.getItem(selectedMangaKey)));
  } catch {
    return fallbackManga;
  }
};

const toRecommendedManga = (item, index) => ({
  id: `${item[0]}-${index}`,
  title: item[0],
  chap: item[1],
  views: item[2],
  img: item[3]
});

const toStoredMangaItem = (item) => [
  item.title,
  item.chap || 'Chap mới',
  item.views || 'Đang cập nhật lượt đọc',
  item.img,
  new Date().toISOString()
];

const hasStoredManga = (key, title) => readUserList(key).some((item) => item?.[0] === title);

const toggleStoredManga = (key, manga) => {
  const items = readUserList(key);
  const exists = items.some((item) => item?.[0] === manga.title);

  if (exists) {
    writeUserList(key, items.filter((item) => item?.[0] !== manga.title));
    return false;
  }

  writeUserList(key, [toStoredMangaItem(manga), ...items]);
  return true;
};

const getPageNumbers = (current, total) => {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 1, total - 3));
  return [start, start + 1, start + 2, start + 3];
};

const getChapterNumber = (chap) => {
  const found = String(chap || '').match(/\d+/);
  return found ? Math.max(1, Number(found[0])) : 6;
};

export default function MangaDetailPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('chapters');
  const [manga, setManga] = useState(readSelectedManga);
  const [recommendedManga, setRecommendedManga] = useState([]);
  const [apiError, setApiError] = useState('');
  const [isLiked, setIsLiked] = useState(() => hasStoredManga(favoriteMangaKey, readSelectedManga().title));
  const [isFollowed, setIsFollowed] = useState(() => hasStoredManga(followedMangaKey, readSelectedManga().title));
  const [notice, setNotice] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [homePage, setHomePage] = useState(1);

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (ignore) return;

        const storedManga = readSelectedManga();
        const detail = storedManga.title === fallbackManga.title ? toMangaDetail(data.mangaRanking[0]) : storedManga;

        setManga(detail);
        setRecommendedManga(data.mangaRanking.filter((item) => item[0] !== detail.title).slice(0, 40).map(toRecommendedManga));
        setApiError('');
      })
      .catch((error) => {
        if (!ignore) setApiError(error?.message || 'Không thể tải dữ liệu truyện');
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setIsLiked(hasStoredManga(favoriteMangaKey, manga.title));
    setIsFollowed(hasStoredManga(followedMangaKey, manga.title));
    setCommentText('');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [manga.title]);

  const chapterItems = useMemo(() => {
    const latest = Math.max(6, getChapterNumber(manga.chap));
    return Array.from({ length: latest }, (_, index) => {
      const chapter = latest - index;
      return {
        id: chapter,
        title: `Chap ${String(chapter).padStart(2, '0')}`,
        views: manga.views,
        img: manga.img
      };
    });
  }, [manga]);

  const topManga = recommendedManga.slice(0, 10).map((item, index) => ({ ...item, rank: index + 1 }));
  const tags = [`Truyện ${manga.title}`, `${manga.title} ${manga.chap}`, 'Manhua', 'Đọc truyện online'];

  const showNotice = (text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 1400);
  };

  const likeManga = () => {
    const active = toggleStoredManga(favoriteMangaKey, manga);
    setIsLiked(active);
    showNotice(active ? 'Đã thêm vào truyện đã thích' : 'Đã hủy thích truyện');
  };

  const followManga = () => {
    const active = toggleStoredManga(followedMangaKey, manga);
    setIsFollowed(active);
    showNotice(active ? 'Đã thêm vào truyện đã theo dõi' : 'Đã hủy theo dõi truyện');
  };

  const shareManga = async () => {
    const shareData = {
      title: manga.title,
      text: `${manga.title} - ${manga.chap}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showNotice('Đã mở chia sẻ truyện');
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      showNotice('Đã copy link truyện');
    } catch {
      showNotice('Chưa thể chia sẻ truyện');
    }
  };

  const openRecommendedManga = (item) => {
    window.localStorage.setItem(selectedMangaKey, JSON.stringify(item));
    setManga(toMangaDetail(item));
    setActiveTab('chapters');
    setHomePage(1);
    setNotice('');
  };

  const submitComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    const user = getSessionUser();
    setComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        mangaTitle: manga.title,
        name: user?.fullName || 'Bạn',
        text,
        createdAt: new Date().toLocaleDateString('vi-VN')
      }
    ]);
    setCommentText('');
  };

  return (
    <PageShell title="Chi tiết truyện">
      <PhoneFrame>
        <Box sx={{ height: '100%', bgcolor: '#101010', position: 'relative', color: '#fff' }}>
          <Box ref={scrollRef} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 9, md: 12 } }}>
            <Box sx={{ position: 'relative', pt: { xs: 0, md: 1.6 }, px: { xs: 0, md: 3 } }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', px: { xs: 1.1, md: 3 }, py: { xs: 0.9, md: 1.4 }, background: 'linear-gradient(to bottom, rgba(0,0,0,0.82), transparent)' }}>
                <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate(-1)}>
                  <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
                </IconButton>
                <Typography sx={{ ml: 0.9, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>Truyện tranh</Typography>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', md: '50%' },
                  mx: 'auto',
                  aspectRatio: '16/9',
                  position: 'relative',
                  backgroundColor: '#222',
                  borderRadius: { xs: 0, md: 1 },
                  overflow: 'hidden',
                  border: { xs: 0, md: '1px solid #2b2b2b' }
                }}
              >
                <img src={manga.img} alt={manga.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 55%)' }} />
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: 52, md: 72 }, height: { xs: 52, md: 72 }, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.22)' }}>
                  <MenuBookOutlinedIcon sx={{ fontSize: { xs: 28, md: 38 }, color: 'rgba(255,255,255,0.9)' }} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.3, md: 2.4 } }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 15, md: 22 }, mb: 0.35 }}>{manga.title} - {manga.chap}</Typography>
              <Typography sx={{ color: '#aaa', fontSize: { xs: 10.5, md: 14 }, mb: { xs: 1.2, md: 2 } }}>{manga.views}</Typography>
              {notice && (
                <Typography sx={{ color: '#ff9800', fontSize: { xs: 10.5, md: 13 }, fontWeight: 800, mb: 1 }}>
                  {notice}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1.2 }, mb: { xs: 1.2, md: 2 }, overflowX: 'auto', scrollbarWidth: 'none' }}>
                <Button onClick={likeManga} size="small" startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />} sx={{ color: isLiked ? '#ff9800' : '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                  {isLiked ? 'Đã thích' : 'Thích'}
                </Button>
                <Button onClick={followManga} size="small" startIcon={isFollowed ? <BookmarkIcon /> : <BookmarkBorderIcon />} sx={{ color: isFollowed ? '#ff9800' : '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                  {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
                </Button>
                <Button onClick={shareManga} size="small" startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ color: '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                  Chia sẻ
                </Button>
              </Box>

              <Box sx={{ display: 'flex', borderBottom: '1px solid #1e1e1e', mt: { xs: 0.6, md: 1 } }}>
                {[
                  { key: 'chapters', label: 'Danh sách chương' },
                  { key: 'comments', label: `${comments.filter((c) => c.mangaTitle === manga.title).length} Bình luận` }
                ].map(({ key, label }) => (
                  <Box
                    key={key}
                    onClick={() => setActiveTab(key)}
                    sx={{
                      px: { xs: 1.4, md: 2 },
                      py: { xs: 1.1, md: 1.4 },
                      borderBottom: `2px solid ${activeTab === key ? '#ff9800' : 'transparent'}`,
                      mb: '-1px',
                      color: activeTab === key ? '#fff' : '#666',
                      fontSize: { xs: 11.5, md: 15 },
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      userSelect: 'none'
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>

              {activeTab === 'chapters' && (
                <Box sx={{ pt: { xs: 1.4, md: 2 }, mb: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.6 }, mb: { xs: 2, md: 3 } }}>
                    {chapterItems.map((chapter) => (
                      <Box key={chapter.id} onClick={() => showNotice(`Đang mở ${chapter.title}`)} sx={{ display: 'flex', gap: { xs: 1, md: 1.6 }, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                        <Box sx={{ position: 'relative', width: { xs: 86, md: 130 }, height: { xs: 54, md: 78 }, borderRadius: 0.8, overflow: 'hidden', flexShrink: 0, bgcolor: '#222' }}>
                          <img src={chapter.img} alt={chapter.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', bgcolor: 'rgba(0,0,0,0.18)' }}>
                            <MenuBookOutlinedIcon sx={{ fontSize: { xs: 18, md: 24 }, color: 'rgba(255,255,255,0.82)' }} />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                          <Typography sx={{ color: '#ff9800', fontWeight: 'bold', fontSize: { xs: 9.5, md: 12 } }}>{manga.title}</Typography>
                          <Typography sx={{ fontWeight: 'bold', fontSize: { xs: 11.5, md: 15 } }}>{chapter.title}</Typography>
                          <Typography sx={{ color: '#aaa', fontSize: { xs: 9, md: 12 } }}>{chapter.views}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Typography sx={{ fontWeight: 'bold', fontSize: { xs: 12.5, md: 16 }, mb: 0.8 }}>THÔNG TIN TRUYỆN</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 0.4 }}>Thể loại: Viễn tưởng, Đời thường</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 0.4 }}>Nhóm dịch: A3DD</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 1.2 }}>Chương hiện tại: {manga.chap}</Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    <Typography sx={{ color: '#aaa', mr: 0.5, alignSelf: 'center', fontSize: { xs: 10, md: 13 } }}>Từ khóa:</Typography>
                    {tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#222', color: '#aaa', height: { xs: 22, md: 28 }, fontSize: { xs: 9, md: 12 }, borderRadius: 0.8 }} />
                    ))}
                  </Box>

                  <Typography sx={{ color: '#ccc', lineHeight: 1.45, fontSize: { xs: 10.5, md: 14 } }}>
                    {manga.title} đang nằm trong danh sách truyện được cập nhật từ API. Nội dung, lượt đọc và hình ảnh được đồng bộ theo truyện bạn chọn từ bảng xếp hạng hoặc menu Truyện tranh.
                  </Typography>
                  {apiError && (
                    <Typography sx={{ color: '#ffb74d', mt: 1, fontSize: { xs: 10.5, md: 14 }, fontWeight: 700 }}>
                      Lỗi API: {apiError}
                    </Typography>
                  )}
                </Box>
              )}

              {activeTab === 'comments' && (
                <Box sx={{ pt: { xs: 1.4, md: 2 }, mb: { xs: 2.4, md: 3.2 } }}>
                  <Box component="form" onSubmit={submitComment} sx={{ border: '1px solid #2a2a2a', borderRadius: 1, overflow: 'hidden', mb: { xs: 1.4, md: 2 } }}>
                    <Box
                      component="textarea"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Nhập bình luận..."
                      rows={3}
                      sx={{ width: '100%', display: 'block', bgcolor: '#161616', border: 0, outline: 0, color: '#ddd', fontSize: { xs: 10.5, md: 14 }, fontFamily: 'Roboto, Arial, sans-serif', resize: 'none', px: 1.2, py: 1, boxSizing: 'border-box' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1, py: 0.8, bgcolor: '#141414', borderTop: '1px solid #1e1e1e' }}>
                      <Typography sx={{ flex: 1, color: '#777', fontSize: { xs: 10, md: 13 } }}>{getSessionUser()?.fullName || 'Bạn'}</Typography>
                      <Button onClick={() => setCommentText('')} sx={{ color: '#666', textTransform: 'none', minHeight: '26px !important', px: 0.9, py: 0.3, fontSize: { xs: 10, md: 13 } }}>
                        Hủy
                      </Button>
                      <Button type="submit" variant="contained" disabled={!commentText.trim()} sx={{ bgcolor: '#ff9800', color: '#fff', boxShadow: 'none', textTransform: 'none', minHeight: '26px !important', px: 1.2, py: 0.3, fontSize: { xs: 10, md: 13 }, '&:hover': { bgcolor: '#e68a00', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: '#2a2a2a', color: '#555' } }}>
                        Bình luận
                      </Button>
                    </Box>
                  </Box>

                  <Box>
                    {comments.filter((comment) => comment.mangaTitle === manga.title).map((comment) => (
                      <Box key={comment.id} sx={{ pt: { xs: 1.2, md: 1.6 }, pb: { xs: 1, md: 1.4 }, borderBottom: '1px solid #1a1a1a' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                          <Typography sx={{ color: '#ff9800', fontWeight: 800, fontSize: { xs: 10.5, md: 14 } }}>{comment.name}</Typography>
                          <Typography sx={{ color: '#444', fontSize: { xs: 9, md: 11.5 } }}>{comment.createdAt}</Typography>
                        </Box>
                        <Typography sx={{ color: '#ccc', fontSize: { xs: 10.5, md: 13.5 }, lineHeight: 1.5 }}>{comment.text}</Typography>
                      </Box>
                    ))}
                    {!comments.some((comment) => comment.mangaTitle === manga.title) && (
                      <Typography sx={{ color: '#666', fontSize: { xs: 10.5, md: 13 }, py: 2 }}>
                        Chưa có bình luận cho truyện này.
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 1.6 } }}>
                <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 }, mr: 0.6 }}>TOP 10</Typography>
                <Box sx={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3].map((n) => (
                    <Box key={n} sx={{ width: { xs: 5, md: 7 }, height: { xs: 12, md: 17 }, bgcolor: n === 1 ? '#ff9800' : n === 2 ? '#f06000' : '#c04000', borderRadius: '1px' }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: { xs: '8px 6px', md: '14px 10px' }, mb: { xs: 2, md: 3 } }}>
                {topManga.map((item) => (
                  <Box key={item.id} onClick={() => openRecommendedManga(item)} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                    <Box sx={{ position: 'relative', borderRadius: 0.7, overflow: 'hidden', aspectRatio: '2/3', mb: 0.5 }}>
                      <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <Box sx={{ position: 'absolute', left: 0, bottom: 0, minWidth: { xs: 16, md: 22 }, height: { xs: 16, md: 22 }, px: 0.4, bgcolor: item.rank <= 3 ? '#ff9800' : 'rgba(0,0,0,0.72)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: { xs: 9, md: 12 }, fontWeight: 900, borderTopRightRadius: 4 }}>
                        {item.rank}
                      </Box>
                    </Box>
                    <Typography sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: 9, md: 12 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#ddd' }}>
                      {item.title}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {recommendedManga.length > 0 && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 1.6 }, mt: { xs: 0.5, md: 1 }, cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 } }}>TRUYỆN TRANH MỚI NHẤT</Typography>
                    <ChevronRightIcon sx={{ fontSize: { xs: 18, md: 22 } }} />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(4, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '16px 8px', md: '20px 12px' }, mb: { xs: 1.6, md: 2 } }}>
                    {recommendedManga.slice((homePage - 1) * MANGA_PAGE_SIZE, homePage * MANGA_PAGE_SIZE).map((item) => (
                      <Box key={item.id} onClick={() => openRecommendedManga(item)} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                        <Box sx={{ position: 'relative', borderRadius: 0.7, overflow: 'hidden', aspectRatio: '2/3', mb: 0.5 }}>
                          <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          <Box sx={{ position: 'absolute', left: 3, bottom: 3, px: 0.5, py: 0.15, borderRadius: 0.5, bgcolor: 'rgba(0,0,0,0.75)', color: '#ff9800', fontSize: { xs: 7.5, md: 10 }, fontWeight: 800 }}>
                            {item.chap}
                          </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 700, lineHeight: 1.25, fontSize: { xs: 9, md: 12 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#ddd' }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ color: '#888', fontSize: { xs: 7.5, md: 11 }, mt: 0.2 }} noWrap>{item.views}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {Math.ceil(recommendedManga.length / MANGA_PAGE_SIZE) > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 0.6, md: 1 }, pb: { xs: 1.5, md: 2 } }}>
                      <Box onClick={() => homePage > 1 && setHomePage(homePage - 1)} sx={{ px: { xs: 1.2, md: 2 }, height: { xs: 28, md: 36 }, display: 'flex', alignItems: 'center', borderRadius: 1, border: '1px solid #333', bgcolor: '#1a1a1a', color: homePage === 1 ? '#444' : '#ccc', fontSize: { xs: 10.5, md: 13 }, fontWeight: 700, cursor: homePage === 1 ? 'default' : 'pointer' }}>
                        Trước
                      </Box>
                      {getPageNumbers(homePage, Math.ceil(recommendedManga.length / MANGA_PAGE_SIZE)).map((n) => (
                        <Box key={n} onClick={() => setHomePage(n)} sx={{ width: { xs: 28, md: 36 }, height: { xs: 28, md: 36 }, display: 'grid', placeItems: 'center', borderRadius: 1, border: `1px solid ${n === homePage ? '#ff9800' : '#333'}`, bgcolor: n === homePage ? '#ff9800' : '#1a1a1a', color: n === homePage ? '#fff' : '#ccc', fontSize: { xs: 11, md: 14 }, fontWeight: 800, cursor: 'pointer' }}>
                          {n}
                        </Box>
                      ))}
                      <Box onClick={() => homePage < Math.ceil(recommendedManga.length / MANGA_PAGE_SIZE) && setHomePage(homePage + 1)} sx={{ px: { xs: 1.2, md: 2 }, height: { xs: 28, md: 36 }, display: 'flex', alignItems: 'center', borderRadius: 1, border: '1px solid #333', bgcolor: '#1a1a1a', color: homePage === Math.ceil(recommendedManga.length / MANGA_PAGE_SIZE) ? '#444' : '#ccc', fontSize: { xs: 10.5, md: 13 }, fontWeight: 700, cursor: homePage === Math.ceil(recommendedManga.length / MANGA_PAGE_SIZE) ? 'default' : 'pointer' }}>
                        Sau
                      </Box>
                    </Box>
                  )}
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
