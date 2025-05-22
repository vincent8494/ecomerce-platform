const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

// Security headers
exports.securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
exports.corsConfig = cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Request ID middleware
exports.requestId = (req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

// Security headers middleware
exports.securityHeadersMiddleware = (req, res, next) => {
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict-Transport-Security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
};

// SQL Injection prevention
exports.preventSQLInjection = (req, res, next) => {
  const sqlRegex = /['";=]/;
  const hasSQLInjection = Object.values(req.body).some(value => 
    typeof value === 'string' && sqlRegex.test(value)
  );
  
  if (hasSQLInjection) {
    return res.status(400).json({
      status: 'error',
      message: 'SQL injection attempt detected',
    });
  }
  
  next();
};

// XSS prevention
exports.preventXSS = (req, res, next) => {
  const xssRegex = /<script|<iframe|<object|<embed|<svg|<link|<style|<meta/i;
  const hasXSS = Object.values(req.body).some(value => 
    typeof value === 'string' && xssRegex.test(value)
  );
  
  if (hasXSS) {
    return res.status(400).json({
      status: 'error',
      message: 'XSS attempt detected',
    });
  }
  
  next();
};

// CSRF protection
exports.csrfProtection = (req, res, next) => {
  const token = req.headers['x-csrf-token'];
  if (!token) {
    return res.status(403).json({
      status: 'error',
      message: 'CSRF token required',
    });
  }
  
  // In a real application, you would verify the token against a stored value
  next();
};

// File upload validation
exports.validateFileUpload = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No files were uploaded',
    });
  }

  const file = req.files.file;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid file type',
    });
  }

  if (file.size > maxSize) {
    return res.status(400).json({
      status: 'error',
      message: 'File size too large',
    });
  }

  next();
};
