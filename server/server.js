require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// JWT middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// User dashboard stub
app.get('/api/user/dashboard', authenticateJWT, (req, res) => {
  if (req.user.role !== 'user') return res.sendStatus(403);
  res.json({ message: 'User dashboard data' });
});

// Admin dashboard stub
app.get('/api/admin/dashboard', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  res.json({ message: 'Admin dashboard data' });
});

app.get('/', (req, res) => {
  res.send('Citizen Portal Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 