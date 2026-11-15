require('dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const News = require('./models/News');
const Competition = require('./models/Competition');
const Result = require('./models/Result');

(async () => {
  const { MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set MONGO_URL, ADMIN_EMAIL and ADMIN_PASSWORD in .env');
  }
  await mongoose.connect(MONGO_URL);

  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10), role: 'admin' },
    { upsert: true }
  );
  console.log('Admin ready:', ADMIN_EMAIL);

  if ((await Competition.countDocuments()) === 0) {
    const [past] = await Competition.create([
      { title: { kz: 'Тест шоссе кубогы', ru: 'Тестовый кубок по шоссе' }, discipline: 'road', date: '2026-10-05', location: 'Astana' },
      { title: { kz: 'Тест трек чемпионаты', ru: 'Тестовый чемпионат по треку' }, discipline: 'track', date: '2027-03-15', location: 'Almaty' },
    ]);
    await Result.create([
      { competition: past._id, athlete: 'Test Athlete A', region: 'Astana', category: 'Elite', place: 1, time: '01:48:03', points: 100 },
      { competition: past._id, athlete: 'Test Athlete B', region: 'Almaty', category: 'Elite', place: 2, time: '01:48:10', points: 80 },
      { competition: past._id, athlete: 'Test Athlete C', region: 'Shymkent', category: 'Elite', place: 3, time: '01:48:25', points: 60 },
    ]);
    await News.create({
      title: { kz: 'Портал іске қосылды', ru: 'Портал запущен' },
      body: { kz: 'Бұл тест жаңалық.', ru: 'Это тестовая новость.' },
    });
    console.log('Sample data added');
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
