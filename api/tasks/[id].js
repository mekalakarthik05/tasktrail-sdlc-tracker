const connectDB = require('../../lib/db');
const withApiKey = require('../../lib/withApiKey');
const Task = require('../../models/Task');

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Task ID required' });

  if (req.method === 'GET') {
    try {
      const task = await Task.findById(id).populate('assignedTo', 'name email role');
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'PUT') {
    try {
      const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .populate('assignedTo', 'name email role');
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.status(200).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

module.exports = withApiKey(handler);
