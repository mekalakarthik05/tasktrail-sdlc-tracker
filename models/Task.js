const mongoose = require('mongoose');

const historyEntrySchema = new mongoose.Schema({
  phase: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  phase: {
    type: String,
    enum: ['To Do', 'In Progress', 'Review', 'Done'],
    default: 'To Do',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  history: [historyEntrySchema],
}, {
  timestamps: true,
});

taskSchema.pre('save', function (next) {
  if (this.isNew && this.history.length === 0) {
    this.history.push({ phase: this.phase, note: 'Task created' });
  }
  if (this.isModified('phase') && !this.isNew) {
    this.history.push({ phase: this.phase, note: 'Phase updated' });
  }
  next();
});

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);
