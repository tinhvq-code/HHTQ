import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

/* global process */
dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 3001);

app.use(cors());
app.use(express.json());

// 1. KẾT NỐI MONGODB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hhtq_anime';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Đã kết nối MongoDB thành công 🚀'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// 2. KHỞI TẠO MÔ HÌNH DỮ LIỆU (SCHEMAS)
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  birthday: { type: String, default: '' },
  gender: { type: String, default: '' },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash; 
  }
});
const User = mongoose.model('User', userSchema);

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  updated: { type: Boolean, default: false },
  fullName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  birthday: { type: String, default: '' },
  gender: { type: String, default: '' },
  avatar: { type: String, default: '' },
}, { timestamps: true });

profileSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});
const UserProfile = mongoose.model('UserProfile', profileSchema);

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  feedbackType: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

feedbackSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

const normalizeEmail = (email = '') => email.trim().toLowerCase();

// API Test kết nối
app.get('/api/test-db', (req, res) => {
  const state = mongoose.connection.readyState;
  const status = { 0: 'Ngắt kết nối', 1: 'Đã kết nối', 2: 'Đang kết nối', 3: 'Đang ngắt kết nối' };
  res.json({ 
    message: 'Trạng thái MongoDB', 
    status: status[state] || 'Không xác định' 
  });
}); 

// 3. CÁC API XỬ LÝ DỮ LIỆU
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, birthday, gender, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc.' });
    }

    const existingUser = await User.findOne({ email: normalizeEmail(email) });
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã được đăng ký.' });
    }

    const newUser = await User.create({
      fullName,
      email: normalizeEmail(email),
      phone: phone || '',
      birthday: birthday || '',
      gender: gender || '',
      passwordHash: password 
    });

    const profile = await UserProfile.create({
      userId: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName
    });

    res.status(201).json({ user: newUser, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể đăng ký tài khoản.', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    const user = await User.findOne({ email: normalizeEmail(email) });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại.' });
    }

    if (user.passwordHash !== password) {
      return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }

    let profile = await UserProfile.findOne({ userId: user._id });
    if (!profile) {
       profile = await UserProfile.create({ userId: user._id, email: user.email, fullName: user.fullName });
    }

    res.json({ user, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể đăng nhập.', error: err.message });
  }
});

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Không tìm thấy hồ sơ.' });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải hồ sơ.', error: err.message });
  }
});

app.put('/api/users/:userId/profile', async (req, res) => {
  try {
    const { fullName, email, phone, birthday, gender, avatar } = req.body;
    
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: req.params.userId },
      { 
        fullName, email: normalizeEmail(email), phone, birthday, gender, avatar, 
        updated: true 
      },
      { new: true, upsert: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { fullName, email: normalizeEmail(email), phone, birthday, gender },
      { new: true }
    );

    res.json({ user: updatedUser, profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ message: 'Không thể cập nhật hồ sơ.', error: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { userId, type, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Vui lòng nhập nội dung.' });

    const feedback = await Feedback.create({
      userId: userId || null,
      feedbackType: type || 'suggest',
      content
    });

    res.status(201).json({ message: 'Đã gửi phản hồi.', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Không thể gửi phản hồi.', error: err.message });
  }
});

// KHỞI ĐỘNG MÁY CHỦ
app.listen(PORT, () => {
  console.log(`API server đang chạy tại http://localhost:${PORT} 🚀`);
});