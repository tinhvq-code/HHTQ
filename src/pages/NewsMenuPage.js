import React, { useState } from 'react';
import { Box, Typography, IconButton, InputBase, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';

const categories = [
  'Tất Cả', 'Tin Anime', 'Tin Phim', 'Thể Thao', 'Du Lịch', 'Sức Khỏe', 'Thế Giới'
];

const newsList = [
  { id: 1, time: '8:10 Hôm nay', title: 'Sau 30 năm, ca khúc “CHA-LA HEAD CHA-LA” của Dragon Ball Z được tái hiện trở lại!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Dragon+Ball' },
  { id: 2, time: '16:10 Hôm nay', title: 'One Piece sẽ chính thức lên sóng tập mới trở lại từ 17 tháng 4!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=One+Piece' },
  { id: 3, time: '18:40 Hôm nay', title: 'Đón chờ podcast “Anime Roomy” với 4 cô nàng dễ thương!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Anime+Roomy' },
  { id: 4, time: '17:23 Hôm qua', title: 'Doraemon movie 41 chính thức khởi chiếu tại Việt Nam với cái tên hoàn toàn mới!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Doraemon' },
  { id: 5, time: '17:23 Hôm qua', title: '6 nhân vật chiếm trọn trái tim khán giả từ cái nhìn đầu tiên: Emma Watson mãi là “Tình đầu”...', tag: 'Tin Phim', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Emma+Watson' },
  { id: 6, time: '21:00 Thứ hai', title: 'Mads Mikkelsen được khen khi thay thế Johnny Depp', tag: 'Tin Phim', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Mads+Mikkelsen' },
];

export default function NewsMenuPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất Cả');

  return (
    <PageShell title="Danh sách Tin Tức">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: 4 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 3, position: 'sticky', top: 0, bgcolor: '#101010', zIndex: 10 }}>
            <IconButton size="small" sx={{ color: '#fff' }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 'bold', fontSize: 16 }}>Tin Tức</Typography>
          </Box>

          <Box sx={{ px: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#222', borderRadius: 8, px: 2, py: 0.5 }}>
              <SearchIcon sx={{ color: '#888', mr: 1, fontSize: 20 }} />
              <InputBase placeholder="Nhập tên tin tức cần tìm kiếm" sx={{ color: '#fff', flex: 1, fontSize: '0.9rem' }} />
            </Box>
          </Box>

          <Box sx={{ px: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  backgroundColor: activeCategory === cat ? '#ff9800' : '#222',
                  color: activeCategory === cat ? '#fff' : '#aaa',
                  borderRadius: 1, textTransform: 'none', minWidth: 'auto', px: 1.5, py: 0.5, fontSize: '0.8rem',
                  '&:hover': { backgroundColor: activeCategory === cat ? '#e68a00' : '#333' }
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          <Typography sx={{ px: 2, mb: 3, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', fontSize: 14 }}>
            Tin mới nhất
          </Typography>

          <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {newsList.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 1.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} onClick={() => navigate('/news-detail')}>
                <Box sx={{ width: 130, flexShrink: 0, borderRadius: 1.5, overflow: 'hidden', aspectRatio: '16/9' }}>
                  <img src={item.img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1 }}>
                  <Typography sx={{ color: '#ff9800', fontSize: 10, mb: 0.5 }}>{item.time}</Typography>
                  <Typography sx={{ fontWeight: 'bold', lineHeight: 1.3, mb: 1, fontSize: 13, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ alignSelf: 'flex-start', backgroundColor: '#222', px: 1, py: 0.2, borderRadius: 1 }}>
                    <Typography sx={{ color: '#aaa', fontSize: 10 }}>{item.tag}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

        </Box>
      </PhoneFrame>
    </PageShell>
  );
}