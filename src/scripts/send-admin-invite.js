const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function sendEmail(email, code) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
     connectionTimeout: 10000,
  });

  const mailOptions = {
    from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Super Admin Invitation - The Band Company',
    html: `
      <div style="font-family: sans-serif; background: #0a0a0a; color: white; padding: 40px; border-radius: 20px;">
        <h1 style="color: #eab308;">Super Admin Invite</h1>
        <p>You have been invited to register as a <strong>Super Admin</strong> for The Band Company.</p>
        <div style="background: #18181b; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #71717a; margin-bottom: 8px;">Your Invite Code</p>
          <code style="font-size: 32px; font-weight: 900; color: #eab308; letter-spacing: 0.3em;">${code}</code>
        </div>
        <p>Please use this code at the registration page: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/register?code=${code}&email=${email}" style="color: #eab308;">Join as Admin</a></p>
        <hr style="border: none; border-top: 1px solid #27272a; margin: 20px 0;">
        <p style="font-size: 12px; color: #71717a;">This code is valid for 7 days.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('Invite email sent successfully to:', email);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  
  const InviteCodeSchema = new mongoose.Schema({
    code: String,
    role: String,
    allowedEmail: String,
    expiresAt: Date,
    isUsed: Boolean,
    createdBy: mongoose.Schema.Types.ObjectId,
  }, { strict: false });

  const InviteCode = mongoose.models.InviteCode || mongoose.model('InviteCode', InviteCodeSchema);
  
  // Find a system admin user or create a temporary ID if none exists
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}));
  const admin = await User.findOne({ role: 'admin' });
  const adminId = admin?._id || new mongoose.Types.ObjectId();

  const email = 'live.thebandcompany@gmail.com';
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await InviteCode.create({
    code,
    role: 'admin',
    allowedEmail: email,
    expiresAt,
    isUsed: false,
    createdBy: adminId,
  });

  console.log('Invite code generated in DB:', code);
  
  await sendEmail(email, code);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
