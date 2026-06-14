
export const generateAdminEmail = (data: {
  name: string;
  mobile: string;
  email: string;
  destination: string;
  date: string;
  message?: string;
  type: string;
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry</title>
  <style>
    body { margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(90deg, #b8860b 0%, #d4af37 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: #000000; margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 40px 30px; }
    .title { color: #d4af37; font-size: 18px; font-weight: 600; margin-bottom: 25px; border-bottom: 1px solid #333333; padding-bottom: 15px; }
    .field { margin-bottom: 20px; }
    .label { color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .value { color: #ffffff; font-size: 16px; font-weight: 500; line-height: 1.5; }
    .footer { background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222222; }
    .footer p { color: #444444; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div style="padding: 40px 0;">
    <div class="container">
      <div class="header">
        <h1>New Event Inquiry</h1>
      </div>
      <div class="content">
        <div class="title">Inquiry Details from ${data.type}</div>
        
        <div class="field">
          <div class="label">Name</div>
          <div class="value">${data.name}</div>
        </div>

        <div class="field">
          <div class="label">Mobile Number</div>
          <div class="value">${data.mobile}</div>
        </div>

        <div class="field">
          <div class="label">Email Address</div>
          <div class="value"><a href="mailto:${data.email}" style="color: #d4af37; text-decoration: none;">${data.email}</a></div>
        </div>

        <div class="field">
          <div class="label">Preferred Destination</div>
          <div class="value">${data.destination || 'Not Specified'}</div>
        </div>

        <div class="field">
          <div class="label">Event Date</div>
          <div class="value">${data.date || 'Not Specified'}</div>
        </div>

        ${data.message ? `
        <div class="field">
          <div class="label">Message</div>
          <div class="value" style="white-space: pre-wrap;">${data.message}</div>
        </div>
        ` : ''}
      </div>
      <div class="footer">
        <p>This inquiry was submitted through The Band Company website.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export const generateAutoReply = (data: {
  name: string;
  destination: string;
  date: string;
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You</title>
  <style>
    body { margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 8px; overflow: hidden; }
    .image-header { width: 100%; background-color: #000; padding: 20px 0; text-align: center; border-bottom: 2px solid #d4af37; }
    .logo-img { width: 220px; max-width: 80%; height: auto; display: inline-block; }
    .content { padding: 40px 30px; text-align: center; }
    .heading { color: #d4af37; font-size: 26px; font-weight: 300; margin-bottom: 20px; letter-spacing: 1px; }
    .message { color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
    .summary-box { background-color: #1a1a1a; border: 1px solid #333333; padding: 25px; border-radius: 4px; text-align: left; margin-bottom: 30px; }
    .summary-title { color: #888888; font-size: 12px; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px; border-bottom: 1px solid #333333; padding-bottom: 10px; }
    .summary-item { margin-bottom: 10px; display: flex; justify-content: space-between; }
    .summary-label { color: #666666; font-size: 14px; }
    .summary-value { color: #ffffff; font-size: 14px; font-weight: 500; }
    .button { display: inline-block; background-color: #d4af37; color: #000000; padding: 14px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-top: 10px; }
    .footer { background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #222222; }
    .footer-text { color: #444444; font-size: 12px; margin-bottom: 10px; line-height: 1.5; }
    .contact-info { color: #d4af37; font-size: 14px; margin-bottom: 15px; font-weight: bold; }
    .social-links { margin-top: 20px; }
    .social-link { color: #666666; text-decoration: none; margin: 0 10px; font-size: 12px; }
  </style>
</head>
<body>
  <div style="padding: 40px 0;">
    <div class="container">
      <div class="image-header">
        <img src="https://www.thebandcompany.in/blog/TBClogo.png" alt="The Band Company" class="logo-img" />
      </div>
      <div class="content">
        <h1 class="heading">Thank You for Inquiring</h1>
        <p class="message">
          Hi ${data.name},<br><br>
          Thank you for contacting The Band Company. We have received your inquiry and our creative team is already reviewing your details.
        </p>
        
        <div class="summary-box">
          <div class="summary-title">Inquiry Summary</div>
          <div class="summary-item">
            <span class="summary-label">Preferred Destination</span>
            <span class="summary-value">${data.destination || 'Not Specified'}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Event Date</span>
            <span class="summary-value">${data.date || 'Not Specified'}</span>
          </div>
        </div>

        <p class="message" style="font-size: 14px; color: #888888;">
          We aim to respond to all inquiries within 24 hours. If your matter is urgent, please call our artist helpline directly.
        </p>
        
        <a href="https://www.thebandcompany.in" class="button">Visit Our Website</a>
      </div>
      <div class="footer">
        <div class="contact-info">
          Email: <a href="mailto:live.thebandcompany@gmail.com" style="color: #d4af37; text-decoration: none;">live.thebandcompany@gmail.com</a><br>
          Phone: <a href="tel:+917779945379" style="color: #d4af37; text-decoration: none;">+91 7779945379</a>
        </div>
        <p class="footer-text">© ${new Date().getFullYear()} The Band Company. All rights reserved.</p>
        <p class="footer-text">Lonavala • Karjat • Alibaug • Mumbai • Pune • Other+</p>
        <div class="social-links">
          <a href="#" class="social-link">Instagram</a>
          <a href="#" class="social-link">Facebook</a>
          <a href="#" class="social-link">Contact Us</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

// --- Pricing Data (Mirrored from PricingTiers.tsx) ---
const PRICING_DATA: Record<string, {
  name: string;
  price: string;
  features: string[];
  color: string;
  tagline: string;
}> = {
  "Essential": {
    name: "Essential",
    price: "Starting at ₹35,000",
    tagline: "Perfect for intimate gatherings",
    features: [
      "2-3 Piece Band",
      "2.5 Hours Performance",
      "Acoustic Setup",
      "1 Music Style",
      "Basic Sound System",
      "Vocalist + 2 Instruments"
    ],
    color: "#52525b" // zinc-600
  },
  "Premium": {
    name: "Premium",
    price: "Starting at ₹65,000",
    tagline: "Our most popular choice",
    features: [
      "4-5 Piece Band",
      "3.5 Hours Performance",
      "Professional Setup",
      "2-3 Music Styles",
      "Premium Sound & Lighting",
      "Multiple Vocalists",
      "Dedicated Sound Engineer",
      "Rehearsal Session Included"
    ],
    color: "#eab308" // yellow-500
  },
  "Ultimate": {
    name: "Ultimate",
    price: "Starting at ₹1,20,000",
    tagline: "The complete luxury experience",
    features: [
      "Full 6+ Piece Band",
      "4.5+ Hours Performance",
      "Luxury Production",
      "Unlimited Music Styles",
      "Premium Sound, Lighting & Stage",
      "Multiple Vocalists & Artists",
      "Dedicated Production Team",
      "Multiple Rehearsals",
      "Custom Arrangements",
      "Video Recording Support"
    ],
    color: "#a855f7" // purple-500
  }
};

export const generatePackageConfirmationEmail = (data: {
  name: string;
  destination: string;
  date: string;
  packageName: string;
}) => {
  // Extract actual package name (e.g., "Band Package - Premium" -> "Premium")
  const cleanPackageName = data.packageName.replace("Band Package - ", "").trim();
  const pkg = PRICING_DATA[cleanPackageName] || PRICING_DATA["Premium"]; // Fallback
  const accentColor = pkg.color;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    body { margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 12px; overflow: hidden; }
    .image-header { width: 100%; height: 120px; background-color: #000; display: flex; align-items: center; justify-content: center; background-image: url('https://www.thebandcompany.in/blog/TBClogo.png'); background-size: contain; background-repeat: no-repeat; background-position: center; border-bottom: 2px solid ${accentColor}; }
    .content { padding: 40px 30px; text-align: center; }
    .heading { color: #ffffff; font-size: 24px; font-weight: 300; margin-bottom: 10px; letter-spacing: 1px; }
    .subheading { color: ${accentColor}; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; }
    .message { color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
    
    /* Package Card Style */
    .package-card { background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%); border: 1px solid ${accentColor}40; border-radius: 12px; padding: 30px; text-align: left; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .pkg-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 15px; }
    .pkg-name { color: #ffffff; font-size: 20px; font-weight: bold; }
    .pkg-price { color: ${accentColor}; font-size: 18px; font-weight: bold; }
    .pkg-features { list-style: none; padding: 0; margin: 0; }
    .pkg-feature { color: #aaaaaa; font-size: 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
    .check { color: ${accentColor}; font-weight: bold; font-size: 16px; }

    .summary-box { background-color: #1a1a1a; border: 1px solid #333333; padding: 20px; border-radius: 8px; text-align: left; margin-bottom: 30px; }
    .summary-item { margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 14px; }
    .summary-label { color: #666666; }
    .summary-value { color: #ffffff; font-weight: 500; }

    .button { display: inline-block; background-color: ${accentColor}; color: #000000; padding: 14px 30px; text-decoration: none; font-weight: bold; border-radius: 50px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-top: 10px; box-shadow: 0 4px 15px ${accentColor}40; }
    .footer { background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #222222; }
    .footer-text { color: #444444; font-size: 12px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div style="padding: 40px 0;">
    <div class="container">
      <div class="image-header"></div>
      <div class="content">
        <h1 class="heading">Booking Confirmed</h1>
        <div class="subheading">Package: ${pkg.name}</div>
        
        <p class="message">
          Hi ${data.name},<br><br>
          We are thrilled to confirm your booking for the <strong>${pkg.name} Experience</strong>. Below are the premium details included in your bundle:
        </p>

        <div class="package-card">
            <div class="pkg-header">
                <span class="pkg-name">${pkg.name}</span>
            </div>
            <ul class="pkg-features">
                ${pkg.features.map(f => `
                <li class="pkg-feature">
                    <span class="check">✓</span> ${f}
                </li>`).join('')}
            </ul>
        </div>
        
        <div class="summary-box">
          <div class="summary-item">
            <span class="summary-label">Date</span>
            <span class="summary-value">${data.date || 'To be confirmed'}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Location</span>
            <span class="summary-value">${data.destination || 'To be confirmed'}</span>
          </div>
        </div>

        <p class="message" style="font-size: 14px; color: #888888;">
          Our team will contact you shortly for more details.
        </p>
        
        <a href="https://www.thebandcompany.in" class="button">Visit Our Website</a>
      </div>
      <div class="footer">
        <p class="footer-text">© ${new Date().getFullYear()} The Band Company</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
};

export const generateOfferEmail = (data: {
  subject: string;
  htmlMessage: string;
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #050505; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0b; border: 1px solid #1f1f22; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .header { background: radial-gradient(circle at top right, #1a1a1e 0%, #0a0a0b 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #1f1f22; position: relative; overflow: hidden; }
    .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #3b82f6, transparent); opacity: 0.5; }
    .logo-img { width: 220px; max-width: 80%; height: auto; display: inline-block; margin: 10px 0; }
    .badge { display: inline-block; background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; }
    .content { padding: 40px 30px; }
    .subject { color: #ffffff; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 25px; line-height: 1.3; }
    .message { color: #a1a1aa; font-size: 16px; line-height: 1.7; margin-bottom: 30px; font-weight: 400; }
    .message h1, .message h2, .message h3 { color: #f4f4f5; margin-top: 30px; margin-bottom: 15px; font-weight: 600; }
    .message a { color: #60a5fa; text-decoration: none; border-bottom: 1px solid rgba(96, 165, 250, 0.3); transition: border-color 0.2s; }
    .message ul, .message ol { padding-left: 20px; margin-bottom: 20px; }
    .message li { margin-bottom: 10px; }
    .message strong { color: #e4e4e7; font-weight: 600; }
    .cta-container { text-align: center; margin-top: 40px; margin-bottom: 10px; }
    .cta-button { display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 16px 40px; text-decoration: none; font-weight: 800; border-radius: 8px; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39); }
    .footer { background-color: #000000; padding: 30px; text-align: center; border-top: 1px solid #1f1f22; }
    .footer-text { color: #52525b; font-size: 12px; margin: 0 0 10px 0; line-height: 1.5; }
    .social-links a { color: #71717a; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 500; }
  </style>
</head>
<body>
  <div style="padding: 40px 20px;">
    <div class="container">
      <div class="header">
        <div class="badge">Exclusive Offer</div><br>
        <img src="https://www.thebandcompany.in/blog/TBClogo.png" alt="The Band Company" class="logo-img" />
      </div>
      <div class="content">
        <h2 class="subject">${data.subject}</h2>
        <div class="message">
          ${data.htmlMessage}
        </div>
        <div class="cta-container">
          <a href="https://www.thebandcompany.in" class="cta-button">Claim Offer Now</a>
        </div>
      </div>
      <div class="footer">
        <p class="footer-text">© ${new Date().getFullYear()} The Band Company. All rights reserved.<br>You are receiving this because you previously inquired with us.</p>
        <div class="social-links">
          <a href="https://www.thebandcompany.in">Website</a>
          <a href="#">Instagram</a>
          <a href="#">Unsubscribe</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
