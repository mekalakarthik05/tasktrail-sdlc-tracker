const connectDB = require('../../../lib/db');
const withApiKey = require('../../../lib/withApiKey');
const Task = require('../../../models/Task');

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  await connectDB();
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  try {
    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name email role')
      .sort({ updatedAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = withApiKey(handler);
