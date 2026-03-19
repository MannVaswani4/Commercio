const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// Note: passport is required AFTER dotenv has loaded (see server.js load order)
const passport = require('./config/passport');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({
    crossOriginOpenerPolicy: { policy: 'unsafe-none' }, // allow Google OAuth popup to communicate
}));
const corsOptions = {
    origin: true,        // Mirror request Origin — always sets the header
    credentials: true,   // Required for cookies (refresh token)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // cors() handles OPTIONS preflight automatically

// Session (needed for passport, though we use stateless JWT — only used during OAuth handshake)
app.use(session({
    secret: process.env.JWT_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 }, // 1 min — just for the handshake
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/images', express.static(path.join(__dirname, '/images')));

// Health check
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
