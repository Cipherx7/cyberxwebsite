import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Rsvp from '../../../../models/Rsvp';

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        const { name, email, privacyAccepted, anonymousQuestion } = data;

        if (!name || !email || !privacyAccepted) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!email.toLowerCase().endsWith('@gmail.com')) {
            return NextResponse.json({ error: 'Only @gmail.com email addresses are allowed' }, { status: 400 });
        }

        // Save to MongoDB
        const newRsvp = await Rsvp.create({
            name,
            email,
            privacyAccepted,
            anonymousQuestion: anonymousQuestion || ''
        });

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
