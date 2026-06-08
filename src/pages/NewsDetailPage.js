import React from 'react';
import { Box, Typography, IconButton, Divider, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.js';
import PhoneFrame from '../components/PhoneFrame.js';

const relatedNews = [
  { id: 1, time: '16:10 Hôm nay', title: 'One Piece sẽ chính thức lên sóng tập mới trở lại từ 17 tháng 4!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=One+Piece' },
  { id: 2, time: '18:40 Hôm nay', title: 'Đón chờ podcast “Anime Roomy” với 4 cô nàng dễ thương!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Anime+Roomy' },
  { id: 3, time: '17:23 Hôm qua', title: 'Doraemon movie 41 chính thức khởi chiếu tại Việt Nam với cái tên hoàn toàn mới!', tag: 'Tin Anime', img: 'https://placehold.co/300x200/2a2a2a/FFF?text=Doraemon' },
];

export default function NewsDetailPage() {
  const navigate = useNavigate();

  return (
    <PageShell title="Chi tiết Tin Tức">
      <PhoneFrame>
        <Box sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#101010', color: '#fff', pb: 6 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, pt: 3, position: 'sticky', top: 0, bgcolor: '#101010', zIndex: 10 }}>
            <IconButton size="small" sx={{ color: '#fff' }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <IconButton size="small" sx={{ color: '#fff', mr: 1 }}><BookmarkBorderIcon /></IconButton>
              <IconButton size="small" sx={{ color: '#fff' }}><ShareIcon /></IconButton>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ backgroundColor: '#ff9800', px: 1, py: 0.3, borderRadius: 1 }}>
                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: 10 }}>Tin Anime</Typography>
              </Box>
              <Typography sx={{ color: '#888', fontSize: 11 }}>8:10 Hôm nay</Typography>
            </Box>

            <Typography sx={{ fontWeight: 'bold', lineHeight: 1.4, mb: 2, fontSize: 18 }}>
              Sau 30 năm, ca khúc “CHA-LA HEAD CHA-LA” của Dragon Ball Z được tái hiện trở lại!
            </Typography>

            <Box sx={{ width: '100%', aspectRatio: '16/9', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
              <img src="https://placehold.co/800x450/2a2a2a/FFF?text=Dragon+Ball+Cover" alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>

            <Typography sx={{ color: '#ccc', lineHeight: 1.6, mb: 2, fontSize: 13 }}>
              Người hâm mộ bộ anime huyền thoại Dragon Ball Z vừa đón nhận một tin không thể vui hơn. Bài hát mở đầu mang tính biểu tượng "CHA-LA HEAD CHA-LA" vừa được thu âm lại với chất lượng hoàn toàn mới mẻ.
            </Typography>
            
            <Typography sx={{ color: '#ccc', lineHeight: 1.6, mb: 3, fontSize: 13 }}>
              Sự kiện này đánh dấu kỷ niệm 30 năm ra mắt thương hiệu. Rất nhiều khán giả đã bày tỏ sự xúc động mạnh mẽ khi giai điệu tuổi thơ một lần nữa vang lên trên các nền tảng phát trực tuyến.
            </Typography>

            <Divider sx={{ borderColor: '#333', mb: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, backgroundColor: '#222', p: 1.5, borderRadius: 2 }}>
              <Avatar src="https://i.pravatar.cc/150?img=11" sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', fontSize: 13 }}>Phóng viên Wibu</Typography>
                <Typography sx={{ color: '#888', fontSize: 11 }}>Chuyên gia săn tin Anime</Typography>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 2, fontSize: 14 }}>
              Tin mới nhất
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {relatedNews.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 1.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} onClick={() => navigate('/news-detail')}>
                  <Box sx={{ width: 120, flexShrink: 0, borderRadius: 1.5, overflow: 'hidden', aspectRatio: '16/9' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1 }}>
                    <Typography sx={{ color: '#ff9800', fontSize: 10, mb: 0.5 }}>{item.time}</Typography>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1.3, mb: 1, fontSize: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ alignSelf: 'flex-start', backgroundColor: '#222', px: 1, py: 0.2, borderRadius: 1 }}>
                      <Typography sx={{ color: '#aaa', fontSize: 9 }}>{item.tag}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

          </Box>
        </Box>
      </PhoneFrame>
    </PageShell>
  );
}