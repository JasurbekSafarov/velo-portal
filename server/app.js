require('dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

if (!process.env.MONGO_URL || !process.env.JWT_SECRET) {
  console.error('Set MONGO_URL and JWT_SECRET in .env');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/competitions', require('./routes/competitions'));
app.use('/api/results', require('./routes/results'));

app.use(express.static(path.join(__dirname, '..', 'client')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`)))
  .catch((e) => {
    console.error('MongoDB connection failed:', e.message);
    process.exit(1);
  });
