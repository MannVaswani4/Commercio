const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d',
    });

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: isProd,                          // HTTPS only in production
        sameSite: isProd ? 'none' : 'lax',       // 'none' required for cross-origin (Vercel→Railway)
        maxAge: 30 * 24 * 60 * 60 * 1000,       // 30 days
    });

    // Return the token so callers can also send it in the response body.
    // This is the fallback for iOS Safari / browsers that block third-party cookies.
    return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
