const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['Developer', 'Designer', 'Manager', 'QA', 'Other'],
    default: 'Developer',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
