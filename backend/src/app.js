
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFound } = require("./middleware/errorHandler");
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const tmdbRoutes = require('./modules/tmdb/tmbd.routes');
require('dotenv').config();

const app = express();

// Security & basic middlewares
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting (basic)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// Health check
app.get('/health', (req, res) => res.json({ ok: true, service: 'prism-backend' }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tmdb', tmdbRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = { app };