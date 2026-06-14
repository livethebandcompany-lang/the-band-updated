const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function listInvites() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const InviteCodeSchema = new mongoose.Schema({
      code: String,
      role: String,
      allowedEmail: String,
      isUsed: Boolean,
      expiresAt: Date
    });

    const InviteCode = mongoose.models.InviteCode || mongoose.model('InviteCode', InviteCodeSchema);

    const invites = await InviteCode.find({ isUsed: false, expiresAt: { $gt: new Date() } });
    console.log('Active Invites:');
    console.log(JSON.stringify(invites, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listInvites();
