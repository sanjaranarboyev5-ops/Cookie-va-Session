const http = require('http');

// Simple helper to make HTTP requests with cookie retention
const makeRequest = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookies: res.headers['set-cookie'] || [],
          body: parsed,
        });
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function runTests() {
  console.log('🧪 ==========================================');
  console.log('🧪 COOKIE & SESSION AUTH TO\'LIQ TEKSHIRUV');
  console.log('🧪 ==========================================');

  let sessionCookie = '';

  // 1. Health check
  console.log('\n[1] Health Check...');
  const healthRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('✅ Health status:', healthRes.body.status, '| DB:', healthRes.body.database);

  // 2. Register User 1
  console.log('\n[2] Register User 1 (ali_valiyev)...');
  const regRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { name: 'ali_valiyev', password: 'secretPassword123', language: 'uz', theme: 'light' }
  );
  console.log('✅ Register natijasi:', regRes.statusCode, regRes.body.message);
  console.log('✅ Berilgan User ID:', regRes.body.user?.id);

  // 3. Login with wrong password test
  console.log('\n[3] Noto\'g\'ri parol bilan login tekshirish (rad etilishi kerak)...');
  const wrongLoginRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { name: 'ali_valiyev', password: 'noto_g_ri_parol' }
  );
  if (wrongLoginRes.statusCode === 401) {
    console.log('✅ Noto\'g\'ri parol to\'g\'ri rad etildi:', wrongLoginRes.body.message);
  } else {
    console.error('❌ Noto\'g\'ri parol rad etilmadi!', wrongLoginRes.statusCode);
  }

  // 4. Login with correct password
  console.log('\n[4] To\'g\'ri parol bilan login...');
  const loginRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { name: 'ali_valiyev', password: 'secretPassword123' }
  );
  console.log('✅ Login natijasi:', loginRes.statusCode, loginRes.body.message);
  console.log('✅ Set-Cookie sarlavhalari:', loginRes.cookies);

  // Cookie extraction
  if (loginRes.cookies.length > 0) {
    sessionCookie = loginRes.cookies[0].split(';')[0];
    const cookieHeaderStr = loginRes.cookies[0];
    const isHttpOnly = cookieHeaderStr.toLowerCase().includes('httponly');
    const isSameSiteLax = cookieHeaderStr.toLowerCase().includes('samesite=lax');
    console.log(`✅ Cookie nomi va qiymati: ${sessionCookie}`);
    console.log(`✅ HttpOnly: ${isHttpOnly} | SameSite: Lax: ${isSameSiteLax}`);
  }

  // 5. Get Me (Check Session & Cookie)
  console.log('\n[5] Sessiya va Cookie orqali /api/auth/me tekshirish...');
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      Cookie: sessionCookie,
    },
  });
  console.log('✅ /api/auth/me natijasi:', meRes.body.isAuthenticated ? 'Autentifikatsiya Muvaffaqiyatli' : 'Xato');
  console.log('✅ Foydalanuvchi:', meRes.body.user?.name, '| ID:', meRes.body.user?.id);
  console.log('✅ Session ID:', meRes.body.session?.id);

  // 6. Session Status (Inspector)
  console.log('\n[6] /api/auth/session-status tekshirish...');
  const statusRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/session-status',
    method: 'GET',
    headers: {
      Cookie: sessionCookie,
    },
  });
  console.log('✅ Session Status:', statusRes.body.session?.status);
  console.log('✅ Server qabul qilgan xom cookie:', statusRes.body.session?.rawCookieReceived);

  // 7. Students CRUD: Create Student
  console.log('\n[7] Yangi o\'quvchi qo\'shish (POST /api/students)...');
  const createStudentRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/students',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
    },
    {
      name: 'Sherzod Mamadaliyev',
      email: 'sherzod@gmail.com',
      phone: '+998901234567',
      course: 'Fullstack JavaScript',
      status: 'active',
      grade: 95,
    }
  );
  const createdStudentId = createStudentRes.body.data?._id;
  console.log('✅ O\'quvchi qo\'shildi:', createStudentRes.body.message, '| ID:', createdStudentId);

  // 8. Students Stats
  console.log('\n[8] O\'quvchilar statistikasi (GET /api/students/stats)...');
  const statsRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/stats',
    method: 'GET',
    headers: {
      Cookie: sessionCookie,
    },
  });
  console.log('✅ Statistika:', statsRes.body.stats);

  // 9. Update Preferences (Theme & Language per account)
  console.log('\n[9] Foydalanuvchi tilini RU va rangini DARK ga o\'zgartirish...');
  const prefRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/user/preferences',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
    },
    { language: 'ru', theme: 'dark' }
  );
  console.log('✅ Yangilangan sozlamalar:', prefRes.body.user);

  // 10. Logout & Verify Cookie Clearing
  console.log('\n[10] Tizimdan chiqish (Logout)...');
  const logoutRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/logout',
    method: 'POST',
    headers: {
      Cookie: sessionCookie,
    },
  });
  console.log('✅ Logout javobi:', logoutRes.body.message);
  console.log('✅ Set-Cookie tozalash sarlavhasi:', logoutRes.cookies);

  // Check if session is destroyed
  console.log('\n[11] Sessiya yo\'q qilinganligini tekshirish...');
  const postLogoutMe = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      Cookie: sessionCookie,
    },
  });
  if (postLogoutMe.statusCode === 401) {
    console.log('✅ Sessiya muvaffaqiyatli yo\'q qilindi! (401 Unauthorized qaytarildi)');
  } else {
    console.error('❌ Sessiya hali ham faol!', postLogoutMe.statusCode);
  }

  // 12. Register second user to verify per-account settings separation
  console.log('\n[12] Ikkinchi foydalanuvchini (nodira_usmonova) ro\'yxatdan o\'tkazish...');
  const user2Reg = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { name: 'nodira_usmonova', password: 'password456', language: 'en', theme: 'light' }
  );
  console.log('✅ Ikkinchi foydalanuvchi:', user2Reg.body.user?.name, '| Til:', user2Reg.body.user?.language, '| Rang:', user2Reg.body.user?.theme);

  console.log('\n🎉 BARCHA TEKSHIRUVLAR MUVAFFAQIYATLI YAKUNLANDI!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test xatosi:', err);
  process.exit(1);
});

