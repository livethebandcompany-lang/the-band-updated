const mongoose = require('mongoose');
require('dotenv').config();

async function testConn() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to:', uri ? uri.split('@')[1] : 'UNDEFINED');
    await mongoose.connect(uri);
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE:', err.message);
    process.exit(1);
  }
}

testConn();
