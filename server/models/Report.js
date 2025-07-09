const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address: { type: String },
  photo: { type: String }, // Cloudinary URL
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'verified', 'resolved', 'closed'], default: 'pending' },
  adminRemarks: { type: String, trim: true },
  feedback: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);