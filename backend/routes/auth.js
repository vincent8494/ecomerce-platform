const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/authController');

const {
  googleAuth,
  facebookAuth,
  linkSocialAccount
} = require('../controllers/socialAuthController');

const { protect } = require('../middleware/auth');

// Regular authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/logout', logout);

// Social authentication routes
router.post('/google', googleAuth);
router.post('/facebook', facebookAuth);
router.post('/link-social', protect, linkSocialAccount);

module.exports = router;
