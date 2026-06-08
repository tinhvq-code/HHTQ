import cors from 'cors';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import express from 'express';
import sql from 'mssql';

/* global process */

dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 3001);

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let poolPromise;
const sessions = new Map();

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig);
  }

  return poolPromise;
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const createSession = (userId) => {
  const token = crypto.randomUUID();
  sessions.set(token, {
    userId,
    createdAt: Date.now()
  });
  return token;
};

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  return type === 'Bearer' ? token : '';
};

const requireAuth = (req, res, next) => {
  const token = getBearerToken(req);
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({ message: 'Vui long dang nhap truoc khi tiep tuc.' });
  }

  req.session = session;
  req.authToken = token;
  return next();
};

const requireSameUser = (req, res, next) => {
  const routeUserId = Number(req.params.userId || req.body.userId);

  if (!routeUserId || routeUserId !== req.session.userId) {
    return res.status(403).json({ message: 'Ban khong co quyen truy cap du lieu nay.' });
  }

  return next();
};

const publicUserSelect = `
  Id AS id,
  FullName AS fullName,
  Email AS email,
  Phone AS phone,
  Birthday AS birthday,
  Gender AS gender,
  CreatedAt AS createdAt
`;

const publicUserOutput = `
  INSERTED.Id AS id,
  INSERTED.FullName AS fullName,
  INSERTED.Email AS email,
  INSERTED.Phone AS phone,
  INSERTED.Birthday AS birthday,
  INSERTED.Gender AS gender,
  INSERTED.CreatedAt AS createdAt
`;

const profileSelect = `
  UserId AS userId,
  Updated AS updated,
  FullName AS fullName,
  Email AS email,
  Phone AS phone,
  Birthday AS birthday,
  Gender AS gender,
  Avatar AS avatar,
  UpdatedAt AS updatedAt
`;

const ensureSchema = async () => {
  const pool = await getPool();

  await pool.request().batch(`
    IF OBJECT_ID('dbo.AppUsers', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.AppUsers (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(120) NOT NULL,
        Email NVARCHAR(180) NOT NULL UNIQUE,
        Phone NVARCHAR(30) NULL,
        Birthday NVARCHAR(30) NULL,
        Gender NVARCHAR(20) NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.UserProfiles', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.UserProfiles (
        UserId INT NOT NULL PRIMARY KEY,
        Updated BIT NOT NULL DEFAULT 0,
        FullName NVARCHAR(120) NULL,
        Email NVARCHAR(180) NULL,
        Phone NVARCHAR(30) NULL,
        Birthday NVARCHAR(30) NULL,
        Gender NVARCHAR(20) NULL,
        Avatar NVARCHAR(500) NULL,
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_UserProfiles_AppUsers FOREIGN KEY (UserId) REFERENCES dbo.AppUsers(Id)
      );
    END;

    IF OBJECT_ID('dbo.FeedbackMessages', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.FeedbackMessages (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        FeedbackType NVARCHAR(40) NOT NULL,
        Content NVARCHAR(1000) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_FeedbackMessages_AppUsers FOREIGN KEY (UserId) REFERENCES dbo.AppUsers(Id)
      );
    END;

    IF OBJECT_ID('dbo.UserVideoItems', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.UserVideoItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        ListType NVARCHAR(20) NOT NULL,
        Title NVARCHAR(220) NOT NULL,
        Episode NVARCHAR(80) NULL,
        MetaText NVARCHAR(160) NULL,
        Image NVARCHAR(500) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_UserVideoItems_AppUsers FOREIGN KEY (UserId) REFERENCES dbo.AppUsers(Id)
      );
    END;
  `);
};

const getProfileByUserId = async (userId) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('userId', sql.Int, userId)
    .query(`SELECT ${profileSelect} FROM dbo.UserProfiles WHERE UserId = @userId`);

  return result.recordset[0] || null;
};

app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT GETDATE() AS currentTime');

    res.json({
      message: 'Kết nối SQL Server thành công',
      data: result.recordset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Lỗi kết nối SQL Server',
      error: err.message
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const fullName = String(req.body.fullName || '').trim();
  const email = normalizeEmail(req.body.email);
  const phone = String(req.body.phone || '').trim();
  const birthday = String(req.body.birthday || '').trim();
  const gender = String(req.body.gender || '').trim();
  const password = String(req.body.password || '');

  if (!fullName || !email || !phone || !birthday || !gender || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }

  try {
    const pool = await getPool();
    const duplicate = await pool
      .request()
      .input('email', sql.NVarChar(180), email)
      .query('SELECT Id FROM dbo.AppUsers WHERE Email = @email');

    if (duplicate.recordset.length) {
      return res.status(409).json({ message: 'Email đã được đăng ký.' });
    }

    const created = await pool
      .request()
      .input('fullName', sql.NVarChar(120), fullName)
      .input('email', sql.NVarChar(180), email)
      .input('phone', sql.NVarChar(30), phone)
      .input('birthday', sql.NVarChar(30), birthday)
      .input('gender', sql.NVarChar(20), gender)
      .input('passwordHash', sql.NVarChar(255), password)
      .query(`
        INSERT INTO dbo.AppUsers (FullName, Email, Phone, Birthday, Gender, PasswordHash)
        OUTPUT ${publicUserOutput}
        VALUES (@fullName, @email, @phone, @birthday, @gender, @passwordHash);
      `);

    const user = created.recordset[0];

    await pool
      .request()
      .input('userId', sql.Int, user.id)
      .input('email', sql.NVarChar(180), user.email)
      .query(`
        INSERT INTO dbo.UserProfiles (UserId, Updated, FullName, Email, Phone, Birthday, Gender, Avatar)
        VALUES (@userId, 0, '', @email, '', '', '', '');
      `);

    const profile = await getProfileByUserId(user.id);

    const token = createSession(user.id);

    res.status(201).json({ user, profile, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể đăng ký tài khoản.', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('email', sql.NVarChar(180), email)
      .query(`
        SELECT ${publicUserSelect}, PasswordHash AS passwordHash
        FROM dbo.AppUsers
        WHERE Email = @email
      `);

    const account = result.recordset[0];

    if (!account) {
      return res.status(404).json({ message: 'Email không tồn tại.' });
    }

    if (account.passwordHash !== password) {
      return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }

    const user = { ...account };
    delete user.passwordHash;
    let profile = await getProfileByUserId(user.id);

    if (!profile) {
      await pool
        .request()
        .input('userId', sql.Int, user.id)
        .input('email', sql.NVarChar(180), user.email)
        .query(`
          INSERT INTO dbo.UserProfiles (UserId, Updated, FullName, Email, Phone, Birthday, Gender, Avatar)
          VALUES (@userId, 0, '', @email, '', '', '', '');
        `);
      profile = await getProfileByUserId(user.id);
    }

    const token = createSession(user.id);

    res.json({ user, profile, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể đăng nhập.', error: err.message });
  }
});

app.post('/api/auth/social', async (req, res) => {
  const provider = String(req.body.provider || '').trim().toLowerCase();
  const providerId = String(req.body.providerId || '').trim();
  const fullName = String(req.body.fullName || '').trim();
  const email = normalizeEmail(req.body.email);
  const avatar = String(req.body.avatar || '').trim();

  if (!['google', 'facebook'].includes(provider) || !providerId || !email) {
    return res.status(400).json({ message: 'Thong tin dang nhap mang xa hoi khong hop le.' });
  }

  try {
    const pool = await getPool();
    const existing = await pool
      .request()
      .input('email', sql.NVarChar(180), email)
      .query(`SELECT ${publicUserSelect} FROM dbo.AppUsers WHERE Email = @email`);

    let user = existing.recordset[0];

    if (!user) {
      const created = await pool
        .request()
        .input('fullName', sql.NVarChar(120), fullName || email)
        .input('email', sql.NVarChar(180), email)
        .input('passwordHash', sql.NVarChar(255), `${provider}:${providerId}`)
        .query(`
          INSERT INTO dbo.AppUsers (FullName, Email, Phone, Birthday, Gender, PasswordHash)
          OUTPUT ${publicUserOutput}
          VALUES (@fullName, @email, '', '', '', @passwordHash);
        `);

      user = created.recordset[0];
    }

    let profile = await getProfileByUserId(user.id);

    if (!profile) {
      await pool
        .request()
        .input('userId', sql.Int, user.id)
        .input('fullName', sql.NVarChar(120), user.fullName || fullName || '')
        .input('email', sql.NVarChar(180), user.email)
        .input('avatar', sql.NVarChar(500), avatar)
        .query(`
          INSERT INTO dbo.UserProfiles (UserId, Updated, FullName, Email, Phone, Birthday, Gender, Avatar)
          VALUES (@userId, 0, @fullName, @email, '', '', '', @avatar);
        `);
    } else if (avatar && !profile.avatar) {
      await pool
        .request()
        .input('userId', sql.Int, user.id)
        .input('avatar', sql.NVarChar(500), avatar)
        .query('UPDATE dbo.UserProfiles SET Avatar = @avatar, UpdatedAt = SYSUTCDATETIME() WHERE UserId = @userId');
    }

    profile = await getProfileByUserId(user.id);
    const token = createSession(user.id);

    return res.json({ user, profile, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Khong the dang nhap bang mang xa hoi.', error: err.message });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const pool = await getPool();
    const userResult = await pool
      .request()
      .input('userId', sql.Int, req.session.userId)
      .query(`SELECT ${publicUserSelect} FROM dbo.AppUsers WHERE Id = @userId`);

    const user = userResult.recordset[0];

    if (!user) {
      sessions.delete(req.authToken);
      return res.status(401).json({ message: 'Phien dang nhap khong hop le.' });
    }

    const profile = await getProfileByUserId(user.id);
    return res.json({ user, profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Khong the kiem tra phien dang nhap.', error: err.message });
  }
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  sessions.delete(req.authToken);
  res.json({ message: 'Da dang xuat.' });
});

app.get('/api/users/:userId/profile', requireAuth, requireSameUser, async (req, res) => {
  try {
    const profile = await getProfileByUserId(Number(req.params.userId));

    if (!profile) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ.' });
    }

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể tải hồ sơ.', error: err.message });
  }
});

app.put('/api/users/:userId/profile', requireAuth, requireSameUser, async (req, res) => {
  const userId = Number(req.params.userId);
  const fullName = String(req.body.fullName || '').trim();
  const email = normalizeEmail(req.body.email);
  const phone = String(req.body.phone || '').trim();
  const birthday = String(req.body.birthday || '').trim();
  const gender = String(req.body.gender || '').trim();
  const avatar = String(req.body.avatar || '').trim();
  const updated = Boolean(fullName || phone || birthday || gender || avatar);

  try {
    const pool = await getPool();

    await pool
      .request()
      .input('userId', sql.Int, userId)
      .input('fullName', sql.NVarChar(120), fullName)
      .input('email', sql.NVarChar(180), email)
      .input('phone', sql.NVarChar(30), phone)
      .input('birthday', sql.NVarChar(30), birthday)
      .input('gender', sql.NVarChar(20), gender)
      .input('avatar', sql.NVarChar(500), avatar)
      .input('updated', sql.Bit, updated)
      .query(`
        MERGE dbo.UserProfiles AS target
        USING (SELECT @userId AS UserId) AS source
        ON target.UserId = source.UserId
        WHEN MATCHED THEN
          UPDATE SET
            Updated = @updated,
            FullName = @fullName,
            Email = @email,
            Phone = @phone,
            Birthday = @birthday,
            Gender = @gender,
            Avatar = @avatar,
            UpdatedAt = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN
          INSERT (UserId, Updated, FullName, Email, Phone, Birthday, Gender, Avatar)
          VALUES (@userId, @updated, @fullName, @email, @phone, @birthday, @gender, @avatar);

        UPDATE dbo.AppUsers
        SET FullName = CASE WHEN @fullName = '' THEN FullName ELSE @fullName END,
            Email = CASE WHEN @email = '' THEN Email ELSE @email END,
            Phone = @phone,
            Birthday = @birthday,
            Gender = @gender
        WHERE Id = @userId;
      `);

    const userResult = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`SELECT ${publicUserSelect} FROM dbo.AppUsers WHERE Id = @userId`);

    const profile = await getProfileByUserId(userId);

    res.json({ user: userResult.recordset[0], profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể cập nhật hồ sơ.', error: err.message });
  }
});

app.post('/api/feedback', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const feedbackType = String(req.body.type || 'suggest').trim();
  const content = String(req.body.content || '').trim();

  if (!content) {
    return res.status(400).json({ message: 'Vui lòng nhập nội dung phản hồi.' });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .input('feedbackType', sql.NVarChar(40), feedbackType)
      .input('content', sql.NVarChar(1000), content)
      .query(`
        INSERT INTO dbo.FeedbackMessages (UserId, FeedbackType, Content)
        OUTPUT INSERTED.Id AS id, INSERTED.CreatedAt AS createdAt
        VALUES (@userId, @feedbackType, @content);
      `);

    res.status(201).json({
      message: 'Đã gửi phản hồi.',
      feedback: result.recordset[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể gửi phản hồi.', error: err.message });
  }
});

app.get('/api/users/me/videos/:kind', requireAuth, async (req, res) => {
  const allowedKinds = new Set(['history', 'favorite', 'followed']);
  const kind = String(req.params.kind || '').trim();

  if (!allowedKinds.has(kind)) {
    return res.status(400).json({ message: 'Danh sach phim khong hop le.' });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('userId', sql.Int, req.session.userId)
      .input('kind', sql.NVarChar(20), kind)
      .query(`
        SELECT Title AS title, Episode AS episode, MetaText AS metaText, Image AS image
        FROM dbo.UserVideoItems
        WHERE UserId = @userId AND ListType = @kind
        ORDER BY CreatedAt DESC, Id DESC;
      `);

    res.json({
      items: result.recordset.map((item) => [
        item.title || '',
        item.episode || '',
        item.metaText || '',
        item.image || ''
      ])
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Khong the tai danh sach phim cua tai khoan.', error: err.message });
  }
});

app.post('/api/users/me/videos/:kind', requireAuth, async (req, res) => {
  const allowedKinds = new Set(['history', 'favorite', 'followed']);
  const kind = String(req.params.kind || '').trim();
  const title = String(req.body.title || '').trim();
  const episode = String(req.body.episode || '').trim();
  const metaText = String(req.body.metaText || '').trim();
  const image = String(req.body.image || '').trim();

  if (!allowedKinds.has(kind)) {
    return res.status(400).json({ message: 'Danh sach phim khong hop le.' });
  }

  if (!title) {
    return res.status(400).json({ message: 'Vui long chon phim can luu.' });
  }

  try {
    const pool = await getPool();

    await pool
      .request()
      .input('userId', sql.Int, req.session.userId)
      .input('kind', sql.NVarChar(20), kind)
      .input('title', sql.NVarChar(220), title)
      .input('episode', sql.NVarChar(80), episode)
      .input('metaText', sql.NVarChar(160), metaText)
      .input('image', sql.NVarChar(500), image)
      .query(`
        DELETE FROM dbo.UserVideoItems
        WHERE UserId = @userId AND ListType = @kind AND Title = @title;

        INSERT INTO dbo.UserVideoItems (UserId, ListType, Title, Episode, MetaText, Image)
        VALUES (@userId, @kind, @title, @episode, @metaText, @image);
      `);

    res.status(201).json({ message: 'Da luu phim vao danh sach.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Khong the luu phim vao danh sach.', error: err.message });
  }
});

app.delete('/api/users/me/videos/:kind', requireAuth, async (req, res) => {
  const allowedKinds = new Set(['history', 'favorite', 'followed']);
  const kind = String(req.params.kind || '').trim();
  const title = String(req.body.title || '').trim();

  if (!allowedKinds.has(kind)) {
    return res.status(400).json({ message: 'Danh sach phim khong hop le.' });
  }

  try {
    const pool = await getPool();

    await pool
      .request()
      .input('userId', sql.Int, req.session.userId)
      .input('kind', sql.NVarChar(20), kind)
      .input('title', sql.NVarChar(220), title)
      .query(`
        DELETE FROM dbo.UserVideoItems
        WHERE UserId = @userId AND ListType = @kind
          AND (@title = '' OR Title = @title);
      `);

    res.json({ message: 'Da xoa phim khoi danh sach.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Khong the xoa phim khoi danh sach.', error: err.message });
  }
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Không thể khởi tạo SQL schema:', err);
    process.exit(1);
  });
