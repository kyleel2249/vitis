import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getAdminUser } from '@/lib/admin';
import { getResendApiKey, newsletterCampaignHtml, sendEmailStrict } from '@/lib/email';
import { createUnsubscribeToken, getRequestOrigin } from '@/lib/newsletter';

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });

  const body = await request.json();
  const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
  const content = typeof body?.content === 'string' ? body.content.trim() : '';

  if (subject.length < 3 || subject.length > 160) {
    return NextResponse.json({ success: false, error: 'Subject must be between 3 and 160 characters.' }, { status: 400 });
  }
  if (content.length < 10 || content.length > 10000) {
    return NextResponse.json({ success: false, error: 'Message must be between 10 and 10,000 characters.' }, { status: 400 });
  }

  const subscribers = await query<{ id: string; email: string }>(
    `SELECT id, email FROM newsletter_subscribers WHERE is_active = true ORDER BY subscribed_at ASC`
  );
  if (!subscribers.length) {
    return NextResponse.json({ success: false, error: 'There are no active subscribers to receive this campaign.' }, { status: 400 });
  }

  let apiKey: string;
  try {
    apiKey = await getResendApiKey();
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Email delivery is not connected. Connect Resend before sending a campaign.',
    }, { status: 503 });
  }

  const campaign = await queryOne<{ id: string }>(
    `INSERT INTO newsletter_campaigns (subject, content, status, recipient_count, created_by)
     VALUES ($1, $2, 'sending', $3, $4)
     RETURNING id`,
    [subject, content, subscribers.length, admin.id]
  );
  if (!campaign) {
    return NextResponse.json({ success: false, error: 'Could not create campaign.' }, { status: 500 });
  }

  const origin = getRequestOrigin(request);
  let sentCount = 0;
  let failedCount = 0;

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${createUnsubscribeToken(subscriber.email)}`;
    try {
      await sendEmailStrict({
        to: subscriber.email,
        subject,
        html: newsletterCampaignHtml({ content, unsubscribeUrl }),
      }, apiKey);
      sentCount += 1;
    } catch (error) {
      failedCount += 1;
      console.error(`Newsletter delivery failed for ${subscriber.email}:`, error);
    }
  }

  const status = failedCount === 0 ? 'sent' : sentCount === 0 ? 'failed' : 'partial';
  await query(
    `UPDATE newsletter_campaigns
     SET status = $1, sent_count = $2, failed_count = $3, completed_at = NOW()
     WHERE id = $4`,
    [status, sentCount, failedCount, campaign.id]
  );

  return NextResponse.json({
    success: status !== 'failed',
    campaign: { id: campaign.id, status, recipientCount: subscribers.length, sentCount, failedCount },
    message: status === 'sent'
      ? `Campaign sent to ${sentCount} subscribers.`
      : `Campaign finished with ${sentCount} sent and ${failedCount} failed.`,
  }, { status: status === 'failed' ? 502 : 201 });
}