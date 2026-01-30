const connectDB = require('../../lib/db');
const withApiKey = require('../../lib/withApiKey');
const User = require('../../models/User');

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'User ID required' });

  if (req.method === 'GET') {
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'PUT') {
    try {
      const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

module.exports = withApiKey(handler);
