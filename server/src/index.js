import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import sceneRoutes from './routes/sceneRoutes.js';
import observationRoutes from './routes/observationRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import userRoutes from './routes/userRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.API_CLIENT_ORIGIN,   // EC2 or Local depending on env file
  "http://localhost",
  "http://localhost:80",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/scenes/', sceneRoutes);
app.use('/api/observations/', observationRoutes);
app.use('/api/analyses/', analysisRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;

// --- Start Server Function ---
const startServer = async () => {
  try {
    // Wait for the database connection to be established
    await connectDB();
    
    // Then, start the Express server
    app.listen(PORT, "0.0.0.0")
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

// --- Execute the Server Start ---
startServer();