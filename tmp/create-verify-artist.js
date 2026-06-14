const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createVerifyArtist() {
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

    const hashedPassword = await bcrypt.hash('ArtistPassword123!', 12);
    
    await User.findOneAndUpdate(
      { email: 'artist@theband.com' },
      {
        name: 'Verify Artist',
        email: 'artist@theband.com',
        password: hashedPassword,
        role: 'artist',
        provider: 'credentials',
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('Verification Artist created: artist@theband.com / ArtistPassword123!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createVerifyArtist();
