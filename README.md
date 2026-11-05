# 🚀 Cookie & Session Auth — To‘liq Qo‘llanma

Ushbu loyiha zamonaviy **Fullstack (React + Vite + Node.js + Express + MongoDB Atlas)** arxitekturasida yaratilgan bo‘lib, xavfsiz **Cookie va Session** autentifikatsiyasi, foydalanuvchi sozlamalari (Til va Rang), hamda O‘quvchilarni boshqarish (CRUD, qidiruv, statistika) tizimini o‘z ichiga oladi.

---

## 📑 Bajarilgan Vazifalar Ro‘yxati (10/10)

### 1. MongoDB & Atlas
- [x] **MongoDB Atlas ulash**: `backend/.env` orqali Atlas ulanish konfiguratsiyasi va avtomatik zaxira tizimi.
- [x] **Database yaratish**: `cookie_session_auth` ma'lumotlar bazasi va `users`, `students`, `sessions` to'plamlari.
- [x] **User Model**: `name` (unique, minlength 3), `password` (bcrypt hash), `language` (uz/ru/en), `theme` (light/dark).
- [x] **Student Model**: `name`, `email`, `phone`, `course`, `status` (active/inactive/graduated), `grade` (0-100), `createdBy`.

### 2. Register va Login
- [x] **Register sahifasi**: Ism va parol kiritish, parolni tasdiqlash, validatsiya.
- [x] **Ma'lumotlarni saqlash**: Parollar `bcryptjs` (salt 10) orqali xeshlangan holda MongoDB'ga saqlanadi.
- [x] **Login sahifasi**: Ism va parolni tekshirish.
- [x] **Noto‘g‘ri parolga ruxsat bermaslik**: Xato parol kiritilganda `401 Unauthorized` xabari ko‘rsatiladi.
- [x] **Alohida ID**: Har bir foydalanuvchiga MongoDB tomonidan unikal `_id` biriktiriladi.

### 3. Session
- [x] **express-session** o‘rnatildi va konfiguratsiya qilindi.
- [x] **connect-mongo** o‘rnatildi (`MongoStore`).
- [x] **Session yaratish**: Muvaffaqiyatli login bo‘lganda serverda yangi sessiya ochiladi.
- [x] **req.session.userId**: Sessiya ichida foydalanuvchi identifikatori saqlanadi.
- [x] **MongoDB'da saqlash**: Sessiyalar bevosita MongoDB'ning `sessions` to‘plamida saqlanadi (server o‘chib yonsa ham sessiya saqlanib qoladi).
- [x] **Session holatini tekshirish**: `/api/auth/session-status` va `/api/auth/me` orqali sessiya holati olinadi.
- [x] **Logout**: `req.session.destroy()` orqali sessiya MongoDB'dan to‘liq o‘chiriladi.

### 4. Cookie
- [x] **cookie-parser** o‘rnatildi va middleware sifatida ulandi.
- [x] **connect.sid**: Cookie nomi standart `connect.sid` sifatida yaratildi.
- [x] **HttpOnly: true**: Brauzer JavaScript kodi cookie'ni o‘g‘irlay olmaydi (XSS himoyasi).
- [x] **SameSite: lax**: Saytlararo so‘rovlarni soxtalashtirishdan (CSRF) himoya.
- [x] **Cookie orqali Session ID yuborish**: Har bir HTTP so‘rovda brauzer avtomatik ravishda Session ID'ni sarlavhada yuboradi (`credentials: 'include'`).
- [x] **Foydalanuvchini tanish**: `authMiddleware` orqali cookie orqali sessiya topilib, foydalanuvchi aniqlanadi.
- [x] **Logout cookie tozalash**: `res.clearCookie('connect.sid')` orqali cookie brauzerdan tozalanadi.

### 5. O‘quvchilar (Students)
- [x] **O‘quvchi qo‘shish**: Ism, email, telefon, kurs, holat va baho bilan qo‘shish modali.
- [x] **O‘quvchilar ro‘yxatini ko‘rish**: Chiroyli jadval va kartalar ko‘rinishi.
- [x] **O‘quvchini tahrirlash**: Istalgan maydonni tezkor tahrirlash.
- [x] **O‘quvchini o‘chirish**: Tasdiqlash tugmasi bilan o‘chirish.
- [x] **O‘quvchilarni qidirish**: Ism, telefon, email va kurs bo‘yicha jonli tezkor qidiruv.
- [x] **O‘quvchilar statistikasi**: Jami, faol, muzlatilgan, bitirganlar soni, o‘rtacha baho va kurslar bo‘yicha taqsimot.

### 6. Til (Internationalization)
- [x] **O‘zbek tili (UZ)**
- [x] **Rus tili (RU)**
- [x] **Ingliz tili (EN)**
- [x] **Tilni almashtirish**: Yuqori menyudagi qulay dropdown orqali.
- [x] **Standart til**: O‘zbekcha (UZ).
- [x] **Akkauntda alohida saqlash**: Tanlangan til MongoDB'da foydalanuvchi profiliga saqlanadi va qayta kirganda tiklanadi.

### 7. Rang (Theme)
- [x] **Light Mode**: Oq, yorug‘ dizayn.
- [x] **Dark Mode**: Zamonaviy to‘q, qora dizayn.
- [x] **Rangni almashtirish tugmasi**: Quyosh/Oy animatsion belgisi.
- [x] **Standart rang**: Oq (Light).
- [x] **Akkauntda alohida saqlash**: Har bir akkaunt o‘zining tanlagan mavzusini MongoDB'da saqlaydi va keyingi kirishda avtomatik tiklanadi.

### 8. Dashboard
- [x] **Cookie & Session Auth sarlavhasi**: Zamonaviy gradient sarlavha.
- [x] **Foydalanuvchi ismi va Foydalanuvchi ID**: MongoDB `_id` va foydalanuvchi ismi kartada ko‘rsatiladi.
- [x] **Authentication holati**: "Muvaffaqiyatli autentifikatsiya (Faol)" animatsion yashil indikator.
- [x] **Session ID**: Serverdan olingan faol sessiya kaliti.
- [x] **Session holati**: MongoDB Connect-Mongo faol holat indikatori.
- [x] **Cookie nomi**: `connect.sid`.
- [x] **HttpOnly va SameSite holati**: `HttpOnly: true`, `SameSite: Lax`.
- [x] **Session muddati**: Jonli sekund-ba-sekund orqaga hisoblovchi taymer (`HH:MM:SS`).
- [x] **Sessiyani tekshirish tugmasi**: Jonli server so‘rovini yuborib, JSON va xavfsizlik parametrlarini ko‘rsatuvchi modal.
- [x] **Logout tugmasi**: Sessiya va cookie'ni tozalab, Login sahifasiga yo‘naltiradi.

### 9. Frontend va AI
- [x] **React + Vite**: Yuqori tezlikdagi zamonaviy frontend ekotizimi.
- [x] **AI Zamonaviy Dizayn**: Tailwind CSS, Lucide Icons, Glassmorphism, yumshoq soyalar va toza shriftlar.
- [x] **Register va Login sahifalari**: Chiroyli shakllar, parolni ko‘rsatish/yashirish tugmalari, xatoliklar banneri.
- [x] **Backend API bilan ulash**: Axios `withCredentials: true` orqali to‘liq ulangan.
- [x] **Responsive dizayn**: Telefon, planshet va kompyuterlar uchun 100% moslashuvchan.

### 10. Yakuniy Tekshiruv & Postman
- [x] **Bir vaqtda ishga tushirish**: `npm run dev` orqali Frontend va Backend bitta buyruq bilan parallel ishga tushadi.
- [x] **Postman to‘plami**: `postman_collection.json` fayli taqdim etildi.

---

## 🛠️ O‘rnatish va Ishga Tushirish

### 1. MongoDB Atlas ulanishini sozlash (Ixtiyoriy)
Loyiha ichidagi `backend/.env` faylini oching va o‘zingizning MongoDB Atlas ulanish havolangizni yozing:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cookie_session_auth?retryWrites=true&w=majority
PORT=5000
SESSION_SECRET=super_secret_session_key_cookie_auth_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(Eslatma: Agar MongoDB Atlas havolasi kiritilmasa, loyiha avtomatik ravishda ichki zaxira bazasini ishga tushirib, to‘xtovsiz ishlayveradi).*

### 2. Loyihani Ishga Tushirish
Bitta buyruq bilan Backend va Frontendni parallel ishga tushiring:
```bash
npm run dev
```

Serverlar quyidagi manzillarda ishlaydi:
- 🌐 **Frontend (React + Vite)**: `http://localhost:5173`
- ⚙️ **Backend API (Express + MongoDB)**: `http://localhost:5000`

---

## 📬 Postman orqali tekshirish

Loyiha ildizidagi `postman_collection.json` faylini Postman'ga **Import** qiling:
1. `POST /api/auth/register` — Yangi foydalanuvchi yaratish
2. `POST /api/auth/login` — Tizimga kirish (Cookie olinadi)
3. `GET /api/auth/me` — Cookie orqali joriy sessiyani tekshirish
4. `GET /api/auth/session-status` — Sessiya va cookie parametrlarini to‘liq ko‘rish
5. `POST /api/students` — O‘quvchi qo‘shish
6. `GET /api/students` — O‘quvchilarni qidirish va ro‘yxatini olish
7. `GET /api/students/stats` — Statistikani ko‘rish
8. `PUT /api/user/preferences` — Til va Rangni o‘zgartirish
9. `POST /api/auth/logout` — Tizimdan chiqish (Cookie tozalanadi)

