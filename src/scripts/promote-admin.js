const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function promote() {
  await mongoose.connect(MONGODB_URI);
  
  const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    isActive: Boolean,
  }, { strict: false });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const email = 'live.thebandcompany@gmail.com';
  let user = await User.findOne({ email });

  if (user) {
    console.log('User found. Updating role to admin and active...');
    user.role = 'admin';
    user.isActive = true;
    await user.save();
    console.log('User promoted successfully.');
  } else {
    console.log('User not found. Creating a new admin user...');
    // If user doesn't exist, we create one (e.g. for Google login or manual sign in)
    // For Google login, they will just sign in and it will match this email.
    await User.create({
      name: 'The Band Company Admin',
      email: email,
      role: 'admin',
      isActive: true,
      provider: 'google' // Assume Google for this one if it's gmail
    });
    console.log('New admin user created.');
  }

  await mongoose.disconnect();
  process.exit(0);
}

promote().catch(err => {
  console.error(err);
  process.exit(1);
});
