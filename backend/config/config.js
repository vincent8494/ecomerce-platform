const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB connection
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/fetty',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 30,
  
  // File upload
  maxFileUpload: process.env.MAX_FILE_UPLOAD || 1000000, // 1MB
  fileUploadPath: process.env.FILE_UPLOAD_PATH || path.join(__dirname, '../public/uploads'),
  
  // Email
  smtpHost: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  smtpPort: process.env.SMTP_PORT || 2525,
  smtpEmail: process.env.SMTP_EMAIL || 'your_smtp_email',
  smtpPassword: process.env.SMTP_PASSWORD || 'your_smtp_password',
  fromEmail: process.env.FROM_EMAIL || 'noreply@fetty.com',
  fromName: process.env.FROM_NAME || 'Fetty Store',
  
  // Payment (Stripe)
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'your_stripe_webhook_secret',
  
  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // limit each IP to 100 requests per windowMs
};

// Ensure required environment variables are set
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGO_URI',
  'SMTP_EMAIL',
  'SMTP_PASSWORD',
  'STRIPE_SECRET_KEY',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}
