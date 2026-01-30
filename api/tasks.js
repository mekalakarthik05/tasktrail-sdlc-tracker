const connectDB = require('../lib/db');
const withApiKey = require('../lib/withApiKey');
const Task = require('../models/Task');

async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const filter = {};
      if (req.query.phase) filter.phase = req.query.phase;
      if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

      const tasks = await Task.find(filter)
        .populate('assignedTo', 'name email role')
        .sort({ updatedAt: -1 });
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const task = new Task(req.body);
      await task.save();
      await task.populate('assignedTo', 'name email role');
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

module.exports = withApiKey(handler);
