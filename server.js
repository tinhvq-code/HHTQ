import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sql from 'mssql';

/* global process */
dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, 'src', 'data', 'users.json');

app.use(cors());
app.use(express.json());

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  connectionTimeout: 5000,
  requestTimeout: 8000
};

let sqlPool = null;
let sqlStatus = process.env.DB_DATABASE ? 'connecting' : 'not-configured';

const isSqlReady = () => Boolean(sqlPool?.connected);

const initSqlTables = async (pool) => {
  await pool.request().batch(`
    IF OBJECT_ID('dbo.AppUsers', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.AppUsers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        fullName NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        phone NVARCHAR(50) NULL,
        birthday NVARCHAR(50) NULL,
        gender NVARCHAR(50) NULL,
        passwordHash NVARCHAR(255) NOT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.UserProfiles', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.UserProfiles (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        updated BIT NOT NULL DEFAULT 0,
        fullName NVARCHAR(255) NULL,
        email NVARCHAR(255) NULL,
        phone NVARCHAR(50) NULL,
        birthday NVARCHAR(50) NULL,
        gender NVARCHAR(50) NULL,
        avatar NVARCHAR(MAX) NULL,
        createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.FeedbackMessages', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.FeedbackMessages (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId NVARCHAR(80) NULL,
        feedbackType NVARCHAR(80) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF COL_LENGTH('dbo.AppUsers', 'createdAt') IS NULL
      ALTER TABLE dbo.AppUsers ADD createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.AppUsers', 'updatedAt') IS NULL
      ALTER TABLE dbo.AppUsers ADD updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.UserProfiles', 'createdAt') IS NULL
      ALTER TABLE dbo.UserProfiles ADD createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.UserProfiles', 'updatedAt') IS NULL
      ALTER TABLE dbo.UserProfiles ADD updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.FeedbackMessages', 'createdAt') IS NULL
      ALTER TABLE dbo.FeedbackMessages ADD createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();
  `);
};

const connectSqlServer = async () => {
  if (!process.env.DB_DATABASE) {
    sqlStatus = 'not-configured';
    return;
  }

  try {
    const pool = await sql.connect(sqlConfig);
    await initSqlTables(pool);
    sqlPool = pool;
    sqlStatus = 'connected';
    console.log(`SQL Server connected: ${sqlConfig.server}:${sqlConfig.port}/${sqlConfig.database}`);
  } catch (error) {
    sqlPool = null;
    sqlStatus = `error: ${error.message}`;
    console.error('SQL Server unavailable, falling back to MongoDB/local JSON:', error.message);
  }
};

mongoose.set('bufferCommands', false);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hhtq_anime';
mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB unavailable, local JSON fallback remains available:', error.message));

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    birthday: { type: String, default: '' },
    gender: { type: String, default: '' },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  }
});

const User = mongoose.model('User', userSchema);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    updated: { type: Boolean, default: false },
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    birthday: { type: String, default: '' },
    gender: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  { timestamps: true }
);

profileSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});

const UserProfile = mongoose.model('UserProfile', profileSchema);

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    feedbackType: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

feedbackSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

const isMongoReady = () => mongoose.connection.readyState === 1;

const publicUser = (user) => {
  const nextUser = { ...user };
  delete nextUser.password;
  delete nextUser.passwordHash;
  return nextUser;
};

const profileFromUser = (user) => ({
  userId: String(user.id),
  updated: Boolean(user.fullName),
  fullName: user.fullName || '',
  email: user.email || '',
  phone: user.phone || '',
  birthday: user.birthday || '',
  gender: user.gender || '',
  avatar: user.avatar || ''
});

const getColumn = (row, ...names) => names.map((name) => row?.[name]).find((value) => value !== undefined && value !== null);

const mapSqlUser = (row) =>
  row
    ? {
        id: String(getColumn(row, 'id', 'Id', 'ID')),
        fullName: getColumn(row, 'fullName', 'FullName', 'name', 'Name') || '',
        email: getColumn(row, 'email', 'Email') || '',
        phone: getColumn(row, 'phone', 'Phone') || '',
        birthday: getColumn(row, 'birthday', 'Birthday') || '',
        gender: getColumn(row, 'gender', 'Gender') || '',
        passwordHash: getColumn(row, 'passwordHash', 'PasswordHash', 'password', 'Password') || ''
      }
    : null;

const mapSqlProfile = (row, user) =>
  row
    ? {
        userId: String(getColumn(row, 'userId', 'UserId', 'UserID')),
        updated: Boolean(getColumn(row, 'updated', 'Updated')),
        fullName: getColumn(row, 'fullName', 'FullName') || '',
        email: getColumn(row, 'email', 'Email') || '',
        phone: getColumn(row, 'phone', 'Phone') || '',
        birthday: getColumn(row, 'birthday', 'Birthday') || '',
        gender: getColumn(row, 'gender', 'Gender') || '',
        avatar: getColumn(row, 'avatar', 'Avatar') || ''
      }
    : profileFromUser(user);

const findSqlUserByEmail = async (email) => {
  const result = await sqlPool
    .request()
    .input('email', sql.NVarChar(255), email)
    .query('SELECT TOP 1 * FROM dbo.AppUsers WHERE email = @email');

  return mapSqlUser(result.recordset[0]);
};

const findSqlUserById = async (userId) => {
  const result = await sqlPool
    .request()
    .input('id', sql.Int, Number(userId))
    .query('SELECT TOP 1 * FROM dbo.AppUsers WHERE id = @id');

  return mapSqlUser(result.recordset[0]);
};

const getSqlProfile = async (user) => {
  const result = await sqlPool
    .request()
    .input('userId', sql.Int, Number(user.id))
    .query('SELECT TOP 1 * FROM dbo.UserProfiles WHERE userId = @userId');

  return mapSqlProfile(result.recordset[0], user);
};

const createSqlUser = async ({ fullName, email, phone, birthday, gender, password }) => {
  const result = await sqlPool
    .request()
    .input('fullName', sql.NVarChar(255), fullName)
    .input('email', sql.NVarChar(255), email)
    .input('phone', sql.NVarChar(50), phone || '')
    .input('birthday', sql.NVarChar(50), birthday || '')
    .input('gender', sql.NVarChar(50), gender || '')
    .input('passwordHash', sql.NVarChar(255), password)
    .query(`
      INSERT INTO dbo.AppUsers (fullName, email, phone, birthday, gender, passwordHash)
      OUTPUT INSERTED.*
      VALUES (@fullName, @email, @phone, @birthday, @gender, @passwordHash)
    `);

  const user = mapSqlUser(result.recordset[0]);

  await sqlPool
    .request()
    .input('userId', sql.Int, Number(user.id))
    .input('fullName', sql.NVarChar(255), user.fullName)
    .input('email', sql.NVarChar(255), user.email)
    .input('phone', sql.NVarChar(50), user.phone)
    .input('birthday', sql.NVarChar(50), user.birthday)
    .input('gender', sql.NVarChar(50), user.gender)
    .query(`
      INSERT INTO dbo.UserProfiles (userId, fullName, email, phone, birthday, gender)
      VALUES (@userId, @fullName, @email, @phone, @birthday, @gender)
    `);

  return user;
};

const syncSqlUserPassword = async (user, password) => {
  if (!isSqlReady() || !user?.id) return;

  await sqlPool
    .request()
    .input('id', sql.Int, Number(user.id))
    .input('passwordHash', sql.NVarChar(255), password)
    .query(`
      UPDATE dbo.AppUsers
      SET passwordHash = @passwordHash, updatedAt = SYSUTCDATETIME()
      WHERE id = @id
    `);
};

const ensureSqlUserFromLegacy = async (legacyUser, password) => {
  if (!isSqlReady() || !legacyUser) return null;

  const normalizedEmail = normalizeEmail(legacyUser.email);
  const existingUser = await findSqlUserByEmail(normalizedEmail);

  if (existingUser) {
    await syncSqlUserPassword(existingUser, password);
    return {
      ...existingUser,
      passwordHash: password
    };
  }

  return createSqlUser({
    fullName: legacyUser.fullName || legacyUser.name || normalizedEmail,
    email: normalizedEmail,
    phone: legacyUser.phone || '',
    birthday: legacyUser.birthday || '',
    gender: legacyUser.gender || '',
    password
  });
};

const updateSqlProfile = async (userId, payload) => {
  const user = await findSqlUserById(userId);
  if (!user) return null;

  const nextUser = {
    ...user,
    fullName: payload.fullName || '',
    email: normalizeEmail(payload.email),
    phone: payload.phone || '',
    birthday: payload.birthday || '',
    gender: payload.gender || '',
    avatar: payload.avatar || ''
  };

  await sqlPool
    .request()
    .input('id', sql.Int, Number(userId))
    .input('fullName', sql.NVarChar(255), nextUser.fullName)
    .input('email', sql.NVarChar(255), nextUser.email)
    .input('phone', sql.NVarChar(50), nextUser.phone)
    .input('birthday', sql.NVarChar(50), nextUser.birthday)
    .input('gender', sql.NVarChar(50), nextUser.gender)
    .query(`
      UPDATE dbo.AppUsers
      SET fullName = @fullName, email = @email, phone = @phone, birthday = @birthday, gender = @gender, updatedAt = SYSUTCDATETIME()
      WHERE id = @id
    `);

  await sqlPool
    .request()
    .input('userId', sql.Int, Number(userId))
    .input('fullName', sql.NVarChar(255), nextUser.fullName)
    .input('email', sql.NVarChar(255), nextUser.email)
    .input('phone', sql.NVarChar(50), nextUser.phone)
    .input('birthday', sql.NVarChar(50), nextUser.birthday)
    .input('gender', sql.NVarChar(50), nextUser.gender)
    .input('avatar', sql.NVarChar(sql.MAX), nextUser.avatar)
    .query(`
      MERGE dbo.UserProfiles AS target
      USING (SELECT @userId AS userId) AS source
      ON target.userId = source.userId
      WHEN MATCHED THEN
        UPDATE SET updated = 1, fullName = @fullName, email = @email, phone = @phone, birthday = @birthday, gender = @gender, avatar = @avatar, updatedAt = SYSUTCDATETIME()
      WHEN NOT MATCHED THEN
        INSERT (userId, updated, fullName, email, phone, birthday, gender, avatar)
        VALUES (@userId, 1, @fullName, @email, @phone, @birthday, @gender, @avatar);
    `);

  return {
    user: publicUser(nextUser),
    profile: await getSqlProfile(nextUser)
  };
};

const readLocalUsers = async () => {
  try {
    const content = await fs.readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(content);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const writeLocalUsers = async (users) => {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
};

const findLocalUserByEmail = async (email) => {
  const users = await readLocalUsers();
  return users.find((user) => normalizeEmail(user.email) === email) || null;
};

const findLocalUserById = async (userId) => {
  const users = await readLocalUsers();
  return users.find((user) => String(user.id) === String(userId)) || null;
};

const createLocalUser = async ({ fullName, email, phone, birthday, gender, password }) => {
  const users = await readLocalUsers();
  const newUser = {
    id: String(Date.now()),
    fullName,
    email,
    phone: phone || '',
    birthday: birthday || '',
    gender: gender || '',
    password
  };

  await writeLocalUsers([...users, newUser]);
  return newUser;
};

const updateLocalProfile = async (userId, payload) => {
  const users = await readLocalUsers();
  const index = users.findIndex((user) => String(user.id) === String(userId));

  if (index < 0) return null;

  users[index] = {
    ...users[index],
    fullName: payload.fullName || '',
    email: normalizeEmail(payload.email),
    phone: payload.phone || '',
    birthday: payload.birthday || '',
    gender: payload.gender || '',
    avatar: payload.avatar || ''
  };

  await writeLocalUsers(users);
  const user = publicUser(users[index]);

  return { user, profile: profileFromUser(user) };
};

app.get('/', (req, res) => {
  res.json({
    ok: true,
    name: 'HHTQ API',
    port: PORT,
    database: isSqlReady() ? 'sql-server' : isMongoReady() ? 'mongodb' : 'local-json-fallback',
    sqlStatus,
    frontend: 'Open the Vite URL, for example http://127.0.0.1:5177',
    endpoints: ['/api/test-db', '/api/auth/login', '/api/auth/register', '/api/auth/google']
  });
});

app.get('/api/test-db', (req, res) => {
  const mongoStatus = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.json({
    ok: true,
    activeDatabase: isSqlReady() ? 'sql-server' : isMongoReady() ? 'mongodb' : 'local-json-fallback',
    sql: {
      status: sqlStatus,
      server: sqlConfig.server,
      database: sqlConfig.database,
      port: sqlConfig.port
    },
    mongo: {
      status: mongoStatus[mongoose.connection.readyState] || 'Unknown'
    }
  });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, birthday, gender, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!fullName || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc.' });
    }

    if (isSqlReady()) {
      const existingUser = await findSqlUserByEmail(normalizedEmail);
      if (existingUser) return res.status(409).json({ message: 'Email đã được đăng ký.' });

      const user = await createSqlUser({ fullName, email: normalizedEmail, phone, birthday, gender, password });
      return res.status(201).json({ user: publicUser(user), profile: await getSqlProfile(user), source: 'sql-server' });
    }

    if (isMongoReady()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) return res.status(409).json({ message: 'Email đã được đăng ký.' });

      const newUser = await User.create({
        fullName,
        email: normalizedEmail,
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

      return res.status(201).json({ user: newUser, profile, source: 'mongodb' });
    }

    const existingLocalUser = await findLocalUserByEmail(normalizedEmail);
    if (existingLocalUser) return res.status(409).json({ message: 'Email đã được đăng ký.' });

    const localUser = await createLocalUser({ fullName, email: normalizedEmail, phone, birthday, gender, password });
    const user = publicUser(localUser);
    return res.status(201).json({ user, profile: profileFromUser(user), source: 'local-json-fallback' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Không thể đăng ký tài khoản.', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    if (isSqlReady()) {
      const user = await findSqlUserByEmail(normalizedEmail);
      if (user && user.passwordHash === password) {
        return res.json({ user: publicUser(user), profile: await getSqlProfile(user), source: 'sql-server' });
      }
    }

    if (isMongoReady()) {
      const user = await User.findOne({ email: normalizedEmail });

      if (user && user.passwordHash === password) {
        const syncedUser = await ensureSqlUserFromLegacy(user, password);
        if (syncedUser) {
          return res.json({
            user: publicUser(syncedUser),
            profile: await getSqlProfile(syncedUser),
            source: 'sql-server-synced-from-mongodb'
          });
        }

        let profile = await UserProfile.findOne({ userId: user._id });
        if (!profile) {
          profile = await UserProfile.create({ userId: user._id, email: user.email, fullName: user.fullName });
        }

        return res.json({ user, profile, source: 'mongodb' });
      }
    }

    const localUser = await findLocalUserByEmail(normalizedEmail);
    if (!localUser) return res.status(404).json({ message: 'Email không tồn tại.' });
    if (localUser.password !== password) return res.status(401).json({ message: 'Mật khẩu không đúng.' });

    const syncedUser = await ensureSqlUserFromLegacy(localUser, password);
    if (syncedUser) {
      return res.json({
        user: publicUser(syncedUser),
        profile: await getSqlProfile(syncedUser),
        source: 'sql-server-synced-from-local'
      });
    }

    const user = publicUser(localUser);
    return res.json({ user, profile: profileFromUser(user), source: 'local-json-fallback' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Không thể đăng nhập.', error: error.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ message: 'Thiếu mã xác thực Google.' });

    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const googleUser = await googleRes.json();

    if (!googleUser.email) {
      return res.status(400).json({ message: 'Không thể lấy thông tin từ Google.' });
    }

    const normalizedEmail = normalizeEmail(googleUser.email);
    const fullName = googleUser.name;
    const avatar = googleUser.picture || '';
    const password = 'GOOGLE_AUTH_NO_PASS'; 

    if (isSqlReady()) {
      let user = await findSqlUserByEmail(normalizedEmail);
      if (!user) {
        user = await createSqlUser({ fullName, email: normalizedEmail, phone: '', birthday: '', gender: '', password });
        await sqlPool.request().input('userId', sql.Int, Number(user.id)).input('avatar', sql.NVarChar(sql.MAX), avatar).query('UPDATE dbo.UserProfiles SET avatar = @avatar WHERE userId = @userId');
      }
      return res.json({ user: publicUser(user), profile: await getSqlProfile(user), source: 'sql-server' });
    }

    if (isMongoReady()) {
      let user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        user = await User.create({ fullName, email: normalizedEmail, passwordHash: password });
        await UserProfile.create({ userId: user._id, email: user.email, fullName: user.fullName, avatar });
      }
      let profile = await UserProfile.findOne({ userId: user._id });
      if (!profile) {
         profile = await UserProfile.create({ userId: user._id, email: user.email, fullName: user.fullName, avatar });
      }
      return res.json({ user, profile, source: 'mongodb' });
    }

    let localUser = await findLocalUserByEmail(normalizedEmail);
    if (!localUser) {
      localUser = await createLocalUser({ fullName, email: normalizedEmail, phone: '', birthday: '', gender: '', password });
    }
    const user = publicUser(localUser);
    const profile = profileFromUser(user);
    profile.avatar = avatar; 
    return res.json({ user, profile, source: 'local-json-fallback' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi đăng nhập Google.', error: error.message });
  }
});

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    if (isSqlReady() && /^\d+$/.test(String(req.params.userId))) {
      const user = await findSqlUserById(req.params.userId);
      if (user) return res.json({ profile: await getSqlProfile(user), source: 'sql-server' });
    }

    if (isMongoReady() && /^[0-9a-f]{24}$/i.test(String(req.params.userId))) {
      const profile = await UserProfile.findOne({ userId: req.params.userId });
      if (profile) return res.json({ profile, source: 'mongodb' });
    }

    const localUser = await findLocalUserById(req.params.userId);
    if (!localUser) return res.status(404).json({ message: 'Không tìm thấy hồ sơ.' });

    const user = publicUser(localUser);
    return res.json({ profile: profileFromUser(user), source: 'local-json-fallback' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tải hồ sơ.', error: error.message });
  }
});

app.put('/api/users/:userId/profile', async (req, res) => {
  try {
    if (isSqlReady() && /^\d+$/.test(String(req.params.userId))) {
      const result = await updateSqlProfile(req.params.userId, req.body);
      if (result) return res.json({ ...result, source: 'sql-server' });
    }

    if (isMongoReady() && /^[0-9a-f]{24}$/i.test(String(req.params.userId))) {
      const { fullName, email, phone, birthday, gender, avatar } = req.body;
      const normalizedEmail = normalizeEmail(email);
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { userId: req.params.userId },
        { fullName, email: normalizedEmail, phone, birthday, gender, avatar, updated: true },
        { new: true, upsert: true }
      );

      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { fullName, email: normalizedEmail, phone, birthday, gender },
        { new: true }
      );

      if (updatedUser) return res.json({ user: updatedUser, profile: updatedProfile, source: 'mongodb' });
    }

    const localResult = await updateLocalProfile(req.params.userId, req.body);
    if (!localResult) return res.status(404).json({ message: 'Không tìm thấy hồ sơ.' });

    return res.json({ ...localResult, source: 'local-json-fallback' });
  } catch (error) {
    return res.status(500).json({ message: 'Không thể cập nhật hồ sơ.', error: error.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { userId, type, content } = req.body;

    if (!content) return res.status(400).json({ message: 'Vui lòng nhập nội dung.' });

    if (isSqlReady()) {
      const result = await sqlPool
        .request()
        .input('userId', sql.NVarChar(80), userId ? String(userId) : null)
        .input('feedbackType', sql.NVarChar(80), type || 'suggest')
        .input('content', sql.NVarChar(sql.MAX), content)
        .query(`
          INSERT INTO dbo.FeedbackMessages (userId, feedbackType, content)
          OUTPUT INSERTED.*
          VALUES (@userId, @feedbackType, @content)
        `);

      return res.status(201).json({ message: 'Đã gửi phản hồi.', feedback: result.recordset[0], source: 'sql-server' });
    }

    if (isMongoReady()) {
      const feedback = await Feedback.create({
        userId: /^[0-9a-f]{24}$/i.test(String(userId)) ? userId : null,
        feedbackType: type || 'suggest',
        content
      });

      return res.status(201).json({ message: 'Đã gửi phản hồi.', feedback, source: 'mongodb' });
    }

    return res.status(201).json({
      message: 'Đã ghi nhận phản hồi.',
      feedback: { id: String(Date.now()), userId: userId || null, feedbackType: type || 'suggest', content },
      source: 'local-json-fallback'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Không thể gửi phản hồi.', error: error.message });
  }
});

await connectSqlServer();

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});