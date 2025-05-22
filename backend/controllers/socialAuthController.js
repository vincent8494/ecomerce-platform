const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      authType: user.authType,
    },
  });
};

// @desc    Authenticate with Google
// @route   POST /api/v1/auth/google
// @access  Public
exports.googleAuth = asyncHandler(async (req, res, next) => {
  const { tokenId } = req.body;

  try {
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId, picture: avatar } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update user if they already exist
      if (user.authType !== 'google') {
        return next(
          new ErrorResponse(
            `Please login using ${user.authType} authentication`,
            400
          )
        );
      }
    } else {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        googleId,
        authType: 'google',
        avatar,
        isEmailVerified: true,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(new ErrorResponse('Invalid Google token', 401));
  }
});

// @desc    Authenticate with Facebook
// @route   POST /api/v1/auth/facebook
// @access  Public
exports.facebookAuth = asyncHandler(async (req, res, next) => {
  const { accessToken, userID } = req.body;

  try {
    // Get user info from Facebook
    const { data } = await axios.get(
      `https://graph.facebook.com/v12.0/${userID}?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { name, email, id: facebookId, picture } = data;
    const avatar = picture?.data?.url;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update user if they already exist
      if (user.authType !== 'facebook') {
        return next(
          new ErrorResponse(
            `Please login using ${user.authType} authentication`,
            400
          )
        );
      }
    } else {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        facebookId,
        authType: 'facebook',
        avatar,
        isEmailVerified: true,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Facebook Auth Error:', err);
    return next(new ErrorResponse('Facebook authentication failed', 401));
  }
});

// @desc    Link social account to existing user
// @route   POST /api/v1/auth/link-social
// @access  Private
exports.linkSocialAccount = asyncHandler(async (req, res, next) => {
  const { provider, tokenId, accessToken, userID } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (provider === 'google') {
      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const { email, sub: googleId } = ticket.getPayload();
      
      if (email !== user.email) {
        return next(new ErrorResponse('Email does not match your account', 400));
      }

      user.googleId = googleId;
      user.authType = 'google';
      await user.save();
    } 
    else if (provider === 'facebook') {
      // Verify Facebook token and get user info
      const { data } = await axios.get(
        `https://graph.facebook.com/v12.0/${userID}?fields=id,email&access_token=${accessToken}`
      );

      if (data.email && data.email !== user.email) {
        return next(new ErrorResponse('Email does not match your account', 400));
      }

      user.facebookId = data.id;
      user.authType = 'facebook';
      await user.save();
    } else {
      return next(new ErrorResponse('Invalid provider', 400));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Link Social Error:', err);
    return next(new ErrorResponse('Failed to link social account', 500));
  }
});
