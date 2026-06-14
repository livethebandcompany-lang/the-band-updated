require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function verifySmtp() {
    console.log('--- SMTP Verification Script ---');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`User: ${process.env.EMAIL_USER}`);
    // console.log(`Pass: ${process.env.EMAIL_PASS}`); // Don't log full password for security

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('Attempting to connect...');
        await transporter.verify();
        console.log('✅ Success! The App Password is CORRECT.');
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
    }
}

verifySmtp();
