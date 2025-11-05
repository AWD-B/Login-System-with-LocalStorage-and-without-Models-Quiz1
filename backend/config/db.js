const fs = require('fs');
const path = require('path');
console.log('DEBUG reading .env raw:');
try {
  console.log(fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8'));
} catch(e) {
  console.error('READ .env ERROR', e.message);
}
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // ensure loading backend/.env
console.log('DEBUG: dotenv loaded MONGO_URI exists?:', !!process.env.MONGO_URI);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;