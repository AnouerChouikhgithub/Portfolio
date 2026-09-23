// Netlify Function: receives contact form submissions and forwards them
// Configure `DASHBOARD_WEBHOOK` in Netlify site environment variables

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const webhook = process.env.DASHBOARD_WEBHOOK;
  if (!webhook) {
    console.error('DASHBOARD_WEBHOOK not configured');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  try {
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Webhook forward failed', resp.status, text);
      return { statusCode: 502, body: 'Webhook error' };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Forwarding failed' };
  }
};
