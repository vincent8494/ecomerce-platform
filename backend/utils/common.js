const mongoose = require('mongoose');

// Format error messages
exports.formatError = (error) => {
  if (error.name === 'ValidationError') {
    return Object.values(error.errors).map(err => err.message);
  }
  return error.message || 'Something went wrong';
};

// Generate unique codes
exports.generateCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Format currency
exports.formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Calculate distance between two points
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Validate email
exports.validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Generate unique slug
exports.generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Format date
exports.formatDate = (date, format = 'MM/DD/YYYY') => {
  const d = new Date(date);
  if (format === 'MM/DD/YYYY') {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }
  return d.toISOString();
};

// Generate password reset token
exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate phone number
exports.validatePhone = (phone) => {
  // Basic phone number validation (can be made more specific based on country)
  return /^\+?[0-9]{10,}$/.test(phone);
};

// Generate order number
exports.generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

// Calculate shipping cost
exports.calculateShipping = (weight, distance, baseRate = 5) => {
  // Basic shipping calculation (can be made more complex)
  const weightFactor = weight * 0.1;
  const distanceFactor = distance * 0.01;
  return (baseRate + weightFactor + distanceFactor).toFixed(2);
};
