const crypto = require('crypto');
const mongoose = require('mongoose');

// Validate password strength
exports.validatePassword = (password) => {
  // Minimum 8 characters
  // At least one uppercase letter
  // At least one lowercase letter
  // At least one number
  // At least one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

// Generate secure password hash
exports.hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Validate email domain
exports.validateEmailDomain = (email) => {
  const domain = email.split('@')[1];
  const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
  return allowedDomains.includes(domain);
};

// Validate phone number format
exports.validatePhoneNumber = (phone) => {
  // E.164 format validation
  const e164Regex = /^\+?[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
};

// Validate address format
exports.validateAddress = (address) => {
  // Basic address validation
  const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
  return addressRegex.test(address);
};

// Validate coupon code format
exports.validateCouponCode = (code) => {
  // Format: XXXX-XXXX-XXXX-XXXX
  const couponRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return couponRegex.test(code);
};

// Validate gift card code format
exports.validateGiftCardCode = (code) => {
  // Format: XXXX-XXXX-XXXX-XXXX
  const giftCardRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return giftCardRegex.test(code);
};

// Validate product SKU format
exports.validateSKU = (sku) => {
  // Format: P-XXXXX
  const skuRegex = /^P-[A-Z0-9]{5}$/;
  return skuRegex.test(sku);
};

// Validate order number format
exports.validateOrderNumber = (orderNumber) => {
  // Format: ORD-YYYYMMDD-XXXX
  const orderRegex = /^ORD-[0-9]{8}-[0-9]{4}$/;
  return orderRegex.test(orderNumber);
};

// Validate image URL
exports.validateImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = urlObj.pathname.split('.').pop().toLowerCase();
    return validExtensions.includes(extension);
  } catch {
    return false;
  }
};

// Validate file size
exports.validateFileSize = (fileSize, maxSize = 5242880) => {
  // Default max size is 5MB
  return fileSize <= maxSize;
};

// Validate file type
exports.validateFileType = (fileType, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  return allowedTypes.includes(fileType);
};

// Validate product price
exports.validatePrice = (price) => {
  return price >= 0 && price <= 1000000; // Max price of $1,000,000
};

// Validate stock quantity
exports.validateStock = (quantity) => {
  return quantity >= 0 && quantity <= 1000000; // Max stock of 1,000,000
};

// Validate rating
exports.validateRating = (rating) => {
  return rating >= 1 && rating <= 5;
};

// Validate review length
exports.validateReviewLength = (text) => {
  return text.length >= 10 && text.length <= 1000;
};
