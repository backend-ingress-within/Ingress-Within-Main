import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '../../../../../lib/calendar/googleCalendarService';

export async function POST(request: NextRequest) {
  try {
    const headers: Record<string, string | undefined> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const result = await GoogleCalendarService.handleWebhookNotification(headers);

    return NextResponse.json({
      success: true,
      acknowledged: result.acknowledged,
      state: result.state,
    });
  } catch (err: any) {
    console.error('[GoogleWebhookRoute] Safe error handling webhook:', err);
    // Google expects a 2xx or 4xx to prevent relentless spamming
    return NextResponse.json({ error: 'Internal processing error' }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active', message: 'Google Calendar Webhook Receiver' });
}
