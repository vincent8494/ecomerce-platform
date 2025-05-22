const { formatError } = require('../utils/common');
const { validateError } = require('../utils/validators');

// Custom error class
exports.CustomError = class CustomError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
    this.isOperational = true;
  }
};

// Validation error class
exports.ValidationError = class ValidationError extends CustomError {
  constructor(message, details = null) {
    super(message, 400, details);
  }
};

// Authentication error class
exports.AuthenticationError = class AuthenticationError extends CustomError {
  constructor(message, details = null) {
    super(message, 401, details);
  }
};

// Authorization error class
exports.AuthorizationError = class AuthorizationError extends CustomError {
  constructor(message, details = null) {
    super(message, 403, details);
  }
};

// Resource not found error class
exports.NotFoundError = class NotFoundError extends CustomError {
  constructor(message, details = null) {
    super(message, 404, details);
  }
};

// Global error handler middleware
exports.errorHandler = (err, req, res, next) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    status: err.status,
    details: err.details,
    requestId: req.requestId,
  });

  // Format error response
  let response = {
    status: 'error',
    message: 'Internal server error',
    requestId: req.requestId,
  };

  // Handle different error types
  if (err.isOperational) {
    response.message = err.message;
    response.status = err.status;
    if (err.details) response.details = err.details;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    response.message = formatError(err);
    response.status = 400;
  }

  // Handle mongoose errors
  if (err.name === 'MongoError') {
    if (err.code === 11000) {
      response.message = 'Duplicate entry';
      response.status = 400;
    } else {
      response.message = 'Database error';
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    response.message = 'Invalid or expired token';
    response.status = 401;
  }

  // Send response
  res.status(response.status || 500).json(response);
};

// Error handling middleware for async functions
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Input validation middleware
exports.validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    next();
  };
};

// File upload validation middleware
exports.validateUpload = (types, maxSize = 5242880) => {
  return (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new ValidationError('No files were uploaded');
    }

    const file = req.files.file;
    if (!types.includes(file.mimetype)) {
      throw new ValidationError('Invalid file type');
    }

    if (file.size > maxSize) {
      throw new ValidationError('File size too large');
    }

    next();
  };
};
