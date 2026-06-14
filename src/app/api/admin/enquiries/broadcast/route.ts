import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'subadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    const { targetEmails, subject, htmlMessage } = await request.json();

    if (!targetEmails || !Array.isArray(targetEmails) || targetEmails.length === 0) {
      return NextResponse.json({ error: 'No recipients provided.' }, { status: 400 });
    }

    if (!subject || !htmlMessage) {
        return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 });
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // We use bcc pattern here to avoid rate-limiting looping single emails, 
    // but in a highly scaled production environment an ESP like SendGrid would be better.
    // For now we will loop and send to each dynamically to allow for individualized error trapping.
    let successCount = 0;
    let failCount = 0;

    for (const email of targetEmails) {
        if (!email) continue;
        
        try {
            await transporter.sendMail({
                from: `"${process.env.COMPANY_NAME || 'The Band Company'}" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                html: htmlMessage
            });
            successCount++;
        } catch (err) {
            console.error(`Broadcast failed for ${email}:`, err);
            failCount++;
        }
    }

    return NextResponse.json({ 
        success: true, 
        message: `Broadcast complete. Success: ${successCount}, Failed: ${failCount}` 
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to dispatch broadcast:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
