const fetch = require('node-fetch');

async function testWebhook() {
  const payload = {
    event: 'payment_link.paid',
    payload: {
      payment_link: {
        entity: {
          id: 'plink_dummy_id',
          notes: {
            bookingId: '65fgh...89' // REPLACE WITH AN ACTUAL BOOKING ID FROM DB
          }
        }
      }
    }
  };

  const response = await fetch('http://localhost:3000/api/webhooks/razorpay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': 'MOCK_SIGNATURE' // Webhook verification will fail unless mocked or disabled
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log('Response:', data);
}

// NOTE: This will fail signature verification. 
// For real testing, I should find a way to bypass verification locally or use a real secret.
