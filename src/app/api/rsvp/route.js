import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        { 
            error: 'Registrations for this event are now closed as the live session has concluded.',
            certificatesUrl: '/certificates/osint-researcher-digital-investigations'
        }, 
        { status: 400 }
    );
}
