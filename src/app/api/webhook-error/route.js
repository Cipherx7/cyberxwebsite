import { NextResponse } from 'next/server';

// Rate limiting for webhook-error endpoint
const webhookLimiter = new Map();

function checkWebhookRateLimit(ip) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 5; // 5 reports per 15 min per IP

    if (!webhookLimiter.has(ip)) {
        webhookLimiter.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }
    const record = webhookLimiter.get(ip);
    if (now > record.resetTime) {
        webhookLimiter.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }
    if (record.count >= maxRequests) return false;
    record.count++;
    return true;
}

export async function POST(request) {
    try {
        // Rate limit check
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : null) ||
            request.headers.get('x-real-ip') || 'unknown';

        if (!checkWebhookRateLimit(ip)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const body = await request.json();

        // Validate required fields exist and are strings
        if (!body.error || typeof body.error !== 'string') {
            return NextResponse.json({ error: 'Invalid error payload' }, { status: 400 });
        }

        const webhookUrl = process.env.WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('WEBHOOK_URL not configured');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }

        // Send sanitized error data to webhook
        const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'form_submission_error',
                error: String(body.error).substring(0, 500),
                fullName: String(body.fullName || '').substring(0, 100),
                email: String(body.email || '').substring(0, 100),
                whatsappNumber: String(body.whatsappNumber || '').substring(0, 20),
                timestamp: body.timestamp || new Date().toISOString()
            })
        });

        if (!webhookResponse.ok) {
            throw new Error('Webhook request failed');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Failed to send to webhook' }, { status: 500 });
    }
}
