import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';

const episodes = [
  { id: 1, title: 'Tập 1', views: '432K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+1' },
  { id: 2, title: 'Tập 2', views: '321K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+2' },
  { id: 3, title: 'Tập 3', views: '310K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+3' },
  { id: 4, title: 'Tập 4', views: '309K lượt xem', img: 'https://placehold.co/120x80/2a2a2a/FFF?text=Tap+4' },
];

const recommendedAnime = [
  { id: 1, title: 'Hibike! Euphonium movie3: Chikai no', eps: 'Tập 12', views: '12k6 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Hibike' },
  { id: 2, title: 'Shirobako Movie', eps: 'Tập 12', views: '10k9 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Shirobako' },
  { id: 3, title: 'Precure Miracle Leap movie: Minna to no', eps: 'Tập 12', views: '4k6 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Precure' },
];

const recommendedManga = [
  { id: 1, title: 'Black Clover', chap: 'Chap 293', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Black+Clover' },
  { id: 2, title: 'Boruto', chap: 'Chap 71', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Boruto' },
  { id: 3, title: 'Release that Witch!', chap: 'Chap 180', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Release+Witch' },
];

export default function AnimeDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('danh-sach');

  return (
    <PageShell title="Chi tiết Anime">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: 6 }}>
          
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', p: 1.5, pt: 3, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
              <IconButton size="small" sx={{ color: '#fff' }} onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ ml: 1, fontWeight: 'bold', fontSize: 16 }}>Anime</Typography>
            </Box>

            <Box sx={{ width: '100%', aspectRatio: '16/9', position: 'relative', backgroundColor: '#222' }}>
              <img src="https://placehold.co/600x337/333/FFF?text=Eden+Video" alt="Video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <PlayCircleOutlinedIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.8)' }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 18, mb: 0.5 }}>Eden - Tập 1</Typography>
            <Typography sx={{ color: '#aaa', fontSize: 12, mb: 2 }}>522.000 lượt xem</Typography>
            
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Button size="small" startIcon={<FavoriteBorderIcon />} sx={{ color: '#aaa', textTransform: 'none', fontSize: 11 }}>Thích 23</Button>
              <Button size="small" startIcon={<BookmarkBorderIcon />} sx={{ color: '#aaa', textTransform: 'none', fontSize: 11 }}>Theo dõi 23</Button>
              <Button size="small" startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ color: '#aaa', textTransform: 'none', fontSize: 11 }}>Chia sẻ 200</Button>
            </Box>

            <Divider sx={{ borderColor: '#333', mb: 2 }} />

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button 
                onClick={() => setActiveTab('danh-sach')}
                sx={{ backgroundColor: activeTab === 'danh-sach' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', px: 2, py: 0.5, borderRadius: 1, border: activeTab === 'danh-sach' ? '1px solid #ff9800' : '1px solid #333', fontSize: 12 }}
              >
                Danh sách tập
              </Button>
              <Button 
                onClick={() => setActiveTab('binh-luan')}
                sx={{ backgroundColor: activeTab === 'binh-luan' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', px: 2, py: 0.5, borderRadius: 1, border: activeTab === 'binh-luan' ? '1px solid #ff9800' : '1px solid #333', fontSize: 12 }}
              >
                0 Bình luận
              </Button>
            </Box>

            <Box sx={{ minHeight: 200, mb: 3 }}>
              {activeTab === 'danh-sach' && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    {episodes.map((ep) => (
                      <Box key={ep.id} sx={{ display: 'flex', gap: 1.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                        <Box sx={{ position: 'relative', width: 110, height: 70, borderRadius: 1, overflow: 'hidden' }}>
                          <img src={ep.img} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <PlayCircleOutlinedIcon sx={{ fontSize: 24, color: 'rgba(255,255,255,0.8)' }} />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Typography sx={{ color: '#ff9800', fontWeight: 'bold', fontSize: 11 }}>Eden</Typography>
                          <Typography sx={{ fontWeight: 'bold', fontSize: 13 }}>{ep.title}</Typography>
                          <Typography sx={{ color: '#aaa', fontSize: 10 }}>{ep.views}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Typography sx={{ fontWeight: 'bold', fontSize: 14, mb: 1 }}>THÔNG TIN PHIM</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: 11, mb: 0.5 }}>Thể loại: Viễn Tưởng, Đời Thường, Robot</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: 11, mb: 0.5 }}>Nhóm sub: Phim1080</Typography>
                  <Typography sx={{ color: '#aaa', fontSize: 11, mb: 1.5 }}>Tổng số tập: 4 tập</Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    <Typography sx={{ color: '#aaa', mr: 0.5, alignSelf: 'center', fontSize: 11 }}>Từ khóa:</Typography>
                    {['Eden', 'Eden Vietsub', 'Eden HD', 'tập 1'].map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#222', color: '#aaa', fontSize: 10, borderRadius: 1 }} />
                    ))}
                  </Box>
                  
                  <Typography sx={{ color: '#ccc', lineHeight: 1.5, fontSize: 11 }}>
                    Một bé gái loài người được robot bí mật nuôi nấng bắt đầu khám phá những bí mật đen tối đằng sau thế giới dịu dàng xanh tươi nơi con người gần như biến mất.
                  </Typography>
                </Box>
              )}

              {activeTab === 'binh-luan' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, color: '#aaa' }}>
                  <Typography sx={{ fontSize: 12 }}>Chưa có bình luận nào.</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: '#333', mb: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 2, '&:hover': { color: '#ff9800' } }}>
              <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 14 }}>Hôm nay xem gì</Typography>
              <ChevronRightIcon fontSize="small" />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 4 }}>
              {recommendedAnime.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', aspectRatio: '2/3', mb: 1 }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 'bold', lineHeight: 1.3, fontSize: 11.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</Typography>
                </Box>
              ))}
            </Box>

          </Box>
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}