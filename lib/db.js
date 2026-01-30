const mongoose = require('mongoose');

// Vercel: set MONGO_URI (or MONGODB_URI) in Project → Settings → Environment Variables
const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

async function connectDB() {
  if (!uri || typeof uri !== 'string') {
    throw new Error(
      'Missing MongoDB connection string. Set MONGO_URI or MONGODB_URI in Vercel → Settings → Environment Variables (e.g. mongodb+srv://user:pass@cluster.mongodb.net/dbname)'
    );
  }
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(uri);
}

module.exports = connectDB;
