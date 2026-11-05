const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Agar MongoDB Atlas URI mavjud bo'lsa va standart placeholder bo'lmasa, ulanishga harakat qilamiz
  const isDefaultPlaceholder = !uri || uri.includes('admin:password123');

  if (!isDefaultPlaceholder) {
    try {
      console.log('🔄 MongoDB Atlas ulanmoqda...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 6000,
      });
      console.log(`✅ MongoDB Atlas muvaffaqiyatli ulandi: ${conn.connection.host} (DB: ${conn.connection.name})`);
      return {
        type: 'Atlas',
        host: conn.connection.host,
        name: conn.connection.name,
        uri: uri,
      };
    } catch (atlasErr) {
      console.warn('⚠️ MongoDB Atlas ulanishda xatolik:', atlasErr.message);
      console.warn('🔄 Zaxira (In-Memory MongoDB) bazasiga o\'tilmoqda...');
    }
  } else {
    console.log('ℹ️ MONGODB_URI hali sozlanmagan yoki standart namunada. Zaxira bazaga ulanmoqda...');
  }

  // Zaxira: MongoDB Memory Server (Atlas ulanmagan bo'lsa darhol ishlashi uchun)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'cookie_session_auth',
      },
    });
    const memoryUri = memoryServerInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Zaxira In-Memory MongoDB ulandi: ${memoryUri}`);
    console.log('💡 MongoDB Atlas ishlatish uchun backend/.env faylida MONGODB_URI ga haqiqiy Atlas havolangizni yozing.');
    return {
      type: 'In-Memory (Development)',
      host: 'localhost',
      name: 'cookie_session_auth',
      uri: memoryUri,
    };
  } catch (memErr) {
    console.error('❌ MongoDB ulanish xatosi:', memErr.message);
    throw memErr;
  }
};

module.exports = connectDB;

