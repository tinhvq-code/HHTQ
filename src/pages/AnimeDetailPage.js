import { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Button, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
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
import { readUserList, writeUserList } from '../services/authSession.js';
import { fetchYouTubeVideoData } from '../services/youtubeApi.js';
import { BottomNav } from './AnimeMockPages.js';

const selectedAnimeKey = 'selectedAnimeDetail';
const watchedAnimeKey = 'watchedAnimeItems';
const favoriteAnimeKey = 'favoriteAnimeItems';
const followedAnimeKey = 'followedAnimeItems';

const episodes = [
  { id: 1, title: 'Tập 1', views: '432K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+1' },
  { id: 2, title: 'Tập 2', views: '321K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+2' },
  { id: 3, title: 'Tập 3', views: '310K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+3' },
  { id: 4, title: 'Tập 4', views: '309K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+4' }
];

const fallbackAnime = {
  title: 'Eden',
  eps: 'Tập 1',
  views: '522.000 lượt xem',
  img: 'https://placehold.co/600x337/333/FFF?text=Anime',
  trailer: null,
  genres: []
};

const toAnimeDetail = (item) => ({
  title: item?.title || item?.[0] || fallbackAnime.title,
  views: item?.views || item?.[1] || fallbackAnime.views,
  eps: item?.eps || item?.[2] || fallbackAnime.eps,
  img: item?.img || item?.[3] || fallbackAnime.img,
  trailer: item?.trailer || item?.[4] || null,
  genres: item?.genres || item?.[5] || []
});

const toRecommendedAnime = (item, index) => ({
  id: `${item[0]}-${index}`,
  title: item[0],
  views: item[1],
  eps: item[2],
  img: item[3],
  trailer: item[4] || null,
  genres: item[5] || []
});

const trailerUrl = (trailer) => {
  if (!trailer?.id || trailer.site !== 'youtube') return '';
  return `https://www.youtube.com/embed/${trailer.id}`;
};

const readSelectedAnime = () => {
  try {
    return toAnimeDetail(JSON.parse(window.localStorage.getItem(selectedAnimeKey)));
  } catch {
    return fallbackAnime;
  }
};

const readStoredList = (key) => {
  return readUserList(key);
};

const writeStoredList = (key, items) => {
  writeUserList(key, items);
};

const toStoredVideoItem = (item) => [
  item.title,
  item.eps || 'Tập mới',
  item.views || 'Đang cập nhật lượt xem',
  item.img,
  item.trailer || null,
  item.genres || []
];

const hasStoredAnime = (key, title) => {
  return readStoredList(key).some((item) => item?.[0] === title);
};

const toggleStoredAnime = (key, anime) => {
  const items = readStoredList(key);
  const exists = items.some((item) => item?.[0] === anime.title);

  if (exists) {
    writeStoredList(
      key,
      items.filter((item) => item?.[0] !== anime.title)
    );
    return false;
  }

  writeStoredList(key, [toStoredVideoItem(anime), ...items]);
  return true;
};

const rememberWatchedAnime = (anime) => {
  if (!anime?.title) return;

  const items = readStoredList(watchedAnimeKey).filter((item) => item?.[0] !== anime.title);
  writeStoredList(watchedAnimeKey, [toStoredVideoItem(anime), ...items].slice(0, 80));
};

export default function AnimeDetailPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [viewMode, setViewMode] = useState('trailer');
  const [anime, setAnime] = useState(readSelectedAnime);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [youtubeData, setYoutubeData] = useState(null);
  const [youtubeError, setYoutubeError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(() => hasStoredAnime(favoriteAnimeKey, readSelectedAnime().title));
  const [isFollowed, setIsFollowed] = useState(() => hasStoredAnime(followedAnimeKey, readSelectedAnime().title));
  const [notice, setNotice] = useState('');
  const [comments, setComments] = useState([
    { id: 1, name: 'HHTQ Fan', text: 'Phim này hình ảnh ổn, chờ thêm tập mới.' },
    { id: 2, name: 'Anime Lover', text: 'Có trailer là tiện xem trước hơn nhiều.' }
  ]);

  useEffect(() => {
    let ignore = false;

    fetchHomeAnime()
      .then((data) => {
        if (ignore) return;

        const storedAnime = readSelectedAnime();
        const detail = storedAnime.title === fallbackAnime.title ? toAnimeDetail(data.latestAnime[0]) : storedAnime;
        setAnime(detail);
        setRecommendedAnime(data.latestAnime.filter((item) => item[0] !== detail.title).slice(0, 5).map(toRecommendedAnime));
      })
      .catch(() => {
        if (!ignore) setRecommendedAnime([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const videoId = anime.trailer?.id;

    if (!videoId) {
      setYoutubeData(null);
      setYoutubeError('');
      return undefined;
    }

    let ignore = false;
    setYoutubeData(null);
    setYoutubeError('');

    fetchYouTubeVideoData(videoId)
      .then((data) => {
        if (!ignore) setYoutubeData(data);
      })
      .catch((error) => {
        if (!ignore) setYoutubeError(error?.message || 'Không thể tải dữ liệu YouTube');
      });

    return () => {
      ignore = true;
    };
  }, [anime.trailer?.id]);

  useEffect(() => {
    setIsLiked(hasStoredAnime(favoriteAnimeKey, anime.title));
    setIsFollowed(hasStoredAnime(followedAnimeKey, anime.title));
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [anime.title]);

  const episodeItems = episodes.map((episode) => ({
    ...episode,
    img: anime.img,
    views: anime.views
  }));
  const tags = [anime.title, `${anime.title} Vietsub`, `${anime.title} HD`, anime.eps];
  const genreText = anime.genres?.length ? anime.genres.join(', ') : 'Đang cập nhật';
  const activeTrailerUrl = trailerUrl(anime.trailer);

  useEffect(() => {
    if (viewMode === 'trailer' && activeTrailerUrl) {
      rememberWatchedAnime(anime);
    }
  }, [activeTrailerUrl, anime, viewMode]);

  const resetDetailView = () => {
    setViewMode('trailer');
    setNotice('');
    setCommentText('');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const showTrailer = () => {
    rememberWatchedAnime(anime);
    setViewMode('trailer');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const showEpisodes = () => {
    rememberWatchedAnime(anime);
    setViewMode('episodes');
  };
  const watchEpisode = () => {
    rememberWatchedAnime(anime);
    showNotice('Đã lưu vào lịch sử xem');
  };
  const showNotice = (text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 1400);
  };
  const likeAnime = () => {
    const active = toggleStoredAnime(favoriteAnimeKey, anime);
    setIsLiked(active);
    showNotice(active ? 'Đã thêm vào phim đã thích' : 'Đã hủy thích phim');
  };
  const followAnime = () => {
    const active = toggleStoredAnime(followedAnimeKey, anime);
    setIsFollowed(active);
    showNotice(active ? 'Đã thêm vào phim đã theo dõi' : 'Đã hủy theo dõi phim');
  };
  const shareAnime = async () => {
    const shareData = {
      title: anime.title,
      text: `${anime.title} - ${anime.eps}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showNotice('Đã mở chia sẻ phim');
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      showNotice('Đã copy link phim');
    } catch {
      showNotice('Chưa thể chia sẻ phim');
    }
  };
  const openRecommendedAnime = (item) => {
    window.localStorage.setItem(selectedAnimeKey, JSON.stringify(item));
    setAnime(toAnimeDetail(item));
    resetDetailView();
  };
  const submitComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    setComments((current) => [{ id: Date.now(), name: 'Bạn', text }, ...current]);
    setCommentText('');
  };

  return (
    <PageShell title="Chi tiết Anime">
      <PhoneFrame>
        <Box sx={{ height: '100%', bgcolor: '#101010', position: 'relative', color: '#fff' }}>
          <Box ref={scrollRef} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', pb: { xs: 9, md: 12 } }}>
            <Box sx={{ position: 'relative', pt: { xs: 0, md: 1.6 }, px: { xs: 0, md: 3 } }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', px: { xs: 1.1, md: 3 }, py: { xs: 0.9, md: 1.4 }, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
              <IconButton size="small" sx={{ color: '#fff', p: 0.55 }} onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: { xs: 19, md: 24 } }} />
              </IconButton>
              <Typography sx={{ ml: 0.9, fontWeight: 800, fontSize: { xs: 13, md: 18 } }}>Anime</Typography>
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
              {activeTrailerUrl && viewMode === 'trailer' ? (
                <Box
                  component="iframe"
                  src={activeTrailerUrl}
                  title={`${anime.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
                />
              ) : (
                <>
                  <img src={anime.img} alt={anime.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 38, md: 52 }, color: 'rgba(255,255,255,0.8)' }} />
                  </Box>
                </>
              )}
            </Box>
          </Box>

            <Box sx={{ px: { xs: 1.4, md: 3 }, py: { xs: 1.3, md: 2.4 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 15, md: 22 }, mb: 0.35 }}>{anime.title} - {anime.eps}</Typography>
            <Typography sx={{ color: '#aaa', fontSize: { xs: 10.5, md: 14 }, mb: { xs: 1.2, md: 2 } }}>{anime.views}</Typography>
            {notice && (
              <Typography sx={{ color: '#ff9800', fontSize: { xs: 10.5, md: 13 }, fontWeight: 800, mb: 1 }}>
                {notice}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1.2 }, mb: { xs: 1.2, md: 2 }, overflowX: 'auto', scrollbarWidth: 'none' }}>
              <Button onClick={likeAnime} size="small" startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />} sx={{ color: isLiked ? '#ff9800' : '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                {isLiked ? 'Đã thích' : 'Thích'}
              </Button>
              <Button onClick={followAnime} size="small" startIcon={isFollowed ? <BookmarkIcon /> : <BookmarkBorderIcon />} sx={{ color: isFollowed ? '#ff9800' : '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
              </Button>
              <Button onClick={shareAnime} size="small" startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ color: '#aaa', textTransform: 'none', minHeight: '28px !important', px: 0.7, fontSize: { xs: 9.5, md: 13 }, whiteSpace: 'nowrap' }}>
                Chia sẻ
              </Button>
            </Box>

            <Divider sx={{ borderColor: '#333', mb: { xs: 1.2, md: 2 } }} />

            <Box sx={{ display: 'flex', gap: 0.7, mb: { xs: 1.4, md: 2 } }}>
              <Button
                onClick={showTrailer}
                sx={{ backgroundColor: viewMode === 'trailer' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', minHeight: '30px !important', px: 1.2, py: 0.35, borderRadius: 0.7, border: viewMode === 'trailer' ? '1px solid #ff9800' : '1px solid #333', fontSize: { xs: 10.5, md: 13 } }}
              >
                Trailer
              </Button>
              <Button
                onClick={showEpisodes}
                sx={{ backgroundColor: viewMode === 'episodes' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', minHeight: '30px !important', px: 1.2, py: 0.35, borderRadius: 0.7, border: viewMode === 'episodes' ? '1px solid #ff9800' : '1px solid #333', fontSize: { xs: 10.5, md: 13 } }}
              >
                Xem phim
              </Button>
            </Box>

            <Box sx={{ minHeight: { xs: 160, md: 220 }, mb: { xs: 2, md: 3 } }}>
              {viewMode === 'trailer' && (
                <Box sx={{ mb: { xs: 2, md: 3 } }}>
                  <Typography sx={{ color: activeTrailerUrl ? '#ccc' : '#ffb74d', lineHeight: 1.45, fontSize: { xs: 10.5, md: 14 } }}>
                    {activeTrailerUrl ? 'Trailer đang phát ở khung phía trên.' : 'Phim này chưa có trailer từ API, đang hiển thị ảnh đại diện ở khung phía trên.'}
                  </Typography>
                  {activeTrailerUrl && (
                    <Box sx={{ mt: 1, p: { xs: 1, md: 1.4 }, bgcolor: '#181818', border: '1px solid #2c2c2c', borderRadius: 0.8 }}>
                      <Typography sx={{ color: '#ff9800', fontSize: { xs: 10, md: 13 }, fontWeight: 800, mb: 0.35 }}>
                        Dữ liệu YouTube
                      </Typography>
                      {youtubeData ? (
                        <>
                          <Typography sx={{ color: '#f2f2f2', fontSize: { xs: 11, md: 15 }, fontWeight: 800, lineHeight: 1.25 }}>
                            {youtubeData.title}
                          </Typography>
                          <Typography sx={{ color: '#aaa', fontSize: { xs: 9.5, md: 13 }, mt: 0.45 }}>
                            {[youtubeData.channelTitle, youtubeData.views, youtubeData.source].filter(Boolean).join(' - ')}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ color: youtubeError ? '#ffb74d' : '#aaa', fontSize: { xs: 9.5, md: 13 } }}>
                          {youtubeError || 'Đang tải dữ liệu YouTube...'}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )}

              {viewMode === 'episodes' && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.6 }, mb: { xs: 2, md: 3 } }}>
                    {episodeItems.map((ep) => (
                      <Box key={ep.id} onClick={watchEpisode} sx={{ display: 'flex', gap: { xs: 1, md: 1.6 }, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                        <Box sx={{ position: 'relative', width: { xs: 86, md: 130 }, height: { xs: 54, md: 78 }, borderRadius: 0.8, overflow: 'hidden', flexShrink: 0 }}>
                          <img src={ep.img} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <PlayCircleOutlinedIcon sx={{ fontSize: { xs: 20, md: 26 }, color: 'rgba(255,255,255,0.8)' }} />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Typography sx={{ color: '#ff9800', fontWeight: 'bold', fontSize: { xs: 9.5, md: 12 } }}>{anime.title}</Typography>
                          <Typography sx={{ fontWeight: 'bold', fontSize: { xs: 11.5, md: 15 } }}>{ep.title}</Typography>
                          <Typography sx={{ color: '#aaa', fontSize: { xs: 9, md: 12 } }}>{ep.views}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Typography sx={{ fontWeight: 'bold', fontSize: { xs: 12.5, md: 16 }, mb: 0.8 }}>THÔNG TIN PHIM</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 0.4 }}>Thể loại: {genreText}</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 0.4 }}>Nhóm sub: Phim1080</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: { xs: 10, md: 13 }, mb: 1.2 }}>Tổng số tập: {anime.eps}</Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    <Typography sx={{ color: '#aaa', mr: 0.5, alignSelf: 'center', fontSize: { xs: 10, md: 13 } }}>Từ khóa:</Typography>
                    {tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#222', color: '#aaa', height: { xs: 22, md: 28 }, fontSize: { xs: 9, md: 12 }, borderRadius: 0.8 }} />
                    ))}
                  </Box>

                  <Typography sx={{ color: '#ccc', lineHeight: 1.45, fontSize: { xs: 10.5, md: 14 } }}>
                    {anime.title} đang nằm trong danh sách anime được cập nhật từ API. Nội dung, lượt xem và hình ảnh được đồng bộ theo phim bạn chọn từ bảng xếp hạng hoặc menu Anime.
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: '#333', mb: { xs: 2, md: 3 } }} />

            <Box sx={{ mb: { xs: 2.4, md: 3.2 } }}>
              <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 }, mb: { xs: 1, md: 1.5 } }}>
                BÌNH LUẬN
              </Typography>
              <Box component="form" onSubmit={submitComment} sx={{ display: 'flex', gap: 0.8, mb: { xs: 1.4, md: 2 } }}>
                <Box
                  component="input"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Viết bình luận..."
                  sx={{ flex: 1, minWidth: 0, height: { xs: 32, md: 42 }, px: 1.1, border: '1px solid #333', borderRadius: 0.7, bgcolor: '#181818', color: '#fff', outline: 0, fontSize: { xs: 10.5, md: 14 }, fontFamily: 'Roboto, Arial, sans-serif' }}
                />
                <Button type="submit" variant="contained" sx={{ bgcolor: '#ff9800', color: '#fff', boxShadow: 'none', minHeight: '32px !important', px: 1.4, fontSize: { xs: 10.5, md: 13 }, '&:hover': { bgcolor: '#e68a00', boxShadow: 'none' } }}>
                  Gửi
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.4 } }}>
                {comments.map((comment) => (
                  <Box key={comment.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '28px 1fr', md: '38px 1fr' }, gap: { xs: 0.8, md: 1.2 }, alignItems: 'start' }}>
                    <Box sx={{ width: { xs: 28, md: 38 }, height: { xs: 28, md: 38 }, borderRadius: '50%', bgcolor: '#2a2a2a', color: '#ff9800', display: 'grid', placeItems: 'center', fontSize: { xs: 10, md: 13 }, fontWeight: 900 }}>
                      {comment.name.charAt(0)}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ color: '#f2f2f2', fontSize: { xs: 10.5, md: 14 }, fontWeight: 800 }}>{comment.name}</Typography>
                      <Typography sx={{ color: '#bdbdbd', fontSize: { xs: 10, md: 13 }, lineHeight: 1.4, mt: 0.2 }}>{comment.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: { xs: 1.1, md: 2 }, '&:hover': { color: '#ff9800' } }}>
              <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: { xs: 12.5, md: 16 } }}>HÔM NAY XEM GÌ</Typography>
              <ChevronRightIcon fontSize="small" />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: { xs: '13px 9px', md: '22px 18px' }, mb: { xs: 3, md: 4 } }}>
              {recommendedAnime.map((item) => (
                <Box key={item.id} onClick={() => openRecommendedAnime(item)} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  <Box sx={{ position: 'relative', borderRadius: 0.9, overflow: 'hidden', aspectRatio: '2/3', mb: 0.65 }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {item.trailer && (
                      <Box sx={{ position: 'absolute', right: 4, bottom: 4, width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,152,0,0.92)' }}>
                        <PlayCircleOutlinedIcon sx={{ fontSize: 18, color: '#fff' }} />
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ fontWeight: 'bold', lineHeight: 1.25, fontSize: { xs: 10.2, md: 14 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</Typography>
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
