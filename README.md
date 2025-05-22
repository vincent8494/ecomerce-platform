# Fetty E-commerce Platform

![Fetty E-commerce Platform](https://via.placeholder.com/1200x600?text=Fetty+E-commerce+Platform)

A full-stack e-commerce platform built with modern web technologies to provide a seamless shopping experience.

## 🚀 Features

- **User Authentication**
  - Email/Password login and registration
  - Secure JWT authentication
  - Protected routes and role-based access control
  
- **Product Management**
  - Browse products by categories
  - Product search and filtering
  - Product details and reviews

- **Shopping Experience**
  - Add products to cart
  - Wishlist functionality
  - Secure checkout process
  - Order history and tracking

- **Admin Dashboard**
  - Manage products, categories, and users
  - View and process orders
  - Sales analytics and reporting

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Axios** for API requests

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email notifications

### Development Tools
- **Vite** for frontend tooling
- **Nodemon** for backend development
- **ESLint** and **Prettier** for code quality
- **Git** for version control

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fetty-ecommerce.git
   cd fetty-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the backend directory with:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     JWT_COOKIE_EXPIRE=30
     NODE_ENV=development
     ```

4. **Database Setup**
   - Make sure MongoDB is running locally or update the connection string
   - Seed the database with initial data:
     ```bash
     cd backend
     node seeds/seed.js
     ```

5. **Running the Application**
   - Start the backend server:
     ```bash
     cd backend
     npm run dev
     ```
   - Start the frontend development server:
     ```bash
     cd frontend
     npm run dev
     ```
   - Open [http://localhost:5173](http://localhost:5173) in your browser

## 📦 Deployment

### Backend Deployment
1. Set up a production MongoDB database (e.g., MongoDB Atlas)
2. Configure environment variables in your hosting platform
3. Deploy to your preferred hosting service (e.g., Heroku, Render, AWS)

### Frontend Deployment
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to a static hosting service (e.g., Vercel, Netlify, GitHub Pages)

## 🔒 Default Admin Credentials

- **Email:** admin@example.com
- **Password:** 123456

## 📚 API Documentation

API documentation is available at `/api-docs` when running the development server.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- And all the amazing open-source libraries used in this project

---

<p align="center">
  Made with ❤️ by Your Name
</p>
