const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: [true, 'Please add a review title'],
    maxlength: 100,
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: 500,
  },
  isApproved: {
    type: Boolean,
    default: false, // Needs admin approval before appearing on site
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for approved reviews
ReviewSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema); 