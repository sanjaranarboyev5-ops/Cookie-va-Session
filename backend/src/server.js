const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Muhit o'zgaruvchilarini yuklash
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. CORS sozlamalari (Cookie almashish uchun credentials: true majburiy)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Tana (Body) va Cookie parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serverni ishga tushirish funksiyasi
const startServer = async () => {
  try {
    // 1. MongoDB ulanishi (Atlas yoki In-Memory Fallback)
    const dbInfo = await connectDB();

    // 2. connect-mongo orqali Session'ni MongoDB'da saqlash konfiguratsiyasi
    const mongoStore = MongoStore.create({
      mongoUrl: dbInfo.uri,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 kun (sekundlarda)
      autoRemove: 'native',
    });

    // 3. express-session sozlamalari
    // Cookie nomi: connect.sid, HttpOnly: true, SameSite: lax
    app.use(
      session({
        name: 'connect.sid',
        secret: process.env.SESSION_SECRET || 'cookie_session_secret_2026',
        resave: false,
        saveUninitialized: false,
        store: mongoStore,
        cookie: {
          httpOnly: true, // Brauzer JS kodi o'qiy olmaydi (XSS himoyasi)
          sameSite: 'lax', // CSRF himoyasi
          secure: process.env.NODE_ENV === 'production', // Dev rejimida false, HTTPS da true
          maxAge: 1000 * 60 * 60 * 24, // 24 soat (millisekundlarda)
        },
      })
    );

    // 4. API Marshrutlari (Routes)
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/user', require('./routes/userRoutes'));
    app.use('/api/students', require('./routes/studentRoutes'));

    // Server holati (Health check)
    app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'UP',
        message: 'Cookie & Session Auth Backend ishlayapti',
        database: dbInfo.type,
        databaseName: dbInfo.name,
        authenticated: !!(req.session && req.session.userId),
        sessionId: req.sessionID || null,
        timestamp: new Date().toISOString(),
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Marshrut topilmadi: ${req.originalUrl}`,
      });
    });

    // Global xatolik middleware
    app.use((err, req, res, next) => {
      console.error('Server kutilmagan xatolik:', err);
      res.status(500).json({
        success: false,
        message: 'Ichki server xatosi',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });

    // Tinglash
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`);
      console.log(`🔒 Cookie: connect.sid (HttpOnly: true, SameSite: lax)`);
      console.log(`💾 Session Store: MongoDB (${dbInfo.type})`);
      console.log(`🌐 CORS ruxsat berilgan: ${CLIENT_URL}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Serverni ishga tushirishda xatolik:', error);
    process.exit(1);
  }
};

startServer();

