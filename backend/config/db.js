const mongoose = require('mongoose');

let cachedConnection = null;

/**
 * Connect to MongoDB database
 * Uses MONGO_URI from environment variables
 * Includes caching for serverless environments
 */
const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
