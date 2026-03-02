const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  fullName: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: 'https://i.sstatic.net/l60Hf.png'
  },
  status: {
    type: Boolean,
    default: false
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  loginCount: {
    type: Number,
    default: 0,
    min: [0, 'Login count cannot be negative']
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

// Partial unique index: chỉ check unique trên các bản ghi chưa xoá mềm
userSchema.index({ username: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

module.exports = mongoose.model('User', userSchema);
