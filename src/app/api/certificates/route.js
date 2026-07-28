import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Rsvp from '../../../../models/Rsvp';
import Certificate from '../../../../models/Certificate';
import Feedback from '../../../../models/Feedback';

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
                eventTitle: 'How Investigators Find Anyone Online using OSINT',
                eventCategory: 'Technical',
                eventDate: '25th July, 2026',
                descriptionTopic: 'How Investigators Find Anyone Online using OSINT',
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
                    rating: certificate.rating,
                    comment: certificate.comment,
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

/**
 * POST /api/certificates
 * Body: { email: string, rating: number (1-5), comment?: string }
 * 
 * Takes feedback (rating 1-5 required, comment optional), updates/creates Certificate
 * and records feedback in MongoDB Feedback collection.
 */
export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const { email, rating, comment } = body;

        if (!email || !String(email).trim()) {
            return NextResponse.json(
                { success: false, error: 'Email address is required' },
                { status: 400 }
            );
        }

        const RATING_LABELS = {
            5: 'Outstanding',
            4: 'Excellent',
            3: 'Good',
            2: 'Fair',
            1: 'Needs Improvement',
        };

        const numericRating = Number(rating);
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return NextResponse.json(
                { success: false, error: 'Please select a rating option (Outstanding, Excellent, Good, Fair, or Needs Improvement).' },
                { status: 400 }
            );
        }

        const ratingLabel = RATING_LABELS[numericRating] || '';

        await dbConnect();

        const normalizedEmail = String(email).trim().toLowerCase();

        // 1. Check if email has RSVP entry
        const rsvp = await Rsvp.findOne({
            email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        if (!rsvp) {
            return NextResponse.json({
                success: false,
                error: 'No certificate found for this email address. Please verify your registered email.',
                count: 0,
                certificates: [],
            }, { status: 404 });
        }

        // 2. Check or create certificate
        let certificate = await Certificate.findOne({
            candidateEmail: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        const safeComment = comment ? String(comment).trim() : '';

        if (!certificate) {
            const certNo = await generateUniqueCertNo();
            certificate = await Certificate.create({
                certificateNo: certNo,
                candidateName: rsvp.name,
                candidateEmail: normalizedEmail,
                eventTitle: 'How Investigators Find Anyone Online using OSINT',
                eventCategory: 'Technical',
                eventDate: '25th July, 2026',
                descriptionTopic: 'How Investigators Find Anyone Online using OSINT',
                status: 'Attended',
                rsvpId: rsvp._id,
                rating: numericRating,
                ratingLabel,
                comment: safeComment,
                feedbackSubmittedAt: new Date(),
            });
        } else {
            certificate.rating = numericRating;
            certificate.ratingLabel = ratingLabel;
            certificate.comment = safeComment || certificate.comment || '';
            certificate.feedbackSubmittedAt = new Date();
            await certificate.save();
        }

        // 3. Save entry in MongoDB Feedback collection
        await Feedback.create({
            candidateEmail: normalizedEmail,
            candidateName: rsvp.name,
            certificateNo: certificate.certificateNo,
            eventTitle: certificate.eventTitle || 'How Investigators Find Anyone Online using OSINT',
            rating: numericRating,
            ratingLabel,
            comment: safeComment,
            submittedAt: new Date(),
        });

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
                    rating: certificate.rating,
                    ratingLabel: certificate.ratingLabel,
                    comment: certificate.comment,
                },
            ],
        });
    } catch (error) {
        console.error('Certificate submission error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
