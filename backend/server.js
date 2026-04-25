const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ------ Middleware ------

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for easier development/deployment, enable if needed
}));

// Compression
app.use(compression());

// CORS — allow frontend to communicate with backend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ------ API Routes ------

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LMS API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/api', (req, res) => {
  res.send('Api is Running');
});

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Mount route files
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enroll', require('./routes/enrollmentRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// ------ Deployment ------

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

// ------ Error Handler ------
app.use(errorHandler);

// ------ Start Server ------
const PORT = process.env.PORT || 5000;

// For Vercel serverless deployment
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  module.exports = app;
}
