require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');

  // ------ AUTO-CREATE ADMIN USER IF NOT EXISTS ------
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');

  if (
    process.env.DEFAULT_ADMIN_EMAIL &&
    process.env.DEFAULT_ADMIN_PASSWORD
  ) {
    const existingAdmin = await User.findOne({ email: process.env.DEFAULT_ADMIN_EMAIL, role: 'admin' });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);
      await User.create({
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: hashed,
        role: 'admin',
        isVerified: true
      });
      console.log(`Default admin created: ${process.env.DEFAULT_ADMIN_EMAIL}`);
    }
  }
}).catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Citizen Portal Backend Running');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});