import crypto from 'crypto';

/**
 * Normalizes and hashes user data as required by Meta Conversions API.
 * Data must be lowercase and SHA-256 hashed.
 */
function hashData(data: string | undefined): string | undefined {
  if (!data) return undefined;
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

/**
 * Normalizes phone numbers specifically for Meta CAPI.
 * Should include country code + numbers only (e.g., "919999999999").
 */
function hashPhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  return crypto.createHash('sha256').update(cleanPhone).digest('hex');
}

interface MetaCapiEventParams {
  eventName: string;       // e.g., 'Lead', 'Purchase', 'Contact'
  eventSourceUrl?: string; // e.g., 'https://thebandcompany.com/contact'
  userEmail?: string;
  userPhone?: string;      // Including country code
  clientIp?: string;       // Important for CAPI matching
  userAgent?: string;      // Important for CAPI matching
  fbp?: string;            // Facebook browser cookie (_fbp)
  fbc?: string;            // Facebook click cookie (_fbc)
  customData?: any;        // e.g., { value: 100, currency: 'INR' }
}

export async function sendMetaCapiEvent({
  eventName,
  eventSourceUrl,
  userEmail,
  userPhone,
  clientIp,
  userAgent,
  fbp,
  fbc,
  customData
}: MetaCapiEventParams) {
  // Use the established pixel ID from your existing setup, or an environment variable override.
  const META_PIXEL_ID = process.env.META_PIXEL_ID || '649433920828355'; 
  const META_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

  if (!META_ACCESS_TOKEN) {
    console.warn("Meta CAPI log: META_CAPI_ACCESS_TOKEN is missing in environment variables. CAPI event skipped.");
    return null;
  }

  const endpoint = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`;
  const eventTime = Math.floor(Date.now() / 1000);

  // Construct User Data Object
  const userData: any = {};
  
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (userEmail) userData.em = [hashData(userEmail)];
  if (userPhone) userData.ph = [hashPhone(userPhone)];

  const payload: any = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: userData,
      }
    ]
  };

  // Add custom data (like currency, value) if provided
  if (customData) {
    payload.data[0].custom_data = customData;
  }

  // Include Test Event Code if provided in env limits (Useful for Events Manager Debugging)
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(`${endpoint}?access_token=${META_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Meta CAPI Request Failed:', JSON.stringify(result, null, 2));
    }
    
    return result;
  } catch (error) {
    console.error('Meta CAPI Network Error:', error);
    return null;
  }
}
