# Fetty E-commerce Backend API

This is the backend API for the Fetty e-commerce platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Product management
- Category management
- Order processing
- Shopping cart functionality
- File uploads
- Email notifications
- Secure payment processing with Stripe
- Rate limiting and security best practices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Stripe account (for payment processing)
- SMTP service (for email notifications)

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/fetty-ecommerce.git
cd fetty-ecommerce/backend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/fetty

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# File Upload
MAX_FILE_UPLOAD=1000000
FILE_UPLOAD_PATH=./public/uploads

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_EMAIL=your_smtp_email
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@fetty.com
FROM_NAME=Fetty Store

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

4. Seed the database (optional)

```bash
# Seed with sample data
npm run seed

# Clear the database
npm run seed:destroy
```

## Running the Application

### Development

```bash
npm run dev
# or
yarn dev
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

### Production

```bash
npm start
# or
yarn start
```

## API Documentation

API documentation is available at `/api-docs` when the server is running in development mode.

### Authentication

Most routes require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Available Endpoints

#### Auth

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password
- `POST /api/v1/auth/forgotpassword` - Forgot password
- `PUT /api/v1/auth/resetpassword/:resettoken` - Reset password
- `GET /api/v1/auth/logout` - Logout user

#### Products

- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create new product (admin only)
- `PUT /api/v1/products/:id` - Update product (admin only)
- `DELETE /api/v1/products/:id` - Delete product (admin only)
- `PUT /api/v1/products/:id/photo` - Upload product photo

#### Categories

- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get single category
- `POST /api/v1/categories` - Create new category (admin only)
- `PUT /api/v1/categories/:id` - Update category (admin only)
- `DELETE /api/v1/categories/:id` - Delete category (admin only)
- `PUT /api/v1/categories/:id/photo` - Upload category photo

#### Orders

- `GET /api/v1/orders` - Get all orders (admin only)
- `GET /api/v1/orders/myorders` - Get logged in user orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/:id/pay` - Update order to paid
- `PUT /api/v1/orders/:id/deliver` - Update order to delivered (admin only)
- `PUT /api/v1/orders/:id/status` - Update order status (admin only)

#### Users

- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID (admin only)
- `POST /api/v1/users` - Create new user (admin only)
- `PUT /api/v1/users/:id` - Update user (admin only)
- `DELETE /api/v1/users/:id` - Delete user (admin only)
- `PUT /api/v1/users/photo` - Upload user photo

## Security

- Helmet for setting various HTTP headers
- Express Rate Limit for rate limiting
- Express Mongo Sanitize for data sanitization
- XSS protection
- HPP (HTTP Parameter Pollution) protection
- CORS enabled
- JWT for authentication
- Password hashing with bcrypt
- Input validation with express-validator

## Testing

To run tests:

```bash
npm test
# or
yarn test
```

## Deployment

### Heroku

1. Install the Heroku CLI
2. Login to your Heroku account
3. Create a new Heroku app

```bash
heroku create
```

4. Add MongoDB add-on

```bash
heroku addons:create mongolab:sandbox
```

5. Set environment variables on Heroku

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
# Set other environment variables as needed
```

6. Deploy to Heroku

```bash
git push heroku main
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Stripe](https://stripe.com/)
- [Nodemailer](https://nodemailer.com/about/)
