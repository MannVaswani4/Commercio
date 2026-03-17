const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
    (req, res) => {
        const user = req.user;

        // Set refresh token cookie
        generateRefreshToken(res, user._id);

        // Generate access token
        const accessToken = generateAccessToken(user._id);

        // Redirect to frontend with access token in query param (client extracts it once)
        const params = new URLSearchParams({
            accessToken,
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || '',
        });

        res.redirect(`${process.env.CLIENT_URL}/auth/callback?${params.toString()}`);
    }
);

module.exports = router;
