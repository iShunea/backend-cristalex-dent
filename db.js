// db.js

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// MongoDB connection function
const connectDB = async () => {
  const uri = process.env.MONGO_DB;
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with failure if the connection fails
  }
};

module.exports = connectDB;
