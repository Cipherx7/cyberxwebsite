import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Certificate from '../../../../../models/Certificate';

/**
 * GET /api/certificates/[certNo]
 * 
 * Fetch single certificate metadata by certificate number (for verification).
 */
export async function GET(req, { params }) {
    try {
        const { certNo } = await params;

        if (!certNo) {
            return NextResponse.json(
                { success: false, error: 'Certificate number is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const certificate = await Certificate.findOne({
            certificateNo: certNo.toUpperCase(),
        });

        if (!certificate) {
            return NextResponse.json(
                { success: false, error: 'Certificate not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            certificateNo: certificate.certificateNo,
            candidateName: certificate.candidateName,
            candidateEmail: certificate.candidateEmail,
            eventTitle: certificate.eventTitle,
            eventCategory: certificate.eventCategory,
            eventDate: certificate.eventDate,
            descriptionTopic: certificate.descriptionTopic,
            status: certificate.status,
        });
    } catch (error) {
        console.error('Certificate fetch error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
