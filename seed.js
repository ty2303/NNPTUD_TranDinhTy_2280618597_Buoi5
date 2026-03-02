/**
 * Seed script - Thêm dữ liệu mẫu vào MongoDB
 * Chạy: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { MONGO_URI } = require('./utils/config');

const seedData = [
  {
    title: "Classic Heather Gray Hoodie",
    slug: "classic-heather-gray-hoodie",
    price: 69,
    description: "Stay cozy and stylish with our Classic Heather Gray Hoodie.",
    category: { id: 1, name: "Clothes", slug: "clothes" },
    images: ["https://i.imgur.com/cHddUCu.jpeg"]
  },
  {
    title: "Classic Comfort Fit Joggers",
    slug: "classic-comfort-fit-joggers",
    price: 25,
    description: "Discover the perfect blend of style and comfort with our Classic Comfort Fit Joggers.",
    category: { id: 1, name: "Clothes", slug: "clothes" },
    images: ["https://i.imgur.com/ZKGofuB.jpeg"]
  },
  {
    title: "Classic Comfort Drawstring Joggers",
    slug: "classic-comfort-drawstring-joggers",
    price: 79,
    description: "Experience the perfect blend of comfort and style with our Classic Comfort Drawstring Joggers.",
    category: { id: 1, name: "Clothes", slug: "clothes" },
    images: ["https://i.imgur.com/axsyGpD.jpeg"]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Thêm dữ liệu mẫu
    const products = await Product.insertMany(seedData);
    console.log(`Seeded ${products.length} products:`);
    products.forEach(p => console.log(`  - ${p.title} ($${p.price})`));

    await mongoose.connection.close();
    console.log('\nDone! Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
