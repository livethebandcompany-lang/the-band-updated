const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createVerifyAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      provider: String,
      isActive: Boolean
    });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const hashedPassword = await bcrypt.hash('VerifyPassword123!', 12);
    
    await User.findOneAndUpdate(
      { email: 'verify@theband.com' },
      {
        name: 'Verify Admin',
        email: 'verify@theband.com',
        password: hashedPassword,
        role: 'admin',
        provider: 'credentials',
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('Verification Admin created: verify@theband.com / VerifyPassword123!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createVerifyAdmin();
