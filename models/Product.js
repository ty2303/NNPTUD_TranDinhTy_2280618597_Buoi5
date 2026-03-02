const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    id: { type: Number },
    name: { type: String },
    slug: { type: String }
  },
  images: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Product', productSchema);
