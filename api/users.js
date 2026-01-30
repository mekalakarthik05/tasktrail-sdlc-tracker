const connectDB = require('../lib/db');
const withApiKey = require('../lib/withApiKey');
const User = require('../models/User');

async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(400).json({ error: err.message });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

module.exports = withApiKey(handler);
