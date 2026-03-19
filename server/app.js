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
// Trust Railway/Heroku reverse proxy so req.secure = true (required for secure cookies)
app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://commercio-five.vercel.app',
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, curl) OR listed origins
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,   // Required so cookies (refresh token) are sent cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // cors() handles OPTIONS preflight automatically

const isProd = process.env.NODE_ENV === 'production';

// Session (needed for passport OAuth handshake only — JWT handles auth state)
app.use(session({
    secret: process.env.JWT_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProd,                    // HTTPS only in production
        sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-origin (Vercel → Railway)
        maxAge: 60000,                     // 1 min — only used during OAuth handshake
    },
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
