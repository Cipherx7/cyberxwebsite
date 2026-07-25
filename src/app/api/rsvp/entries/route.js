import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Rsvp from '../../../../../models/Rsvp';
import { verifyAdmin, unauthorizedResponse } from '../../../../../lib/auth-utils';

export async function GET(request) {
  // Ensure the request is from an authenticated admin
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return unauthorizedResponse();
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build filter object
    const filter = {};

    if (search.trim()) {
      // Escape special regex characters to prevent ReDoS/injection
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { anonymousQuestion: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    // Fetch entries from 'osintevent' collection, sorted by newest first
    const entries = await Rsvp.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      entries,
      total: entries.length
    });
  } catch (error) {
    console.error('Fetch RSVP entries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVP entries' },
      { status: 500 }
    );
  }
}
