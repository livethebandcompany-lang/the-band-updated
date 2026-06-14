import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateAdminEmail, generateAutoReply } from '@/lib/email-templates';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import Notification from '@/models/Notification';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, mobile, destination, date, message, type = 'General Inquiry' } = body;

        // Validate required fields (Name is optional for Quick Inquiry)
        if (!email || !mobile) {
            return NextResponse.json(
                { error: 'Email and Mobile are required.' },
                { status: 400 }
            );
        }

        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Missing SMTP Environment Variables');
            return NextResponse.json(
                { error: 'Server configuration error: Missing email settings.' },
                { status: 500 }
            );
        }

        const finalName = name || "Guest";

        try {
            await connectDB();
            await Inquiry.create({
                name: finalName,
                email,
                mobile,
                destination: destination || '',
                date: date || '',
                message: message || '',
                type,
                status: 'new'
            });
            console.log(`[Email Inquiry] Saved ${type} to Master Database from ${email}.`);
            // Create admin notification
            await Notification.create({
              title: 'New Inquiry Received',
              message: `${finalName} submitted a ${type} from ${destination || 'an unknown location'}.`,
              type: 'inquiry',
              link: '/admin/enquiries',
            });
        } catch (dbError) {
            console.error('[Email Inquiry] Failed to save inquiry to database:', dbError);
            // We will NOT block the email from sending if the DB insert fails temporarily.
        }

        // Configure Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Add timeouts to prevent long hangs (60s default is too long)
            connectionTimeout: 5000, // 5 seconds
            greetingTimeout: 5000, 
            socketTimeout: 10000,
        });


        // 1. Send Admin Notification
        const adminMailOptions = {
            from: `"${process.env.COMPANY_NAME || 'The Band Company'}" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Event Inquiry - ${finalName}`,
            html: generateAdminEmail({ name: finalName, email, mobile, destination, date, message, type }),
        };

        // 2. Send Customer Auto-Reply
        let customerEmailHtml;
        let customerSubject;

        // Check if it's a specific Band Package booking
        if (type && type.startsWith("Band Package")) {
            const { generatePackageConfirmationEmail } = await import('@/lib/email-templates');
            customerEmailHtml = generatePackageConfirmationEmail({
                name: finalName,
                destination,
                date,
                packageName: type // Pass 'Band Package - Premium'
            });
            customerSubject = `Booking Confirmed: ${type.replace("Band Package - ", "")} Experience`;
        } else {
            // Default Auto-Reply
            customerEmailHtml = generateAutoReply({ name: finalName, destination, date });
            customerSubject = `Thank you for your inquiry - ${process.env.COMPANY_NAME || 'The Band Company'}`;
        }

        const autoReplyMailOptions = {
            from: `"${process.env.COMPANY_NAME || 'The Band Company'}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: customerSubject,
            html: customerEmailHtml
        };

        // Send emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(autoReplyMailOptions),
        ]);

        return NextResponse.json({ success: true, message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email. Please try again later.', details: error instanceof Error ? error.message : String(error) }, // Return actual error details
            { status: 500 }
        );
    }
}
