const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be at least 0'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount must be at least 0%'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide product quantity'],
      min: [0, 'Quantity cannot be negative'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    colors: [String],
    sizes: [String],
    tags: [String],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for getting the final price after discount
productSchema.virtual('finalPrice').get(function () {
  return this.price * (1 - this.discount / 100);
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

// Calculate average rating when saving
productSchema.pre('save', async function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, item) => item.rating + acc, 0);
    this.averageRating = sum / this.ratings.length;
    this.numOfReviews = this.ratings.length;
  } else {
    this.averageRating = 0;
    this.numOfReviews = 0;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
