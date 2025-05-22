const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryPhotoUpload,
} = require('../controllers/categoryController');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Category = require('../models/Category');

router
  .route('/')
  .get(
    advancedResults(Category, {
      path: 'products',
      select: 'name description price'
    }),
    getCategories
  )
  .post(protect, authorize('admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

router
  .route('/:id/photo')
  .put(protect, authorize('admin'), categoryPhotoUpload);

module.exports = router;
