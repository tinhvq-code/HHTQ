import cors from 'cors';
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

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig);
  }

  return poolPromise;
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

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

    res.status(201).json({ user, profile });
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

    res.json({ user, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể đăng nhập.', error: err.message });
  }
});

app.get('/api/users/:userId/profile', async (req, res) => {
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

app.put('/api/users/:userId/profile', async (req, res) => {
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

app.post('/api/feedback', async (req, res) => {
  const userId = req.body.userId ? Number(req.body.userId) : null;
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
