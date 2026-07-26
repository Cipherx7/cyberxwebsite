import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Rsvp from '../../../../models/Rsvp';
import Certificate from '../../../../models/Certificate';

/**
 * Generate a unique certificate number in format CX#### (e.g. CX0251)
 */
async function generateUniqueCertNo() {
    const maxAttempts = 50;
    for (let i = 0; i < maxAttempts; i++) {
        const num = Math.floor(1000 + Math.random() * 9000); // 1000-9999
        const certNo = `CX${num}`;
        const exists = await Certificate.findOne({ certificateNo: certNo });
        if (!exists) return certNo;
    }
    // Fallback: use timestamp-based
    const ts = Date.now().toString().slice(-5);
    return `CX${ts}`;
}

/**
 * GET /api/certificates?email=user@example.com
 * 
 * Look up the email in the RSVP collection (osintevent).
 * If found, find or create a Certificate record and return it.
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email parameter is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const normalizedEmail = email.trim().toLowerCase();

        // Step 1: Check if this email has an RSVP entry
        const rsvp = await Rsvp.findOne({
            email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        if (!rsvp) {
            return NextResponse.json({
                success: true,
                count: 0,
                certificates: [],
            });
        }

        // Step 2: Check if a certificate already exists for this email
        let certificate = await Certificate.findOne({
            candidateEmail: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        // Step 3: If no certificate, generate one
        if (!certificate) {
            const certNo = await generateUniqueCertNo();
            certificate = await Certificate.create({
                certificateNo: certNo,
                candidateName: rsvp.name,
                candidateEmail: normalizedEmail,
                eventTitle: 'OSINT Researcher & Digital Investigations',
                eventCategory: 'Technical',
                eventDate: '25th July, 2026',
                descriptionTopic: 'OSINT Researcher & Digital Investigations',
                status: 'Attended',
                rsvpId: rsvp._id,
            });
        }

        return NextResponse.json({
            success: true,
            count: 1,
            certificates: [
                {
                    id: certificate._id.toString(),
                    certificateNo: certificate.certificateNo,
                    candidateName: certificate.candidateName,
                    candidateEmail: certificate.candidateEmail,
                    eventTitle: certificate.eventTitle,
                    eventCategory: certificate.eventCategory,
                    eventDate: certificate.eventDate,
                    descriptionTopic: certificate.descriptionTopic,
                    status: certificate.status,
                },
            ],
        });
    } catch (error) {
        console.error('Certificate search error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
