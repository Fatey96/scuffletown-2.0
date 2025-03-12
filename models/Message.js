const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: false,
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    maxlength: 100,
  },
  message: {
    type: String,
    required: [true, 'Please add your message'],
    maxlength: 1000,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: false, // Optional, in case message is about specific vehicle
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for unread messages
MessageSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema); 