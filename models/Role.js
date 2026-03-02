const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
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
roleSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

module.exports = mongoose.model('Role', roleSchema);
