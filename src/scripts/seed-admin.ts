import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env');
  process.exit(1);
}

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  // Define schema inline to avoid issues with compilation of models in a script
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'subadmin', 'artist'], default: 'artist' },
    isActive: { type: Boolean, default: true },
    provider: { type: String, default: 'credentials' }
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const adminEmail = 'admin@thebandcompany.in'; // Default admin email
  const existing = await User.findOne({ email: adminEmail });
  
  if (existing) {
    console.log('Admin user already exists:', adminEmail);
    process.exit(0);
  }

  const password = 'AdminPassword123!'; // Default password - USER SHOULD CHANGE THIS
  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    name: 'Super Admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    provider: 'credentials',
  });

  console.log('--------------------------------------------------');
  console.log('Admin user seeded successfully!');
  console.log('Email:', adminEmail);
  console.log('Password:', password);
  console.log('IMPORTANT: Please change this password after login.');
  console.log('--------------------------------------------------');
  
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
