const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import data
const bcrypt = require('bcryptjs');

// Create users with plain text passwords
// The pre-save hook will handle the hashing
const createUsers = () => {
  return [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456', // Will be hashed by pre-save hook
      role: 'admin',
      authType: 'email',
      isEmailVerified: true
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456', // Will be hashed by pre-save hook
      role: 'user',
      authType: 'email',
      isEmailVerified: true
    },
    {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456', // Will be hashed by pre-save hook
      role: 'user',
      authType: 'email',
      isEmailVerified: true
    },
  ];
};

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    image: 'electronics.jpg',
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel',
    image: 'clothing.jpg',
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home appliances and kitchenware',
    image: 'home-kitchen.jpg',
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Books and publications',
    image: 'books.jpg',
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sports and outdoor equipment',
    image: 'sports.jpg',
  },
];

// Import into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data destroyed...'.red.inverse);

    // Create users (passwords will be hashed by the pre-save hook)
    const users = createUsers();
    console.log('Creating users...');
    const createdUsers = await User.create(users);
    console.log('Users created successfully');
    const adminUser = createdUsers[0]._id;

    // Add user to categories
    const sampleCategories = categories.map((category) => ({
      ...category,
      user: adminUser,
    }));

    // Create categories
    const createdCategories = await Category.create(sampleCategories);

    console.log('Data imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
