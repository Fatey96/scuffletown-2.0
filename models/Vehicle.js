const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please specify vehicle type (car or motorcycle)'],
    enum: ['car', 'motorcycle'],
  },
  make: {
    type: String, 
    required: [true, 'Please add a make'],
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
  },
  year: {
    type: Number,
    required: [true, 'Please add a year'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  mileage: {
    type: Number,
    required: [true, 'Please add mileage'],
  },
  color: {
    type: String,
    required: [true, 'Please add a color'],
  },
  vin: {
    type: String,
    required: [true, 'Please add a VIN'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  features: {
    type: [String],
    required: false,
  },
  images: {
    type: [String], // Array of image URLs
    required: [true, 'Please add at least one image'],
  },
  featured: {
    type: Boolean,
    default: false,
    set: function(value) {
      // Ensure we're always storing a boolean
      return Boolean(value);
    }
  },
  sold: {
    type: Boolean,
    default: false,
    set: function(value) {
      // Ensure we're always storing a boolean
      return Boolean(value);
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index for common search patterns
VehicleSchema.index({ make: 1, model: 1, year: 1 });
VehicleSchema.index({ type: 1, featured: 1 });
VehicleSchema.index({ sold: 1 });

// Middleware to ensure consistent field names and types
VehicleSchema.pre('save', function(next) {
  // If isFeatured exists, synchronize with featured
  if (this.isFeatured !== undefined) {
    this.featured = Boolean(this.isFeatured);
    this.isFeatured = undefined; // Remove the legacy field
    console.log('Synchronized isFeatured → featured:', this.featured);
  }
  
  // If isSold exists, synchronize with sold
  if (this.isSold !== undefined) {
    this.sold = Boolean(this.isSold);
    this.isSold = undefined; // Remove the legacy field
    console.log('Synchronized isSold → sold:', this.sold);
  }
  
  next();
});

// Middleware to handle updates
VehicleSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Handle featured field consistency
  if (update.isFeatured !== undefined && update.featured === undefined) {
    update.featured = Boolean(update.isFeatured);
    delete update.isFeatured;
    console.log('Update: Synchronized isFeatured → featured:', update.featured);
  }
  
  // Handle sold field consistency
  if (update.isSold !== undefined && update.sold === undefined) {
    update.sold = Boolean(update.isSold);
    delete update.isSold;
    console.log('Update: Synchronized isSold → sold:', update.sold);
  }
  
  next();
});

module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema); 