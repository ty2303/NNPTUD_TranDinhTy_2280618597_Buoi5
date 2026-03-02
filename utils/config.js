const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/nnptud_db?authSource=admin';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);

    // Load models trước khi sync indexes
    const Role = require('../models/Role');
    const User = require('../models/User');

    // Sync indexes từng model (đảm bảo partial unique index được tạo)
    await Role.syncIndexes();
    await User.syncIndexes();
    console.log('MongoDB Indexes synced');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, MONGO_URI };
