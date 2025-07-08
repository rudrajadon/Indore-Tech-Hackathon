const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String },
  photo: { type: String }, // URL or file path
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'resolved'], default: 'pending' },
  adminRemarks: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema); 