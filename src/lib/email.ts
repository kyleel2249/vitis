/**
 * Email sending utility using Resend via the Replit connector.
 * Falls back gracefully when the integration is not yet connected.
 */

async function getResendApiKey(): Promise<string> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname || !xReplitToken) throw new Error('Replit connector env vars not set');

  const resp = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=resend`,
    {
      headers: { Accept: 'application/json', X_REPLIT_TOKEN: xReplitToken },
      signal: AbortSignal.timeout(5_000),
    }
  );
  if (!resp.ok) throw new Error(`Connector fetch failed: ${resp.status}`);

  const data = await resp.json();
  const key = data.items?.[0]?.settings?.api_key;
  if (!key) throw new Error('Resend API key not found in connector settings');
  return key;
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  try {
    const apiKey = await getResendApiKey();
    const from = payload.from || 'Vitis <orders@vitis.app>';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error ${res.status}: ${err}`);
    }
  } catch (err: any) {
    // Log but never crash the calling request — email is best-effort
    console.warn('[email] Failed to send email:', err.message);
  }
}

// ── Email templates ──────────────────────────────────────────────────────────

export function orderConfirmationHtml(order: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}): string {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">${i.name} × ${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right">$${(i.price * i.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
    <div style="background:#3b5bf5;padding:32px 32px 24px;color:#fff">
      <h1 style="margin:0 0 4px;font-size:24px">Order Confirmed ✅</h1>
      <p style="margin:0;opacity:.85">Order #${order.orderNumber}</p>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 24px;color:#374151">Hi ${order.customerName}, thanks for your order! We'll let you know when it ships.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151">
        ${rows}
        <tr><td style="padding:12px 0 4px;color:#6b7280">Subtotal</td><td style="padding:12px 0 4px;text-align:right;color:#6b7280">$${order.subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280">Shipping</td><td style="padding:4px 0;text-align:right;color:#6b7280">${order.shippingCost === 0 ? 'Free' : '$' + order.shippingCost.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280">Tax</td><td style="padding:4px 0;text-align:right;color:#6b7280">$${order.tax.toFixed(2)}</td></tr>
        <tr><td style="padding:12px 0 0;font-weight:700;font-size:16px;border-top:2px solid #f0f0f0">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:16px;border-top:2px solid #f0f0f0">$${order.total.toFixed(2)}</td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">Questions? Reply to this email or visit your account dashboard.</p>
    </div>
  </div>
</body>
</html>`;
}

export function shippingUpdateHtml(order: {
  orderNumber: string;
  customerName: string;
  trackingNumber?: string;
  status: string;
}): string {
  const statusMessages: Record<string, string> = {
    shipped: "Great news — your order is on its way! 🚚",
    delivered: "Your order has been delivered! 📦",
    processing: "Your order is being prepared.",
    confirmed: "Your order has been confirmed and is being processed.",
  };
  const message = statusMessages[order.status] || `Your order status has been updated to: ${order.status}.`;

  return `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
    <div style="background:#3b5bf5;padding:32px 32px 24px;color:#fff">
      <h1 style="margin:0 0 4px;font-size:24px">Order Update</h1>
      <p style="margin:0;opacity:.85">Order #${order.orderNumber}</p>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 16px;color:#374151">Hi ${order.customerName},</p>
      <p style="margin:0 0 16px;color:#374151">${message}</p>
      ${order.trackingNumber ? `<p style="margin:0 0 16px;color:#374151"><strong>Tracking number:</strong> ${order.trackingNumber}</p>` : ''}
      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">View your order status in your account dashboard.</p>
    </div>
  </div>
</body>
</html>`;
}
