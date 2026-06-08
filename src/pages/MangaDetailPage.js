import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Divider, Chip, Avatar, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';

const recommendedManga = [
  { id: 1, title: 'Black Clover', chap: 'Chap 293', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Black+Clover' },
  { id: 2, title: 'Boruto', chap: 'Chap 71', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Boruto' },
  { id: 3, title: 'Release that Witch!', chap: 'Chap 180', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Release+Witch' },
];

const recommendedAnime = [
  { id: 1, title: 'Hibike! Euphonium movie3', eps: 'Tập 12', views: '12k6 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Hibike' },
  { id: 2, title: 'Shirobako Movie', eps: 'Tập 12', views: '10k9 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Shirobako' },
  { id: 3, title: 'Precure Miracle Leap', eps: 'Tập 12', views: '4k6 view', img: 'https://placehold.co/200x300/2a2a2a/FFF?text=Precure' },
];

export default function MangaDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doc-truyen');

  return (
    <PageShell title="Đọc Truyện Tranh">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: 6 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, pt: 3, backgroundColor: '#101010', position: 'sticky', top: 0, zIndex: 100 }}>
            <IconButton size="small" sx={{ color: '#fff' }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ ml: 1, fontWeight: 'bold', fontSize: 16 }}>Truyện Tranh</Typography>
          </Box>

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ width: 140, height: 210, borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                <img src="https://placehold.co/400x600/2a2a2a/FFF?text=Kingdom" alt="Kingdom Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Typography sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1, fontSize: 18 }}>Kingdom - Vương Giả Thiên Hạ</Typography>
              <Typography sx={{ color: '#aaa', mb: 0.5, fontSize: 12 }}>Tác giả: Hara Yasuhisa</Typography>
              <Typography sx={{ color: '#aaa', mb: 0.5, fontSize: 12 }}>Tình trạng: Đang cập nhật</Typography>
              <Typography sx={{ color: '#aaa', mb: 2, fontSize: 12 }}>Lượt đọc: 153.017</Typography>
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button size="small" startIcon={<FavoriteBorderIcon />} sx={{ color: '#aaa', textTransform: 'none', fontSize: 11 }}>Thích 23</Button>
                <Button size="small" startIcon={<BookmarkBorderIcon />} sx={{ color: '#aaa', textTransform: 'none', fontSize: 11 }}>Theo dõi 70</Button>
                <Button size="small" startIcon={<ReplyIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ color: '#aaa', textTransform: 'none', fontSize: 11 }}>Chia sẻ 200</Button>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#333', mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button 
                onClick={() => setActiveTab('doc-truyen')}
                sx={{ backgroundColor: activeTab === 'doc-truyen' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', px: 2, py: 0.5, borderRadius: 1, border: activeTab === 'doc-truyen' ? '1px solid #ff9800' : '1px solid #333', fontSize: 12 }}
              >
                Đọc truyện
              </Button>
              <Button 
                onClick={() => setActiveTab('binh-luan')}
                sx={{ backgroundColor: activeTab === 'binh-luan' ? '#333' : 'transparent', color: '#fff', textTransform: 'none', px: 2, py: 0.5, borderRadius: 1, border: activeTab === 'binh-luan' ? '1px solid #ff9800' : '1px solid #333', fontSize: 12 }}
              >
                70 Bình luận
              </Button>
            </Box>

            <Box sx={{ minHeight: 300, mb: 4 }}>
              {activeTab === 'doc-truyen' && (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mb: 4, alignItems: 'center' }}>
                    {[1, 2, 3].map((page) => (
                      <img key={page} src={`https://placehold.co/600x900/222/FFF?text=Trang+Truyen+${page}`} alt={`Page ${page}`} style={{ width: '100%', maxWidth: 400, objectFit: 'contain' }} />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}>Danh sách chương</Typography>
                    <Button size="small" variant="contained" sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#e68a00' }, textTransform: 'none', fontSize: 11 }}>Mới nhất</Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[...Array(6)].map((_, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderBottom: '1px solid #333', cursor: 'pointer', '&:hover': { backgroundColor: '#222' } }}>
                        <Typography sx={{ color: '#ccc', fontSize: 12 }}>Chapter - Tướng Quân Tái Xuất {i + 1}</Typography>
                        <Typography sx={{ color: '#ff9800', fontSize: 12 }}>Tập {6 - i}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {activeTab === 'binh-luan' && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, color: '#aaa' }}>
                    <Typography sx={{ fontSize: 12 }}>Đang tải bình luận...</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: '#333', mb: 3 }} />

            <Typography sx={{ fontWeight: 'bold', mb: 1, fontSize: 14 }}>THÔNG TIN TRUYỆN</Typography>
            <Typography sx={{ color: '#aaa', mb: 0.5, fontSize: 11 }}>Thể loại: Viễn Tưởng, Đời Thường</Typography>
            <Typography sx={{ color: '#aaa', mb: 0.5, fontSize: 11 }}>Nhóm sub: A3DD</Typography>
            <Typography sx={{ color: '#aaa', mb: 1.5, fontSize: 11 }}>Tổng số chap: 150 chap</Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              <Typography sx={{ color: '#aaa', mr: 0.5, alignSelf: 'center', fontSize: 11 }}>Từ khóa:</Typography>
              {['Truyện Kingdom', 'Vương Giả Thiên Hạ chap 1'].map((tag) => (
                <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#222', color: '#aaa', fontSize: 10, borderRadius: 1 }} />
              ))}
            </Box>
            
            <Typography sx={{ color: '#ccc', lineHeight: 1.5, mb: 4, fontSize: 11 }}>
              Trải qua hàng ngàn năm, vương quốc mới bắt đầu trỗi dậy. Một thiếu niên ôm mộng lớn trở thành đại tướng quân vĩ đại nhất.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 2, '&:hover': { color: '#ff9800' } }}>
              <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 14 }}>Truyện tranh mới nhất</Typography>
              <ChevronRightIcon fontSize="small" />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 4 }}>
              {recommendedManga.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', aspectRatio: '2/3', mb: 1 }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', top: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.7)', borderLeft: '2px solid #ff4444', px: 0.5, py: 0.1, borderRadius: '2px' }}>
                      <Typography sx={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>{item.chap}</Typography>
                    </Box>
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