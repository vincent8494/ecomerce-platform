const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  default: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update updatedAt timestamp
addressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
addressSchema.index({ user: 1 });

// Validate postal code format
addressSchema.path('postalCode').validate(function(value) {
  // Basic postal code validation (can be made more specific based on country)
  return /^[A-Za-z0-9- ]+$/.test(value);
}, 'Invalid postal code format');

// Validate phone number format
addressSchema.path('phone').validate(function(value) {
  // Basic phone number validation
  return /^\+?[0-9]{10,}$/.test(value);
}, 'Invalid phone number format');

module.exports = mongoose.model('Address', addressSchema);
