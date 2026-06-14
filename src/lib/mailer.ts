import nodemailer from 'nodemailer';
import { generateAutoReply, generatePackageConfirmationEmail } from './email-templates';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://www.thebandcompany.in';

export async function sendInviteEmail(to: string, code: string, role: string, adminName: string) {
  const registerUrl = `${baseUrl}/auth/register?code=${code}&email=${to}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `You're invited to join The Band Company as ${role}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #eab308;">You're Invited!</h2>
        <p>Hello,</p>
        <p>${adminName} has invited you to join **The Band Company** team as a **${role.toUpperCase()}**.</p>
        <p>Use the following invite code to create your account:</p>
        <div style="background: #fdfce8; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #eab308; margin: 0;">${code}</h1>
        </div>
        <p>Alternatively, you can click the button below to register directly:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${registerUrl}" style="background: #eab308; color: black; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Complete Registration</a>
        </div>
        <p style="color: #666; font-size: 14px;">This invite was sent to ${to}. If you didn't expect this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendDeleteUserOtp(email: string, otp: string, adminName: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verification Code for User Deletion',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ef4444;">Verification Required</h2>
        <p>Hello ${adminName},</p>
        <p>You have requested to permanently delete a user account. Please use the following code to confirm this action:</p>
        <div style="background: #fef2f2; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #ef4444; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please secure your account immediately.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendInviteCreationOtp(email: string, otp: string, adminName: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verification Code for Creating Invite',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #eab308;">Verification Required</h2>
        <p>Hello ${adminName},</p>
        <p>Please use the following code to verify your identity before creating a new invite code:</p>
        <div style="background: #fefce8; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #eab308; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendOtpEmail(to: string, otp: string, userName: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Password Reset OTP - The Band Company',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #eab308;">Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>Please use the following code to reset your account password. This code is valid for 10 minutes.</p>
        <div style="background: #fdfce8; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #eab308; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export const sendPaymentLinkEmail = async (to: string, clientName: string, eventType: string, amount: number, paymentLink: string) => {
  const mailOptions = {
    from: `"The Band Company" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Payment Order for your ${eventType} booking - The Band Company`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; background-color: #000; color: #fff;">
        <div style="padding: 40px; text-align: center; border-bottom: 1px solid #333;">
           <h1 style="color: #eab308; margin-bottom: 20px;">The Band Company</h1>
           <h2 style="font-size: 24px;">Complete Your Booking</h2>
        </div>
        <div style="padding: 40px; background-color: #111;">
          <p>Hi ${clientName},</p>
          <p>Thank you for choosing <strong>The Band Company</strong> for your ${eventType}.</p>
          <p>To finalize your booking, please complete the payment of <strong>₹${amount.toLocaleString()}</strong> using the link below:</p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${paymentLink}" style="background-color: #eab308; color: #000; padding: 16px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 18px; box-shadow: 0 4px 20px rgba(234,179,8,0.3);">
              Pay Now
            </a>
          </div>
          
          <p style="font-size: 14px; color: #888;">Note: This link is secure and powered by Razorpay. If you have any questions, feel free to reply to this email.</p>
        </div>
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #555; border-top: 1px solid #333;">
          &copy; 2026 The Band Company. All rights reserved.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export async function sendAdminNotificationEmail(bookingData: any) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@thebandcompany.in';
    await transporter.sendMail({
      from: `"The Band Company CRM" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Booking Request: ${bookingData.clientName} - ${bookingData.eventType}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #c4a000;">
          <h1 style="color: #c4a000; text-transform: uppercase;">New Lead Captured</h1>
          <p>A new booking has been recorded in the CRM.</p>
          <hr style="border-color: #333;" />
          <p><strong>Client:</strong> ${bookingData.clientName}</p>
          <p><strong>Phone:</strong> ${bookingData.clientPhone}</p>
          <p><strong>Event:</strong> ${bookingData.eventType} (${bookingData.performanceType})</p>
          <p><strong>Date:</strong> ${new Date(bookingData.eventDate).toLocaleDateString()}</p>
          <p><strong>Venue:</strong> ${bookingData.venueName}, ${bookingData.city}</p>
          <p><strong>Amount:</strong> ₹${bookingData.finalAmount}</p>
          <p><strong>Status:</strong> <span style="color: ${bookingData.status === 'confirmed' ? '#4caf50' : '#ff9800'}">${bookingData.status.toUpperCase()}</span></p>
          <br />
          <a href="${baseUrl}/admin/bookings" style="background-color: #c4a000; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">View in CRM</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

export async function sendCustomerAutoReplyEmail(to: string, clientName: string, destination: string, date: string, packageName?: string | null) {
  try {
    let htmlContent;
    let subject;

    if (packageName && (packageName.startsWith("Band Package") || packageName === "Essential" || packageName === "Premium" || packageName === "Ultimate")) {
      const pkgName = packageName.startsWith("Band Package") ? packageName : `Band Package - ${packageName}`;
      htmlContent = generatePackageConfirmationEmail({
        name: clientName,
        destination,
        date,
        packageName: pkgName,
      });
      subject = `Booking Confirmed: ${pkgName.replace("Band Package - ", "")} Experience`;
    } else {
      htmlContent = generateAutoReply({
        name: clientName,
        destination,
        date,
      });
      subject = `Thank you for your inquiry - ${process.env.COMPANY_NAME || 'The Band Company'}`;
    }

    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || 'The Band Company'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Failed to send customer auto-reply email:', error);
  }
}

export async function sendPaidBookingInvoiceEmail(clientEmail: string, clientName: string, booking: any, pdfData?: string) {
  try {
    const eventDate = new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const total = booking.totalAmount || 0;

    const attachments = [];
    if (pdfData) {
      attachments.push({
        filename: `Invoice_${booking.invoiceNumber || 'TBC'}.pdf`,
        content: pdfData,
        encoding: 'base64',
      });
    }

    await transporter.sendMail({
      from: `"The Band Company" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: `Thank You for Booking Us! - Invoice ${booking.invoiceNumber || ''}`,
      attachments,
      html: `
        <div style="background-color: #0c0c0e; color: #ffffff; padding: 40px; font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/dnr4pajkw/image/upload/v1772124790/the_band_company_logo_f5kq5p.png" alt="The Band Company" width="100" style="margin-bottom: 20px;" />
            <h1 style="color: #eab308; font-size: 28px; letter-spacing: 3px; margin: 0;">THANK YOU!</h1>
            <p style="color: #888; font-size: 14px; margin-top: 10px;">For Booking Us</p>
          </div>

          <div style="background-color: #1a1a1a; border-radius: 8px; padding: 30px; margin-bottom: 30px; text-align: center;">
            <p style="color: #fff; font-size: 16px; margin: 0 0 10px 0;">
              Hi ${booking.billingName || clientName},
            </p>
            <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0;">
              Your booking for <strong style="color: #eab308;">${booking.eventType}</strong> on <strong style="color: #eab308;">${eventDate}</strong> is confirmed!<br/>
              Payment of <strong style="color: #eab308;">₹${total.toLocaleString()}</strong> has been received.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <p style="color: #eab308; font-size: 18px; font-style: italic; margin: 0;">
              "Where Music Meets Unforgettable Moments"
            </p>
          </div>

          <div style="border-top: 1px solid #333; padding-top: 20px; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">Need to reach us?</p>
            <p style="color: #888; font-size: 12px; margin: 0;">
              📧 sales@thebandcompany.in<br/>
              📱 @live.thebandcompany<br/>
              🌐 www.thebandcompany.in
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #555; font-size: 10px; margin: 0;">
              Please find your invoice attached as PDF.<br/>
              By engaging our services, you agree to our <a href="${baseUrl}/terms-and-conditions" style="color: #eab308; text-decoration: underline;">Terms & Conditions</a>.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    throw error;
  }
}


export async function sendPaidBookingAdminNotificationEmail(booking: any, recipientEmail?: string) {
  try {
    const targetEmail = recipientEmail || 'live.thebandcompany@gmail.com';
    await transporter.sendMail({
      from: `"The Band Company [PAID]" <${process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: `✅ PAYMENT CONFIRMED: ${booking.clientName} - ${booking.eventType}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #c4a000;">
          <h1 style="color: #c4a000; text-transform: uppercase;">Booking Secured</h1>
          <p>Full payment has been received for the following booking.</p>
          <hr style="border-color: #333;" />
          <div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #222;">
            <p><strong>Client:</strong> ${booking.clientName}</p>
            <p><strong>Phone:</strong> ${booking.clientPhone}</p>
            <p><strong>Event:</strong> ${booking.eventType}</p>
            <p><strong>Performance:</strong> ${booking.performanceType}</p>
            <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> ${booking.venueName}, ${booking.city}</p>
            <p style="font-size: 20px; color: #c4a000;"><strong>Amount Paid:</strong> ₹${booking.finalAmount}</p>
          </div>
          <br />
          <a href="${baseUrl}/admin/database" style="background-color: #c4a000; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">View in Directory</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send paid admin notification:', error);
  }
}

export async function sendArtistNewGigEmail(email: string, name: string, booking: any) {
  try {
    await transporter.sendMail({
      from: `"The Band Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎸 NEW GIG CONFIRMED: ${booking.eventType} on ${new Date(booking.eventDate).toLocaleDateString()}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #2563eb;">
          <h1 style="color: #2563eb; text-transform: uppercase;">New Performance Logged</h1>
          <p>Hi ${name}, you have a new confirmed performance!</p>
          <hr style="border-color: #333;" />
          <div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #222;">
            <p><strong>Event:</strong> ${booking.eventType}</p>
            <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> ${booking.venueName}</p>
            <p><strong>City:</strong> ${booking.city}</p>
            <p><strong>Timing:</strong> ${booking.startTime} - ${booking.endTime}</p>
          </div>
          <p>Please check your artist dashboard for location details and contact information.</p>
          <br />
          <a href="${baseUrl}/admin/calendar" style="background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">View Calendar</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send artist notification email:', error);
  }
}

export async function sendSubadminNotificationEmail(email: string, name: string, booking: any) {
  try {
    await transporter.sendMail({
      from: `"The Band Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ BOOKING CONFIRMED: ${booking.clientName} - ${booking.eventType}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #10b981;">
          <h1 style="color: #10b981; text-transform: uppercase;">Booking Active</h1>
          <p>Hi ${name}, a new booking has been confirmed under the system.</p>
          <hr style="border-color: #333;" />
          <div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #222;">
            <p><strong>Client:</strong> ${booking.clientName}</p>
            <p><strong>Event:</strong> ${booking.eventType}</p>
            <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> ${booking.venueName}</p>
          </div>
          <br />
          <a href="${baseUrl}/admin/bookings" style="background-color: #10b981; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">View Bookings</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send sub-admin notification email:', error);
  }
}
export async function sendFulfillmentAdminEmail(email: string, name: string, booking: any) {
  try {
    await transporter.sendMail({
      from: `"The Band Company [FULFILLED]" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎭 SHOW COMPLETED: ${booking.clientName} - ${booking.venueName}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #10b981;">
          <h1 style="color: #10b981; text-transform: uppercase;">Performance Report Received</h1>
          <p>Hi ${name}, an artist has officially marked a show as COMPLETED.</p>
          <hr style="border-color: #333;" />
          <div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #222;">
            <p><strong>Client:</strong> ${booking.clientName}</p>
            <p><strong>Venue:</strong> ${booking.venueName}</p>
            <p><strong>Actual End Time:</strong> ${booking.completionReport?.actualEndTime || 'N/A'}</p>
            <p><strong>Deployment Team:</strong></p>
            <ul style="color: #888;">
              ${booking.completionReport?.teamMembers?.map((m: any) => `<li>${m.name} (${m.role})</li>`).join('') || '<li>No team data provided</li>'}
            </ul>
          </div>
          <br />
          <a href="${baseUrl}/admin/database" style="background-color: #10b981; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">View Performance Archive</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send fulfillment admin email:', error);
  }
}

export async function sendBroadcastNewGigEmail(email: string, booking: any) {
  try {
    await transporter.sendMail({
      from: `"The Band Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `📢 NEW PERFORMANCE SECURED: ${booking.clientName} in ${booking.city}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #eab308;">
          <h1 style="color: #eab308; text-transform: uppercase;">Gig Broadcast</h1>
          <p>A new performance has been confirmed and is now visible on the master calendar.</p>
          <hr style="border-color: #333;" />
          <div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #222;">
             <p><strong>Event Type:</strong> ${booking.eventType}</p>
             <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
             <p><strong>City:</strong> ${booking.city}</p>
          </div>
          <p style="font-size: 12px; color: #666;">This is an automated broadcast to all team members.</p>
          <br />
          <a href="${baseUrl}/admin/calendar" style="background-color: #eab308; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">View Schedule</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send broadcast gig email:', error);
  }
}
