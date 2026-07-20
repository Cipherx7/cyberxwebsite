import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Rsvp from '../../../../models/Rsvp';
import { sendRsvpEmail } from '../../../../lib/mailer';

// Rate limiting for RSVP endpoint
const rsvpLimiter = new Map();

function checkRsvpRateLimit(ip) {
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const maxRequests = 3; // 3 RSVPs per 10 min per IP

    if (!rsvpLimiter.has(ip)) {
        rsvpLimiter.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }
    const record = rsvpLimiter.get(ip);
    if (now > record.resetTime) {
        rsvpLimiter.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }
    if (record.count >= maxRequests) return false;
    record.count++;
    return true;
}

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rsvpLimiter.entries()) {
        if (now > record.resetTime) rsvpLimiter.delete(ip);
    }
}, 60000);

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        const { name, email, privacyAccepted, anonymousQuestion } = data;

        if (!name || !email || !privacyAccepted) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Rate limit check
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : null) ||
            req.headers.get('x-real-ip') || 'unknown';

        if (!checkRsvpRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Too many registrations. Please try again later.' },
                { status: 429 }
            );
        }

        // Check for duplicate email registration
        const existingRsvp = await Rsvp.findOne({ email: email.toLowerCase() });
        if (existingRsvp) {
            return NextResponse.json(
                { error: 'This email is already registered for this event.' },
                { status: 409 }
            );
        }


        // Call the external partner RSVP API first
        let qrCode = '';
        try {
            const partnerRes = await fetch('https://team.cyberx.org.in/api/public/events/6a5c5e3e78abca7e38b77975/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });

            if (!partnerRes.ok) {
                const partnerError = await partnerRes.json().catch(() => ({}));
                return NextResponse.json({
                    error: partnerError.message || 'The registration partner API returned an error.'
                }, { status: partnerRes.status });
            }

            const partnerData = await partnerRes.json();
            qrCode = partnerData.registration?.qrCode || '';
        } catch (partnerFetchError) {
            console.error('Failed calling external RSVP partner API:', partnerFetchError);
            return NextResponse.json({
                error: 'Unable to connect to the external RSVP partner API. Please try again.'
            }, { status: 502 });
        }

        // Save to MongoDB
        const newRsvp = await Rsvp.create({
            name,
            email,
            privacyAccepted,
            anonymousQuestion: anonymousQuestion || '',
            qrCode: qrCode
        });

        // Send RSVP Confirmation Email (via Gmail)
        try {
            await sendRsvpEmail({
                to: email,
                name: name,
                eventName: newRsvp.eventName,
                eventDate: newRsvp.eventDate,
                anonymousQuestion: newRsvp.anonymousQuestion,
                joinLink: process.env.EVENT_JOIN_LINK,
                calendarLink: process.env.EVENT_CALENDAR_LINK,
                qrCode: qrCode
            });
        } catch (emailError) {
            console.error('Failed to send RSVP confirmation email:', emailError);
            // Non-blocking: we still want to save and post to webhook
        }

        // Post to Webhook
        const webhookUrl = process.env.WEBHOOK_URL;
        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'rsvp_submitted',
                        data: {
                            id: newRsvp._id,
                            name,
                            email,
                            privacyAccepted,
                            anonymousQuestion: newRsvp.anonymousQuestion,
                            eventName: newRsvp.eventName,
                            eventDate: newRsvp.eventDate,
                            qrCode: newRsvp.qrCode,
                            submittedAt: newRsvp.createdAt
                        }
                    })
                });
            } catch (webhookError) {
                console.error('Failed to post to webhook:', webhookError);
                // We still return success to user even if webhook fails
            }
        } else {
            console.warn('No WEBHOOK_URL environment variable found. Skipping webhook post.');
        }

        return NextResponse.json({ success: true, data: newRsvp }, { status: 201 });
    } catch (error) {
        console.error('RSVP submission error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
