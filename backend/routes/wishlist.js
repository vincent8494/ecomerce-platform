const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist
} = require('../controllers/wishlistController');

const { protect } = require('../middleware/auth');

// Routes for wishlist operations
router
  .route('/add/:productId')
  .post(protect, addToWishlist);

router
  .route('/remove/:productId')
  .delete(protect, removeFromWishlist);

router
  .route('/')
  .get(protect, getWishlist)
  .delete(protect, clearWishlist);

module.exports = router;
