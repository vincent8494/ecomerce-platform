const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
  getProductsInRadius
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');

// Re-route into other resource routers
// router.use('/:productId/reviews', reviewRouter);

router
  .route('/radius/:zipcode/:distance')
  .get(getProductsInRadius);

router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'category',
      select: 'name description'
    }),
    getProducts
  )
  .post(protect, authorize('admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), productPhotoUpload);

module.exports = router;
